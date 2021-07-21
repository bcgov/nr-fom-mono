
function DeleteAdminFrontEnd {
    param($Suffix, $Env)

    Write-Output "Deleting existing resources for suffix $Suffix and env $Env ..."
    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-admin-deploy,suffix="fom$Suffix"
}

function CreateAdminFrontEnd {
    param ($ApiVersion, $Suffix, $Env, $ReplicaCount=2)

    DeleteAdminFrontEnd -Suffix $Suffix -Env $Env

    $Hostname="fom-nrs$Suffix.apps.silver.devops.gov.bc.ca"
    # $Hostname="nr-fom-admin$Suffix.apps.silver.devops.gov.bc.ca" TODO: Old format hostname.

    Write-Output "Create Admin front-end for suffix $Suffix and env $Env using version $ApiVersion with replica_count $ReplicaCount ..."
    oc process -f fom-admin-deploy.yml -p ENV=$Env -p SUFFIX=$Suffix -p HOSTNAME=$Hostname -p IMAGE_STREAM_VERSION=$ApiVersion -p REPLICA_COUNT=$ReplicaCount | oc create -n a4b31c-$Env -f -
}
