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
      'DB_NAME': 'fom-db-ha', // First portion of name of OpenShift resource (StatefulSet and related resources)
      'SUFFIX': config.suffix,
      'IMAGE_STREAM_VERSION': config.tag,
      'BACKUP_VOLUME_NAME': `backup-fom-db-ha${config.suffix}`,
      'APP_DB_NAME': 'fom', // Name of postgres application database
    }
    const databaseServiceName = `${dbParams.APP_DB_NAME}-master${config.suffix}`;

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db/fom-db-ha-prereq-deploy.yml`, {
      'param':{
        'NAME': dbParams.DB_NAME,
        'SUFFIX': config.suffix,
        'APP_DB_NAME': dbParams.APP_DB_NAME,
      }
    }));


    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db/fom-db-ha-deploy.yml`, {
      'param':{
        'NAMESPACE': config.namespace,
        'NAME': dbParams.DB_NAME,
        'SUFFIX': config.suffix,
        'DATABASE_SERVICE_NAME': databaseServiceName, 
        'IMAGE_STREAM_TAG': config.tag,
        'BACKUP_VOLUME_NAME': dbParams.BACKUP_VOLUME_NAME,
        'REPLICAS': config.dbReplicaCount,
        'CPU_REQUEST': '50m',
        'CPU_LIMIT': config.dbCpuLimit,
        'MEMORY_REQUEST': '0.2Gi',
        'MEMORY_LIMIT': config.dbMemoryLimit,
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db-backup/backup-deploy.yml`, {
      'param':{
        ...dbParams,
        'NAMESPACE': config.namespace,
        'JOB_NAME': `backup-fom-db-ha${config.suffix}`,
        'VERIFICATION_VOLUME_NAME': `backup-verify-fom-db-ha${config.suffix}`,
        'DATABASE_DEPLOYMENT_NAME': `fom-db-ha${config.suffix}`,
        'DATABASE_SERVICE_NAME': databaseServiceName, 
        'DATABASE_USER_KEY_NAME':'superuser-username',
        'DATABASE_PASSWORD_KEY_NAME': 'superuser-password',
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
        'DATABASE_SERVICE_NAME': databaseServiceName,
        'DB_NAME': dbParams.DB_NAME,
        'INSTANCE_URL_PREFIX': config.instanceUrlPrefix,
        'OBJECT_STORAGE_URL': config.objectStorageUrl,
        'KEYCLOAK_URL': config.keycloakUrl,
        'SITEMINDER_URL': config.siteminderUrl,
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

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-batch-deploy.yml`, {
      'param':{
        'NAMESPACE': config.namespace,
        'SUFFIX': config.suffix,
        'IMAGE_STREAM_VERSION': config.tag,
        'ENV': config.phase,
        'DB_NAME': dbParams.DB_NAME,
        'DATABASE_SERVICE_NAME': databaseServiceName,
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

    return objects;
  }
}

module.exports = async (settings) => {
  await new MyDeployer(settings).deploy();
}
