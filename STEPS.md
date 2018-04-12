## {.tabset .tabset-fade}

### Node.js application

#### Node.js application As A Service

- Create [Node.js Cloudant DB Web Starter](https://console.bluemix.net/catalog/starters/nodejs-cloudant-db-web-starter)
- Give it a Name
- This service comes with Cloudant database attached to it
- Check and make sure that you have Cloudant binded inside your running app instance
- The app will create a database in Cloudant when you run it



**To deploy the code to IBM Cloud:**
- ./deploy.sh
OR
- run each line by line the content of the deploy.sh
- <YOUR_APP_NAME>.mybluemix.net

**To run the code locally to your laptop:**
- npm install
- npm start
- localhost:3000


### Watson IoT Platform

#### Watson IoT Platform Service Setup

- Create [Internet of Things Platform](https://console.bluemix.net/catalog/services/internet-of-things-platform) (this is only the platform service by itself)
- Give a Name
- Make you add it by binding from within your node.js app (click on "+ Add A Connection" to add this service to your app)


### Watson Machine Learning

#### Watson Machine Learning Service Setup in IBM Cloud

> <u>N.B:</u> This service allows a certain number of api calls. If you exceed that number of allowance then it won't allow you to receive the prediction values anymore and/or it may charge you some money if you have a credit card information on there.

- Create [Machine Learning](https://console.bluemix.net/catalog/services/machine-learning) service
- Save the credentials found at by clicking the Service Credentials (on left panel) and then clicking "New Credential" button on the right of your page (center)
<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-addproject-1.png" width="350" height="500">

> Fill in the credentials in .env.template, save and re-name it to .env

- Make sure you add your credentials in .env.template:
WML_SERVICE_PATH=https://ibm-watson-ml.mybluemix.net
WML_USERNAME=
WML_PASSWORD=
WML_INSTANCE_ID=
WML_MODEL_ID=
WML_DEPLOYMENT_ID=
- Then rename .env.template to only .env


### IBM Studios

#### Data Platform
- A model setup on [IBM Studios](https://dataplatform.ibm.com) is needed to perform the prediction scoring of the beats per minute (bpm). (will post it - .ipynb notebook)
- Create a new project in there (click "+ Add a Project")
<table align="center"><tr>
<td><img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-addproject-1.png" width="350" height="500"><br>
<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-addproject-2.png" width="350" height="500"><br>
<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-addproject-3.png" width="350" height="500"></td>
</tr></table>
- Choose Spark to launch an instance of it
- Make use of [pulse-rate.csv](https://github.com/hovig/gyro-watson-ml/blob/master/Pulse Rates.ipynb) as your Jupyter notebook model
- Make use of [pulse-rate.csv](https://github.com/hovig/gyro-watson-ml/blob/master/pulse-rate.csv) to feed it into the Spark pipeline in your model
- Make sure in your notebook you have these following Kernel versions: Spark 2.1 and Python 3.5
<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/kernel-python-spark-versions.png" width="350" height="500">
<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-kernel.png" width="350" height="500">
