conn = new Mongo();
db = conn.getDB('scenarios');

printjson(db.scenarios.ensureIndex({narrative: 'text'},{title: 'title'},{summary: 'text'}));
printjson(db.scenarios.getIndexes());
