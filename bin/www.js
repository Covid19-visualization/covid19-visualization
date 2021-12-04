#!/usr/bin/env node

var app = require('../app');
var http = require('http');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var config = require('../config');

var port = normalizePort(process.env.PORT || '8888');
app.set('port', port);

// DATABASE
var DB = config.DB;
app.set('NODE_ENV', config.NODE_ENV);
//app.set('superSecret', require('../secret')); what

// START SERVER NODE.JS
var server = http.createServer(app);
server.listen(port, () => {
	console.log(`DEBUG: server.listening on port: ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

// DATABASE CONNECTION
mongoose.Promise = global.Promise;
console.log("DEBUG: " + config.NODE_ENV);
var dbUrl = DB[config.NODE_ENV];
//var dbUrl = DB.development


mongoose.connect(dbUrl.host, { useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true}, function (err, res) {
	if (err) {
		console.error('ERROR:\n\nCANNOT FIND DATABASE\n\n' + dbUrl.host + '\n\n' + JSON.stringify(err));
		onError(err);
	} else {
		console.log('DEBUG: DATABASE ONLINE ' + dbUrl.name);
	}
});


// NORMALIZZAZIONE PORTA SERVER
function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) { return val; }
	if (port >= 0) { return port; }
	return false;
}


// ERROR HANDLER SERVER
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}


// EVENT LISTENER SERVER
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
}
