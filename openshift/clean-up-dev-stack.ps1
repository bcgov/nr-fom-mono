# Remove an old dev stack. (Each new PR to master creates a brand new dev stack)
# Don't delete the N-1 stack just in case for production support.
oc project a4b31c-dev
oc delete all,NetworkPolicy,ConfigMap,Secret,PersistentVolumeClaim -l app=fom-dev-86


