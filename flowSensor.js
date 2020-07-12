(function() {

	const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
	const mqtt = require('./mqtt');
	const actuator = require('./actuator');
	
	const flow1 = new Gpio(global.flowSensor1.PIN, 'in', 'falling', {debounceTimeout: 0.1});
	const flow2 = new Gpio(global.flowSensor2.PIN, 'in', 'falling', {debounceTimeout: 0.1});
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var count4 = 0;
	const constant1 = (350/145);
	const constant2 = (400/537);
	const constant3 = (300/97);
	const constant4 = (400/133);
	
	flow1.watch((err, value) => {
		if (err) {
			throw err;
		}
		if(global.valve1.state == "on") {
			
			if(global.valve2.state == "off") {
				count1++;
			} else if (global.valve2.state == "on") {
				count3++;
			}
			
			if (global.oldUsage1 != null) global.flowSensor1.liter = parseFloat(((count1 * constant1 / 1000) + (count3 * constant3 / 1000) + global.oldUsage1)).toFixed(3);
		}
		if(global.flowSensor1.liter >= global.flowSensor1.limit && global.valve1.state == "on") {
			global.logger.log("Limit of User1 reached: " + global.flowSensor1.liter + "/" + global.flowSensor1.limit);
			actuator.toggleValve(1, "off");
		}
	});

	flow2.watch((err, value) => {
		if (err) {
			throw err;
		}
		if(global.valve2.state == "on") {
			
			if(global.valve1.state == "off") {
				count2++;
			} else if (global.valve1.state == "on") {
				count4++;
			}
			
			if (global.oldUsage2 != null) global.flowSensor2.liter = parseFloat(((count2 * constant2 / 1000) + (count4 * constant4 / 1000) + global.oldUsage2)).toFixed(3);
		}
		if(global.flowSensor2.liter >= global.flowSensor2.limit && global.valve2.state == "on") {
			global.logger.log("Limit of User2 reached: " + global.flowSensor2.liter + "/" + global.flowSensor2.limit);
			actuator.toggleValve(2, "off");
		}
	});
	
	exports.startSendingUsage = function(seconds) {
		setInterval(function() {
			console.log(" ");
			//console.log("Old: " + global.oldUsage1);
			global.flowSensor1.liter = parseFloat(((count1 * constant1 / 1000) + (count3 * constant3 / 1000) + global.oldUsage1)).toFixed(3);
			if (global.oldUsage2 != null) global.flowSensor2.liter = parseFloat(((count2 * constant2 / 1000) + (count4 * constant4 / 1000) + global.oldUsage2)).toFixed(3);
			global.logger.log("FlowSensor1: " + global.flowSensor1.liter + " Liter");
			console.log("Count1 + Count3: " + count1 + " + " + count3);
			global.logger.log("FlowSensor2: " + global.flowSensor2.liter + " Liter");
			console.log("Count2 + Count4: " + count2 + " + " + count4);
			const total = count1+count2+count3+count4;
			console.log("TotalCount: " + total);
			const message = [global.flowSensor1.liter, global.flowSensor2.liter];
			if(mqtt.client.connected) {
				mqtt.sendMsg("Usage", message);
			}
		
		}, seconds*1000);
	};
	
	exports.resetCounts = function() {
		count1 = 0;
		count2 = 0;
		count3 = 0;
		count4 = 0;
	};

}());
