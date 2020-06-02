 (function() {

    const spi = require('spi-device');
    const asynch = require('async');

    var mcp3008;

    // The MCP3008 is on bus 0 and it's device 0
    
    /*setInterval(() => {
        const mcp3008 = spi.open(0, 0, err => {
        // An SPI message is an array of one or more read+write transfers
        const message = [{
                sendBuffer: Buffer.from([0x01, 0x90, 0x01]), // Sent to read channel 0
                receiveBuffer: Buffer.alloc(3),              // Raw data read from channel
                byteLength: 3,
                speedHz: 320000 // Use a low bus speed to get a good reading from the TMP36
            }];

        if (err) throw err;

        mcp3008.transfer(message, (err, message) => {
                if (err) throw err;

            // Convert raw value from sensor to celcius and log to console
            //console.log(message[0].receiveBuffer);
            const rawValue = ((message[0].receiveBuffer[1] & 0x03) << 8) +
            message[0].receiveBuffer[2];
            console.log("raw value: " + rawValue);
            const voltage = rawValue * 3.3 / 1023;
            const celcius = (voltage - 0.5) * 100;

            console.log(voltage);
        });
    });

    }, 2000)*/

    exports.getWaterLevel = function(tankID) {
        var channels;

        if (tankID == 1) {
            levelPins = [global.levelSensor1.channel, global.levelSensor2.channel];
        } else if (tankID == 2) {
            levelPins = [global.levelSensor3.channel, global.levelSensor4.channel];
        }

        var results = [];

        // The MCP3008 is on bus 0 and it's device 0
        mcp3008 = spi.open(0, 0, err => {
            if (err) throw err;

            asynch.forEachOf(channels, (value, key, callback) => {
                readLevelSensor(value, (result) => {
                    //TODO
                    results[key] = result;
                    callback();
                });
            }, () =>{
                if (results[0] > 0) {
                    console.log("Tank " + tankID + " is full!");
                } else {
                    if (results[1] > 0) {
                        console.log("Tank " + tankID + " is filled!");
                    } else {
                        console.log("Tank " + tankID + " is empty!");
                    }
                }
            });
        });
    };

    function readLevelSensor(channel, cb) {
        const message = [{
                sendBuffer: Buffer.from([0x01, 0x80 + 16*channel, 0x01]), // Sent to read channel
                receiveBuffer: Buffer.alloc(3),     // Raw data read from channel
                byteLength: 3,
                speedHz: 320000 // Use a low bus speed to get a good reading from the TMP36
        }];

        mcp3008.transfer(message, (err, message) => {
            if (err) throw err;

            // Convert raw value from sensor to celcius and log to console
            //console.log(message[0].receiveBuffer);
            const rawValue = ((message[0].receiveBuffer[1] & 0x03) << 8) +
            message[0].receiveBuffer[2];
            console.log("raw value: " + rawValue);
            const voltage = rawValue * 3.3 / 1023;
            const celcius = (voltage - 0.5) * 100;

            console.log(voltage);
            cb(voltage);
        });
    }

}());
