var fs           = require('fs');
var fsSync       = require('fs-sync');
var HttpStatus   = require('http-status');

module.exports = function(oldPath, next, callback) {

  if (oldPath) {
    //console.log('Image given');

    if (fsSync.exists(oldPath)) {
      if (oldPath && oldPath.indexOf('tmp/') === 0) {
        //console.log('  ', oldPath + ' FOUND');

        var urlParts = oldPath.split('/');
        urlParts[0] = 'uploads';
        var newPath = urlParts.join('/');

        fs.rename(oldPath, newPath, function() {
          //console.log('  ', 'Moved file from ', oldPath, ' to ', newPath);
          callback(newPath);
          return;
        });

      } else {
        //console.log('  ', oldPath, 'PASS THROUGH');
        callback(oldPath);
        return;
      }

    } else {
      var err = new Error('File', oldPath, ' NOZ FOUND');
      err.status = HttpStatus.BAD_REQUEST;
      next(err); // Callback is not called!
      return;
    }

  } else {

    //console.log('  ', oldPath + ' UNDEFINED');
    callback(oldPath);

  }
};
