# Mirror 3rd party docker images locally to avoid DockerHub pull rate limit issues and reduce network traffic.

#oc delete all -n a4b31c-tools -l template=mirror-build
oc process -f mirror-build.yml -p OCP_IMAGE_NAME=node -p DOCKER_IMAGE_NAME=node -p IMAGE_VERSION=14-slim | oc create -n a4b31c-tools -f -
oc process -f mirror-build.yml -p OCP_IMAGE_NAME=postgis -p DOCKER_IMAGE_NAME=postgis/postgis -p IMAGE_VERSION=13-3.1-alpine | oc create -n a4b31c-tools -f -

