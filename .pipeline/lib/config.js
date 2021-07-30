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
    const appName = 'fom'

    // Properties can be defined per phase, or defaulted using key 'default'.
    // The following properties are required by nrdk for each phase: changeId, namespace, name, tag, instance
    const propertiesByPhase = {
      // Application (Stack) name
      name:             {default: `${appName}`},  // Needed by nrdk directly.

      namespace:        {build: `${namespacePrefix}-tools`, dev: `${namespacePrefix}-dev`, test: `${namespacePrefix}-test`, prod: `${namespacePrefix}-prod`},

      // Pipeline phase, also used as environment name by nrdk & fom
      phase:            {build: 'build', dev: 'dev', test: 'test', prod: 'prod'},

      // Used by nrdk/pipeline-cli as unique environment id. 
      changeId:         {default: changeId },  

      // Used by nrdk/pipeline-cli as app label / selector for OpenShift resources
      instance:         {build: `${appName}-build-${changeId}`, dev: `${appName}-dev-${changeId}`, test: `${appName}-test-${changeId}`, prod: `${appName}-prod-${changeId}`}, 

      // Used as ImageStream tag. Environments that are ephemeral (candidates to be deleted/cleaned up) include the changeId, environments that are stable do not include the changeId. 
      // Includes the namespace to minimize confusion and allow multiple environments in a single namespace.
      tag:              {build: `build-${version}-${changeId}`, dev: `dev-${version}-${changeId}`, test: `test-${version}`, prod: `prod-${version}`},

      // Remaining properties are FOM-specific

      // URL prefix added to uniquely identify the application instance in development. Not used in test/prod where there is a single application instance.
      // Value is either blank (default) or of format '/{prefix}'
      // This is used instead of varying the hostname because Keycloak whitelisting via allowed origins can't handle wildcard hostnames, but can handle wildcard URLs under one hostname.
      instanceUrlPrefix: {default: '', dev: `/${changeId}` },

      // Suffix added to OpenShift resource names in fom build/deployment templates. Uses similar logic to tag for naming.
      suffix:           {build: `-build-${changeId}`, dev: `-dev-${changeId}`, test: `-test`, prod: `-prod`  },

      // Using a single hostname per environment to simplify KeyCloak configuration of allowed origins.
      hostname:         {dev: `fom-nrs-dev.apps.silver.devops.gov.bc.ca`, test: `fom-test.nrs.gov.bc.ca`, prod: `fom.nrs.gov.bc.ca`},

      // Note that having test data enabled with multiple replicas can cause issues when populating the large volume test data. 
      testDataEnabled:  {default: 'false', dev: 'true', test: 'true' },

      apiReplicaCount:  {dev: '1', test: '3', prod: '3'},
      adminReplicaCount:  {default: '3', dev: '2' },
      publicReplicaCount:  {default: '3', dev: '2' },

      keycloakEnabled:  {default: 'true' },

      // TODO: Change test keycloak back to 'https://test.oidc.gov.bc.ca/auth' once set up.
      keycloakUrl:      {dev: 'https://dev.oidc.gov.bc.ca/auth', test: 'https://dev.oidc.gov.bc.ca/auth', prod: 'https://oidc.gov.bc.ca/auth'},

      // The object storage API needs the hostname without the https:// prefix
      objectStorageUrl: {default: 'nrs.objectstore.gov.bc.ca'},
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
        phases[phaseName][properyName] = property[phaseName] || property['default'] || '';
      });
    });

    return { phases, options, environments};
  }
}