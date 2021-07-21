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

    // Parameters common across all components.
    const defaultParams = {
      'ENV': config.phase,
      'SUFFIX': config.suffix,
      'IMAGE_STREAM_VERSION': config.tag,
      'HOSTNAME': config.hostname,
    }


    // TODO: Need to evaluate ImageChangeTrigger from tools?  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag);
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-db-deploy.yml`, {
      'param':{
        ...defaultParams
        // TODO: Add more parameters for prod configuration (storage size, etc.)
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-api-deploy.yml`, {
      'param':{
        ...defaultParams,
        'DB_TESTDATA': config.testDataEnabled,
        'REPLICA_COUNT': config.apiReplicaCount,
        'KEYCLOAK_ENABLED': config.keycloakEnabled,
        'KEYCLOAK_URL': config.keycloakUrl,
        // TODO: Add more parameters for prod configuration (CPU, memory, etc.)
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-batch-deploy.yml`, {
      'param':{
        ...defaultParams
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/public/fom-public-deploy.yml`, {
      'param':{
        ...defaultParams,
        'REPLICA_COUNT': config.publicReplicaCount, 
        // TODO: Add more parameters for prod configuration (CPU, memory, etc.)
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/admin/fom-admin-deploy.yml`, {
      'param':{
        ...defaultParams,
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
