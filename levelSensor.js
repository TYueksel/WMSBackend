(function() {

	const Gpio = require('onoff').Gpio;
	const mqtt = require('./mqtt');
	const actuator = require('./actuator');
	
	const level1 = new Gpio(global.levelSensor1.PIN, 'in', 'both', {activeLow: true});
	const level2 = new Gpio(global.levelSensor2.PIN, 'in', 'both', {activeLow: true});
	const level3 = new Gpio(global.levelSensor3.PIN, 'in', 'both', {activeLow: true});
	const level4 = new Gpio(global.levelSensor4.PIN, 'in', 'both', {activeLow: true});
	const level5 = new Gpio(global.levelSensor5.PIN, 'in', 'both', {activeLow: true});
	
	exports.readInitialLevels = function() {
		global.levelSensor1.value = level1.readSync();
		global.levelSensor2.value = level2.readSync();
		global.levelSensor3.value = level3.readSync();
		global.levelSensor4.value = level4.readSync();
		global.levelSensor5.value = level5.readSync();
		
		global.tank1 = getWaterLevel(1);
		global.logger.log("Tank1 is " + global.tank1);
		mqtt.sendMsg("Tank1", global.tank1);
		
		global.tank2 = getWaterLevel(2);
		global.logger.log("Tank2 is " + global.tank2);
		mqtt.sendMsg("Tank2", global.tank2);
    };
	
	level1.watch((err, value) => {
		if (err) {
			throw err;
		}
		
		if(global.levelSensor1.value != value) {
			global.levelSensor1.value = value;
			global.tank1 = getWaterLevel(1);
			global.logger.log("Tank1 is " + global.tank1);
			if(mqtt.client.connected) {
				mqtt.sendMsg("Tank1", global.tank1);
			}
			if(global.tank1 == "EMPTY" && global.pump1.state == "on") {
				global.logger.log("Turning Pump1 OFF: Tank1 is " + global.tank1);
				actuator.togglePump(1, "off");
			}
			if(global.tank1 != "EMPTY" && (global.tank2 == "EMPTY" || global.tank2 == "LOW") && global.pump1.state == "off" && global.turbiditySensor < 500) {
				global.logger.log("Turning Pump1 ON: Tank2 is " + global.tank2);
				actuator.togglePump(1, "on");
			}
		}
	});
	
	level2.watch((err, value) => {
		if (err) {
			throw err;
		}
		
		if(global.levelSensor2.value != value) {
			global.levelSensor2.value = value;
			global.tank1 = getWaterLevel(1);
			global.logger.log("Tank1 is " + global.tank1);
			if(mqtt.client.connected) {
				mqtt.sendMsg("Tank1", global.tank1);
			}
		}
	});
	
	level3.watch((err, value) => {
		if (err) {
			throw err;
		}
		
		if(global.levelSensor3.value != value) {
			global.levelSensor3.value = value;
			global.tank2 = getWaterLevel(2);
			global.logger.log("Tank2 is " + global.tank2);
			if(mqtt.client.connected) {
				mqtt.sendMsg("Tank2", global.tank2);
			}
			
			if(global.tank2 == "EMPTY" && global.pump2.state == "on") {
				global.logger.log("Turning Pump2 OFF: Tank2 is " + global.tank2);
				actuator.togglePump(2, "off");
			}
			if(global.tank1 != "EMPTY" && (global.tank2 == "LOW" || global.tank2 == "EMPTY") && global.pump1.state == "off" && global.turbiditySensor < 500) {
				global.logger.log("Turning Pump1 ON: Tank2 is " + global.tank2);
				actuator.togglePump(1, "on");
			}
			if(global.tank2 == "LOW" && (global.valve1.state == "on" || global.valve2.state == "on") && global.pump2.state == "off" && global.turbiditySensor < 500) {
				global.logger.log("Turning Pump2 ON: Tank2 is " + global.tank2 + " and at least one Valve is ON");
				actuator.togglePump(2, "on");
			}
		}
	});
	
	level4.watch((err, value) => {
		if (err) {
			throw err;
		}
		
		if(global.levelSensor4.value != value) {
			global.levelSensor4.value = value;
			global.tank2 = getWaterLevel(2);
			global.logger.log("Tank2 is " + global.tank2);
			if(mqtt.client.connected) {
				mqtt.sendMsg("Tank2", global.tank2);
			}
		}
	});
	
	level5.watch((err, value) => {
		if (err) {
			throw err;
		}
		
		if(global.levelSensor5.value != value) {
			global.levelSensor5.value = value;
			global.tank2 = getWaterLevel(2);
			global.logger.log("Tank2 is " + global.tank2);
			if(mqtt.client.connected) {
				mqtt.sendMsg("Tank2", global.tank2);
			}
			if(global.tank2 == "FULL" && global.pump1.state == "on") {
				global.logger.log("Turning Pump1 OFF: Tank2 is " + global.tank2);
				actuator.togglePump(1, "off");
			}
		}
	});
	
	function getWaterLevel(tankID) {
		if(tankID == 1) {
			if(global.levelSensor1.value == 0) {
				return "EMPTY";
			} else {
				if(global.levelSensor2.value == 0) {
					return "MEDIUM";
				} else {
					return "FULL";
				}
			}
		} else if(tankID == 2) {
			if(global.levelSensor3.value == 0) {
				return "EMPTY";
			} else {
				if(global.levelSensor4.value == 0) {
					return "LOW";
				} else {
					if(global.levelSensor5.value == 0) {
						return "MEDIUM";
					} else {
						return "FULL";
					}
				} 
			}
		}
	}

}());
