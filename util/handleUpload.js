var fs           = require('fs');

module.exports = function(oldPath, callback) {

  if (oldPath && oldPath.indexOf('tmp/') === 0) {
    var urlParts = oldPath.split('/');
    urlParts[0] = 'uploads';
    var newPath = urlParts.join('/');

    fs.rename(oldPath, newPath, function() {
      console.log('Moved file from ', oldPath, ' to ', newPath);
      callback(newPath);
    });

  } else {
    callback(oldPath);
  }

};
