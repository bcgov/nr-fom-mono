. ./create-public-function.ps1

#DeletePublicFrontEnd -Suffix "-main-dev" -Env "dev"

CreatePublicFrontEnd -Suffix "-main-dev" -Env "dev" -ApiVersion "main" 
