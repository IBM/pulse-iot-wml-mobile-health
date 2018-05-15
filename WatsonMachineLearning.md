## Watson Machine Learning Service Setup in IBM Cloud

> <u>N.B:</u> This service allows a certain number of api calls. If you exceed that number of allowance then it won't allow you to receive the prediction values anymore and/or it may charge you some money if you have a credit card information on there.

- Create [Machine Learning](https://console.bluemix.net/catalog/services/machine-learning) service
- Save the credentials found at by clicking the `Service Credentials` (on left panel) and then clicking `New Credential` button on the right of your page (center)


> Fill in the credentials in .env.template, save and re-name it to .env

- Make sure you add your credentials in .env.template:

WML_SERVICE_PATH=https://ibm-watson-ml.mybluemix.net

WML_USERNAME=

WML_PASSWORD=

WML_INSTANCE_ID=

WML_MODEL_ID=

WML_DEPLOYMENT_ID=

- Then rename .env.template to only .env
