var request = require('request');

module.exports = function(app) {
  var router = app.loopback.Router;

  app.get('/', function(req, res) {
    request.get('http://localhost:3002/api/notes', function(err, response,
        body) {
      if (err)
        return res.render('error', {
          title: err.code,
          message: err
        });

      try {
        var notes = JSON.parse(body);
      } catch (e) {
        return res.render('error', {
          title: e.name,
          msg: e.message
        });
      }

      res.render('notes', {notes: notes});
    });
  });

  app.use(router);
};
