const fs = require("fs");
const path = require("path");

// Load settings from a JSON file
function loadSettings(localPath, settings) {
  const absPath = path.join(__dirname, localPath);
  const data = JSON.parse(fs.readFileSync(absPath, "utf8"));
  for (const [key, val] of Object.entries(data)) {
    settings[key] = val;
  }
}

// Read and parse settings.json and local_settings.json
const settings = {};
loadSettings("settings.json", settings);
loadSettings("local_settings.json", settings);

module.exports = { settings };
