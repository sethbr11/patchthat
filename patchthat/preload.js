const { contextBridge, ipcRenderer } = require("electron");

// Exposes a new API in the global window object of the renderer process under the name electronAPI. This
// allows the renderer process to access this API without directly exposing the entire Electron API, which
// can help improve security. When the code uses contextBridge.exposeInMainWorld("electronAPI", {...}), it
// creates an object called electronAPI within the window object. This means you can access it in your
// renderer code using window.electronAPI.
contextBridge.exposeInMainWorld("electronAPI", {
  getServices: () => ipcRenderer.invoke("get-services"),
});
