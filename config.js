(function() {
	
	/**
	 * TODO: Config for GPIO Pin for each sensor and actuator
	 */
	global.level_PIN = 5;
	
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
