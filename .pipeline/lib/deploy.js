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

    // Using default component names (fom-db, fom-api, fom-batch, fom-admin, fom-public)

    // TODO: Need to evaluate ImageChangeTrigger from tools?  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag);
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-db-deploy.yml`, {
      'param':{
        'SUFFIX': config.suffix,
        // TODO: Add more parameters for prod configuration (storage size, etc.)
      }
    }));

    // Parameters common across application components.
    const appParams = {
      'SUFFIX': config.suffix,
      'IMAGE_STREAM_VERSION': config.tag,
      'ENV': config.phase,
      'HOSTNAME': config.hostname,
    }

    let apiBasePath = '/api';
    // if (config.instanceUrlPrefix && config.instanceUrlPrefix.length > 0) {
    //   apiBasePath = '/' + config.instanceUrlPrefix + apiBasePath;
    // }
    const apiBaseUrl = "https://" + config.hostname + apiBasePath;

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-api-deploy.yml`, {
      'param':{
        ...appParams,
        'API_BASE_PATH': apiBasePath,
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
