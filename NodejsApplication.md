## Node.js application As A Service

- Create [Node.js Service](https://console.bluemix.net/catalog/starters/sdk-for-nodejs)
- Give it a Name
- Follow steps in [Watson IoT Platform Service](WatsonIoTPlatform.md)


**To deploy the code to IBM Cloud:**

> Please make sure you have all the necessary CLIs (Cloud Foundry CLI (cf), Bluemix CLI (bx or bluemix or ibmcloud), etc.) installed before any deployment.
> __MAKE SURE__ you modify deploy.sh with your credentials and namings

* Run the following file in your terminal:

```
./deploy.sh
```

Note that the `deploy.sh` script will:  

- Create the [Cloudant Database Service](Cloudant.md)
- Bind the [Watson IoT Platform Service](WatsonIoTPlatform.md)

After it's done running successfully, check `<YOUR_APP_NAME>.mybluemix.net` on browser


* **To run the code locally to your laptop:**
- npm install
- npm start
- Open browser and check `localhost:3000`
