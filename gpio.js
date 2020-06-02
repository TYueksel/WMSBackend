(function() {

	const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

	/*var LED = new Gpio(global.valve2, 'out'); //use GPIO pin 4, and specify that it is output
	LED.writeSync(1);

	function myFunc() {
  		LED.writeSync(0);
	}
	setTimeout(myFunc, 2000, '');*/

	var flow = new Gpio(global.flowSensor, 'in');
	var counter = 0;

	setInterval(() => {
		var input = flow.readSync();
		if (input===1) {
			counter++;
		}
		if (input===0) {
			counter = 0;
		}
		console.log(counter)
	}, 100)


	exports.togglePump = function(pin, mode) {
		var pump = new Gpio(pin, 'out');
		pump.writeSync(mode);
	}

	exports.toggleValve = function(pin, mode) {
		var valve = new Gpio(pin, 'out');
		valve.writeSync(mode);
	}

}());
