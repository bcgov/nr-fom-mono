. ./create-public-function.ps1

DeletePublicFrontEnd -Suffix "-experiment-dev" -Env "dev"

#CreatePublicFrontEnd -Suffix "-experiment-dev" -Env "dev" -ApiVersion "dev" -ReplicaCount 1
