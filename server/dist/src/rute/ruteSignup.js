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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mail, parola } = req.body;
    try {
        console.log("Cerere primita pentru signup:", mail);
        const existing = yield prisma.utilizator.findUnique({ where: { mail } });
        if (existing) {
            return res.status(400).json({ message: "Email deja folosit!" });
        }
        const pozaProfilUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const utilizator = yield prisma.utilizator.create({
            data: {
                mail,
                parola,
                numeUtilizator: mail.split("@")[0],
                pozaProfilUrl,
                echipaId: 1,
                functiaUtilizatorului: "Web Crawler",
                echipaUtilizatorului: "Data Team",
            },
        });
        console.log("Utilizator creat:", utilizator);
        res
            .status(201)
            .json({ message: "Utilizator creat cu succes!", utilizator });
    }
    catch (err) {
        console.error("Eroare la crearea contului:", err);
        res.status(500).json({ message: "Eroare la crearea contului!" });
    }
}));
exports.default = router;
