var apiServer = require('./api-server');
var webServer = require('./web-server');

apiServer.once('started', function() {
  console.log('Notes API server ready at: %s', apiServer.get('url'));
});
webServer.once('started', function() {
  console.log('Notes web server ready at: %s', webServer.get('url'));
});

apiServer.start();
webServer.start()
