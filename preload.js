const { contextBridge, ipcRenderer } = require('electron');

// Expose only what the page needs. The renderer has no Node.js access.
contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});
