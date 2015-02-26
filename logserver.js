var sys = require('sys');
var colors = require('colors');
var config = require('./config.js');
var fs = require('fs');
try {
	fs.writeFileSync(process.env.OPENSHIFT_DATA_DIR + "404.html", 'Esto es un Bot para Pokemon showdown.');
	var app = require('http').createServer();
	var appssl;
	if (config.ssl) {
		appssl = require('https').createServer(config.ssl.options);
	}
	var nodestatic = require('node-static');
	var staticserver = new nodestatic.Server(process.env.OPENSHIFT_DATA_DIR);
	var staticRequestHandler = function (request, response) {
		request.resume();
		request.addListener('end', function () {
			var server;
				if (/^\/([A-Za-z0-9][A-Za-z0-9-]*)\/?$/.test(request.url)) {
					request.url = '/';
				}
				server = staticserver;
			server.serve(request, response, function (e, res) {
				if (e && (e.status === 404)) {
					staticserver.serveFile('404.html', 404, {}, request, response);
				}
			});
		});
	};
	app.on('request', staticRequestHandler);
	if (appssl) {
		appssl.on('request', staticRequestHandler);
	}
	var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
	var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
	app.listen(port, ipaddress, function() {
    	console.log((new Date()) + ' Log server is listening on port ' + port);
	});
	} catch (e) {
		console.log('failed to start logs server: ' + sys.inspect(e));
		console.log('Could not start node-static - try `npm install` if you want to use it');
	}
