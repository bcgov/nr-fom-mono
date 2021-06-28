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
    const namespace = {build: `${namespacePrefix}-tools`, dev: `${namespacePrefix}-dev`, test: `${namespacePrefix}-test`, prod: `${namespacePrefix}-prod`}
    const changeId = options.pr //aka pull-request
    const version = '1.0'
    const name = 'fom-api'

    const phases0 = {
        namespace,
        changeId: {build: changeId, dev: changeId, test: changeId, prod: changeId},
        name:          {build: `${name}`                     , dev: `${name}`                                                              , test: `${name}`                                                   , prod: `${name}`},
        instance:      {build: `${name}-build-${changeId}`   , dev: `${name}-dev-${changeId}`                                              , test: `${name}-test`                                              , prod: `${name}-prod-${changeId}`},
        suffix:        {build: `-build-${changeId}`          , dev: `-dev-${changeId}`                                                     , test: `-test`                                                     , prod: `-prod`  },
        tag:           {build: `build-${version}-${changeId}`, dev: `dev-${version}-${changeId}`                                           , test: `test-${version}`                                           , prod: `prod-${version}`},
        phase:         {build: 'build'                       , dev: 'dev'                                                                  , test: 'test'                                                      , prod: 'prod'},
    };

    const phases = {};
    // Pivot configuration table, so that `phase name` becomes a top-level property
    // { namespace: { build: '-tools',  dev: '-dev'}}   ->  { build: { namespace: '-tools' }, dev: { namespace: '-dev' } }
    Object.keys(phases0).forEach((properyName) => {
      const property = phases0[properyName];
      Object.keys(property).forEach((phaseName) => {
        phases[phaseName] = phases[phaseName] || {};
        phases[phaseName][properyName] = property[phaseName];
      });
    });
    return { phases, options, environments};
  }
}