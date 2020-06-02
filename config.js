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
	global.flowSensor = 21;
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
	 * TODO: Config for local MySQL DB
	 */
	global.sqlHOST = 'localhost';
	global.sqlDB = 'WMS';
	global.sqlUSER = 'pi';
	global.sqlPW = 'group24';

	/**
	 * TODO: Config for MQTT
	 */
	global.mqttUSER = 'user';
	global.mqttPW = 'rand837P';
	global.mqttHOST = 'fmsro1.de';
	global.mqttPORT = '47021';
	global.VIN = 'WME4514901K645679';
	global.mqttTOPIC = 'fkfs/fleet/' + global.VIN;

}());
