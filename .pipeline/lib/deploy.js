'use strict';
const BasicDeployer = require.main.exports.BasicDeployer
const path = require('path');

const MyDeployer = class extends BasicDeployer{
  processTemplates(oc){
    const settings = this.settings
    const phase = settings.phase
    const phases = settings.phases
    const config = phases[phase];
    const objects = [];
    const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'));

    // Using default component names (fom-db, fom-api, fom-batch, fom-admin, fom-public, backup-postgres)
    const dbParams = {
      'SUFFIX': config.suffix,
      'IMAGE_STREAM_VERSION': config.tag,
      'BACKUP_VOLUME_NAME': `backup${config.suffix}`,
    }

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db/fom-db-deploy.yml`, {
      'param':{
        ...dbParams,
        'REQUEST_CPU': '100m',
        'LIMIT_CPU': config.dbCpuLimit,
        'REQUEST_MEMORY': '0.2Gi',
        'LIMIT_MEMORY': config.dbMemoryLimit,
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db-backup/backup-deploy.yml`, {
      'param':{
        ...dbParams,
        'JOB_NAME': `backup-postgres${config.suffix}`,
        'VERIFICATION_VOLUME_NAME': `backup-verification${config.suffix}`,
        'DATABASE_DEPLOYMENT_NAME': `fom-db${config.suffix}`,
        'DATABASE_SERVICE_NAME':`fom-db${config.suffix}`,
        'DATABASE_NAME':'fom',
        // Use defaults (best-effort) for cpu and memory limits, as this is just a backup process.
      }
    }));

    // Parameters common across application components.
    const appParams = {
      'SUFFIX': config.suffix,
      'IMAGE_STREAM_VERSION': config.tag,
      'ENV': config.phase,
      'HOSTNAME': config.hostname,
    }

    // URL/Path definitions:
    // full URL = https://${HOSTNAME}/${urlPrefix}
    // where ${urlPrefix} = [${INSTANCE_URL_PREFIX/]${componentPrefix}}]
    // ${componentPrefix} = api or admin or public
    // Example: https://fom-nrs-dev.apps.silver.devops.gov.bc.ca/86/api
    // API Base URL = https://${HOSTNAME}/[${INSTANCE_URL_PREFIX}] (without /api component prefix)

    let apiBaseUrl = "https://" + config.hostname;
    if (config.instanceUrlPrefix && config.instanceUrlPrefix.length > 0) {
      apiBaseUrl = apiBaseUrl + config.instanceUrlPrefix;
    }

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-api-deploy.yml`, {
      'param':{
        ...appParams,
        'INSTANCE_URL_PREFIX': config.instanceUrlPrefix,
        'OBJECT_STORAGE_URL': config.objectStorageUrl,
        'KEYCLOAK_URL': config.keycloakUrl,
        'REPLICA_COUNT': config.apiReplicaCount,
        'REQUEST_CPU': '100m',
        'LIMIT_CPU': config.apiCpuLimit,
        'REQUEST_MEMORY': '0.2Gi',
        'LIMIT_MEMORY': config.apiMemoryLimit,

        // Test-related parameters
        'DB_TESTDATA': config.testDataEnabled,
        'KEYCLOAK_ENABLED': config.keycloakEnabled,
      }
    }));

/* Not needed for database clustering.
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-batch-deploy.yml`, {
      'param':{
        'SUFFIX': config.suffix,
        'IMAGE_STREAM_VERSION': config.tag,
        'ENV': config.phase,
        // Using defaults for memory and CPU limits, as this is a short-running batch process.
      }
    }));
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/public/fom-public-deploy.yml`, {
      'param':{
        ...appParams,
        'API_BASE_URL': apiBaseUrl,
        'REPLICA_COUNT': config.publicReplicaCount, 
        // Using defaults for memory and CPU limits, as this is just a static front-end.
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/admin/fom-admin-deploy.yml`, {
      'param':{
        ...appParams,
        'API_BASE_URL': apiBaseUrl,
        'REPLICA_COUNT': config.adminReplicaCount, 
        // Using defaults for memory and CPU limits, as this is just a static front-end.
      }
    }));
*/
    return objects;
  }
}

module.exports = async (settings) => {
  await new MyDeployer(settings).deploy();
}
