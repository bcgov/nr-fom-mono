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
        // TODO: Add more parameters for prod configuration (storage size, etc.)
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
        // TODO: Add more parameters for prod configuration (CPU, memory, etc.)
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
        // TODO: Add more parameters for prod configuration (CPU, memory, etc.)
        // Test-related parameters
        'DB_TESTDATA': config.testDataEnabled,
        'KEYCLOAK_ENABLED': config.keycloakEnabled,
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-batch-deploy.yml`, {
      'param':{
        'SUFFIX': config.suffix,
        'IMAGE_STREAM_VERSION': config.tag,
        'ENV': config.phase,
        // TODO: Add more parameters for prod configuration (CPU, memory, etc.)
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/public/fom-public-deploy.yml`, {
      'param':{
        ...appParams,
        'API_BASE_URL': apiBaseUrl,
        'REPLICA_COUNT': config.publicReplicaCount, 
        // TODO: Add more parameters for prod configuration (CPU, memory, etc.)
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/admin/fom-admin-deploy.yml`, {
      'param':{
        ...appParams,
        'API_BASE_URL': apiBaseUrl,
        'REPLICA_COUNT': config.adminReplicaCount, 
        // TODO: Add more parameters for prod configuration (CPU, memory, etc.)
      }
    }));

    return objects;
  }
}

module.exports = async (settings) => {
  await new MyDeployer(settings).deploy();
}
