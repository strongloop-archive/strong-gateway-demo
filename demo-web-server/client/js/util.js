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
