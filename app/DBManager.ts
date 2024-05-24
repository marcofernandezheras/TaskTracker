import * as Database from "better-sqlite3";
import { Activo, Desarrollo, Tarea } from "../src/app/shared/services/main-service.service";
const path = require("path")

const dbPath = "C:/Proyectos/electron/TaskTracker/db/task-tracker.db";

const db = new Database(dbPath)
db.pragma("journal_mode = WAL")

export interface DbManager {
        findActivos(id: number): any;
        listActivos(): any;
        insertActivo(data: Activo): number | bigint;
        updateActivo(data: Activo): boolean;
        deleteActivo(id: number): boolean;

        findDesarrollo(id: number): any;
        listDesarrollos(): any;
        insertDesarrollo(data: Desarrollo): number | bigint;
        updateDesarrollo(data: Desarrollo): boolean;
        deleteDesarrollo(id: number): boolean;

        listTipoTarea(): any;

        findTareas(id: number): any;
        listTareas(fecha: Date):any;
        insertTarea(data: Tarea): number | bigint;
        updateTarea(data: Tarea): boolean;
        deleteTarea(id: number): boolean;

        tareasPorDesarrollo(start: Date, end: Date): any;
}

export const Manager : DbManager = {
        findActivos(id: number) {
                const query = db.prepare(`SELECT id, name, notes FROM Activo WHERE id=?;`);
                return query.get(id);
        },
        listActivos() {
                const query = `SELECT id, name, notes FROM Activo order by name;`;
                const readQuery = db.prepare(query);
                return readQuery.all();
        },
        insertActivo(data: Activo): number | bigint {
                const query = db.prepare(`INSERT INTO Activo (name, notes) VALUES(?, ?);`);
                const result = query.run(data.name, data.notes ?? null);
                return result.lastInsertRowid;
        },
        updateActivo(data: Activo): boolean {
                const query = db.prepare(`UPDATE Activo SET name=?,notes=? WHERE id=?;`);
                const result = query.run(data.name, data.notes ?? null, data.id);
                return result.changes === 1;
        },
        deleteActivo(id: number) {
                const query = db.prepare(`DELETE FROM Activo WHERE id=?;`);
                const result = query.run(id);
                return result.changes === 1;
        },


        findDesarrollo(id: number) {
                const query = db.prepare(`SELECT id, idActivo, ticket, title, notes FROM Desarrollo WHERE id=?;`);
                return query.get(id);
        },
        listDesarrollos() {
                const query = `SELECT id, idActivo, ticket, title, notes FROM Desarrollo  order by ticket;`;
                const readQuery = db.prepare(query);
                return readQuery.all();
        },
        insertDesarrollo(data: Desarrollo): number | bigint {
                const query = db.prepare(`INSERT INTO Desarrollo (idActivo, ticket, title, notes) VALUES(?, ?, ?, ?);`);
                const result = query.run(data.idActivo, data.ticket, data.title, data.notes ?? null);
                return result.lastInsertRowid;
        },
        updateDesarrollo(data: Desarrollo): boolean {
                const query = db.prepare(`UPDATE Desarrollo SET idActivo=?, ticket=?, title=?, notes=? WHERE id=?;`);
                const result = query.run(data.idActivo, data.ticket, data.title, data.notes ?? null, data.id);
                return result.changes === 1;
        },
        deleteDesarrollo(id: number) {
                const query = db.prepare(`DELETE FROM Desarrollo WHERE id=?;`);
                const result = query.run(id);
                return result.changes === 1;
        },


        listTipoTarea() {
                const query = `SELECT id, name FROM TipoTarea;`;
                const readQuery = db.prepare(query);
                return readQuery.all();
        },
        listTareas(fecha: Date) {
                let unixTimestamp = toUnixTime(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
                const query = db.prepare(`SELECT id, idDesarrollo, idTipoTarea, startDate, endDate, pause, notes FROM Tarea WHERE DATE(startDate,'unixepoch') = DATE(?,'unixepoch') ORDER BY startDate;`);
                return query.all(unixTimestamp);
        },
        findTareas: function (id: number) {
                const query = db.prepare(`SELECT id, idDesarrollo, idTipoTarea, startDate, endDate, pause, notes FROM Tarea WHERE id=?;`);
                return query.get(id);
        },
        insertTarea: function (data: Tarea): number | bigint {
                const query = db.prepare(`INSERT INTO Tarea (idDesarrollo, idTipoTarea, startDate, endDate, pause, notes) VALUES(?, ?, ?, ?, ?, ?);`);
                const result = query.run(data.idDesarrollo, data.idTipoTarea, data.startDate, data.endDate ?? null, data.pause ?? null, data.notes ?? null);
                return result.lastInsertRowid;                
        },
        updateTarea: function (data: Tarea): boolean {
                const query = db.prepare(`UPDATE Tarea SET idDesarrollo=?, idTipoTarea=?, startDate=?, endDate=?, pause=?, notes=? WHERE id=?;`);
                const result = query.run(data.idDesarrollo, data.idTipoTarea, data.startDate, data.endDate ?? null, data.pause ?? null, data.notes ?? null, data.id);
                return result.changes === 1;
                
        },
        deleteTarea: function (id: number): boolean {
                const query = db.prepare(`DELETE FROM Tarea WHERE id=?;`);
                const result = query.run(id);
                return result.changes === 1;
        },

        tareasPorDesarrollo: function(start: Date, end: Date){
                let unixStartTimestamp = toUnixTime(start.getFullYear(), start.getMonth(), start.getDate());
                let unixEndTimestamp = toUnixTime(end.getFullYear(), end.getMonth(), end.getDate());
                const query = db.prepare(`Select IdDesarrollo, Ticket, Title, TaskDate, HoursConsumed, notes from TareasPorDesarrollo WHERE TaskDate >= DATE(?,'unixepoch') AND TaskDate <= DATE(?,'unixepoch') ORDER BY TaskDate, Ticket;`);
                return query.all(unixStartTimestamp, unixEndTimestamp);
        }
}

const toUnixTime = (year: number, month: number, day: number) => {
        const date = new Date(Date.UTC(year, month, day));
        return Math.floor(date.getTime() / 1000);
};