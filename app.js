// config file
require('./config.js');

// connect to local db
const db = require('./db.js');

const spi = require('./spi.js');

// Raspberry Pi GPIO
// require('./gpio.js');

db.getBuildingIDs(function(res) {
	console.log(res);
});

setInterval(() => {
	spi.getWaterLevel(1);
}, 2000)
