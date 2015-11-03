var fs           = require('fs');

module.exports = function(oldPath, callback) {

  function fileExists(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  }

  if (!fileExists(oldPath)) {
    callback(new Error('File ' + oldPath + ' not found'));
    return;
  }

  if (oldPath && oldPath.indexOf('tmp/') === 0) {
    var urlParts = oldPath.split('/');
    urlParts[0] = 'uploads';
    var newPath = urlParts.join('/');

    fs.rename(oldPath, newPath, function() {
      console.log('Moved file from ', oldPath, ' to ', newPath);
      callback(undefined, newPath);
    });

  } else {
    callback(undefined, oldPath);
  }

};
