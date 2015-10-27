var api         = require('../../../api_routes.js');
var multer      = require('multer');
var upload      = multer({ dest: 'tmp/' });
var fs          = require('fs');
var HttpStatus  = require('http-status');

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  router.post(api.route('upload'), [isLoggedIn, upload.single('file')], function(req, res) {

    var file = req.file;
    //console.log('File', file);

    if (file.mimetype !== 'image/jpeg') {
      fs.unlink(file.path);
      res.status(400).json({ error : 'File must be a JPEG'});
    }

    res.status(HttpStatus.CREATED).json({'file': file.path});

  });

  return router;
};

