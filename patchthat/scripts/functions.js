const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

/*
Function: getOSCommand
Returns the appropriate command to list services based on the current operating system.
*/
function getOSCommand() {
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
      const label = parts.slice(2).join(" ");
      const detailedLabel = getProgramDisplayNameApple(label);
      return {
        pid: parts[0],
        status: parts[1],
        label: detailedLabel,
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

function getProgramDisplayNameApple(label) {
  // Potential directories where .plist files could be located
  const plistDirs = [
    "/System/Library/LaunchAgents",
    "/System/Library/LaunchDaemons",
    "/Library/LaunchAgents",
    "/Library/LaunchDaemons",
    "/System/Library/Preferences",
    "/Library/Preferences",
  ];

  // Try to locate the .plist file that matches the label
  for (let dirPath of plistDirs) {
    const plistPath = path.join(dirPath, `${label}.plist`);
    if (fs.existsSync(plistPath)) {
      try {
        // Read and parse the .plist file
        const plistData = fs.readFileSync(plistPath, "utf8");
        const programMatch = plistData.match(
          /<key>Program<\/key>\s*<string>(.*?)<\/string>/
        );
        const programArgsMatch = plistData.match(
          /<key>ProgramArguments<\/key>\s*<array>\s*<string>(.*?)<\/string>/
        );

        let programPath = programMatch
          ? programMatch[1]
          : programArgsMatch
          ? programArgsMatch[1]
          : null;

        if (programPath && fs.existsSync(programPath)) {
          // Run mdls to get the display name
          const result = execSync(
            `mdls -name kMDItemDisplayName "${programPath}"`,
            { encoding: "utf8" }
          );
          const displayNameMatch = result.match(
            /kMDItemDisplayName\s*=\s*"(.*?)"/
          );

          if (displayNameMatch) {
            return displayNameMatch[1] + " (" + label + ")";
          }
        }
      } catch (error) {
        console.error(`Error processing ${plistPath}:`, error);
      }
    }
  }

  // If the process fails, return the label
  return label;
}

// Export the getOSCommand function so it can be used in other files (main.js)
module.exports = {
  getOSCommand,
  parseCommandOutput,
};
