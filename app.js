// config file
require('./config.js');

// connect to local db
const db = require('./db.js');

// Raspberry Pi GPIO
require('./gpio.js');

db.getBuildingIDs(function(res) {
	console.log(res);
});