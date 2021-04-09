Set-Variable -Name "name" -Value "api"
Set-Variable -Name "tag" -Value "main"
Set-Variable -Name "env" -Value "dev"
oc delete all,NetworkPolicy -n a4b31c-$env -l template=fom-$name-deploy,tag=$tag
oc process -f fom-$name-deploy.yml -p ENV=$env -p TAG=$tag -p HOSTNAME="nr-fom-$name-$tag-$env" | oc create -n a4b31c-$env -f -

Set-Variable -Name "tag" -Value "dev"
Set-Variable -Name "env" -Value "dev"
oc delete all,NetworkPolicy -n a4b31c-$env -l template=fom-$name-deploy,tag=$tag
oc process -f fom-$name-deploy.yml -p ENV=$env -p TAG=$tag -p HOSTNAME="nr-fom-$name-$tag-$env" | oc create -n a4b31c-$env -f -
