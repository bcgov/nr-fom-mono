 # WARNING: This deletes all existing resources, including tagged images.
 oc delete all -l template=fom-api-build
 oc process -f fom-api-build.yml | oc create -n a4b31c-tools -f -