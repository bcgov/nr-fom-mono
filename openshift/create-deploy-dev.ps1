
function CreateApiStack {
    param ($ApiVersion, $Suffix, $Env, $TestData)

    Write-Output "Create API stack for suffix $Suffix and env $Env ..."

    Write-Output "Deleting existing resources..."
    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-api-deploy,tag=$Suffix

    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-db-deploy,suffix=$Suffix
    # WARNING: Non-reversible destructive operation: This will destroy the existing database and credentials to access it.
    oc delete Secret,PersistentVolumeClaim -n a4b31c-$Env -l template=fom-db-deploy,suffix=$Suffix

    Write-Output "Creating database..."
    oc process -f fom-db-deploy.yml -p ENV=$Env -p SUFFIX=$Suffix | oc create -n a4b31c-$Env -f -

    Write-Output "Creating api backend..."
    oc process -f fom-api-deploy.yml -p ENV=$Env -p TAG=$Suffix -p HOSTNAME="nr-fom-api-$Suffix-$Env" -p IMAGE_STREAM_VERSION=$ApiVersion -p DB_TESTDATA=$TestData | oc create -n a4b31c-$Env -f -
}

CreateApiStack -Suffix "working" -Env "dev" -ApiVersion "dev" -TestData "true"
CreateApiStack -Suffix "main" -Env "dev" -ApiVersion "main" -TestData "true"


