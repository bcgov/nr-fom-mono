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
    const fullVersion = version + '.PR' + options.pr + '.B' + process.env['BUILD_NUMBER'];
    const appName = 'fom'

    console.log('*** ENV ***\n' + JSON.stringify(process.env));

    // Properties can be defined per phase, or defaulted using key 'default'.
    // The following properties are required by nrdk for each phase: changeId, namespace, name, tag, instance
    const propertiesByPhase = {
      // Application name
      name:             {default: `${appName}`},  // Needed by nrdk directly.
      // OpenShift namespace
      namespace:        {build: `${namespacePrefix}-tools`    , dev: `${namespacePrefix}-dev`       , test: `${namespacePrefix}-test`   , prod: `${namespacePrefix}-prod`},
      // Pipeline phase, also used as environment name by nrdk & fom
      phase:            {build: 'build'                       , dev: 'dev'                          , test: 'test'                      , prod: 'prod'},
      // Used by nrdk/pipeline-cli as unique environment id. (TODO: This doesn't make sense to me)
      changeId:         {default: changeId },  
      // Used by nrdk/pipeline-cli as app label / selector for OpenShift resources
      instance:         {build: `${appName}-build-${changeId}`   , dev: `${appName}-dev-${changeId}`      , test: `${appName}-test-${changeId}`  , prod: `${appName}-prod-${changeId}`}, 
      // tag:              {build: fullVersion                   , dev: fullVersion                    , test: fullVersion                 , prod: fullVersion},
      // Used by nrdk/pipeline-cli to tag image streams, used by fom to reference image stream version
      tag:              {default: fullVersion}, 
      // ImageStream tag - TODO Need to understand why don't use full version consistent across environments.
      oldTag:           {build: `build-${version}-${changeId}`, dev: `dev-${version}-${changeId}`   , test: `test-${version}`           , prod: `prod-${version}`},

      // Remaining properties are FOM-specific

      // Suffix added to OpenShift resource names in fom deployment templates.
      suffix:           {build: `-build-${changeId}`          , dev: `-dev-${changeId}`             , test: `-test`                     , prod: `-prod`  },

      // Same hostname needs to be used for the Admin and Public components. Also need to white-list these URLs for KeyCloak...
      // TODO: How is that going to work in dev with different change ids.
      // TODO: Plan is to use path-based routes including changeId. For now, just using single dev route, which means can only deploy a single branch.
      // An alternative would be to suffix with version.

      hostname:         {build: `n/a` , dev: `fom-nrs-dev.apps.silver.devops.gov.bc.ca` , test: `fom-nrs-test.apps.silver.devops.gov.bc.ca` , prod: `fom-nrs-prod.apps.silver.devops.gov.bc.ca`},

      testDataEnabled:  {default: 'false', dev: 'true', test: 'true' },
      // Consider having only 1 replica with test data enabled as populating the large volume test data can impact startup when there are multiple replicas.
      apiReplicaCount:  {build: 'n/a'                         , dev: '1'                            , test: '2'                         , prod: '3'},
      // TODO: Need to get test/prod hostnames whitelisted in Keycloak, and need to get dev enabled most likely.
      keycloakEnabled:  {default: 'true', dev: 'false' },
      keycloakUrl:      {build: 'n/a'                         , dev: 'https://dev.oidc.gov.bc.ca/auth'  , test: 'https://test.oidc.gov.bc.ca/auth' , prod: 'https://oidc.gov.bc.ca/auth'},
    };

    // Pivot configuration table, so that `phase name` becomes a top-level property
    // { namespace: { build: '-tools',  dev: '-dev'}}   ->  { build: { namespace: '-tools' }, dev: { namespace: '-dev' } }
    const phases = {};
    const phaseNames = Object.keys(propertiesByPhase.phase);
    phaseNames.forEach((phaseName) => {
      phases[phaseName] = {};
    });

    Object.keys(propertiesByPhase).forEach((properyName) => {
      const property = propertiesByPhase[properyName];
      phaseNames.forEach((phaseName) => {
        phases[phaseName][properyName] = property[phaseName] || property['default'];
      });
    });

    console.log('*** phase dev changeId \n' + phases['dev'].changeId);
    return { phases, options, environments};
  }
}