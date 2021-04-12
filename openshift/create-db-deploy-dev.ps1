
Set-Variable -Name "name" -Value "db"
Set-Variable -Name "suffix" -Value "dev"
Set-Variable -Name "env" -Value "dev"
oc delete all,NetworkPolicy,ConfigMap,Secret,PersistentVolumeClaim -n a4b31c-$env -l template=fom-$name-deploy,suffix=$suffix
oc process -f fom-$name-deploy.yml -p ENV=$env -p SUFFIX=$suffix | oc create -n a4b31c-$env -f -
