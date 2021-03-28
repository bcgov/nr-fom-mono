oc login --token=<token> --server=https://api.silver.devops.gov.bc.ca:6443

### Allow any service account in dev to pull images from tools
oc policy add-role-to-group system:image-puller system:serviceaccounts:a4b31c-dev --namespace=a4b31c-tools

As per https://docs.openshift.com/container-platform/4.5/openshift_images/managing_images/using-image-pull-secrets.html





### Helper Scripts


* exportTemplate.sh - Export deploy, build, routes, services as templates from an existing project.
