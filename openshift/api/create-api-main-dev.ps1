. ./create-api-stack-function.ps1

#DeleteApiStack -Suffix "-main-dev" -Env "dev"

CreateApiStack -Suffix "-main-dev" -Env "dev" -ApiVersion "main" -TestData "true" -ReplicaCount 1
