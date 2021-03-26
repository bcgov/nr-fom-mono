oc login --token=<token> --server=https://api.silver.devops.gov.bc.ca:6443

### Grant image-puller role 
oc -n a4b31c-tools policy add-role-to-group system:image-puller system:serviceaccounts:a4b31c-tools


### Helper Scripts


* exportTemplate.sh - Export deploy, build, routes, services as templates from an existing project.
