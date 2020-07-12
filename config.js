(function() {
	
	/**
	 * TODO: Config for pins/channels of each sensor and actuator
	 */
	global.tank1 = null;
	global.tank2 = null;
	global.levelSensor1 = {
		PIN: 19,
		value: null
	};
	global.levelSensor2 = {
		PIN: 13,
		value: null
	};
	global.levelSensor3 = {
		PIN: 16,
		value: null
	};
	global.levelSensor4 = {
		PIN: 26,
		value: null
	};
	global.levelSensor5 = {
		PIN: 21,
		value: null
	};
	global.flowSensor1 = {
		PIN: 25,
		liter: 0,
		limit: null
	};
	global.flowSensor2 = {
		PIN: 12,
		liter: 0,
		limit: null
	};
	global.turbiditySensor = null;
	global.valve1 = {
		PIN: 22,
		state: 'off'
	};
	global.valve2 = {
		PIN: 27,
		state: 'off'
	};
	global.pump1 = {
		PIN: 5,
		state: 'off',
	};
	global.pump2 = {
		PIN: 6,
		state: 'off'
	};
	
	global.oldUsage1 = 0.0;
	global.oldUsage2 = 0.0;
	
	
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
	global.mqttTOPIC = '/tolunay.yueksel@gmail.com/';

}());
