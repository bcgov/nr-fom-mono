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

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/fom-db-deploy.yml`, {
      'param':{
        'NAME': `${phases[phase].name}-db`,
        'SUFFIX': phases[phase].suffix,
        'PROJECT': 'a4b31c',
      }
    }));
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/fom-api-deploy.yml`, {
      'param':{
        'NAME': `${phases[phase].name}`,
        'SUFFIX': phases[phase].suffix,
        'IMAGE_STREAM_VERSION': phases[phase].tag,
        'HOSTNAME': `${phases[phase].name}${phases[phase].suffix}-${phases[phase].namespace}`,
      }
    }));

    return objects;
  }
}

module.exports = async (settings) => {
  await new MyDeployer(settings).deploy();
}
