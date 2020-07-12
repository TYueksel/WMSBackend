(function() {
	'use strict';

	const mqtt = require('mqtt');
	const actuator = require('./actuator');
	const flow = require('./flowSensor');
	const level = require('./levelSensor');
	
	// Create a client connection
    const client = mqtt.connect(global.mqttHOST, {
    	username: global.mqttUSER,
    	password: global.mqttPW
    });

	exports.client = client;
	
    client.on('connect', function() { // Check you have a connection
		global.logger.log("Connected to MQTT Broker");
		flow.startSendingUsage(5);
		level.readInitialLevels();
		require('./turbiditySensor');
		
    	// Subscribe to a Topic
    	client.subscribe(global.mqttTOPIC + "Frontend", function() {
    		// When a message arrives
            handleMessages();
            
            sendMsg("Hello", "");
        });

    });
    
    function handleMessages() {
    	client.on('message', function(topic, message) {
    		try {
				message = toJSON(message);
			} catch(e) {
				console.error(e);
			}
			
			//console.log("Received '" + message.data + "' on '" + message.subtopic + "'");
			
			if(message.subtopic == "Hello") {
				const msg = {
					tank1: global.tank1,
					tank2: global.tank2,
					usage1: global.flowSensor1.liter,
					usage2: global.flowSensor2.liter,
					turbidity: global.turbidity,
					pump1: global.pump1.state,
					valve1: global.valve1.state,
					valve2: global.valve2.state
				};
				sendMsg("Info", msg);
			} else if(message.subtopic == "Info") {
				global.oldUsage1 = parseFloat(message.data.usage1);
				global.oldUsage2 = parseFloat(message.data.usage2);
				global.flowSensor1.limit = parseFloat(message.data.limit1);
				global.flowSensor2.limit = parseFloat(message.data.limit2);
				if(message.data.valve1) {
					global.valve1.state = "on";
				} else {
					global.valve1.state = "off";
				}
				if(message.data.valve2) {
					global.valve2.state = "on";
				} else {
					global.valve2.state = "off";
				}
			} else if(message.subtopic == "Pump1") {
				if(message.data == "on") {
					actuator.togglePump(1, "on");
				} else if(message.data == "off") {
					actuator.togglePump(1, "off");
				}
			} else if(message.subtopic == "Valve1") {
				if(message.data == "on") {
					actuator.toggleValve(1, "on");
				} else if(message.data == "off") {
					actuator.toggleValve(1, "off");
				}
			} else if(message.subtopic == "Valve2") {
				if(message.data == "on") {
					actuator.toggleValve(2, "on");
				} else if(message.data == "off") {
					actuator.toggleValve(2, "off");
				}
			} else if(message.subtopic == "Limit1") {
				global.flowSensor1.limit = parseFloat(message.data);
				global.logger.log("New Limit1: " + global.flowSensor1.limit);
			} else if(message.subtopic == "Limit2") {
				global.flowSensor2.limit = parseFloat(message.data);
				global.logger.log("New Limit2: " + global.flowSensor2.limit);
			} else if(message.subtopic == "Reset") {
				actuator.togglePump(1, "off");
				actuator.toggleValve(1, "off");
				actuator.toggleValve(2, "off");
				
				global.flowSensor1.liter = 0;
				global.flowSensor1.limit = 0;
				global.flowSensor2.liter = 0;
				global.flowSensor2.limit = 0;
				global.oldUsage1 = 0;
				global.oldUsage2 = 0;
				flow.resetCounts();
			}
		});
    }
    
    exports.closeMQTT = function() {
    	client.end();
    };

	function sendMsg(subtopic, message) {
		var data = {subtopic: subtopic, data: message};
		var buf = toBuffer(data);
		client.publish(global.mqttTOPIC + "Backend", buf, {qos: 2});
	}

	exports.sendMsg = sendMsg;
	
	function toBuffer(data) {
		return Buffer.from(JSON.stringify(data));
	}

	function toJSON(data) {
		return JSON.parse(data.toString());
	}

}());
