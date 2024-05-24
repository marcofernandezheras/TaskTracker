"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const Database = require("better-sqlite3");
const path = require("path");
const dbPath = "C:/Proyectos/electron/TaskTracker/db/task-tracker.db";
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
exports.Manager = {
    findActivos(id) {
        const query = db.prepare(`SELECT id, name, notes FROM Activo WHERE id=?;`);
        return query.get(id);
    },
    listActivos() {
        const query = `SELECT id, name, notes FROM Activo order by name;`;
        const readQuery = db.prepare(query);
        return readQuery.all();
    },
    insertActivo(data) {
        var _a;
        const query = db.prepare(`INSERT INTO Activo (name, notes) VALUES(?, ?);`);
        const result = query.run(data.name, (_a = data.notes) !== null && _a !== void 0 ? _a : null);
        return result.lastInsertRowid;
    },
    updateActivo(data) {
        var _a;
        const query = db.prepare(`UPDATE Activo SET name=?,notes=? WHERE id=?;`);
        const result = query.run(data.name, (_a = data.notes) !== null && _a !== void 0 ? _a : null, data.id);
        return result.changes === 1;
    },
    deleteActivo(id) {
        const query = db.prepare(`DELETE FROM Activo WHERE id=?;`);
        const result = query.run(id);
        return result.changes === 1;
    },
    findDesarrollo(id) {
        const query = db.prepare(`SELECT id, idActivo, ticket, title, notes FROM Desarrollo WHERE id=?;`);
        return query.get(id);
    },
    listDesarrollos() {
        const query = `SELECT id, idActivo, ticket, title, notes FROM Desarrollo  order by ticket;`;
        const readQuery = db.prepare(query);
        return readQuery.all();
    },
    insertDesarrollo(data) {
        var _a;
        const query = db.prepare(`INSERT INTO Desarrollo (idActivo, ticket, title, notes) VALUES(?, ?, ?, ?);`);
        const result = query.run(data.idActivo, data.ticket, data.title, (_a = data.notes) !== null && _a !== void 0 ? _a : null);
        return result.lastInsertRowid;
    },
    updateDesarrollo(data) {
        var _a;
        const query = db.prepare(`UPDATE Desarrollo SET idActivo=?, ticket=?, title=?, notes=? WHERE id=?;`);
        const result = query.run(data.idActivo, data.ticket, data.title, (_a = data.notes) !== null && _a !== void 0 ? _a : null, data.id);
        return result.changes === 1;
    },
    deleteDesarrollo(id) {
        const query = db.prepare(`DELETE FROM Desarrollo WHERE id=?;`);
        const result = query.run(id);
        return result.changes === 1;
    },
    listTipoTarea() {
        const query = `SELECT id, name FROM TipoTarea;`;
        const readQuery = db.prepare(query);
        return readQuery.all();
    },
    listTareas(fecha) {
        let unixTimestamp = toUnixTime(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
        const query = db.prepare(`SELECT id, idDesarrollo, idTipoTarea, startDate, endDate, pause, notes FROM Tarea WHERE DATE(startDate,'unixepoch') = DATE(?,'unixepoch') ORDER BY startDate;`);
        return query.all(unixTimestamp);
    },
    findTareas: function (id) {
        const query = db.prepare(`SELECT id, idDesarrollo, idTipoTarea, startDate, endDate, pause, notes FROM Tarea WHERE id=?;`);
        return query.get(id);
    },
    insertTarea: function (data) {
        var _a, _b, _c;
        const query = db.prepare(`INSERT INTO Tarea (idDesarrollo, idTipoTarea, startDate, endDate, pause, notes) VALUES(?, ?, ?, ?, ?, ?);`);
        const result = query.run(data.idDesarrollo, data.idTipoTarea, data.startDate, (_a = data.endDate) !== null && _a !== void 0 ? _a : null, (_b = data.pause) !== null && _b !== void 0 ? _b : null, (_c = data.notes) !== null && _c !== void 0 ? _c : null);
        return result.lastInsertRowid;
    },
    updateTarea: function (data) {
        var _a, _b, _c;
        const query = db.prepare(`UPDATE Tarea SET idDesarrollo=?, idTipoTarea=?, startDate=?, endDate=?, pause=?, notes=? WHERE id=?;`);
        const result = query.run(data.idDesarrollo, data.idTipoTarea, data.startDate, (_a = data.endDate) !== null && _a !== void 0 ? _a : null, (_b = data.pause) !== null && _b !== void 0 ? _b : null, (_c = data.notes) !== null && _c !== void 0 ? _c : null, data.id);
        return result.changes === 1;
    },
    deleteTarea: function (id) {
        const query = db.prepare(`DELETE FROM Tarea WHERE id=?;`);
        const result = query.run(id);
        return result.changes === 1;
    },
    tareasPorDesarrollo: function (start, end) {
        let unixStartTimestamp = toUnixTime(start.getFullYear(), start.getMonth(), start.getDate());
        let unixEndTimestamp = toUnixTime(end.getFullYear(), end.getMonth(), end.getDate());
        const query = db.prepare(`Select IdDesarrollo, Ticket, Title, TaskDate, HoursConsumed, notes from TareasPorDesarrollo WHERE TaskDate >= DATE(?,'unixepoch') AND TaskDate <= DATE(?,'unixepoch') ORDER BY TaskDate, Ticket;`);
        return query.all(unixStartTimestamp, unixEndTimestamp);
    }
};
const toUnixTime = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    return Math.floor(date.getTime() / 1000);
};
//# sourceMappingURL=DBManager.js.map