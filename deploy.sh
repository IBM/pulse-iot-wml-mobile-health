#!/bin/bash

if [ -z "$1" ]
  then
    echo "No unique string provided across region in IBM Cloud"
    exit 1
fi

UNIQUE_IDENTIFIER="${1}"

###################
# Deployment Code
###################

bx api <API_ENDPOINT>

# i.e.:
# for us-south: https://api.ng.bluemix.net
# for europe: https://api.eu-gb.bluemix.net

bx login -u <YOUR_USERNAME> -p <YOUR_PASSWORD>
bx target -o <YOUR_ORG_NAME> -s <YOUR_SPACE_NAME>

bx cf create-service iotf-service iotf-service-free <YOUR_IOT_PLATFORM_SERVICE_NAME>

bx cf create-service cloudantNoSQLDB Lite <YOUR_CLOUDANT_SERVICE_NAME>
bx cf create-service-key <YOUR_CLOUDANT_SERVICE_NAME> <YOUR_APP_NAME>

CLOUDANT_CREDENTIALS=`bx cf service-key <YOUR_CLOUDANT_SERVICE_NAME> <YOUR_APP_NAME> | tail -n +5`
export CLOUDANT_USERNAME=`echo $CLOUDANT_CREDENTIALS | jq -r .username`
export CLOUDANT_PASSWORD=`echo $CLOUDANT_CREDENTIALS | jq -r .password`
export CLOUDANT_HOST=`echo $CLOUDANT_CREDENTIALS | jq -r .host`

if [ -z "$CLOUDANT_DB" ]; then
  echo 'CLOUDANT_DB was not set in the pipeline. Using default value.'
  export CLOUDANT_DB=<YOUR_CLOUDANT_SERVICE_NAME>-${UNIQUE_IDENTIFIER}
fi

echo 'Creating '$CLOUDANT_db' database...'
curl -s -X PUT "https://$CLOUDANT_USERNAME:$CLOUDANT_PASSWORD@$CLOUDANT_HOST/$CLOUDANT_DB"

bx cf push <YOUR_APP_NAME> --no-start
RUN_RESULT=$?
bx cf bind-service <YOUR_APP_NAME> <YOUR_IOT_PLATFORM_SERVICE_NAME>
bx cf restage <YOUR_APP_NAME>
bx cf start <YOUR_APP_NAME>

RUN_RESULT=$?
if [ ${RUN_RESULT} -ne 0 ]; then
    echo "Service failed to start successfully.  Check logs."
    bx cf logs <YOUR_APP_NAME> --recent
    exit 1
fi

bx cf apps
