pipeline {
  agent none
  options {
    durabilityHint('MAX_SURVIVABILITY')
  }
  stages {
    stage('Build') {
      agent { label 'build' }
      steps {
        echo "Aborting all running jobs ..."
        script {
          abortAllPreviousBuildInProgress(currentBuild)
          sh "npx @bcgov/nrdk build --pr=${CHANGE_ID} --no-rfc-validation"
        }
      }
    }
    /*
    stage('Approval For DLVR in Jira') {
        agent { label 'deploy' }
        when {
            expression { return env.CHANGE_TARGET == 'master';}
              beforeInput true;
        }
        input {
            message "Are all the RFDs to DLVR Approved/Resolved, RFC Authorized to DLVR?"
            id "Jira-DLVR"
            parameters { }
            submitter "SYSTEM"
        }
        steps {
          script {
            echo "Approved"
          }
        }
    }
    */
    stage('Deploy to DEV') {
        agent { label 'build' } // Run on jenkins slave 'build'
        when {
          expression { return env.CHANGE_TARGET == 'master';}
        }
        steps {
          script {
            // Use Pipeline-cli node project to deploy the wiof-build image to Dev Stage
            echo "Deploying to DEV ..."
            sh "npx @bcgov/nrdk deploy --pr=${CHANGE_ID} --build=${BUILD_NUMBER} --env=dev --no-rfc-validation"
          }
        }
    }
    stage('Approval For TEST in Jira') {
        agent { label 'deploy' }
        when {
          expression { return env.CHANGE_TARGET == 'master';}
          beforeInput true;
        }
        input {
          message "Are all the RFDs to TEST Approved/Resolved, all RFDs to DLVR closed and RFC Authorized to TEST ?"
          id "Jira-TEST"
          parameters { }
          // submitter "SYSTEM" // TODO: Renable when JIRA integration is working.
        }
        steps {
          script {
            echo "Approved"
          }
        }
      }
      stage('Deploy to TEST') {
          agent { label 'deploy' }
          when {
              // Run Stage only if Pull Request is to master branch
              expression { return env.CHANGE_TARGET == 'master';}
              beforeInput true;
          }
          steps {
            script {
              // Use Pipeline-cli node project to deploy the wiof-build image to Test Stage
              echo "Deploying to Test ..."
              sh "npx @bcgov/nrdk deploy --pr=${CHANGE_ID} --build=${BUILD_NUMBER} --env=test --no-rfc-validation"
            }
          }
      }
      stage('Approval For PROD in Jira') {
          agent { label 'deploy' }
          when {
            expression { return env.CHANGE_TARGET == 'master';}
            beforeInput true;
          }
          input {
            message "Are all the RFDs to PROD Approved/Resolved, all RFDs to TEST closed and RFC Authorized to PROD ?"
            id "Jira-PROD"
            parameters { }
            // submitter "SYSTEM" // TODO: Renable when JIRA integration is working.
          }
          steps {
            script {
              echo "Approved"
            }
          }
      }
      stage('Deploy to PROD') {
        agent { label 'deploy' }
        when {
            // Run Stage only if Pull Request is to master branch
            expression { return env.CHANGE_TARGET == 'master';}
            beforeInput true;
        }
        steps {
            script {
              // Use Pipeline-cli node project to deploy the wiof-build image to Prod Stage
              echo "Deploying to Prod ..."
              sh "npx @bcgov/nrdk deploy --pr=${CHANGE_ID} --build=${BUILD_NUMBER} --env=prod --no-rfc-validation"
            }
        }
      }
  }
}


