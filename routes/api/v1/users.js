var config        = require('../../../config/config.js');

var User          = require('../../../models/schema/user.js');
var api           = require('../../../api_routes.js');
var ui            = require('../../../ui_routes.js');
var unirest       = require('unirest');
var RestClient    = require('node-rest-client').Client;
var HttpStatus    = require('http-status');
var handleUpload  = require('../../../util/handleUpload');

var validate      = require('express-validation');
var UserJoi       = require('../../../models/joi/user.js');
var hasRole       = require('../../../models/hasRole.js');
var gravatar      = require('gravatar');
var configAuth    = require('../../../config/auth.js');

var uuid          = require('node-uuid');
var mailer        = require('nodemailer');

var commons       = require('./commons');

module.exports = function(router, passport) {

  var isLoggedIn    = require('../../../models/isLoggedIn.js')(passport);
  var isUserOrAdmin = require('../../../models/isUserOrAdmin.js')(passport);

  // ###############################################################
  // Routes
  // ###############################################################

  //router.get(api.route('users'), [isLoggedIn, hasRole(['admin'])], function(req, res, next) {
  router.get(api.route('users'), function(req, res, next) {

    var pipeline = [];
    var match = {};

    // Calculate the age first and project the needed attributes
    var calculateAge = {
      $project: {
        _id: 0,
        city: 1,
        country: 1,
        gender: 1,
        profession: 1,
        professionTitle: 1,
        interests: 1,
        publicEmail: 1,
        publicWebsite : 1,
        'oauth2.id' : 1,
        age: {
          $divide: [
            {$subtract: [new Date(), '$birthday'] },
            (365 * 24 * 60 * 60 * 1000)
          ]
        }
      }
    };
    pipeline.push(calculateAge);

    if (req.query.ageFrom && isNaN(req.query.ageFrom)) {
      throw 'request parameter "ageFrom" is not a valid number: "' + req.query.ageFrom + '"';
    }

    if (req.query.ageTo && isNaN(req.query.ageTo)) {
      throw 'request parameter "ageFrom" is not a valid number: "' + req.query.ageFrom + '"';
    }

    // Filter by age
    if (req.query.ageFrom && req.query.ageTo) {
      match.age = {
        $gte : parseInt(req.query.ageFrom),
        $lte : parseInt(req.query.ageTo) + 0.999
      };
    }

    // Filter by gender
    if (req.query.gender) {
      if (req.query.gender !== 'm' && req.query.gender !== 'f' && req.query.gender !== 'o') {
        throw 'request parameter "gender" is not "f", "m" or "o": "' + req.query.gender + '"';
      }
      match.gender = req.query.gender;
    }

    // Filter by interests
    if (req.query.interests) {
      var interests = Array.isArray(req.query.interests) ? req.query.interests : [req.query.interests];
      match.interests = {
        $all : interests
      };
    }

    // Filter by profession
    if (req.query.profession) {
      var profession = Array.isArray(req.query.profession) ? req.query.profession : [req.query.profession];
      match.profession = {
        $all : profession
      };
    }

    // Filter by profession
    if (req.query.city) {
      match.city = req.query.city;
    }

    // Filter by profession
    if (req.query.country) {
      match.country = req.query.country;
    }

    // Add match, if more than one was added
    if (Object.keys(match).length > 0) {
      var filterByMatch = {
        $match : match
      };
      pipeline.push(filterByMatch);
    }

    // Filter the users
    User.aggregate(pipeline, function(err, users) {
      if (err) {
        return next(err);
      } else {

        // Postprocessing: Age to full integer!
        for (var i = 0; i < users.length; i++) {
          users[i].age = parseInt(users[i].age);
        }

        // ROUND AGE

        res.format({
          'application/json': function() {
            res.json(users);
          },
          'default': function() {
            res.send(406, 'Not Acceptable');
          }
        });
      }
    });
  });

  var findUser = function(uuid, res, next, success) {

    var err;
    User.findOne({ 'uuid' :  uuid }, User.excludeFields, function(err, user) {
      if (user === null) {
        err = new Error('User ' + uuid + ' not found');
        err.status = 404;
        return next(err);
      }
      if (err) {
        console.log(err);
        return next(err);
      } else {
        res.format({
          'application/json': function() {
            success(user.json());
          },
          'default': function() {
            res.send(406, 'Not Acceptable');
          }
        });
      }
    });
  };

  router.get(api.route('user_info'), function(req, res, next) {
    findUser(req.params.uuid, res, next, function(user) {

      var size = 64;

      var p = {
        uuid : user.uuid,
        name : user.name,
        location : user.location,
        profession : user.profession,
        professionTitle : user.professionTitle,
        publicEmail : user.publicEmail,
        publicWebsite : user.publicWebsite
      };

      /*
      if (user.avatar) {
        p.image = user.avatar;
      } else if (user.facebook && user.facebook.id) {

        // https://developers.facebook.com/docs/graph-api/reference/user/picture/
        p.image = 'https://graph.facebook.com/v2.5/' + user.facebook.id + '/picture?width=' + size + '&height=' + size;

      } else if (user.twitter && user.twitter.username) {

        // https://stackoverflow.com/questions/14836956/how-to-get-user-image-with-twitter-api-1-1
        p.image = 'https://twitter.com/' + user.twitter.username + '/profile_image?size=original';

      } else if (user.google && user.google.id) {

//         * IMPROVE: Use OAuth API to get bigger images
//         * http://stackoverflow.com/q/9128700/605890
//         * http://unirest.io/nodejs.html

        var url = 'http://picasaweb.google.com/data/entry/api/user/' + user.google.id + '?alt=json';
        unirest.get(url)
          .header('Accept', 'application/json')
          .send()
          .end(function(response) {
            if (response.body && response.body.entry && response.body.entry.author) {
              p.image = response.body.entry.gphoto$thumbnail.$t;
            }
            res.json(p);
          });
        return; // Wait for google response
      } else if (user.github && user.github.id) {
        p.image = 'https://avatars.githubusercontent.com/u/' + user.github.id;
      } else if (user.disqus && user.disqus.id) {

        // https://disqus.com/api/docs/users/details/

        var args = {
          parameters: {
            'api_secret': configAuth.disqusAuth.clientSecret,
            'user' : user.disqus.id
          },
        };
        client = new RestClient();
        client.get('https://disqus.com/api/3.0/users/details.json', args, function(data, response) {
          if (response.statusCode === HttpStatus.OK) {
            p.image = data.response.avatar.permalink;
          }
          res.json(p);
        });

        return; // Wait for disqus response
      } else if (user.local && user.local.email) {
        var gravatarUrl = gravatar.url(user.local.email, {s: size, d: 'mm'}, true);
        p.image = gravatarUrl;
      }
*/

      console.log(user);

      if (user.facebook && user.facebook.public) {
        p.facebook = user.facebook.id;
      }

      if (user.github && user.github.public) {
        p.github = user.github.username; // OK
      }

      if (user.twitter && user.twitter.public) {
        p.twitter = user.twitter.username;
      }

      if (user.google && user.google.public) {
        p.google = user.google.id;
      }

      res.json(p);
    });
  });

  router.get(api.route('user_by_uuid'), [isLoggedIn, isUserOrAdmin], function(req, res, next) {
    /*
    findUser(req.params.uuid, res, next, function(user) {
      res.json(user);
    });
    */
  });

  router.patch(
    api.route('user-update-viablility'),
    [isLoggedIn, isUserOrAdmin], // validate(UserJoi.profileServer)
    function(req, res, next) {

      User.findOne({ 'uuid' : req.params.uuid }, function(err, user) {
        if (err) {
          return next(err);
        } else {

          if (req.body.github) {
            user.github.public = req.body.github.public;
            user.save(function(err) {
              res.status(200).send('OK - Github status set');
            });
          } else if (req.body.facebook) {
            user.facebook.public = req.body.facebook.public;
            user.save(function(err) {
              res.status(200).send('OK - Facebook status set');
            });
          } else if (req.body.twitter) {
            user.twitter.public = req.body.twitter.public;
            user.save(function(err) {
              res.status(200).send('OK - Twitter status set');
            });
          } else if (req.body.google) {
            user.google.public = req.body.google.public;
            user.save(function(err) {
              res.status(200).send('OK - Goodle status set');
            });
          } else {
            res.status(406).send('Not Acceptable');
          }
        }
      });
    }
  );

  router.patch(
    api.route('user_by_uuid'),
    [isLoggedIn, isUserOrAdmin, validate(UserJoi.profileServer), commons.getAccessToken],
    function(req, res, next) {

      // Non admin user cannot edit the roles
      if (req.body.roles && !req.user.hasRole(['admin'])) {
        var err = new Error('Forbidden: Not allowed to edit roles for User ' + req.params.uuid);
        err.status = 403;
        return next(err);
      }

      User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {

        handleUpload(req.body.avatar, next, function(path) {

          console.log('PATCH:', req.body);

          if (req.body.hasOwnProperty('city')) {
            user.city = (req.body.city === null) ? undefined : req.body.city;
          }

          if (req.body.hasOwnProperty('country')) {
            user.country = req.body.country;
          }

          if (req.body.hasOwnProperty('profession')) {
            user.profession = req.body.profession;
          }

          if (req.body.hasOwnProperty('professionTitle')) {
            user.professionTitle = (req.body.professionTitle === null) ? undefined : req.body.professionTitle;
          }

          if (req.body.hasOwnProperty('interests')) {
            user.interests = req.body.interests;
          }

          if (req.body.hasOwnProperty('gender')) {
            user.gender = req.body.gender;
          }

          if (req.body.hasOwnProperty('publicEmail')) {
            user.publicEmail = (req.body.publicEmail === null) ? undefined : req.body.publicEmail;
          }

          if (req.body.hasOwnProperty('publicWebsite')) {
            user.publicWebsite = (req.body.publicWebsite === null) ? undefined : req.body.publicWebsite;
          }

          if (req.body.hasOwnProperty('birthday')) {
            user.birthday = (req.body.birthday === null) ? undefined : req.body.birthday;
          }

          /*
          if (req.body.local && req.body.local.password) {
            user.local.password = user.generateHash(req.body.local.password);
          }

          if (req.body.hasOwnProperty('name')) {
            user.name = req.body.name;
          }

          if (req.body.hasOwnProperty('location')) {
            user.location = req.body.location;
          }

          // If set, roles will never be emty due to validation
          if (req.body.roles) {
            user.roles = req.body.roles;
          }

          if (req.body.profession) {
            user.profession = req.body.profession;
          }



          if (path) {
            user.avatar = path;
          }
          */

          console.log('Save user:', user);

          user.save(function(err) {
            if (err) {
              return next(err);
            }
            res.format({
              'application/json': function() {
                res.json(user.json());
              },
              'default': function() {
                res.send(406, 'Not Acceptable');
              }
            });
          });

        });

      });
    }
  );

  router.delete(api.route('user_by_uuid'), [isLoggedIn, hasRole(['admin'])], function(req, res, next) {
    User.findOneAndRemove({ 'uuid' :  req.params.uuid }, req.body, function(err, user) {
      if (err) {
        return next(err);
      } else {
        res.format({
          'application/json': function() {
            res.json(user.json());
          },
          'default': function() {
            res.send(406, 'Not Acceptable');
          }
        });
      }
    });
  });

  //

  router.post(
    api.route('forgot-password'),
    [validate(UserJoi.forgotPasswordServer)],
    function(req, res, next) {

      User.findOne({'local.email': req.body.email}, function(err, user) {

        if (err) {
          return next(err);
        }

        if (!user) {
          console.error('Mail ' + req.body.email + ' does not exists');
          return res.status(200).json({});
        } else {

          var id = uuid.v4();

          user.local.passwordReset = {
            id: id,
            timestamp : Date.now()
          };
          user.save(function(err) {

            // Generate URL
            var url;
            if (config.host_external && config.port_external) {
              url = config.host_external + ':' + config.port_external;
            } else {
              url = config.host + ':' + config.port;
            }

            url += ui.reverse('forgot-password') + '?id=' + id;

            // Send mail
            var mail = {
              'from': 'OrganiCity Scenarios <info@organicity.eu>',
              'to': req.body.email,
              'subject': 'New password for OrganiCity Scenarios',
              'text': 'Hello,' +
                '\n\n' +
                'please open the following link to reset your password:' +
                '\n\n' +
                url +
                '\n\n' +
                'Your OrganiCity Team'
            };

            console.log('Sending Mail: ' + JSON.stringify(mail));

            var transporter = mailer.createTransport();
            transporter.sendMail(mail, function(error, info) {
              if (error) {
                console.log('Failure while sending mail: ', error, '(', info, ')');
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'Mailing error'});
              } else {
                console.log('Message sent: ', info);
                return res.status(HttpStatus.OK).json({});
              }
            });
          });
        }
      });
    }
  );

  router.post(
    api.route('update-password'),
    [validate(UserJoi.updatePasswordServer)],
    function(req, res, next) {

      console.log(req.body);

      User.findOne({'local.passwordReset.id': req.body.id}, function(err, user) {

        if (err) {
          return next(err);
        }

        if (!user) {
          console.error('Password reset ID ' + req.body.id + ' does not exists');
          var err = 'Password reset ID ' + req.body.id + ' does not exists or is not valid anymore';
          return res.status(400).json({error: err});
        } else {

          var difference = Date.now() - user.local.passwordReset.timestamp;
          var secondsDifference = Math.floor(difference / 1000);
          console.log('DIFF:', secondsDifference);

          // Code is
          var seconds = 60 * 60 * 24;
          if (secondsDifference < seconds) {
            console.log('Password reset ID ' + req.body.id + ' found');

            user.local.passwordReset = undefined;
            user.local.password = user.generateHash(req.body.password);

            user.save(function(err) {
              return res.status(200).json({});
            });
          } else {
            console.error('Password reset ID ' + req.body.id + ' is not valid anymore');
            var err = 'Password reset ID ' + req.body.id + ' does not exists or is not valid anymore';
            return res.status(400).json({error: err});
          }
        }
      });
    }
  );

  router.post(api.route('set_favorite'), [isLoggedIn], function(req, res, next) {

    console.log(req.body);

    User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        user.favorites.push(req.body.scenario);
        user.save(function(err) {
          console.log(user);
          res.status(200).send('OK - favorite set');
        });
      }
    });

  });

  router.patch(api.route('remove_favorite'), [isLoggedIn], function(req, res, next) {

    console.log(req.body);

    User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        var index = user.favorites.indexOf(req.body.scenario);

        if (index > -1) {
          user.favorites.splice(index, 1);
          user.save(function(err) {
            console.log(user);
            res.status(200).send('OK - removed set');
          });
        } else {
          res.status(404).send('Favorite not found');
        }
      }
    });

  });

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  router.get(api.route('disconnect_local'), [isLoggedIn, isUserOrAdmin], function(req, res, next) {

    User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
          res.redirect(req.header('Referer'));
        });
      }
    });
  });

  // facebook -------------------------------
  router.get(api.route('disconnect_facebook'), [isLoggedIn, isUserOrAdmin], function(req, res, next) {
    User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        user.facebook.id = undefined;
        user.facebook.token = undefined;
        user.facebook.public = false;
        user.save(function(err) {
          res.redirect(req.header('Referer'));
        });
      }
    });
  });

  // twitter --------------------------------
  router.get(api.route('disconnect_twitter'), [isLoggedIn, isUserOrAdmin], function(req, res, next) {
    User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        user.twitter.id = undefined;
        user.twitter.token = undefined;
        user.twitter.public = false;
        user.save(function(err) {
          res.redirect(req.header('Referer'));
        });
      }
    });
  });

  // google ---------------------------------
  router.get(api.route('disconnect_google'), [isLoggedIn, isUserOrAdmin], function(req, res, next) {
    User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        user.google.id = undefined;
        user.google.token = undefined;
        user.google.public = false;
        user.save(function(err) {
          res.redirect(req.header('Referer'));
        });
      }
    });
  });

  // github ---------------------------------
  router.get(api.route('disconnect_github'), [isLoggedIn, isUserOrAdmin], function(req, res, next) {
    User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        user.github.id = undefined;
        user.github.token = undefined;
        user.github.public = false;
        user.save(function(err) {
          res.redirect(req.header('Referer'));
        });
      }
    });
  });

  // disqus ---------------------------------
  router.get(api.route('disconnect_disqus'), [isLoggedIn, isUserOrAdmin], function(req, res, next) {
    User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {
      if (err) {
        return next(err);
      } else {
        user.disqus.token = undefined;
        user.save(function(err) {
          res.redirect(req.header('Referer'));
        });
      }
    });
  });

  return router;
};
