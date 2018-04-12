## MyPulse - IoT WML Mobile Health App

The idea behind this application is to have a way to check pulse rates with the most available devices and these are the mobile phones.

A brief description:

- Create a classification Model using a dataset which contains the pulse data and its related derived values. Deploy the Model and expose it as WML endpoints
- Register the Mobile device with Watson IoT Platform
- Using the mobile app, generate the LIVE pulse data. This data is published to IoT platform and then stored in a NSQL database
- Streaming the pulse data from the app in real-time (or the database) and using WML validate it with the deployed model

<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/pulse-arch.png" width="500" height="350" align="center">

<hr>

## TUTORIAL STEPS

- Steps 1 & 5 - [Node.js application](https://github.com/hovig/pulse-iot-wml-mobile-health/blob/master/NodejsApplication.md)
- Step 2 - [Watson Machine Learning](https://github.com/hovig/pulse-iot-wml-mobile-health/blob/master/WatsonMachineLearning.md)
- Step 3 - [Watson IoT Platform](https://github.com/hovig/pulse-iot-wml-mobile-health/blob/master/WatsonIoTPlatform.md)
- Step 4 - [IBM Studios](https://github.com/hovig/pulse-iot-wml-mobile-health/blob/master/IBMStudios.md)


<hr>

- After doing the above <u>**tutorial steps.**</u>
- Try it on your mobile phone's browser: `http://<YOUR_APP_NAME>.mybluemix.net`
  You can try my running app [http://mypulse.mybluemix.net/](http://mypulse.mybluemix.net/) to have a feel how it looks like, but mine exceeded the allowance plan for the machine learning service so the prediction parts will be displayed with <b>"undefined"</b>

  <img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/plan.png" width="800" height="250">

- Open [Watson IoT Platform Quickstart](https://quickstart.internetofthings.ibmcloud.com/#/)
- Put your device id on there for real-time streaming view of your data.

<hr>


<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/mypulse.gif" width="350" height="500">


## Important Naming Notes

* Bluemix aka IBM Cloud
* DSX aka Data Platform

## Useful links

* [IBM Cloud](https://bluemix.net/)  
* [IBM Cloud Documentation](https://www.ng.bluemix.net/docs/)  
* [IBM Cloud Developers Community](http://developer.ibm.com/bluemix)  
* [IBM Watson Internet of Things](http://www.ibm.com/internet-of-things/)  
* [IBM Watson IoT Platform](http://www.ibm.com/internet-of-things/iot-solutions/watson-iot-platform/)   
* [IBM Watson IoT Platform Developers Community](https://developer.ibm.com/iotplatform/)
* [Savitzky–Golay filter for smoothing the accelerometer data](https://en.wikipedia.org/wiki/Savitzky%E2%80%93Golay_filter)
* Thanks to Mark Watson for making the "[watson-ml-model-utils](https://www.npmjs.com/package/watson-ml-model-utils)" library

## Privacy notice
This web application includes code to track deployments to [IBM Bluemix](https://www.bluemix.net/) and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/IBM/metrics-collector-service) service on each deployment:

* Node.js package version
* Node.js repository URL
* Cloudant database
* Watson machine learning service
* Application Name (`application_name`)
* Application GUID (`application_id`)
* Application instance index number (`instance_index`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Labels of bound services
* Number of instances for each bound service and associated plan information
* Metadata in the repository.yaml file

This data is collected from the `package.json` and `repository.yaml` file in the sample application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

## Disabling deployment tracking
Deployment tracking can be disabled by removing the `require("metrics-tracker-client").track();` line from the './bin/www' file.

## License
[Apache 2.0](LICENSE)
