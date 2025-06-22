"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stergeComentariu = exports.adaugaComentariu = exports.stergeTask = exports.actualizareTask = exports.actualizareStatusTask = exports.creareTask = exports.getTaskuri = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtinerea task-urilor dintr-un proiect
const getTaskuri = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { proiectId } = req.query;
    let where = {};
    if (proiectId !== undefined && proiectId !== null && proiectId !== "") {
        where.proiectId = Number(proiectId);
    }
    const taskuri = yield prisma.task.findMany({
        where,
        include: {
            autor: true,
            utilizatorAsignat: true,
            comentarii: true,
        },
    });
    res.json(taskuri);
});
exports.getTaskuri = getTaskuri;
// Crearea unui task nou
const creareTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titlu, descriere, status, prioritate, tags, dataInceput, dataLimita, points, proiectId, autorUtilizatorId, utilizatorAsignatId, } = req.body;
    try {
        const newTask = yield prisma.task.create({
            data: {
                titlu,
                descriere,
                status,
                prioritate,
                tags,
                dataInceput,
                dataLimita,
                points,
                proiectId,
                autorUtilizatorId,
                utilizatorAsignatId,
            },
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Eroare la crearea taskului: ${error.message}` });
    }
});
exports.creareTask = creareTask;
// Actualizarea statusului unui task
const actualizareStatusTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const taskActualizat = yield prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status: status,
            },
        });
        res.json(taskActualizat);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Eroare la actualizarea taskului: ${error.message}` });
    }
});
exports.actualizareStatusTask = actualizareStatusTask;
// Actualizarea unui task
const actualizareTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { titlu, descriere, status, prioritate, tags, dataInceput, dataLimita, autorUtilizatorId, utilizatorAsignatId, } = req.body;
    try {
        const taskActualizat = yield prisma.task.update({
            where: { id: Number(taskId) },
            data: {
                titlu,
                descriere,
                status,
                prioritate,
                tags,
                dataInceput,
                dataLimita,
                autorUtilizatorId,
                utilizatorAsignatId,
            },
        });
        res.json(taskActualizat);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Eroare la actualizarea taskului: ${error.message}` });
    }
});
exports.actualizareTask = actualizareTask;
// Ștergerea unui task
const stergeTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        // Șterge toate comentariile asociate taskului
        yield prisma.comentariu.deleteMany({
            where: { taskId: Number(taskId) },
        });
        // Șterge taskul
        yield prisma.task.delete({
            where: { id: Number(taskId) },
        });
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la ștergerea taskului!" });
    }
});
exports.stergeTask = stergeTask;
// Adăugarea unui comentariu la un task
const adaugaComentariu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, taskId, utilizatorId } = req.body;
    console.log("Comentariu primit:", { text, taskId, utilizatorId }); // <-- adaugă asta
    if (!text || !taskId || !utilizatorId) {
        return res.status(400).json({ message: "Date lipsă!" });
    }
    try {
        const comentariu = yield prisma.comentariu.create({
            data: {
                text: req.body.text,
                taskId: req.body.taskId,
                utilizatorId: req.body.utilizatorId,
                // fără id!
            },
        });
        res.status(201).json(comentariu);
    }
    catch (error) {
        console.error(error); // <-- adaugă asta pentru a vedea eroarea reală
        res.status(500).json({ message: "Eroare la adăugare comentariu!" });
    }
});
exports.adaugaComentariu = adaugaComentariu;
// Ștergerea unui comentariu
const stergeComentariu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.comentariu.delete({ where: { id: Number(id) } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ message: "Eroare la ștergere comentariu!" });
    }
});
exports.stergeComentariu = stergeComentariu;
