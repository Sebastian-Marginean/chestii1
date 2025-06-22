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
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
// Stergerea tuturor datelor din tabele
function stergeToateDatele(orderedFileNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const numeModele = orderedFileNames.map((numeFisier) => {
            // Numele modelului din numele fisierului
            const numeModel = path_1.default.basename(numeFisier, path_1.default.extname(numeFisier));
            return numeModel.charAt(0).toUpperCase() + numeModel.slice(1);
        });
        // Stergem datele din fiecare model
        for (const numeModel of numeModele) {
            const model = prisma[numeModel];
            try {
                yield model.deleteMany({});
                console.log(`Datele sunt sterse din ${numeModel}`);
            }
            catch (error) {
                console.error(`Eroare la stergerea datelor din ${numeModel}:`, error);
            }
        }
    });
}
// Functia pentru popularea bazei de date
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Path-ul directorului
        const pathDirector = path_1.default.join(__dirname, "datePtSQL");
        // Lista fisierelor JSON in ordinea corecta pentru inserare
        const orderedFileNames = [
            "echipa.json",
            "proiect.json",
            "echipaProiect.json",
            "utilizator.json",
            "task.json",
            "comentariu.json",
            "atribuireTask.json",
        ];
        // Stergem toate datele existente in tabele
        yield stergeToateDatele(orderedFileNames);
        // Parcurgem fiecare fisier JSON si inseram datele in baza de date
        for (const numeFisier of orderedFileNames) {
            const pathFisier = path_1.default.join(pathDirector, numeFisier);
            const datePtSQL = JSON.parse(fs_1.default.readFileSync(pathFisier, "utf-8"));
            const numeModel = path_1.default.basename(numeFisier, path_1.default.extname(numeFisier));
            const model = prisma[numeModel];
            try {
                for (const data of datePtSQL) {
                    yield model.create({ data });
                }
                console.log(`Initializat ${numeModel} cu date din ${numeFisier}`);
            }
            catch (error) {
                console.error(`Eroare la initializarea datelor pentru ${numeModel}:`, error);
            }
        }
    });
}
// Apelam functia si ne asiguram ca, conexiunea la baza de date este inchisa la final
main()
    .catch((e) => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
