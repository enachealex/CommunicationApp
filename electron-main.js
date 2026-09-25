const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

// Only ever hand https links to the OS browser.
function openExternalSafe(url) {
  try {
    if (new URL(url).protocol === 'https:') shell.openExternal(url);
  } catch (e) { /* ignore malformed URLs */ }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 800,
    resizable: true,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Never open new app windows or navigate away from the bundled page.
  win.webContents.setWindowOpenHandler(({ url }) => {
    openExternalSafe(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== win.webContents.getURL()) {
      event.preventDefault();
      openExternalSafe(url);
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
}

ipcMain.handle('open-external', (event, url) => openExternalSafe(url));

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
