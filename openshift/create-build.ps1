 # This script is designed to NOT delete the ImageStream, so recreation of the Image Stream will fail.
Set-Variable -Name "name" -Value "api"
Set-Variable -Name "tag" -Value "main"
Set-Variable -Name "ref" -Value "master"
oc delete all -n a4b31c-tools -l template=fom-$name-build,tag=$tag
oc process -f fom-$name-build.yml -p TAG=$tag -p GIT_REF=$ref | oc create -n a4b31c-tools -f -

Set-Variable -Name "tag" -Value "dev"
Set-Variable -Name "ref" -Value "dev"
oc delete all -n a4b31c-tools -l template=fom-$name-build,tag=$tag
oc process -f fom-$name-build.yml -p TAG=$tag -p GIT_REF=$ref | oc create -n a4b31c-tools -f -
