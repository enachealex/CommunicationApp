const { app, BrowserWindow, ipcMain, session, shell } = require('electron');
const path = require('path');
const { isAllowedExternalUrl } = require('./external-links');

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 800,
    resizable: true,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      // The page gets no Node.js access. Its only bridge to the desktop is preload.js.
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
}

// "Learn about <style>" asks for a link to be opened in the user's browser. Only allowlisted
// links, requested by our own bundled page, are honoured.
ipcMain.handle('open-external', async (event, url) => {
  const senderUrl = event.senderFrame && event.senderFrame.url;
  if (!senderUrl || !senderUrl.startsWith('file:')) return false;
  if (!isAllowedExternalUrl(url)) return false;
  try {
    await shell.openExternal(url);
    return true;
  } catch {
    return false;
  }
});

// Defence in depth: the window never navigates away from the bundled page and never opens new
// windows. A window.open for an allowlisted link goes to the user's browser instead.
app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    if (isAllowedExternalUrl(url)) shell.openExternal(url).catch(() => {});
    return { action: 'deny' };
  });
  contents.on('will-navigate', (event, url) => {
    if (url !== contents.getURL()) event.preventDefault();
  });
});

app.whenReady().then(() => {
  // The app needs no camera, microphone, notifications or any other permission.
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
