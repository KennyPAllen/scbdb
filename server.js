var	express = require('express'),
	bounds = require('./src/api/bounds'),
	replays = require('./src/api/replays'),
	app = express(),
	ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.use('/api/bounds/get', bounds.getBounds);
app.use('/api/replays/get', replays.getReplays);

app.listen(port, ip, function () {
	console.log('Listening on port ' + port);
});