// Runs before the page, in an isolated and sandboxed context. It hands the page exactly one
// capability — asking the main process to open a link in the user's browser — and nothing
// else from Node or Electron. The main process decides whether the link is allowed.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  openExternal: (url) => ipcRenderer.invoke('open-external', String(url)),
});
