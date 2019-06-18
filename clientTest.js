var PORT = 8001;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = new Buffer('안녕하세요!!!');

var client = dgram.createSocket('udp4');

client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
	if (err) {
		console.log(err);
		throw err;
	}
	console.log('UDP message sent!!!! ' + HOST + ':' + PORT);
	client.close();
});