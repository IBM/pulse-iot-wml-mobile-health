cf api https://api.ng.bluemix.net
cf login -u username -o org_name -s space_name
cf create-service iotf-service iotf-service-free service_name 
cf push app_name --no-start
cf bind-service app_name simulate-iot
cf restage app_name
cf start app_name
