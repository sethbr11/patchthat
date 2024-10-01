/* 
The main.js file is the entry point for the Electron application. It creates the 
main window and listens for IPC events from the renderer process. 
*/

// Imports
const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");
const { getOSCommand } = require("../scripts/functions"); // Our custom function to get the OS command

// Create the main window for the application
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false, // Enable node integration. Set to false for security reasons
      contextIsolation: true, // Enable context isolation. Set to true for security reasons
    },
  });

  // Load the index.html file as the main window content
  win.loadFile("src/index.html");
}

// Handle the get-services IPC event. This is run when the button is clicked in index.html
ipcMain.handle("get-services", async () => {
  const command = getOSCommand(); // Get the command for the current OS

  // Run the command and return the output
  try {
    const stdout = await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(stderr); // Reject with error output
        } else {
          resolve(stdout); // Resolve with standard output
        }
      });
    });
    return stdout; // Return the output to the renderer process
  } catch (error) {
    console.error("Error executing command:", error);
    throw new Error(error); // Throw error for handling in the renderer process
  }
});

// Create the main window when the app is ready
app.whenReady().then(() => {
  createWindow();

  // Create the main window when the app is activated
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed
app.on("window-all-closed", () => {
  // On macOS, the app should not quit when all windows are closed, but only when the user quits explicitly
  if (process.platform !== "darwin") app.quit();
});
