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

module.exports = {
  getOSCommand,
};
