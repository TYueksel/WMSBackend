 (function() {

    const spi = require('spi-device');
    const mqtt = require('./mqtt');
    const actuator = require('./actuator');

    // The MCP3008 is on bus 0 and it's device 0
    
    setInterval(() => {
        const mcp3008 = spi.open(0, 0, err => {
		    // An SPI message is an array of one or more read+write transfers
		    const message = [{
		            sendBuffer: Buffer.from([0x01, 0x80, 0x01]), // Sent to read channel 0
		            receiveBuffer: Buffer.alloc(3),              // Raw data read from channel
		            byteLength: 3,
		            speedHz: 250000 // Use a low bus speed to get a good reading from the TMP36
			}];

		    if (err) throw err;

		    mcp3008.transfer(message, (err, message) => {
		            if (err) throw err;

		        // Convert raw value from sensor to celcius and log to console
		        const rawValue = ((message[0].receiveBuffer[1] & 0x03) << 8) +
		        message[0].receiveBuffer[2];
		        const voltage = rawValue * (5.0 / 1023.0);
		        var ntu = voltToNTU(voltage);
		        
		        if(voltage <= 3.36) ntu = 3000;

		        global.turbiditySensor = ntu;
		        
		        if(ntu > 500 && global.pump2.state == "on") {
		        	global.logger.log("Water turbidity raised to " + ntu + " NTU: Trying to turn off Pump2");
		        	actuator.togglePump(2, "off");
		        }
		        if(ntu <= 500 && global.pump2.state == "off" && ((global.valve1.state == "on" && global.flowSensor1.liter < global.flowSensor1.limit) || (global.valve2.state == "on" && global.flowSensor2.liter < global.flowSensor2.limit)) && global.tank2 != "EMPTY") {
		        	global.logger.log("Water turbidity dropped to " + ntu + " NTU: Trying to turn on Pump2");
		        	actuator.togglePump(2, "on");
		        }
		    });
		});

    }, 2000);
    
    setInterval(() => {
    	mqtt.sendMsg("Turbidity", global.turbiditySensor);
    }, 5000);
    
    function voltToNTU(voltage) {
    	return parseInt(-1120.4*(voltage-0.8)*(voltage-0.8)+5742.3*(voltage-0.8)-4352.9);
    }

}());
