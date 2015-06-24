var client = require('./client');
var resourceServer = require('./resource-server');

client.once('started', function() {
  console.log('Client ready at %s', client.get('url'));
});
resourceServer.once('started', function() {
  console.log('Resource server ready at %s', resourceServer.get('url'));
});

client.start();
resourceServer.start();
