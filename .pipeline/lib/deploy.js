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

    // Using default component names (fom-db, fom-api, fom-batch)

    // TODO: Need to evaluate ImageChangeTrigger from tools?
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/fom-db-deploy.yml`, {
      'param':{
        'SUFFIX': config.suffix,
        // TODO: Add more parameters for prod configuration (storage size, etc.)
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/fom-api-deploy.yml`, {
      'param':{
        'ENV': config.phase,
        'SUFFIX': config.suffix,
        'IMAGE_STREAM_VERSION': config.tag,
        'HOSTNAME': config.hostname,
        'DB_TESTDATA': config.testDataEnabled,
        'REPLICA_COUNT': config.apiReplicaCount,
        'KEYCLOAK_ENABLED': config.keycloakEnabled,
        'KEYCLOAK_URL': config.keycloakUrl,
        // TODO: Add more parameters for prod configuration (CPU, memory, etc.)
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/fom-batch-deploy.yml`, {
      'param':{
        'SUFFIX': config.suffix,
        'IMAGE_STREAM_VERSION': config.tag,
      }
    }));

    return objects;
  }
}

module.exports = async (settings) => {
  await new MyDeployer(settings).deploy();
}
