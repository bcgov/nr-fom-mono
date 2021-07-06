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
    const buildNumber = options.build // Jenkins build number
    const version = '1.0'
    const fullVersion = version + '.PR' + options.pr + '.B' + buildNumber;
  
    const propertiesByPhase = {
      phase:            {build: 'build'                       , dev: 'dev'                          , test: 'test'                      , prod: 'prod'},
      env:              {build: 'n/a'                         , dev: 'dev'                          , test: 'test'                      , prod: 'prod'},
      namespace:        {build: `${namespacePrefix}-tools`    , dev: `${namespacePrefix}-dev`       , test: `${namespacePrefix}-test`   , prod: `${namespacePrefix}-prod`},

      // Suffix added to OpenShift resource names.
      suffix:           {build: `-build-${changeId}`          , dev: `-dev-${changeId}`             , test: `-test`                     , prod: `-prod`  },
      // tag:              {build: fullVersion                   , dev: fullVersion                    , test: fullVersion                 , prod: fullVersion},
      tag:              {all: fullVersion},
      // ImageStream tag - TODO Need to understand why don't use full version consistent across environments.
      oldTag:           {build: `build-${version}-${changeId}`, dev: `dev-${version}-${changeId}`   , test: `test-${version}`           , prod: `prod-${version}`},

      // Same hostname needs to be used for the Admin and Public components. Also need to white-list these URLs for KeyCloak...
      // TODO: How is that going to work in dev with different change ids.
      // TODO: Plan is to use path-based routes including changeId. For now, just using single dev route, which means can only deploy a single branch.
      // An alternative would be to suffix with version.

      hostname:         {build: `n/a` , dev: `fom-nrs-dev.apps.silver.devops.gov.bc.ca` , test: `fom-nrs-test.apps.silver.devops.gov.bc.ca` , prod: `fom-nrs-prod.apps.silver.devops.gov.bc.ca`},

      testDataEnabled:  {build: 'n/a'                         , dev: 'false'                        , test: 'true'                      , prod: 'false'},
      // Consider having only 1 replica with test data enabled as populating the large volume test data can impact startup when there are multiple replicas.
      apiReplicaCount:  {build: 'n/a'                         , dev: '1'                            , test: '2'                         , prod: '3'},
      // TODO: Need to get test/prod hostnames whitelisted in Keycloak, and need to get dev enabled most likely.
      keycloakEnabled:  {build: 'n/a'                         , dev: 'false'                        , test: 'true'                      , prod: 'true'},
      keycloakUrl:      {build: 'n/a'                         , dev: 'https://dev.oidc.gov.bc.ca/auth'  , test: 'https://test.oidc.gov.bc.ca/auth' , prod: 'https://oidc.gov.bc.ca/auth'},
    };

    const phases = {};
    // Pivot configuration table, so that `phase name` becomes a top-level property
    // { namespace: { build: '-tools',  dev: '-dev'}}   ->  { build: { namespace: '-tools' }, dev: { namespace: '-dev' } }
    Object.keys(propertiesByPhase).forEach((properyName) => {
      const property = propertiesByPhase[properyName];
      Object.keys(property).forEach((phaseName) => {
        phases[phaseName] = phases[phaseName] || {};
        phases[phaseName][properyName] = property[phaseName] || property['all'];
      });
    });
    return { phases, options, environments};
  }
}