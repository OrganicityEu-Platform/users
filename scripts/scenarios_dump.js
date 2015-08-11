conn = new Mongo();
db = conn.getDB("scenarios");

cursor = db.scenarios.find();
var scenarios = [];
while (cursor.hasNext()) {
  scenarios.push(cursor.next());
}

printjson(scenarios);
