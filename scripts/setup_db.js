conn = new Mongo();
db = conn.getDB("scenarios");

printjson(db.scenarios.ensureIndex({narrative:"text"},{title:"text"},{summary:"text"}));
printjson(db.scenarios.getIndexes());
