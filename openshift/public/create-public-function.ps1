
function DeletePublicFrontEnd {
    param($Suffix, $Env)

    Write-Output "Deleting existing resources for suffix $Suffix and env $Env ..."
    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-public-deploy,suffix="fom$Suffix"
}

function CreatePublicFrontEnd {
    param ($ApiVersion, $Suffix, $Env, $ReplicaCount=2)

    DeletePublicFrontEnd -Suffix $Suffix -Env $Env

    $Hostname="fom-nrs$Suffix.apps.silver.devops.gov.bc.ca"
    #$Hostname="nr-fom-public$Suffix.apps.silver.devops.gov.bc.ca"

    Write-Output "Create Public front-end for suffix $Suffix and env $Env using version $ApiVersion with replica_count = $ReplicaCount ..."
    oc process -f fom-public-deploy.yml -p ENV=$Env -p SUFFIX=$Suffix -p HOSTNAME=$Hostname -p IMAGE_STREAM_VERSION=$ApiVersion -p REPLICA_COUNT=$ReplicaCount | oc create -n a4b31c-$Env -f -
}
