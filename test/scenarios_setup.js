var mongojs = require('mongojs');
var Promise = require('promise');

var saveModels = function(db, models, done) {
  if (models.length === 0) {
    done();
    return;
  }
  var result = db.scenarios.insert(models);
  if (result.nInserted !== models.length) {
    done('Saving model affected %s rows. Expected: %s.', result.nInserted, models.length);
    return;
  }
  done();
};

var fillUsersCollection = function(db, done) {
  // TODO actually fill with users
  done();
};

var fillScenariosCollection = function(db, done) {
  var scenarioDir = __dirname + '/data/scenarios/';
  var files = fs.readdirSync(scenarioDir);
  var scenarios = [];
  files.forEach(function(file) {
    var scenarioJson = JSON.parse(fs.readFileSync(scenarioDir + file));
    scenarios.push(new Scenario(scenarioJson));
  });
  saveModels(scenarios, done);
};

var fillCollections = function(db, done) {
  fillUsersCollection(function(err) {
    if (err) {
      done(err);
      return;
    }
    fillScenariosCollection(done);
  });
};

var createCollections = function(db, done) {
  db.createCollection('users', function(err) {
    if (err) {
      done(err);
      return;
    }
    db.createCollection('scenarios', function(err) {
      if (err) {
        done(err);
        return;
      }
      done();
    });
  });
};

var dropCollections = function(db, done) {
  db.dropCollection('scenarios', function(err) {
    if (err) {
      done(err);
      return;
    }
    db.dropCollection('users', function(err) {
      if (err) {
        done(err);
        return;
      }
      done();
    });
  });
};

var setup = function(dbUrl) {

  var doIt = function(resolve, reject) {

    var db = mongojs(dbUrl);

    db.on('error', function(err) {
      console.log('Error opening DB connection', err);
      reject(err);
    });

    db.on('ready', function() {
      console.log('Connected to MongoDB', db);
      resolve(db);
      return;

      dropCollections(db, function() {
        console.log('Dropped test collections');

        createCollections(db, function() {
          console.log('Created test collections');

          fillCollections(db, function() {
            console.log('Filled test collections with test data');

            resolve(db);
          });
        });
      });
    });
  };

  return new Promise(doIt);
};

var teardown = function(db, done) {
  var promise = new Promise(function(resolve, reject) {
    db.disconnect(function() {
      console.log('Disconnected from MongoDB');
      done();
      resolve();
    });
  });
};

module.exports = {
  setup : setup,
  teardown : teardown
};
