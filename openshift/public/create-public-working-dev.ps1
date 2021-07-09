. ./create-public-function.ps1

#DeletePublicFrontEnd -Suffix "working" -Env "dev"

CreatePublicFrontEnd -Suffix "-working-dev" -Env "dev" -ApiVersion "dev" 
