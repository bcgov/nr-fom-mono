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
      phase:            {build: 'build'                       , dev: 'dev'                          , test: 'test'                      , prod: 'prod'},
      changeId:         {build: changeId                      , dev: changeId                       , test: changeId                    , prod: changeId},
      namespace:        {build: `${namespacePrefix}-tools`    , dev: `${namespacePrefix}-dev`       , test: `${namespacePrefix}-test`   , prod: `${namespacePrefix}-prod`},

      // Suffix added to OpenShift resource names.
      suffix:           {build: `-build-${changeId}`          , dev: `-dev-${changeId}`             , test: `-test`                     , prod: `-prod`  },
      // ImageStream tag
      tag:              {build: `build-${version}-${changeId}`, dev: `dev-${version}-${changeId}`   , test: `test-${version}`           , prod: `prod-${version}`},

      // Same hostname needs to be used for the Admin and Public components. Also need to white-list these URLs for KeyCloak...
      // TODO: How is that going to work in dev with different change ids.
      hostname:         {build: `n/a`                         , dev: `fom-nrs-dev-${changeId}`      , test: `fom-nrs-test`              , prod: `fom-nrs-prod`},

      testDataEnabled:  {build: 'n/a'                         , dev: 'false'                         , test: 'true'                      , prod: 'false'},
      // Consider having only 1 replica with test data enabled as populating the large volume test data can impact startup when there are multiple replicas.
      apiReplicaCount:  {build: 'n/a'                         , dev: '1'                            , test: '2'                         , prod: '3'},
      // TODO: Need to get test/prod hostnames whitelisted in Keycloak, and need to get dev enabled most likely.
      keycloakEnabled:  {build: 'n/a'                         , dev: 'false'                        , test: 'true'                      , prod: 'true'},
      keycloakUrl:      {build: 'n/a'                         , dev: 'https://dev.oidc.gov.bc.ca/auth'  , test: 'true'                      , prod: 'true'},
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