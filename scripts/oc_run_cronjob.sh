#!/bin/sh
#
# Exit on errors or unset variables
set -eu

# Run and verify ETL jobs in OpenShift
#
# Usage: ./oc_run_cronjob.sh [cronjob_name] [optional:token]

# Check inputs
if [ -z "${1:-}" ]; then
  echo -e "\nPlease provide the name of a cronjob to run.  Exiting.\n"
  exit 1
fi

# Login (optional)
if [ ! -z "${2:-}" ]; then
  oc login --token=${2} --server=https://api.silver.devops.gov.bc.ca:6443
  oc project #Safeguard!
fi

# Create job
RUN_JOB=${1}--$(date +"%Y-%m-%d--%H-%M-%S")
oc create job ${RUN_JOB} --from=cronjob/${1}

# Follow
oc wait --for=condition=ready pod --selector=job-name=${RUN_JOB} --timeout=5m
oc logs -l job-name=${RUN_JOB} --tail=50 --follow

# Verify successful completion
oc wait --for jsonpath='{.status.phase}'=Succeeded pod --selector=job-name=${RUN_JOB} --timeout=1m
echo "Job successful!"
