var api           = require('../../../api_routes.js');

var HttpStatus    = require('http-status');

var multer        = require('multer');
var upload        = multer({ dest: 'tmp/' });
var fs            = require('fs');
var gm            = require('gm');

var Joi           = require('joi');
var ScenarioJoi   = require('../../../models/joi/scenario.js');
var sizeOf        = require('image-size');

var config = {
  brightness: 150,
  fileWidth: 1120,
  thumbnailWidth: 600,
  fileTypes: ['image/jpeg', 'image/png']
};

module.exports = function(router, passport) {

  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  router.post(
    api.route('upload_thumbnail'),
    [isLoggedIn, upload.single('file')], function(req, res) {

      // #################################################
      // File validation
      // #################################################

      var file = req.file;
      console.log('File', file);

      try {
        var dimensions = sizeOf(file.path);
      } catch (ex) {
        res.status(400).json({ error : ex.message});
        return;
      }

      var data = {
        width: dimensions.width,
        type: file.mimetype
      };

      var result = Joi.validate(data, ScenarioJoi.image, {});
      if (result.error) {
        fs.unlink(file.path);
        res.status(400).json({ error : result.error});
        return;
      }

      // #################################################
      // Convert file
      // #################################################

      var originalFile = file.path;
      var fileName = file.path + '.' + config.fileWidth + '.jpg';
      var thumbnailName = file.path + '.' + config.thumbnailWidth + '.jpg';

      // (1) Convert JPEG to grayscale!
      gm(originalFile)
        .channel('gray')
        .write(fileName, function(err) {
          if (!err) {

            // (2) Make image brigther
            gm(fileName)
              .modulate(config.brightness)
              .write(fileName, function(err) {
                if (!err) {

                  // (3) Create the image
                  gm(fileName)
                    .resize(config.fileWidth)
                    .write(fileName, function(err) {
                      if (!err) {

                        // (4) Create the thumbnail
                        gm(fileName)
                          .resize(config.thumbnailWidth)
                          .write(thumbnailName, function(err) {
                            if (!err) {

                              // (5) Remove original file and send status to client
                              fs.unlinkSync(originalFile);

                              res.status(HttpStatus.CREATED).json({
                                'image': fileName,
                                'thumbnail': thumbnailName
                              });

                            } else {
                              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                                'error': 'Creation of ' + config.thumbnailWidth + 'px thumbnail failed'
                              });
                            }
                          });
                      } else {
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                          'error': 'Creation of ' + config.thumbnailWidth + 'px image failed'
                        });
                      }
                    });
                } else {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    'error': 'Creation of brighter image failed'
                  });
                }
              }
            );

          } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              'error': 'Convert to Grayscale failed'
            });
          }
        });
    }
  );

  return router;
};

