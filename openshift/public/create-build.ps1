# This script is designed to NOT delete the ImageStream and Secret, so recreation of the Image Stream & Secret will fail.
Set-Variable -Name "name" -Value "public"

Set-Variable -Name "tag" -Value "main"
Set-Variable -Name "ref" -Value "master"
oc delete all -n a4b31c-tools -l template=fom-$name-build,tag=$tag
oc process -f fom-$name-build.yml -p TAG=$tag -p GIT_REF=$ref | oc create -n a4b31c-tools -f -
 
Set-Variable -Name "tag" -Value "dev"
Set-Variable -Name "ref" -Value "dev"
oc delete all -n a4b31c-tools -l template=fom-$name-build,tag=$tag
oc process -f fom-$name-build.yml -p TAG=$tag -p GIT_REF=$ref | oc create -n a4b31c-tools -f -
