. ./create-api-stack-function.ps1

#DeleteApiStack -Suffix "-working-dev" -Env "dev"

CreateApiStack -Suffix "-working-dev" -Env "dev" -ApiVersion "dev" -TestData "true" -ReplicaCount 1
