$Env=dev
oc process -f fom-object-storage-secret.yml -p ENV=$Env -p BUCKET=<...> -p ACCESS_ID=<...> -p SECRET=<...> | oc create -n a4b31c-$Env -f -


