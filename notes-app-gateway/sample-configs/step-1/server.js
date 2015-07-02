var client = require('./client');
var resourceServer = require('./resource-server');

resourceServer.start();
client.start();
