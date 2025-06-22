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
const controloriDeUtilizatori_1 = require("../controlorii/controloriDeUtilizatori");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../../public"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // păstrează numele original
    },
});
const upload = (0, multer_1.default)({ storage });
// Ruta pentru lista de utilizatori
router.get("/", controloriDeUtilizatori_1.getUtilizatori);
// Ruta pentru detalii utilizator
router.get("/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const utilizator = yield prisma.utilizator.findUnique({
            where: { mail: email },
        });
        if (!utilizator)
            return res.status(404).json({ message: "Utilizator inexistent!" });
        res.json({ utilizator });
    }
    catch (err) {
        res.status(500).json({ message: "Eroare la preluare utilizator!" });
    }
}));
// Ruta pentru update utilizator (fără Multer, fără upload)
router.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Cerere update:", req.body); // vezi exact ce primești!
    const { email, username, numeEchipa, numeRol, pozaProfilUrl } = req.body;
    try {
        const utilizator = yield prisma.utilizator.update({
            where: { mail: email },
            data: {
                numeUtilizator: username,
                echipaUtilizatorului: numeEchipa,
                functiaUtilizatorului: numeRol,
                pozaProfilUrl: pozaProfilUrl || undefined,
            },
        });
        res.json({ message: "Date actualizate!", utilizator });
    }
    catch (err) {
        console.error("Eroare la update:", err); // vezi eroarea completă în terminal!
        res.status(500).json({ message: "Eroare la actualizare!" });
    }
}));
router.post("/", upload.single("poza"), (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: "Nicio imagine trimisă!" });
    res.json({ nume: req.file.originalname });
});
// Ruta pentru schimbarea parolei
router.put("/schimba-parola", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, parolaVeche, parolaNoua } = req.body;
    try {
        const utilizator = yield prisma.utilizator.findUnique({
            where: { mail: email },
        });
        if (!utilizator)
            return res.status(404).json({ message: "Utilizator inexistent!" });
        if (utilizator.parola !== parolaVeche)
            return res.status(400).json({ message: "Parola veche incorectă!" });
        yield prisma.utilizator.update({
            where: { mail: email },
            data: { parola: parolaNoua },
        });
        res.json({ message: "Parola a fost schimbată cu succes!" });
    }
    catch (err) {
        res.status(500).json({ message: "Eroare la schimbare parolă!" });
    }
}));
exports.default = router;
