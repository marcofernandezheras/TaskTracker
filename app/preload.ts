import { Activo, Desarrollo, Tarea, TareaPorDesarrollo, TipoTarea } from "../src/app/shared/services/main-service.service"

const { contextBridge, ipcRenderer } = require('electron/renderer')

export interface ElectronAPI {
  openFile: () => Promise<any>
  db: {
    activos: {
      list: () => Promise<any>,
      find: (id:number) => Promise<any>,
      insert: (data: Activo) => Promise<any>,
      update: (data: Activo) => Promise<any>,
      delete: (id:number) => Promise<any>,
    },
    desarrollos: {
      list: () => Promise<any>,
      find: (id:number) => Promise<any>,
      insert: (data: Desarrollo) => Promise<any>,
      update: (data: Desarrollo) => Promise<any>,
      delete: (id:number) => Promise<any>,
    },
    tareas : {
      tipos: () => Promise<Array<TipoTarea>>

      list: (fecha:Date) => Promise<any>,
      find: (id:number) => Promise<any>,
      insert: (data: Tarea) => Promise<any>,
      update: (data: Tarea) => Promise<any>,
      delete: (id:number) => Promise<any>
    },
    informes: {
      tareasPorDesarrolo: (start:Date, end: Date) => Promise<Array<TareaPorDesarrollo>>
    }
  }
}

const api : ElectronAPI = {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  db:{
    activos: {
      list: () => ipcRenderer.invoke('db:activos:list'),
      find: (id:number) => ipcRenderer.invoke('db:activos:find', id),
      insert : (data: Activo) => ipcRenderer.invoke('db:activos:insert',data),
      update : (data: Activo) => ipcRenderer.invoke('db:activos:update',data),
      delete: (id:number) => ipcRenderer.invoke('db:activos:delete', id)
    },
    desarrollos: {
      list: () => ipcRenderer.invoke('db:desarrollos:list'),
      find: (id:number) => ipcRenderer.invoke('db:desarrollos:find', id),
      insert : (data: Desarrollo) => ipcRenderer.invoke('db:desarrollos:insert',data),
      update : (data: Desarrollo) => ipcRenderer.invoke('db:desarrollos:update',data),
      delete: (id:number) => ipcRenderer.invoke('db:desarrollos:delete', id)
    },
    tareas: {
      tipos: () => ipcRenderer.invoke('db:tareas:tipos'),

      list: (fecha:Date) => ipcRenderer.invoke('db:tareas:list', fecha),
      find: (id:number) => ipcRenderer.invoke('db:tareas:find', id),
      insert: (data: Tarea) => ipcRenderer.invoke('db:tareas:insert',data),
      update: (data: Tarea) => ipcRenderer.invoke('db:tareas:update',data),
      delete: (id:number) => ipcRenderer.invoke('db:tareas:delete', id)
    },
    informes:{
      tareasPorDesarrolo: (start:Date, end: Date) => ipcRenderer.invoke('db:informes:tareasPorDesarrollo', start, end)
    }
  }
}

contextBridge.exposeInMainWorld('electronAPI', api)


declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
  }