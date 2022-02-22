'use strict';
const path = require('path');
const BasicBuilder = require.main.exports.BasicBuilder

const MyBuilder = class extends BasicBuilder {
  processTemplates(oc){
    const phase = 'build';
    const phases = this.settings.phases
    const config = phases[phase];
    let objects = [];
    const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'));

    // Parameters common across components.
    const commonParams = {
      'SUFFIX': config.suffix,
      'TAG': config.tag,
      'GIT_REF': oc.git.branch.merge
  }

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db/fom-db-build.yml`, {
      'param':{
        'NAME': 'fom-db-ha',
        ...commonParams,
      }
    }));

    /* Workaround a build failure with the backup. Error message:  error: build error: failed to pull image: After retrying 2 times, Pull image still failed due to error: unable to retrieve auth token: invalid username/password: unauthorized: unable to validate token: ServiceUnavailable
    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db-backup/backup-build.yml`, {
      'param':{
        'SUFFIX': config.suffix,
        'OUTPUT_IMAGE_TAG': config.tag,
        'BASE_IMAGE_FOR_BUILD': `fom-db-ha:${config.tag}`
      }
    }));
    */

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api/fom-api-build.yml`, {
      'param':{
        ...commonParams,
        // 'NAME': config.name, // defaults to fom-api
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/public/fom-public-build.yml`, {
      'param':{
        ...commonParams,
        // 'NAME': config.name, // defaults to fom-public
      }
    }));

    objects.push(... oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/admin/fom-admin-build.yml`, {
      'param':{
        ...commonParams,
        // 'NAME': config.name, // defaults to fom-admin
      }
    }));

    return objects
  }
}
module.exports = async (settings) => {
  await new MyBuilder(settings).build();
}
