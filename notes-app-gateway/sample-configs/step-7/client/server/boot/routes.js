var request = require('request');

module.exports = function(app) {
  var router = app.loopback.Router;

  app.get('/', function(req, res) {
    res.render('authorize');
  });

  app.get('/authorize', function(req, res) {
    var authEndpoint = 'http://localhost:3002/oauth/authorize';
    var clientId = 123;
    var redirectUri = 'https://localhost:2101/token';
    var scope = 'demo';
    var authUrl = authEndpoint + '?client_id=' + clientId + '&redirect_uri=' +
        redirectUri + '&response_type=code&scope=' + scope + '&state=123';

    res.redirect(authUrl);
  });

  app.get('/token', function(req, res) {
    getAccessTokenUsingAuthCode(req.query.code, function(err, response, body) {
      if (err)
        return res.render('error', {
          title: response.statusCode,
          msg: err
        });

      if (response.statusCode !== 200)
        return res.render('error', {
          title: response.statusCode,
          msg: body
        });

      var token = JSON.parse(body).access_token;
      getNotesUsingAccessToken(token, function(err, response, body) {
        if (err)
          return res.render('error', {
            title: response.statusCode,
            msg: err
          });

        if (response.statusCode !== 200)
          return res.render('error', {
            title: response.statusCode,
            msg: body
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
  });

  app.use(router);
};

function getAccessTokenUsingAuthCode(code, cb) {
  request.post('https://localhost:3202/oauth/token', {
    'content-type': 'application/x-www-form-urlencoded',
    form: {
      code: code,
      grant_type: 'authorization_code',
      client_id: 123,
      client_secret: 'secret',
      redirect_uri: 'https://localhost:2101/token'
    },
    strictSSL: false
  }, cb);
}

function getNotesUsingAccessToken(token, cb) {
  request.get('https://localhost:3202/api/notes', {
    qs: {
      access_token: token
    },
    strictSSL: false
  }, cb);
}
