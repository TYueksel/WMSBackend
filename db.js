(function() {
	'use strict';

	var mysql = require('mysql');

	var connection = mysql.createConnection({
		host     : global.sqlHOST,
		user     : global.sqlUSER,
		password : global.sqlPW,
		database : global.sqlDB
	});

	connection.connect();
	console.log("Mit Datenbank verbunden");
	
	// TODO: SQL Queries

}());
