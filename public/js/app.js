var client;
var iotfData = {};
var qsMode = true;
var msgInterval;
var pubTopic = 'iot-2/evt/status/fmt/json';
var subTopic = 'iot-2/cmd/buzz/fmt/json';
var sensordata = {};
sensordata.d = {};

// Pulse metrics
var fps = 50, mduration = 6000, n = 1;
var accelData = [], accelTimes = [], startTime = new Date();
var c,t;
var heartbeats = 0, bpm = 0, averageBpm = 0;

$(document).ready(function() {
	$('select').material_select();
	initchart();
	if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) )
		alert("This does not look like a mobile device - please load this page on a smartphone or tablet!");
});

/* utility functions */
function standardDeviation(values){
  var avg = average(values);

  var squareDiffs = values.map(function(value){
  	var diff = value - avg;
  	var sqrDiff = diff * diff;
  	return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
  	return sum + value;
  }, 0);
  var avg = sum / data.length;
  return avg;
}

function smooth() {
	var heartSignal = AudioProcessor.savitzkyGolay(accelData, Math.round(fps/2)*2+1, 3);
	heartSignal = AudioProcessor.savitzkyGolay(heartSignal, Math.round(fps/4)*2+1, 3);
	var breathSignal = AudioProcessor.savitzkyGolay(heartSignal, Math.round(fps)*2+1, 3);
	heartSignal = numeric.sub(heartSignal, breathSignal);
	heartSignal = AudioProcessor.savitzkyGolay(heartSignal, Math.round(fps/4)*2+1, 3);
	heartSignal = AudioProcessor.savitzkyGolay(heartSignal, Math.round(fps/8)*2+1, 3);
	return heartSignal;
}

function countHeartBeats(heartSignal) {
	var currentMaximum = 0;
	var beats = 0;
	var mean = average(heartSignal);
	var sthreshold = 0.2*standardDeviation(heartSignal);
	for (var i = 0; i < heartSignal.length; i++) {
		if (heartSignal[i] > mean+sthreshold) {
			heartSignal[i] = mean+sthreshold;
			if (!currentMaximum) {
				currentMaximum = 1;
				beats += 1;
			}
		}
		else {
			currentMaximum = 0;
		}
	}
	return beats;
}

/* motion and heart rate calculation */
function calculateHeartRate(event){
  accelData.push(event.accelerationIncludingGravity.y);
  accelTimes.push(new Date() - startTime);
  if (new Date() - startTime > mduration) {
              fps = accelData.length / (new Date() - startTime) * 1000;
	if (averageBpm != 0) {
		document.getElementById("pulse").innerHTML = "<h3 style='font-size:18pt' align='center'>"+(averageBpm==50?"<50":(averageBpm==140?">140":Math.round(averageBpm)))
    +" beats/minute</h3>current bpm: "+(bpm==50?"<50":(bpm==140?">140":bpm))+"<br> heartbeats: "+heartbeats+" in "
    +(mduration/1000)+" seconds <br> sensor data: "+Math.round(fps)+"Hz <br> ML Predicted Pulse: "+sensordata.d.newbpm || 0;
    sensordata.d.bpm = bpm;
    sensordata.d.heartbeats = heartbeats;
    sensordata.d.seconds = mduration/1000;
    autoPredictPulseRate();
	} else if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$("#output").html('<img src="/img/heart.png" height="77" width="77" align="center"><br/>Waiting for accelerometer to pick up your heartbeat... <b>Don\'t move</b>, keep the phone against your chest, and please be patient.<!--<h4><u>Firmly</u> press the bottom of your smartphone against your chest, and wait <u>without moving</u></h4>-->');
	} else {
		$("#output").html("<h1>This is not a mobile device, or no accelerometers detected. Please load this page on a smartphone or tablet instead!</h1>");
  }
	// smoothing with savitzky golay filter
	var heartSignal = smooth(accelData);
  updatechart(heartSignal, "graph");
	heartbeats = countHeartBeats(heartSignal);

	// calculate beats per minute (use weighted rolling average)
	var currentBpm = heartbeats/(mduration/1000) * 60.0;
	if (bpm != 0 && (averageBpm != 0 || currentBpm > 50 && currentBpm < 140)) {
		averageBpm = 0.3*currentBpm + 0.7*(averageBpm + (currentBpm - averageBpm)/n);
		n ++;
	}
	if (currentBpm < 50)
		currentBpm = 50;
	else if (currentBpm > 140)
		currentBpm = 140;
	bpm = currentBpm;

	// reset plot arrays
  	accelData = [];
  	accelTimes = [];
  	startTime = new Date();
  }
}

/* plotting functions */
var m = [1, 1, 1, 1]; // margins
var graphw = 850 - m[1] - m[3];
var graphh = 200 - m[0] - m[2];

function initchart() {
	var data = [1];
	var x = d3.scale.linear().domain([0, data.length]).range([0, graphw]);
	var y = d3.scale.linear().domain([0, 250]).range([graphh, 0]);
	var line = d3.svg.line()
		.x(function(d,i) {
			return x(i);
		})
		.y(function(d) {
			return y(d);
		});

	var graph = d3.select("#graph").append("svg:svg")
		  .attr("width", graphw + m[1] + m[3])
		  .attr("height", graphh + m[0] + m[2])
		  .append("svg:g")
		  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	graph.append("svg:path").attr("class", "line").attr("d", line(data));
}

function updatechart(data, graphid) {
	var x = d3.scale.linear().domain([0, data.length]).range([0, graphw]);
	var y = d3.scale.linear().domain([d3.min(data), d3.max(data)]).range([graphh, 0]);
	var line = d3.svg.line()
		.x(function(d,i) {
			return x(i);
		})
		.y(function(d) {
			return y(d);
		});

	var graph = d3.select("#"+graphid).transition();
	graph.select(".line").duration(data.length).attr("d", line(data))
}

if(window.DeviceMotionEvent){
		window.addEventListener("devicemotion", calculateHeartRate, false);
}else{
		alert("DeviceMotionEvent is not supported");
}

sensordata.toJson = function() {
  return JSON.stringify(this);
}

sensordata.publish = function() {
  var message = new Paho.MQTT.Message(sensordata.toJson());
  message.destinationName = pubTopic;
  client.send(message);
}

init();

function register() {
  var xhr = new XMLHttpRequest();
  xhr.open('get', '/register');
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4)  {
      if(xhr.status === 200) {
        resp = JSON.parse(xhr.responseText)
        localStorage.setItem("iotf", true);
        localStorage.setItem("clientId", resp.uuid);
        localStorage.setItem("org", resp.uuid.split(":")[1]);
        localStorage.setItem("deviceType", resp.type);
        localStorage.setItem("deviceId", resp.id);
        localStorage.setItem("password", resp.password);
        client.disconnect();
        location.reload();
      }
    }
  }
  xhr.send(null);
}

/** Watson ML performance **/
function updateFormOnSubmit() {
  document.getElementById('submit').disabled = true;
  document.getElementById('loading').style.display = 'block';
  document.getElementById('prediction').style.display = 'none';
}
function updateFormAfterSubmit(bpm) {
  document.getElementById('bpm').innerText = bpm;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('prediction').style.display = 'block';
  document.getElementById('submit').disabled = false;
}
function predictPulseRate() {
  updateFormOnSubmit();
  var data = {
    heartBeats: parseInt(document.getElementById('heart_beats').value),
    timeInSeconds: parseInt(document.getElementById('time_in_secs').value),
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/predictPulseRate', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
                console.log(response)
      updateFormAfterSubmit(response.bpm);
    }
  }
  xhr.send(JSON.stringify(data));
}

function autoPredictPulseRate() {
  var data = {
    heartBeats: parseInt(sensordata.d.heartbeats),
    timeInSeconds: parseInt(sensordata.d.seconds),
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/autoPredictPulseRate', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
                console.log(response)
      sensordata.d.newbpm = response.bpm;
    }
  }
  xhr.send(JSON.stringify(data));
}

function bodyLoaded() {
  document.getElementById('submit').onclick = function () {
    predictPulseRate();
    return false;
  }
}
/** **/

function clearData() {
  var xhr = new XMLHttpRequest();
  xhr.open('get', '/unregister?type=' + iotfData.deviceType + '&id=' + iotfData.deviceId);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4)  {
      localStorage.removeItem("iotf");
      localStorage.removeItem("clientId");
      localStorage.removeItem("org");
      localStorage.removeItem("deviceType");
      localStorage.removeItem("deviceId");
      localStorage.removeItem("password");
      location.reload();
    }
  }
  xhr.send(null);
}

/** IoT initiations **/
function init() {
  var name = "mypulse", org = "quickstart";
  if (localStorage && ('iotf' in localStorage)) {
    iotfData.clientId = localStorage.getItem("clientId");
    iotfData.org = localStorage.getItem("org");
    iotfData.deviceType = localStorage.getItem("deviceType");
    iotfData.deviceId = localStorage.getItem("deviceId");
    iotfData.password = localStorage.getItem("password");
    sensordata.d.deviceId = iotfData.deviceId;
    qsMode = false;
    document.getElementById("register").style.display="none";
    document.getElementById("cleardata").style.display="block";
    window.deviceId = iotfData.deviceId;
  } else {
    iotfData.deviceId = new Date().getTime().toString().substring(1, 13);
    iotfData.deviceType = name;
    clientId = "d:"+org+":"+name+":"+iotfData.deviceId;
    if (localStorage) {
      document.getElementById("register").style.display="block";
      document.getElementById("cleardata").style.display="none";
    }
    window.deviceId = iotfData.deviceId;
  }

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(eventData) {
      var tiltLR = eventData.gamma;
      var tiltFB = eventData.beta;
      var dir = eventData.alpha

      deviceOrientationHandler(tiltLR, tiltFB, dir);
      }, false);
  } else {
    document.getElementById("doEvent").innerHTML = "Not supported."
  };

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
  } else {
    document.getElementById("acEvent").innerHTML = "Not supported."
  };
  if (qsMode) {
    client = new Paho.MQTT.Client("ws://quickstart.messaging.internetofthings.ibmcloud.com:1883/", clientId);
    client.onConnectionLost = onConnectionLost;
    client.connect({onSuccess: onConnect});
  }
}

function onMessageArrived(message) {
  console.log(message.payloadString);
  if ("vibrate" in navigator) {
    payload = JSON.parse(message.payloadString);
    if (!isNaN(payload.buzz)) {
      navigator.vibrate(payload.buzz);
    }
  }
}

function onConnect() {
  var connStatus = document.getElementById("connStatus");
  var devId = document.getElementById("devId");
  connStatus.innerHTML = "Status: <span style=\"color:green\"><b>Connected</b></span>";
  devId.innerHTML = "DeviceID: "+iotfData.deviceId;
  console.log("Connected");
  msgInterval = window.setInterval(sensordata.publish, 250);
  window.setInterval(function(){
    getSensorData();
  }, 10000);
  if (!qsMode) {
    client.subscribe(subTopic);
  }
  console.log(msgInterval);
}

function onConnectFailure(error) {
  connStatus.innerHTML = 'Connect Failed';
  console.log("Connect Failed");
  console.log(error.errorCode);
  console.log(error.errorMessage);
}

function onConnectionLost(response) {
  connStatus.innerHTML = "Status: <span style=\"color:red\"><b>Disconnected</b></span>";
  console.log("onConnectionLost")
  if (response.errorCode !== 0) {
      console.log("onConnectionLost:"+response.errorMessage);
  }
  clearInterval(msgInterval);
  if (qsMode) {
    client.connect({onSuccess: onConnect,
            onFailure: onConnectFailure});
  }
}

function deviceOrientationHandler(tiltLR, tiltFB, dir) {
  sensordata.d.tiltLR = Math.round(tiltLR);
  sensordata.d.tiltFB = Math.round(tiltFB);
  sensordata.d.direction = Math.round(dir);

  document.getElementById("motion").innerHTML = "Tilt Left/Right: " + Math.round(tiltLR) + "<br>Tilt Front/Back: "
        + Math.round(tiltFB) + "<br>Direction: " + Math.round(dir);
}

function deviceMotionHandler(eventData) {
  var acceleration = eventData.acceleration;
  var accelX = Math.round(acceleration.x);
  var accelY = Math.round(acceleration.y);
  var accelZ = Math.round(acceleration.z);

  // Grab the acceleration from the results
  sensordata.d.accelX = accelX;
  sensordata.d.accelY = accelY;
  sensordata.d.accelZ = accelZ;
  var speed = Math.sqrt(parseInt(accelX)^2 + parseInt(accelY)^2 + parseInt(accelZ)^2);
  sensordata.d.speed = speed;
  sensordata.d.deviceid = iotfData.deviceId;
  document.getElementById("speed").innerHTML = "Speed: "+speed;
}

/** Send metrics to Cloudant **/
function getSensorData() {
  $.ajax({
  	url: "/api/" + sensordata.toJson(),
    error: function(xhr, status, error) {
      if(xhr.status==401 && xhr.status==404){
        console.log("Sending sensor data with status error " + xhr.status);
  		} else {
        console.log("Failed to authenticate! "+error);
  		}
  	},
  	success: function(){
      console.log("Phone Data sent! " + xhr);
  	}
  });
}
