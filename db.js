(function() {
	'use strict';

	var mysql = require('mysql');

	var connection = mysql.createConnection({
		host     : global.sqlHOST,
		user     : global.sqlUSER,
		password : global.sqlPW,
		database : global.sqlDB
	});

	connection.connect(function(err) {
		if (err) {
	    		console.error('error connecting: ' + err.stack);
	    		return;
	  	}
	 
	  	console.log('Connected to database');
	});
	
	// TODO: SQL Queries

	exports.getBuildingIDs = function(cb) {
		connection.query("SELECT * FROM Buildings", function(error, results, fields) {
			if(error) throw error;
			cb(results);
		});
	};

}());
