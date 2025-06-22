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
exports.getEchipe = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtinerea echipelor
const getEchipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const echipe = yield prisma.echipa.findMany();
        const echipeCuNumeUtilizatori = yield Promise.all(echipe.map((echipa) => __awaiter(void 0, void 0, void 0, function* () {
            const produsOwner = yield prisma.utilizator.findUnique({
                where: { id: echipa.produsAdminId },
                select: { numeUtilizator: true },
            });
            const proiectManager = yield prisma.utilizator.findUnique({
                where: { id: echipa.proiectManagerId },
                select: { numeUtilizator: true },
            });
            return Object.assign(Object.assign({}, echipa), { produsOwnerNumeUtilizator: produsOwner === null || produsOwner === void 0 ? void 0 : produsOwner.numeUtilizator, proiectManagerNumeUtilizator: proiectManager === null || proiectManager === void 0 ? void 0 : proiectManager.numeUtilizator });
        })));
        res.json(echipeCuNumeUtilizatori);
    }
    catch (error) {
        res.status(500).json({
            message: `Eroare la preluarea echipelor: ${error.message}`,
        });
    }
});
exports.getEchipe = getEchipe;
