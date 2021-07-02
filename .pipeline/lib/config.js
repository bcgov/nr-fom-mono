'use strict';
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = class {
  constructor(options) {
    this.options = options
  }
  build(){
    const options = this.options
    const environments = ['dev', 'test', 'prod']
    const namespacePrefix = 'a4b31c'
    const changeId = options.pr //aka pull-request
    const version = '1.0'
    const name = 'fom-api'
  
    const propertiesByPhase = {
      phase:        {build: 'build'                       , dev: 'dev'                          , test: 'test'                      , prod: 'prod'},
      changeId:     {build: changeId                      , dev: changeId                       , test: changeId                    , prod: changeId},
      namespace:    {build: `${namespacePrefix}-tools`    , dev: `${namespacePrefix}-dev`       , test: `${namespacePrefix}-test`   , prod: `${namespacePrefix}-prod`},

      // Suffix added to OpenShift resource names.
      suffix:       {build: `-build-${changeId}`          , dev: `-dev-${changeId}`             , test: `-test`                     , prod: `-prod`  },
      // ImageStream tag
      tag:          {build: `build-${version}-${changeId}`, dev: `dev-${version}-${changeId}`   , test: `test-${version}`           , prod: `prod-${version}`},

      // OpenShift name - TODO need to think about this, as it varies from build to deploy and varies between components.
      // We might want an imagestream name instead?
      name:         {build: `${name}`                     , dev: `${name}`                      , test: `${name}`                   , prod: `${name}`},
      // TODO: Not sure what instance is used for.
      instance:     {build: `${name}-build-${changeId}`   , dev: `${name}-dev-${changeId}`      , test: `${name}-test`              , prod: `${name}-prod-${changeId}`},
    };

    const phases = {};
    // Pivot configuration table, so that `phase name` becomes a top-level property
    // { namespace: { build: '-tools',  dev: '-dev'}}   ->  { build: { namespace: '-tools' }, dev: { namespace: '-dev' } }
    Object.keys(propertiesByPhase).forEach((properyName) => {
      const property = propertiesByPhase[properyName];
      Object.keys(property).forEach((phaseName) => {
        phases[phaseName] = phases[phaseName] || {};
        phases[phaseName][properyName] = property[phaseName];
      });
    });
    return { phases, options, environments};
  }
}