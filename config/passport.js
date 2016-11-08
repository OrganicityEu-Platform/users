// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GithubStrategy   = require('passport-github').Strategy;
var BasicStrategy    = require('passport-http').BasicStrategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var OAuth2Strategy   = require('passport-oauth2').Strategy;
var DisqusStrategy   = require('passport-disqus').Strategy;

var unirest           = require('unirest');
var jwtDecode = require('jwt-decode');

//
var uuid = require('node-uuid');

// load up the user model
var User = require('../models/schema/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // HTTP BASIC ==============================================================
  // =========================================================================
  passport.use(new BasicStrategy({},
      function(email, password, done) {

        // asynchronous verification, for effect...
        process.nextTick(function() {

          User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
              return done(err);
            }

            // if no user is found, return the message
            if (!user) {
              return done(null, false);
            }

            // Password incorrect
            if (!user.validPassword(password)) {
              return done(null, false);
            } else {
              // all is well, return user
              return done(null, user);
            }
          });
        });
      }
    ));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in)
  },
    function(req, email, password, done) {
      if (email) {
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
      }

      // asynchronous
      process.nextTick(function() {
        User.findOne({ 'local.email' :  email }, function(err, user) {
          // if there are any errors, return the error
          if (err) {
            return done(err);
          }

          // if no user is found, return the error
          if (!user) {
            return done(null, false, {error: 'User with email "' + email + '" not found!'});
          }

          if (!user.validPassword(password)) {
            return done(null, false, {error: 'Wrong password for user with email ' + email});
          } else {
            // all is well, return user
            return done(null, user);
          }
        });
      });

    }));

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged)
  },
    function(req, email, password, done) {

      var user;

      if (email) {
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
      }

      // asynchronous
      process.nextTick(function() {

        // if the user is not already logged in:
        if (!req.user) {
          User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
              return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
              return done(null, false, { error: 'That email is already taken.'});
            } else {

              // create the user
              var newUser            = new User();
              newUser.uuid   = uuid.v4();
              newUser.local.email    = email;
              newUser.local.password = newUser.generateHash(password);

              newUser.save(function(err) {
                if (err) {
                  return done(err);
                }

                return done(null, newUser);
              });
            }

          });
      // if the user is logged in but has no local account...
        } else if (!req.user.local.email) {
          // ...presumably they're trying to connect a local account
          // BUT let's check if the email used to connect a local account is being used by another user
          User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) {
              return done(err);
            }

            if (user) {
              return done(null, false, { error: 'That email is already taken.'});
              // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
            } else {
              user = req.user;
              user.local.email = email;
              user.local.password = user.generateHash(password);
              user.save(function(err) {
                if (err) {
                  return done(err);
                }

                return done(null, user);
              });
            }
          });
        } else {
          // user is logged in and already has a local account. Ignore signup.
          // (You should log out before trying to create a new account, user!)
          return done(null, req.user);
        }

      });

    }));

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({

    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in)

  },
    function(req, token, refreshToken, profile, done) {

      // asynchronous
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {

          User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
            if (err) {
              return done(err);
            }

            if (user) {

              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.facebook.token) {
                user.facebook.token = token;
                user.facebook.displayName = profile.displayName;
                //user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                //user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user
            } else {
              // if there is no user, create them
              user = new User();
              user.uuid   = uuid.v4();
              user.facebook.id    = profile.id;
              user.facebook.token = token;
              user.facebook.displayName = profile.displayName;
              //                        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
              //                        user.facebook.email = (profile.emails[0].value || '').toLowerCase();

              user.save(function(err) {
                if (err) {
                  return done(err);
                }

                return done(null, user);
              });
            }
          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user            = req.user; // pull the user out of the session

          user.facebook.id    = profile.id;
          user.facebook.token = token;
          user.facebook.displayName = profile.displayName;
          //              user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
          //            user.facebook.email = (profile.emails[0].value || '').toLowerCase();

          user.save(function(err) {
            if (err) {
              return done(err);
            }

            return done(null, user);
          });

        }
      });

    }));

  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================
  passport.use(new TwitterStrategy({

    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in)

  },
    function(req, token, tokenSecret, profile, done) {

      // asynchronous
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {

          User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
            if (err) {
              return done(err);
            }

            if (user) {
              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.twitter.token) {
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save(function(err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user
            } else {
              // if there is no user, create them
              var newUser                 = new User();
              newUser.uuid        = uuid.v4();
              newUser.twitter.id          = profile.id;
              newUser.twitter.token       = token;
              newUser.twitter.username    = profile.username;
              newUser.twitter.displayName = profile.displayName;

              newUser.save(function(err) {
                if (err) {
                  return done(err);
                }

                return done(null, newUser);
              });
            }
          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user                 = req.user; // pull the user out of the session

          user.twitter.id          = profile.id;
          user.twitter.token       = token;
          user.twitter.username    = profile.username;
          user.twitter.displayName = profile.displayName;

          user.save(function(err) {
            if (err) {
              return done(err);
            }

            return done(null, user);
          });
        }

      });

    }));

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({

    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in)

  },
    function(req, token, refreshToken, profile, done) {

      // asynchronous
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {

          User.findOne({ 'google.id' : profile.id }, function(err, user) {
            if (err) {
              return done(err);
            }

            if (user) {

              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.google.token) {
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, user);
                });
              }

              return done(null, user);
            } else {
              var newUser          = new User();
              newUser.uuid = uuid.v4();
              newUser.google.id    = profile.id;
              newUser.google.token = token;
              newUser.google.name  = profile.displayName;
              newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

              newUser.save(function(err) {
                if (err) {
                  return done(err);
                }

                return done(null, newUser);
              });
            }
          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user               = req.user; // pull the user out of the session

          user.google.id    = profile.id;
          user.google.token = token;
          user.google.name  = profile.displayName;
          user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

          user.save(function(err) {
            if (err) {
              return done(err);
            }

            return done(null, user);
          });

        }

      });

    }));

  // =========================================================================
  // Github =================================================================
  // =========================================================================
  passport.use(new GithubStrategy({

    clientID        : configAuth.githubAuth.clientID,
    clientSecret    : configAuth.githubAuth.clientSecret,
    callbackURL     : configAuth.githubAuth.callbackURL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in)

  },
    function(req, token, tokenSecret, profile, done) {

      // asynchronous
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {

          User.findOne({ 'github.id' : profile.id }, function(err, user) {
            if (err) {
              return done(err);
            }

            if (user) {
              // if there is a user id already but no token (user was linked at one point and then removed)

              if (!user.github.token) {
                user.github.token       = token;
                user.github.id          = profile.id;
                user.github.displayName = profile.displayName;
                user.github.username    = profile.username;

                user.save(function(err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user
            } else {
              // if there is no user, create them
              var newUser                = new User();
              newUser.uuid       = uuid.v4();
              newUser.github.token       = token;
              newUser.github.id          = profile.id;
              newUser.github.displayName = profile.displayName;
              newUser.github.username    = profile.username;

              newUser.save(function(err) {
                if (err) {
                  return done(err);
                }

                return done(null, newUser);
              });
            }
          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user                 = req.user; // pull the user out of the session

          user.github.token       = token;
          user.github.id          = profile.id;
          user.github.displayName = profile.displayName;
          user.github.username    = profile.username;

          user.save(function(err) {
            if (err) {
              return done(err);
            }

            return done(null, user);
          });
        }

      });

    }));

  // =========================================================================
  // DISQUS ==================================================================
  // =========================================================================
  passport.use(new DisqusStrategy({
      clientID: configAuth.disqusAuth.clientID,
      clientSecret: configAuth.disqusAuth.clientSecret,
      callbackURL: configAuth.disqusAuth.callbackURL,
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in)
    },
    function(req, token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {
        // check if the user is already logged in
        if (!req.user) {
          console.log('disqus strategy');
          User.findOne({
            'disqus.id': profile.id
          }, function(err, user) {
            if (err) {
              return done(err);
            }
            if (user) {

              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.disqus.token) {
                user.disqus.token = token;
                user.disqus.name = profile.displayName;

                var raw = JSON.parse(profile._raw);
                var email = raw.response.email;
                user.disqus.email = (email || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                  if (err) {
                    return done(err);
                  }

                  return done(null, user);
                });
              }

              return done(null, user);
            } else {
              var newUser = new User();
              newUser.uuid = uuid.v4();
              newUser.disqus.id = profile.id;
              newUser.disqus.token = token;

              newUser.disqus.name = profile.displayName;
              //console.log('disqus strategy profile object' + profile.displayName);
              var raw = JSON.parse(profile._raw);
              var email = raw.response.email;
              newUser.disqus.email = (email || '').toLowerCase(); // pull the first email

              newUser.save(function(err) {
                if (err) {
                  return done(err);
                }

                return done(null, newUser);
              });
            }
          });

        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          user.disqus.id = profile.id;
          user.disqus.token = token;
          user.disqus.name = profile.displayName;
          var raw = JSON.parse(profile._raw);
          var email = raw.response.email; // CHECK
          newUser.oauth.email = (email || '').toLowerCase(); // pull the first email

          user.save(function(err) {
            if (err) {
              return done(err);
            }
            return done(null, user);
          });
        }
      });

    }));

  // =========================================================================
  // OrganiCity OAuth2
  // =========================================================================

  passport.use(new OAuth2Strategy({
      authorizationURL: configAuth.oAuth2.authorizationURL,
      tokenURL: configAuth.oAuth2.tokenURL,
      clientID: configAuth.oAuth2.clientID,
      clientSecret: configAuth.oAuth2.clientSecret,
      callbackURL: configAuth.oAuth2.callbackURL,
      passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {

      // asynchronous
      process.nextTick(function() {

        // unpack access token.
        var profile = jwtDecode(token);
        console.log('profile', profile);
        console.log('roles', profile.resource_access);
        var roles = profile.resource_access.scenarios ? profile.resource_access.scenarios.roles : [];
        // check if the user is already logged in
        if (!req.user) {
          User.findOne({
            'oauth2.id': profile.sub
          }, function(err, user) {
            if (err) {
              return done(err);
            }
            if (user) {

              console.log('User found');

              // if there is a user id already but no token (user was linked at one point and then removed)
              if (!user.oauth2.token) {

                console.log('User has no token!');

                user.oauth2.id = profile.sub;
                user.oauth2.token = token;
                user.oauth2.name = profile.name;
                user.oauth2.email = profile.email;
                user.roles = roles;
              } else {
                console.log('user is known, refreshing data.');

                user.oauth2.name = profile.name;
                user.oauth2.email = profile.email;
                user.roles = roles;
              }

              user.save(function(err) {
                if (err) {
                  return done(err);
                }
                return done(null, user);
              });
            } else {

              console.log('Create new user!');

              var newUser = new User();
              newUser.uuid = uuid.v4();

              newUser.oauth2.id = profile.sub;
              newUser.oauth2.token = token;
              newUser.oauth2.name = profile.name;
              newUser.oauth2.email = profile.email;
              newUser.roles = roles;

              newUser.save(function(err) {
                if (err) {
                  return done(err);
                }

                return done(null, newUser);
              });
            }
          });

        } else {

          console.log('Link new user!');

          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          user.oauth2.id = profile.sub;
          user.oauth2.token = token;
          user.oauth2.name = profile.name;
          user.oauth2.email = profile.email;
          user.roles = roles;

          user.save(function(err) {
            if (err) {
              return done(err);
            }
            return done(null, user);
          });
        }
      });
    }
  ));

};
