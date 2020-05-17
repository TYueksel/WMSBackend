(function() {

	// all details on wiring pi at https://github.com/WiringPi/WiringPi-Node/blob/master/DOCUMENTATION.md
	var wpi = require('wiringpi-node');

	var pin = global.level_PIN;

	// PIN scheme in wiring pi
	wpi.setup('wpi');

	// PIN Modus Input
	wpi.pinMode(pin, wpi.Output);

	// Detects LOW to HIGH at PIN
	wpi.pullUpDnControl(pin, wpi.PUD_UP);
	wpi.wiringPiISR(pin, wpi.INT_EDGE_RISING, function(delta) {
		console.log("Pin " + pin + " changed to HIGH");
	});

}());
