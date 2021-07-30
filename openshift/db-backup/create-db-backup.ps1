
function DeleteStack {
    param($Suffix, $Env)

    Write-Output "Deleting existing resources for suffix $Suffix and env $Env ..."
    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-api-deploy,suffix="fom$Suffix"

    oc delete all,NetworkPolicy,ConfigMap -n a4b31c-$Env -l template=fom-db-deploy,suffix="fom$Suffix"

    # Allow deletion of database to recreate from scratch and rerun creation/populate scripts.
    Write-Output "WARNING: Non-reversible deletion of existing database and its storage and related credentials..."
    Read-Host "*** Confirm database destruction ***"
    oc delete Secret,PersistentVolumeClaim -n a4b31c-$Env -l template=fom-db-deploy,suffix="fom$Suffix"

    # Delete data encryption key secret as well
    oc delete Secret -n a4b31c-$Env -l template=fom-api-deploy,suffix="fom$Suffix"
}

function CreateStack {
    #param ($ApiVersion, $Suffix, $Env, $TestData="false", $ReplicaCount=2, $KeycloakEnabled="true")

    # DeleteApiStack -Suffix $Suffix -Env $Env

    # Write-Output "Create API stack for suffix $Suffix and env $Env ..."

    # Write-Output "Creating database..."
    # oc process -f ../db/fom-db-deploy.yml -p ENV=$Env -p SUFFIX=$Suffix | oc create -n a4b31c-$Env -f -

    # Write-Output "Delay creation of API to allow time for database to be created and start up..."
    # Start-Sleep -s 60

    # $Hostname="fom-nrs$Suffix.apps.silver.devops.gov.bc.ca"
    # $Hostname="nr-fom-api$Suffix.apps.silver.devops.gov.bc.ca" TODO: Old format hostname.

    Write-Output "Creating db backup..."
    oc process -f backup-deploy.yml -p SUFFIX='-exp-dev' -p IMAGE_STREAM_VERSION='dev' -p JOB_NAME='backup-postgres-exp-dev' -p BACKUP_VOLUME_NAME='backup-exp-dev' -p VERIFICATION_VOLUME_NAME='backup-verification-exp-dev' -p DATABASE_DEPLOYMENT_NAME='fom-db-exp-dev' 
        #| oc create -n a4b31c-$Env -f -
        
}

CreateStack 