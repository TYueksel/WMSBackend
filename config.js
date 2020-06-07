(function() {
	
	/**
	 * TODO: Config for pins/channels of each sensor and actuator
	 */
	global.levelSensor1 = {
		channel: 0,
		value: null
	};
	global.levelSensor2 = {
		channel: 1,
		value: null
	};
	global.levelSensor3 = 8;
	global.levelSensor4 = 8;
	global.flowSensor = 18;
	global.valve1 = {
		PIN: 17,
		state: 'off'
	};
	global.valve2 = {
		PIN: 27,
		state: 'off'
	};
	global.pump1 = {
		PIN: 23,
		state: 'off'
	};
	global.pump2 = {
		PIN: 24,
		state: 'off'
	};
	
	/**
	 * Config for local MySQL DB
	 */
	global.sqlHOST = 'localhost';
	global.sqlDB = 'WMS';
	global.sqlUSER = 'pi';
	global.sqlPW = 'group24';

	/**
	 * Config for MQTT
	 */
	global.mqttUSER = 'tolunay.yueksel@gmail.com';
	global.mqttPW = '437c0228';
	global.mqttHOST = 'mqtt://mqtt.dioty.co:1883';
	global.mqttTOPIC = '/tolunay.yueksel@gmail.com/' + "tolu";

}());
