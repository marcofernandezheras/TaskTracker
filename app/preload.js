"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { contextBridge, ipcRenderer } = require('electron/renderer');
const api = {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    db: {
        activos: {
            list: () => ipcRenderer.invoke('db:activos:list'),
            find: (id) => ipcRenderer.invoke('db:activos:find', id),
            insert: (data) => ipcRenderer.invoke('db:activos:insert', data),
            update: (data) => ipcRenderer.invoke('db:activos:update', data),
            delete: (id) => ipcRenderer.invoke('db:activos:delete', id)
        },
        desarrollos: {
            list: () => ipcRenderer.invoke('db:desarrollos:list'),
            find: (id) => ipcRenderer.invoke('db:desarrollos:find', id),
            insert: (data) => ipcRenderer.invoke('db:desarrollos:insert', data),
            update: (data) => ipcRenderer.invoke('db:desarrollos:update', data),
            delete: (id) => ipcRenderer.invoke('db:desarrollos:delete', id)
        },
        tareas: {
            tipos: () => ipcRenderer.invoke('db:tareas:tipos'),
            list: (fecha) => ipcRenderer.invoke('db:tareas:list', fecha),
            find: (id) => ipcRenderer.invoke('db:tareas:find', id),
            insert: (data) => ipcRenderer.invoke('db:tareas:insert', data),
            update: (data) => ipcRenderer.invoke('db:tareas:update', data),
            delete: (id) => ipcRenderer.invoke('db:tareas:delete', id)
        },
        informes: {
            tareasPorDesarrolo: (start, end) => ipcRenderer.invoke('db:informes:tareasPorDesarrollo', start, end)
        }
    }
};
contextBridge.exposeInMainWorld('electronAPI', api);
//# sourceMappingURL=preload.js.map