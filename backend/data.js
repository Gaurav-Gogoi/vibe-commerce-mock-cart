const fs = require("fs");
const path = "./db.json";

function loadDB() {
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data);
}

function saveDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { loadDB, saveDB };
