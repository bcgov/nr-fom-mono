
function CreateBatchStack {
    param ($ImageVersion, $Suffix, $Env)

    oc delete CronJob -n a4b31c-$Env -l template=fom-batch-deploy,suffix="fom$Suffix"

    Write-Output "Create Batch for suffix $Suffix and env $Env ..."

    oc process -f fom-batch-deploy.yml -p ENV=$Env -p SUFFIX=$Suffix -p IMAGE_STREAM_VERSION=$ImageVersion | oc create -n a4b31c-$Env -f -
}

CreateBatchStack -Suffix "-working-dev" -Env "dev" -ImageVersion "dev" 