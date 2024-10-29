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

/*
Function: parseCommandOutput
Parses the output of the command in JSON based on the current operating system.
*/
function parseCommandOutput(output) {
  const os = require("os");
  const platform = os.platform();
  const lines = output.trim().split("\n");

  let parsedData;

  if (platform === "win32") {
    parsedData = lines.slice(3).map((line) => {
      const parts = line.trim().split(/\s+/);
      return {
        imageName: parts[0],
        pid: parts[1],
        sessionName: parts[2],
        sessionNumber: parts[3],
        memUsage: parts[4],
      };
    });
  } else if (platform === "darwin") {
    parsedData = lines.slice(1).map((line) => {
      const parts = line.trim().split(/\s+/);
      return {
        pid: parts[0],
        status: parts[1],
        label: parts.slice(2).join(" "), // Join remaining parts for service label
      };
    });
  } else if (platform === "linux") {
    parsedData = lines.slice(1).map((line) => {
      const parts = line.trim().split(/\s+/);
      return {
        unit: parts[0],
        load: parts[1],
        active: parts[2],
        sub: parts[3],
        description: parts.slice(4).join(" "), // Join remaining parts for description
      };
    });
  }

  return JSON.stringify(parsedData); // Convert parsed data to JSON string
}

// Export the getOSCommand function so it can be used in other files (main.js)
module.exports = {
  getOSCommand,
  parseCommandOutput,
};
