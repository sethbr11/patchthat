/*
Function: getOSCommand
Returns the appropriate command to list services based on the current operating system.
*/
function getOSCommand() {
  const os = require("os");
  const platform = os.platform();

  if (platform === "win32") {
    return "tasklist";
  } else if (platform === "darwin") {
    return "launchctl list";
    return "ps aux"; // If we want to list all processes instead
  } else if (platform === "linux") {
    return "systemctl list-units --type=service --all --no-pager";
  }
}

// Export the getOSCommand function so it can be used in other files (main.js)
module.exports = {
  getOSCommand,
};
