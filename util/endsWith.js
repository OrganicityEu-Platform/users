module.exports = function(string, searchString, position) {
  if (position === undefined || position > string.length) {
    position = string.length;
  }
  position -= searchString.length;
  var lastIndex = string.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
