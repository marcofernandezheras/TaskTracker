import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {

  activoStore: Array<Activo> = []
  desarrolloStore: Array<Desarrollo> = []
  tareasStore: Array<Tarea> = []

  constructor() {
  }

  convertDateToUTC(date: Date) { 
    return new Date(Date.UTC(date.getFullYear(), 
                    date.getMonth(), 
                    date.getDate(), 
                    date.getHours(), 
                    date.getMinutes(), 
                    date.getSeconds()
                  )); 
  }

  convertDateFromUTC(timestamp: number): Date { 
    let date = new Date(timestamp * 1000);
    date =  new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    return date; 
  }

  convertDateToUnixTime(dateToConvert: Date) : number{    
    const date = new Date(Date.UTC(dateToConvert.getFullYear(), dateToConvert.getMonth(), dateToConvert.getDate()));
    return Math.floor(date.getTime() / 1000);
  };

  listActivos(): Promise<Array<Activo>> {
    return new Promise<Array<Activo>>(async (res, rej) => {
      try {
        const data = await window.electronAPI.db.activos.list();
        res(data);
      } catch (e) {
        rej(e);
      }
    })
  }

  findActivos(id: number): Promise<Activo> {
    return new Promise<Activo>(async (res, rej) => {
      try {
        const data = await window.electronAPI.db.activos.find(id);
        res(data);
      } catch (e) {
        rej(e);
      }
    })
  }

  createActivo(name: string, notes?: string): Promise<Activo> {
    return new Promise<Activo>(async (res, rej) => {

      try {
        const id = await window.electronAPI.db.activos.insert({
          id: 0,
          name,
          notes
        });

        const newActivo = {
          id,
          name,
          notes
        };
        res(newActivo);
      }
      catch (e) {
        rej(e);
      }
    })
  }

  updateActivo(id: number, name: string, notes?: string): Promise<Activo> {
    return new Promise<Activo>(async (res, rej) => {
      try {
        const ok = await window.electronAPI.db.activos.update({ id, name, notes });
        if (ok) {
          return await this.findActivos(id);
        }
      }
      catch (e) {
        rej(e);
      }
    })
  }

  deleteActivo(id: number): Promise<boolean> {
    return new Promise(async (res, rej) => {
      try {
        const ok = await window.electronAPI.db.activos.delete(id);
        res(ok);
      }
      catch (e) {
        rej(e);
      }
    })
  }

  listDesarrollos(): Promise<Array<Desarrollo>> {
    return new Promise<Array<Desarrollo>>(async (res, rej) => {
      try {
        const data = await window.electronAPI.db.desarrollos.list();
        res(data);
      } catch (e) {
        rej(e);
      }
    })
  }

  findDesarrollos(id: number): Promise<Desarrollo> {
    return new Promise<Desarrollo>(async (res, rej) => {
      try {
        const data = await window.electronAPI.db.desarrollos.find(id);
        res(data);
      } catch (e) {
        rej(e);
      }
    })
  }

  createDesarrollo(idActivo: number, ticket: string, title: string, notes?: string): Promise<Desarrollo> {
    return new Promise<Desarrollo>(async (res, rej) => {

      try {
        const id = await window.electronAPI.db.desarrollos.insert({
          id: 0,
          idActivo,
          ticket,
          title,
          notes
        });

        const newDesarrollo = {
          id,
          idActivo,
          ticket,
          title,
          notes
        };
        res(newDesarrollo);
      }
      catch (e) {
        rej(e);
      }
    })
  }

  updateDesarrollo(id: number, idActivo: number, ticket: string, title: string, notes?: string): Promise<Desarrollo> {
    return new Promise<Desarrollo>(async (res, rej) => {
      try {
        const ok = await window.electronAPI.db.desarrollos.update({
          id,
          idActivo,
          ticket,
          title,
          notes
        });
        if (ok) {
          res(await this.findDesarrollos(id));
        } else {
          rej();
        }
      }
      catch (e) {
        rej(e);
      }
    })
  }

  deleteDesarrollo(id: number): Promise<void> {
    return new Promise(async (res, rej) => {
      try {
        const ok = await window.electronAPI.db.desarrollos.delete(id);
        if (ok) res();
        else rej();
      }
      catch (e) {
        rej(e);
      }
    })
  }

  listToDo(): Promise<Array<Tarea>> {
    return new Promise<Array<Tarea>>((res, rej) => {
      res([]);
    })
  }

  listTareas(fecha: Date): Promise<Array<Tarea>> {
    return new Promise<Array<Tarea>>(async (res, rej) => {
      try {
        const data = await window.electronAPI.db.tareas.list(fecha);
        res(data);
      } catch (e) {
        rej(e);
      }
    })
  }

  findTarea(id: number): Promise<Tarea> {
    return new Promise<Tarea>(async (res, rej) => {
      try {
        const data = await window.electronAPI.db.tareas.find(id);
        res(data);
      } catch (e) {
        rej(e);
      }
    })
  }

  createTarea(tarea: Tarea): Promise<Tarea> {
    return new Promise<Tarea>(async (res, rej) => {
      try {
        const id = await window.electronAPI.db.tareas.insert(tarea);
        let newTask = {... tarea};
        newTask.id = id;
        res(newTask);
      } catch (e) {
        rej(e);
      }
    });
  }

  updateTarea(tarea: Tarea): Promise<Tarea> {
    return new Promise<Tarea>(async (res, rej) => {
      try {
        const ok = await window.electronAPI.db.tareas.update(tarea);
        if(ok){
          res(await this.findTarea(tarea.id));          
        }else {
          rej();
        }
      } catch (e) {
        rej(e);
      }
    });
  }

  listTipoTarea(): Promise<Array<TipoTarea>> {
    return new Promise<Array<TipoTarea>>(async (res, rej) => {
      try {
        const data = await window.electronAPI.db.tareas.tipos();
        res(data);
      } catch (e) {
        rej(e);
      }
    })
  }
}

export class Activo {
  id!: number;
  name!: string;
  notes?: string;
}

export class Desarrollo {
  id!: number;
  idActivo!: number;
  ticket!: string;
  title!: string;
  notes?: string;

  //TODO estado
  //TODO Fechas
}

export interface TipoTarea {
  id: number;
  name: string;
}

export class Tarea {
  id!: number;
  idDesarrollo!: number;
  notes?: string;
  idTipoTarea!: number;

  startDate!: number; //UNIX time
  endDate?: number;   //UNIX time
  pause?: number;
}

export interface TareaPorDesarrollo {
  IdDesarrollo: number;
  Ticket: string;
  Title: string;
  TaskDate: string;
  HoursConsumed: number;
  notes: string;
}