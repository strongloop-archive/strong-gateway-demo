var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var http = require('http');
var https = require('https');

var app = module.exports = loopback();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

boot(app, __dirname, function(err) {
  if (err) throw err;

  app.start = function() {
    var port = app.get('port');
    var host = app.get('host');
    var httpServer = http.createServer(app).listen(port, host, function() {
      printServingMsg('http', host, port);

      app.close = function(cb) {
        app.removeAllListeners('started');
        app.removeAllListeners('loaded');
        httpServer.close();
      };

      app.emit('started');
    });
  };

  if (require.main === module)
    app.start();

  app.loaded = true;
  app.emit('loaded');
});

function printServingMsg(protocol, host, port) {
  var url = protocol + '://' + host + ':' + port;
  console.log('Web server listening at', url);
}
