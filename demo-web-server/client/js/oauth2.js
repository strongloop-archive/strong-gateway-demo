// implicit flow

function implicit(clientId, scope) {
  scope = scope || 'demo';

  var authUrl = authEndpoint + '?client_id=' + clientId + '&redirect_uri='
    + getRedirectURI() + '&response_type=token&scope=' + scope + '&state=123';

  if (confirm('Redirecting to: ' + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

// authorization code flow

function getAuthorizationCode(clientId, scope) {
  scope = scope || 'demo';

  var authUrl = authEndpoint + '?client_id=' + clientId + '&redirect_uri='
    + getRedirectURI() + '&response_type=code&scope=' + scope + '&state=123';

  if (confirm('Redirecting to: ' + authUrl)) {
    location.replace(authUrl);
    return true;
  }
  return false;
}

function getCode() {
  return getQueryParam('code');
}

function getTokenByCode(clientId, clientSecret, code, successCallback) {
  var data = 'code=' + code + '&grant_type=authorization_code&client_id='
    + clientId + '&client_secret=' + clientSecret + '&redirect_uri='
    + getRedirectURI();

  $.post(tokenEndpoint, data, successCallback);
}

// client credentials flow

function getTokenByClientCredentials(clientId, clientSecret, username, scope,
    successCallback, errorCallback) {
  scope = scope || 'demo';

  var data = 'grant_type=client_credentials&client_id=' + clientId
    + '&client_secret=' + clientSecret + '&scope=' + scope;

  if (username)
    data += '&username=' + username;

  $.post(tokenEndpoint, data, successCallback)
    .error(errorCallback);
}

// resource owner password credentials flow

function getTokenByResourceOwnerPasswordCredentials(clientId, clientSecret,
    username, password, scope, successCallback, errorCallback) {
  scope = scope || 'demo';

  var data = 'grant_type=password&client_id=' + clientId + '&client_secret='
    + clientSecret + '&username=' + username + '&password=' + password
    + '&scope=' + scope;

  $.post(tokenEndpoint, data, successCallback)
    .error(errorCallback);
}
