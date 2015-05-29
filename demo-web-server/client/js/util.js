function hasQueryStrParams() {
  var queryStr = window.location.search;
  params = queryStr ? queryStr.substring(1).split('&') : [];
  return params.length !== 0;
}

function hasFragment() {
  return window.location.hash.length !== 0;
}

function getUrlWithToken(url, token) {
  return url + '?access_token=' + token;
}

function displayMessage(msg) {
  updateHtml('msg', msg);
}

function updateHtml(id, html) {
  $("#" + id).html(html);
}

function getRedirectURI() {
  return encodeURIComponent('https://localhost:3001' + location.pathname);
}

function appendHtml(id, html) {
  var current = $("#" + id).html();
  current = current ? current + html : html;
  $("#" + id).html(current);
}

function updateJson(id, jsonObject) {
  $("#" + id).html(JSON.stringify(jsonObject));
}

function getQueryParam(name) {
  var query = location.search;
  var parameters = [];
  if (query !== null && query !== '') {
    parameters = query.substring(1).split('&');
  }

  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].indexOf(name + '=') === 0) {
      var code = parameters[i].substring(name.length + 1);
      return code;
    }
  }
  return null;
}

function getAccessToken() {
  if (location.hash.length !== 0) {
    var accessToken = location.hash.substring(1);
    var index = accessToken.indexOf('access_token=', 0);
    var endIndex = accessToken.indexOf('&', index + 13);
    if (endIndex === -1)
      endIndex = accessToken.length() - 1;
    var oAuthToken = accessToken.substring(index + 13, endIndex);
    return oAuthToken;
  }
  return null;
}
