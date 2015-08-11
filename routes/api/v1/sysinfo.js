var api = require('../../../api_routes.js');
var git = require('git-rev');

module.exports = function(router, passport) {
  router.get(api.route('sysinfo'), function(req, res) {
    git.short(function(short) {
      git.long(function(long) {
        git.branch(function(branch) {
          git.tag(function(tag) {
            res.json({
              short  : short,
              long   : long,
              branch : branch,
              tag    : tag
            });
          });
        });
      });
    });
  });
};
