## Data Platform
- A model setup on [IBM Studios](https://dataplatform.ibm.com) is needed to perform the prediction scoring of the beats per minute (bpm)
- Create a new project in there (click "+ Add a Project")
<table align="center"><tr>
<td><img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-addproject-1.png" width="500" height="350"><br>
<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-addproject-2.png" width="500" height="350"><br>
<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-addproject-3.png" width="500" height="350"></td>
</tr></table>

- Choose Spark to launch an instance of it
- Make use of [pulse-rate.csv](https://github.com/hovig/gyro-watson-ml/blob/master/Pulse Rates.ipynb) as your Jupyter notebook model
- Make use of [pulse-rate.csv](https://github.com/hovig/gyro-watson-ml/blob/master/pulse-rate.csv) to feed it into the Spark pipeline in your model
- Make sure in your notebook you have these following Kernel versions: Spark 2.1 and Python 3.5

<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/kernel-python-spark-versions.png" width="650" height="100">

<img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/ml-kernel.png" width="900" height="550">
