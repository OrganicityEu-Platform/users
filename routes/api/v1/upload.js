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
      res.status(400).json({ error : 'File must be mimetype image/jpeg'});
    }

    var originalFile = file.path;
    var fileName = file.path + '.1140.jpg';
    var thumbnailName = file.path + '.600.jpg';

    // (1) Convert JPEG to grayscale!
    gm(originalFile)
      .channel('gray')
      .write(fileName, function(err) {
        if (!err) {

          // (2) Create a 1140px image
          gm(fileName)
            .resize(1140)
            .write(fileName, function(err) {
              if (!err) {

                // (3) Create a 600px thumbnail
                gm(fileName)
                  .resize(600)
                  .write(thumbnailName, function(err) {
                    if (!err) {
                      // (4) Remove original file and send status to client
                      fs.unlinkSync(originalFile);

                      res.status(HttpStatus.CREATED).json({
                        'file': fileName,
                        'thumbnail': thumbnailName
                      });
                    } else {
                      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        'error': 'Creation of 600px thumbnail failed'
                      });
                    }
                  });
              } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  'error': 'Creation of 1140px image failed'
                });
              }
            });
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            'error': 'Convert to Grayscale failed'
          });
        }
      });
  });

  return router;
};

