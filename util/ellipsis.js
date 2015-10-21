// @see: http://stackoverflow.com/a/16879097/605890

module.exports = function(str, maxLen) {
  // no need to cut off
  if (str.length <= maxLen) {
    return str;
  }

  // find the cutoff point
  var oldPos = 0;
  var pos = 0;
  while (pos !== -1 && pos <= maxLen) {
    oldPos = pos;
    pos = str.indexOf(' ', pos) + 1;
  }
  if (pos > maxLen) { pos = oldPos; }
  // return cut off string with ellipsis
  return str.substring(0, pos).trim() + '...';
};
