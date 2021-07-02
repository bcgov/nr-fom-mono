'use strict';
const BasicDeployer = require.main.exports.BasicDeployer
const path = require('path');

const MyDeployer = class extends BasicDeployer{
  processTemplates(oc){
    const settings = this.settings
    const phase = settings.phase
    const phases = settings.phases
    const objects = [];
    const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'));

    // Using default component names (fom-db, fom-api, fom-batch)

    // TODO: Need to evaluate ImageChangeTrigger from tools?
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/fom-db-deploy.yml`, {
      'param':{
        'SUFFIX': phases[phase].suffix,
        // TODO: Add more parameters for prod configuration (storage size, etc.)
      }
    }));
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/fom-api-deploy.yml`, {
      'param':{
        'SUFFIX': phases[phase].suffix,
        'IMAGE_STREAM_VERSION': phases[phase].tag,
        'HOSTNAME': `${phases[phase].hostname}`,
        // TODO: Add more parameters...
      }
    }));
    // TODO: Need to change to pull from imagestream in same namespace, not from tools. 
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/fom-batch-deploy.yml`, {
      'param':{
        'SUFFIX': phases[phase].suffix,
        'IMAGE_STREAM_VERSION': phases[phase].tag,
      }
    }));

    return objects;
  }
}

module.exports = async (settings) => {
  await new MyDeployer(settings).deploy();
}
