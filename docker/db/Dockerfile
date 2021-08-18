FROM artifacts.developer.gov.bc.ca/docker-remote/postgis/postgis:13-3.1
# Use a specific version to avoid the risk of even minor/patch upgrades not working automatically due to required manual upgrade steps
# Cannot use alpine version because only debian supports running as any user under openshift as per https://registry.hub.docker.com/_/postgres/
# Cannot use artifactory because of specific version not available (actual error was "Error reading manifest 13-3.1 in artifacts.developer.gov.bc.ca/docker-remote/postgis: manifest unknown: The named manifest is not known to the registry.")