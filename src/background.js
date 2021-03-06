'use strict'
import { app, ipcMain, protocol, BrowserWindow, Menu, } from "electron"; 
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import { php, path } from './phpserver';
const { download } = require("electron-dl");

const menuTemplate = require("./menuTemplate");

const isDevelopment = process.env.NODE_ENV !== 'production';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 900,
    icon: path.join(__static, "img/icons/android-chrome-512x512.png"),
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //win.setResizable(false);
  win.center();

  win.on("will-resize", (e) => {
    e.preventDefault();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html');
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    php.close();
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  php.run();
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate()));

  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow(); 
})

ipcMain.on('show-main-window-event', function() {
  main.window.show(); 
  app.dock.show();
});
ipcMain.on("ping", (event) => { 
  event.sender.send("pong", { 
    host: php.host,
    port: php.port,
    appver: 'v' + app.getVersion(),
  });
});

ipcMain.on("download", async (event, url) => {
  const win = BrowserWindow.getFocusedWindow();
  console.log("received command");
  const options = {
    openFolderWhenDone: true,
    saveAs: true,
    onStarted: () =>
      event.sender.send("archive", { msg: " Download started", data: null }),
    onProgress: (progress) => event.sender.send("progress", progress),
    onCompleted: (opp) =>
      event.sender.send("archive", { msg: " Archive saved", data: opp }),
  };
  download(win, url, options).catch(console.error);

  // event.sender.send("archive", {
  //   data: archive,
  // });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        php.close();
        app.quit();
      }
    })
  } else { 
    process.on('SIGTERM', () => {
      php.close();
      app.quit();
    })
  }
}
