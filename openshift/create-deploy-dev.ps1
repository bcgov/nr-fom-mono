

function Create-Api-Stack {
    param ($ApiVersion, $Suffix, $Env)

    Write-Output "Create API stack for suffix $Suffix and env $Env ..."

    Write-Output "Deleting existing resources..."
    oc delete all,NetworkPolicy -n a4b31c-$Env -l template=fom-api-deploy,tag=$Suffix

    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-db-deploy,suffix=$Suffix
    # WARNING: Non-reversible destructive operation: This will destroy the existing database and credentials to access it.
    oc delete Secret,PersistentVolumeClaim -n a4b31c-$Env -l template=fom-db-deploy,suffix=$Suffix

    Write-Output "Creating database..."
    oc process -f fom-db-deploy.yml -p ENV=$Env -p SUFFIX=$Suffix | oc create -n a4b31c-$Env -f -

    Write-Output "Creating api backend..."
    oc process -f fom-api-deploy.yml -p ENV=$Env -p TAG=$Suffix -p HOSTNAME="nr-fom-api-$Suffix-$Env" -p IMAGE_STREAM_VERSION=$ApiVersion | oc create -n a4b31c-$Env -f -
}

Create-Api-Stack -Suffix "dev" -Env "dev" -ApiVersion "dev"
#Create-Api-Stack -Suffix "main" -Env "dev" -ApiVersion "main"


