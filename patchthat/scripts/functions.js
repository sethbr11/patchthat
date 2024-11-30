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

  if (platform === "win32")
    return "winget upgrade"; // Winget Upgrade will return a list of all applications that are currently outdated
  else if (platform === "darwin")
    return "launchctl list"; // Try 'brew outdated' as an alternative?
  else if (platform === "linux")
    return "systemctl list-units --type=service --all --no-pager";
}

/*
Function: loadNativeServiceBaseline
Loads the baseline of native services for a given operating system.
*/
function loadNativeServiceBaseline(platform) {
  const fs = require("fs");
  const path = require("path");
  try {
    const baselineFilePath = path.join(
      __dirname,
      "baselines",
      `${platform}_baseline.json`
    );
    const baselineData = fs.readFileSync(baselineFilePath, "utf-8");
    return JSON.parse(baselineData);
  } catch (error) {
    console.error(`Error loading baseline for platform ${platform}:`, error);
    return []; // Return an empty list if the file can't be loaded
  }
}

/*
Function: isNativeService
Checks if a service label is a native service based on the baseline for the current operating system.
*/
function isNativeService(label) {
  const os = require("os");
  const platform = os.platform();
  const nativeServices = loadNativeServiceBaseline(platform); // Load baseline
  return nativeServices.some((nativeService) => label.includes(nativeService));
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
    parsedData = lines
      .slice(2)
      .map((line) => {
        // Split the line by whitespace
        const parts = line.trim().split(/\s{2,}/); // Use two or more spaces as delimiter
        if (parts.length < 5) return null; // Skip malformed lines

        return {
          name: parts[0], // Application name
          id: parts[1], // Winget package ID
          version: parts[2], // Installed version
          available: parts[3], // Available version
          source: parts[4], // Source (e.g., "winget")
        };
      })
      .filter(Boolean); // Remove any null entries caused by malformed lines
  } else if (platform === "darwin") {
    parsedData = lines
      .slice(1) // Remove the header line
      .filter((line) => {
        const parts = line.trim().split(/\s+/);
        const label = parts.slice(2).join(" ");
        return !isNativeService(label); // Exclude native services
      })
      .map((line) => {
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

/*
Function: getProgramDisplayNameApple
Gets the display name of a program on macOS based on its label.
TODO: This works for com.apple services, but not for third-party services.
 */
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
