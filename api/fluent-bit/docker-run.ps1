#!/bin/bash

#cd "${0%/*}"

# Host Metadata - OS
#
#export HOST_OS_KERNEL="$(uname -r)"
#export HOST_OS_TYPE="$(uname)"

# Host Metadata - General
#
#export HOST_ARCH="$(uname -m)"
#export HOST_HOSTNAME="$(hostname -s)"
#export HOST_ID="$(hostname -f)"
#export HOST_NAME="${HOST_HOSTNAME}"
#export HOST_DOMAIN="$(echo ${HOST_HOSTNAME#[[:alpha:]]*.})"
#export FLUENT_VERSION="2.0.5"
#export FLUENT_CONF_HOME="/config"
#export FUNBUCKS_HOME="${PWD}/.."

# Run in foreground, passing vars
#    -e HOST_* \
#    --network=host \
# --security-opt label=disable \
    #-v "/proc/stat:/proc/stat:ro" \

#docker run --rm \
#    -v "../output:/config" \
##    -v "./data:/data" \
#   -e FLUENT_VERSION=2.0.5 \
#    -e FLUENT_CONF_HOME="/config" \
#    fluent/fluent-bit:2.0.5-debug /fluent-bit/bin/fluent-bit -c /config/fluent-bit.conf

#C:\dev\fom\nr-funbucks\lambda> 
docker run --rm -v "c:/dev/fom/nr-fom/api/fluent-bit/config:/config" -v "c:/dev/fom/nr-fom/api/fluent-bit/data:/data" -e FLUENT_CONF_HOME="/config"  fluent/fluent-bit:2.0.5-debug /fluent-bit/bin/fluent-bit -c /config/fluent-bit.conf