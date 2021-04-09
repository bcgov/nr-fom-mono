# Mirror 3rd party docker images locally to avoid DockerHub pull rate limit issues and reduce network traffic.
# oc new-build node:14-slim --name=mirror-node --to=node:14

#oc new-build https://github.com/BCDevOps/sonarqube --strategy=docker --name=sonarqube --to=sonarqube:8.8 -e SONAR_VERSION=8.8

oc delete all -n a4b31c-tools -l template=node-build
oc process -f node-build.yml | oc create -n a4b31c-tools -f -