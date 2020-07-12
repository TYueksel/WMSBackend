// Config file
require('./config');

// Init Logger
global.logger = require('./logger');

// Connect to MQTT Broker
const mqtt = require('./mqtt');

// Raspberry Pi GPIO
const actuator = require('./actuator');

process.on('SIGINT', function() {
	global.logger.log("Terminating");
	actuator.togglePump(1, "off");
	actuator.togglePump(2, "off");
	actuator.toggleValve(1, "off");
	actuator.toggleValve(2, "off");
	mqtt.closeMQTT();
	global.logger.close();
	process.exit();
});
