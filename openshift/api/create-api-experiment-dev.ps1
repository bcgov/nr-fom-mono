. ./create-api-stack-function.ps1

#DeleteApiStack -Suffix "-experiment-dev" -Env "dev"

CreateApiStack -Suffix "-experiment-dev" -Env "dev" -ApiVersion "dev" -TestData "true" -ReplicaCount 3 -KeycloakEnabled "true"
