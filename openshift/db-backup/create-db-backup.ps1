
function CreateStack {

    # Just run template to test if valid, don't apply it as that's done through the Jenkins nrdk pipeline.
    Write-Output "Creating db backup..."
    oc process -f backup-deploy.yml -p SUFFIX='-exp-dev' -p IMAGE_STREAM_VERSION='dev' -p JOB_NAME='backup-postgres-exp-dev' -p BACKUP_VOLUME_NAME='backup-exp-dev' -p VERIFICATION_VOLUME_NAME='backup-verification-exp-dev' -p DATABASE_DEPLOYMENT_NAME='fom-db-exp-dev' 
    #| oc create -n a4b31c-$Env -f -
        
}

CreateStack 
