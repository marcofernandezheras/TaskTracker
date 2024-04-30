import {app, BrowserWindow, screen, ipcMain, dialog} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { DbManager, Manager } from './DBManager';

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');


  async function handleFileOpen () {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
      return filePaths[0]
    }
  }

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: true,
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => { 
    ipcMain.handle('dialog:openFile', handleFileOpen);

    ipcMain.handle('db:activos:list', Manager.listActivos);
    ipcMain.handle('db:activos:find', (e,a) => { 
      return Manager.findActivos(a); 
    });
    ipcMain.handle('db:activos:insert', (e,a) => { 
      return Manager.insertActivo(a); 
    });
    ipcMain.handle('db:activos:update', (e,a) => { 
      return Manager.updateActivo(a); 
    });
    ipcMain.handle('db:activos:delete', (e,a) => { 
      return Manager.deleteActivo(a); 
    });


    ipcMain.handle('db:desarrollos:list', Manager.listDesarrollos);
    ipcMain.handle('db:desarrollos:find', (e,a) => { 
      return Manager.findDesarrollo(a); 
    });
    ipcMain.handle('db:desarrollos:insert', (e,a) => { 
      return Manager.insertDesarrollo(a); 
    });
    ipcMain.handle('db:desarrollos:update', (e,a) => { 
      return Manager.updateDesarrollo(a); 
    });
    ipcMain.handle('db:desarrollos:delete', (e,a) => { 
      return Manager.deleteDesarrollo(a); 
    });

    ipcMain.handle('db:tareas:tipos', Manager.listTipoTarea);

    ipcMain.handle('db:tareas:list', (e,a) => {
      return Manager.listTareas(a);
    });
    ipcMain.handle('db:tareas:find', (e,a) => { 
      return Manager.findTareas(a); 
    });
    ipcMain.handle('db:tareas:insert', (e,a) => { 
      return Manager.insertTarea(a); 
    });
    ipcMain.handle('db:tareas:update', (e,a) => { 
      return Manager.updateTarea(a); 
    });
    ipcMain.handle('db:tareas:delete', (e,a) => { 
      return Manager.deleteTarea(a); 
    });

    ipcMain.handle('db:informes:tareasPorDesarrollo', (e,a,b) => { 
      return Manager.tareasPorDesarrollo(a,b); 
    });

    setTimeout(createWindow, 400)
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
