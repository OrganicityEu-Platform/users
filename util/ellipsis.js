// @see: http://stackoverflow.com/a/16879097/605890

module.exports = function(str, maxLen) {

  // no need to cut off
  if (str.length <= maxLen) {
    return str;
  }
  // Length > maxLen

  // Reduce to 100 char
  var shorten = str.substring(0, 160);

  // Find the last space
  var pos = shorten.lastIndexOf(' ');

  // We do not have a space
  if (pos === -1) {
    return shorten + '...';
  }

  return str.substring(0, pos).trim() + '...';
};
