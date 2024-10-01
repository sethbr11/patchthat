/* 
Preload.js is a script that runs in the renderer process and has access to the Electron API. It is used to
expose specific parts of the Electron API to the renderer process in a controlled manner. This can help
improve security by limiting the access of the renderer process to the Electron API. 
*/
// Imports
const { contextBridge, ipcRenderer } = require("electron");

// Expose the getServices function to the renderer process, which is defined in the main process (main.js)
contextBridge.exposeInMainWorld("electronAPI", {
  getServices: () => ipcRenderer.invoke("get-services"),
});
