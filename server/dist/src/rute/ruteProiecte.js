"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controloriDeProiecte_1 = require("../controlorii/controloriDeProiecte");
const router = (0, express_1.Router)();
// Ruta pentru proiecte
router.get("/", controloriDeProiecte_1.getProiect);
// Ruta pentru a crea un proiect
router.post("/", controloriDeProiecte_1.creareProiect);
exports.default = router;
