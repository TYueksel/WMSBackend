// Config file
require('./config.js');

// Connect to local db
const db = require('./db.js');

// Connect to MQTT Broker
const mqtt = require('./mqtt');

//const spi = require('./spi.js');

// Raspberry Pi GPIO
//const gpio = require('./gpio.js');

db.getBuildingIDs(function(res) {
	console.log(res);
});

/*setInterval(() => {
	spi.getWaterLevel(1);
}, 2000)*/

process.on('SIGINT', function() {
	console.log("Terminating");
	mqtt.closeMQTT();
	process.exit();
});
