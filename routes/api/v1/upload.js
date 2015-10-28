var api        = require('../../../api_routes.js');

var HttpStatus = require('http-status');

var multer     = require('multer');
var upload     = multer({ dest: 'tmp/' });
var fs         = require('fs');
var gm         = require('gm');

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  router.post(api.route('upload'), [isLoggedIn, upload.single('file')], function(req, res) {

    var file = req.file;
    //console.log('File', file);

    if (file.mimetype !== 'image/jpeg') {
      fs.unlink(file.path);
      res.status(400).json({ error : 'File must be a JPEG'});
    }

    // Convert JPEG to grayscale!
    gm(file.path)
      .channel('gray')
      .write(file.path + '.jpg', function(err) {
        if (!err) {
          console.log('Grayscale image created!');

          // Create 600px thumbnail
          gm(file.path + '.jpg')
            .resize(600)
            .write(file.path + '.600.jpg', function(err) {
              if (!err) {
                console.log('600px thumbnail created!');

                // Remove original file and send status to client
                fs.unlinkSync(file.path);
                res.status(HttpStatus.CREATED).json({
                  'file': file.path + '.jpg',
                  'thumbnail': file.path + '.600.jpg'
                });
              }
            });

        }
      });
  });

  return router;
};

