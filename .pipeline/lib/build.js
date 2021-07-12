'use strict';
const path = require('path');
const BasicBuilder = require.main.exports.BasicBuilder

const MyBuilder = class extends BasicBuilder {
  processTemplates(oc){
    const phase = 'build';
    const phases = this.settings.phases
    let objects = [];
    const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-api-build.yml`, {
      'param':{
        // 'NAME': phases[phase].name, // defaults to fom-api
        'SUFFIX': phases[phase].suffix,
        'TAG': phases[phase].tag,
        'GIT_REF': oc.git.branch.merge
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/public/fom-public-build.yml`, {
      'param':{
        // 'NAME': phases[phase].name, // defaults to fom-public
        'SUFFIX': phases[phase].suffix,
        'TAG': phases[phase].tag,
        'GIT_REF': oc.git.branch.merge
      }
    }));

    return objects
  }
}
module.exports = async (settings) => {
  await new MyBuilder(settings).build();
}
