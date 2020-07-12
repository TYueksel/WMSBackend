(function() {
	'use strict';
	
	const Gpio = require('onoff').Gpio;
	const mqtt = require('./mqtt');
	
	var pump1 = new Gpio(global.pump1.PIN, 'out');
	var pump2 = new Gpio(global.pump2.PIN, 'out');
	var valve1 = new Gpio(global.valve1.PIN, 'out');
	var valve2 = new Gpio(global.valve2.PIN, 'out');
	
	function togglePump(pumpID, mode) {
		if(pumpID == 1) {
			if(mode == "on") {
				if(global.tank2 == "FULL") {
					global.logger.log("Cannot turn ON Pump1: Tank2 is " + global.tank2);
				} else if(global.tank1 == "EMPTY") {
					global.logger.log("Cannot turn ON Pump1: Tank1 is " + global.tank2);
				} else {
					global.pump1.state = mode;
					pump1.writeSync(1);
					global.logger.log("Pump1 turned ON");
					mqtt.sendMsg("Pump1", true);
				}
			} else if(mode == "off") {
				global.pump1.state = mode;
				pump1.writeSync(0);
				global.logger.log("Pump1 turned OFF");
				mqtt.sendMsg("Pump1", false);
			}
		} else if(pumpID == 2) {
			if(mode == "on") {
				if(global.turbiditySensor <= 500) {
					if(global.tank2 != "EMPTY") {
						if(global.valve1.state == "on" || global.valve2.state == "on") {
							setTimeout(function() {
								global.pump2.state = mode;
								pump2.writeSync(1);
								global.logger.log("Pump2 turned ON");
							}, 500);
						} else {
							global.logger.log("Cannot turn ON Pump2: Valve1 and Valve2 are both OFF");
						}
					} else {
						global.logger.log("Cannot turn ON Pump2: Tank2 is " + global.tank2);
					}
				} else {
					global.logger.log("Cannot turn ON Pump2: Tank2 is dirty (" + global.turbiditySensor + " NTU)");
				}	
			} else if(mode == "off") {
				global.pump2.state = mode;
				pump2.writeSync(0);
				global.logger.log("Pump2 turned OFF");
			}
		}
	};
	
	exports.togglePump = togglePump;

	function toggleValve(valveID, mode) {
		if(mode == "on") {
			if(valveID == 1) {
				global.valve1.state = mode;
				valve1.writeSync(1);
				global.logger.log("Valve1 turned ON");
				//mqtt.sendMsg("Valve1", true);
			} else if(valveID == 2) {
				global.valve2.state = mode;
				valve2.writeSync(1);
				global.logger.log("Valve2 turned ON");
				//mqtt.sendMsg("Valve2", true);
			}
			togglePump(2, "on");
		} else if (mode == "off") {
			if(global.pump2.state == "on") {
				if(valveID == 1) {
					if(global.valve2.state == "off") {
						togglePump(2, "off");
					}
					global.valve1.state = mode;
					valve1.writeSync(0);
					global.logger.log("Valve1 turned OFF");
					//mqtt.sendMsg("Valve1", false);
				} else if(valveID == 2) {
					if(global.valve1.state == "off") {
						togglePump(2, "off");
					}
					global.valve2.state = mode;
					valve2.writeSync(0);
					global.logger.log("Valve2 turned OFF");
					//mqtt.sendMsg("Valve2", false);
				}
			}
		}
	};
	
	exports.toggleValve = toggleValve;
	
}());
