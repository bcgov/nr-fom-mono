'use strict';
const path = require('path');
const BasicBuilder = require.main.exports.BasicBuilder

const MyBuilder = class extends BasicBuilder {
  processTemplates(oc){
    const phase = 'build';
    const phases = this.settings.phases
    let objects = [];
    const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'));

    // Parameters common across components.
    const commonParams = {
      'SUFFIX': phases[phase].suffix,
      'TAG': phases[phase].tag,
      'GIT_REF': oc.git.branch.merge
  }

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db/fom-db-build.yml`, {
      'param':{
        ...commonParams,
        // 'NAME': phases[phase].name, // defaults to fom-api
      }
    }));


    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-api-build.yml`, {
      'param':{
        ...commonParams,
        // 'NAME': phases[phase].name, // defaults to fom-api
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/public/fom-public-build.yml`, {
      'param':{
        ...commonParams,
        // 'NAME': phases[phase].name, // defaults to fom-public
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/admin/fom-admin-build.yml`, {
      'param':{
        ...commonParams,
        // 'NAME': phases[phase].name, // defaults to fom-public
      }
    }));

    return objects
  }
}
module.exports = async (settings) => {
  await new MyBuilder(settings).build();
}
