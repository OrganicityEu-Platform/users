module.exports = function(str, maxLen) {

  // no need to cut off
  if (str.length <= maxLen) {
    return str;
  }
  // Length > maxLen

  // Reduce to 160 character
  var shorten = str.substring(0, maxLen);

  // Find the last space
  var pos = shorten.lastIndexOf(' ');

  // We do not have a space? return the shortened text
  if (pos === -1) {
    return shorten + '...';
  }

  return str.substring(0, pos).trim() + '...';
};
