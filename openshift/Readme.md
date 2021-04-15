oc login --token=<token> --server=https://api.silver.devops.gov.bc.ca:6443

### Allow any service account in dev to pull images from tools
oc policy add-role-to-group system:image-puller system:serviceaccounts:a4b31c-dev --namespace=a4b31c-tools

As per https://docs.openshift.com/container-platform/4.5/openshift_images/managing_images/using-image-pull-secrets.html


### Pull images locally
``` bash
docker login -u `oc whoami` -p `oc whoami -t` image-registry.apps.silver.devops.gov.bc.ca
docker pull image-registry.apps.silver.devops.gov.bc.ca/a4b31c-tools/fom-public:demo
docker run -d -p 4300:4300 image-registry.apps.silver.devops.gov.bc.ca/a4b31c-tools/fom-public:demo
``` 

### Push images to imagestream (workaround for docker hub pull rate limits)
``` bash
docker login -u `oc whoami` -p `oc whoami -t` image-registry.apps.silver.devops.gov.bc.ca
docker pull ${image}:${tag}
docker tag ${image}:${tag} image-registry.apps.silver.devops.gov.bc.ca/a4b31c-tools/${image}:${tag}
docker push image-registry.apps.silver.devops.gov.bc.ca/a4b31c-tools/${image}:${tag}
# Note that the image name used in OCP cannot have slashes, so a docker image like 'postgis/postgis' will need to have the image name converted to something like 'postgis' in OCP
```

### Starting a build manually
oc start-build -F -n a4b31c-tools fom-api-dev

### Working with postgres
- Open terminal on pod running postgres
- psql --user postgres
- \c fom
- ...


