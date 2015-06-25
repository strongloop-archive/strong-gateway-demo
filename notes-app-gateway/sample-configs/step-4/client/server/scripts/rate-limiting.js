var request = require('request');

var authServerPort = process.env.PORT || 3202;
// Build the token request using client credentials grant type
var form = {
  grant_type: 'password',
  username: 'bob',
  password: 'secret',
  scope: 'demo'
};

// Request an access token
request.post({
  url: 'https://localhost:' + authServerPort + '/oauth/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  },
  // Use the client id/secret in the authorization header
  auth: {
    user: '123',
    pass: 'secret'
  },
  // Allow self-signed SSL certificates
  strictSSL: false,
  form: form
}, function(err, res, body) {
  if (err) throw err;

  var accessToken;
  try {
    accessToken = JSON.parse(body).access_token;
    console.log('Access Token: %s', accessToken);
  } catch (e) {
    throw e;
  }

  if (!accessToken) return;

  requestResourceRepeatedly(accessToken);
});

function requestResourceRepeatedly(accessToken) {
  var iterations = Number(process.argv[2]) || 500;
  var resourceEndpoint = 'https://localhost:' + authServerPort +
    '/api/notes?access_token=' + accessToken;
  for (var i = 0; i < iterations; i++) {
    request.get(resourceEndpoint, {strictSSL: false}, function(err, res) {
      console.log('Key: %s - Limit: %d - Remaining: %d - Reset: %d',
        res.headers['x-ratelimit-key'] || null,
        res.headers['x-ratelimit-limit'] || null,
        res.headers['x-ratelimit-remaining'] || null,
        res.headers['x-ratelimit-reset'] || null);
    });
  }
}
