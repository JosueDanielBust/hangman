function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0';
}

function getWordsFromCookie(name) {
  var wordsCookie = getCookie(name);
  var regExpr = /([A-z]\w+)/ig;
  var wordsSplit = wordsCookie.split(regExpr);
  var words = [];

  wordsSplit.forEach( function(e) {
    if ( regExpr.exec(e) ) { words.push(e) };
  });

  return words;
}