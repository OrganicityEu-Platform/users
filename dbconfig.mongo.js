// $ mongo scenarios dbconfig.mongo.js

db.scenarios.ensureIndex({title: 'text'},{summary: 'text'},{narrative: 'text'});
shellPrint('MONGO: Created text indexes on title, narrative, summary for full text search.');

