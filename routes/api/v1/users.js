var User          = require('../../../models/schema/user.js');
var api           = require('../../../api_routes.js');
var unirest       = require('unirest');
var RestClient    = require('node-rest-client').Client;
var HttpStatus    = require('http-status');
var handleUpload  = require('../../../util/handleUpload');

var validate      = require('express-validation');
var UserJoi       = require('../../../models/joi/user.js');
var hasRole       = require('../../../models/hasRole.js');
var gravatar      = require('gravatar');
var configAuth    = require('../../../config/auth.js');

module.exports = function(router, passport) {

  var isLoggedIn    = require('../../../models/isLoggedIn.js')(passport);
  var isUserOrAdmin = require('../../../models/isUserOrAdmin.js')(passport);

  // ###############################################################
  // Routes
  // ###############################################################

  var excludeFields = {
    '_id'            : 0,
    '__v'            : 0,
    'local.password' : 0
  };

  router.get(api.route('users'), [isLoggedIn, hasRole(['admin'])], function(req, res, next) {

    User.find({}, excludeFields, function(err, users) {
      if (err) {
        return next(err);
      } else {
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
    User.findOne({ 'uuid' :  uuid }, excludeFields, function(err, user) {
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
            success(user);
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
      };

      if (user.avatar) {
        p.image = user.avatar;
      } else if (user.facebook && user.facebook.id) {

        // https://developers.facebook.com/docs/graph-api/reference/user/picture/
        p.image = 'https://graph.facebook.com/v2.5/' + user.facebook.id + '/picture?width=' + size + '&height=' + size;

      } else if (user.twitter && user.twitter.username) {

        // https://stackoverflow.com/questions/14836956/how-to-get-user-image-with-twitter-api-1-1
        p.image = 'https://twitter.com/' + user.twitter.username + '/profile_image?size=original';

      } else if (user.google && user.google.id) {

        /*
         * IMPROVE: Use OAuth API to get bigger images
         * http://stackoverflow.com/q/9128700/605890
         * http://unirest.io/nodejs.html
         */

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

      res.json(p);
    });
  });

  router.get(api.route('user_by_uuid'), [isLoggedIn, isUserOrAdmin], function(req, res, next) {
    findUser(req.params.uuid, res, next, function(user) {
      res.json(user);
    });
  });

  router.patch(
    api.route('user_by_uuid'),
    [isLoggedIn, isUserOrAdmin, validate(UserJoi.profileServer)],
    function(req, res, next) {

      // Non admin user cannot edit the roles
      if (req.body.roles && !req.user.hasRole(['admin'])) {
        var err = new Error('Forbidden: Not allowed to edit roles for User ' + req.params.uuid);
        err.status = 403;
        return next(err);
      }

      User.findOne({ 'uuid' :  req.params.uuid }, function(err, user) {

        handleUpload(req.body.avatar, next, function(path) {

          if (req.body.local && req.body.local.password && req.body.local.password.length > 0) {
            user.local.password = user.generateHash(req.body.local.password);
          }

          if (req.body.hasOwnProperty('name')) {
            user.name = req.body.name;
          }

          // If set, gender will never be emty due to validation
          if (req.body.gender) {
            user.gender = req.body.gender;
          }

          // If set, roles will never be emty due to validation
          if (req.body.roles) {
            user.roles = req.body.roles;
          }

          if (path) {
            user.avatar = path;
          }

          user.save(function(err) {
            if (err) {
              return next(err);
            }
            res.format({
              'application/json': function() {
                res.json(user);
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
            res.json(user);
          },
          'default': function() {
            res.send(406, 'Not Acceptable');
          }
        });
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
        user.facebook.token = undefined;
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
        user.twitter.token = undefined;
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
        user.google.token = undefined;
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
        user.github.token = undefined;
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
