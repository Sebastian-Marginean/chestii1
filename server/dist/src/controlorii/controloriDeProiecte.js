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
exports.creareProiect = exports.getProiect = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtinerea listei de proiecte
const getProiect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proiecte = yield prisma.proiect.findMany();
        res.json(proiecte);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Eroare la preluarea proiectelor: ${error.message}` });
    }
});
exports.getProiect = getProiect;
// Crearea unui proiect nou
const creareProiect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nume, descriere, dataInceput, dataLimita } = req.body;
    try {
        const proiectNou = yield prisma.proiect.create({
            data: {
                nume,
                descriere,
                dataInceput,
                dataLimita,
            },
        });
        res.status(201).json(proiectNou);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Eroare la crearea proiectului: ${error.message}` });
    }
});
exports.creareProiect = creareProiect;
