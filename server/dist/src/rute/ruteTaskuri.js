"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controloriDeTaskuri_1 = require("../controlorii/controloriDeTaskuri");
const router = (0, express_1.Router)();
// Ruta pentru lista de taskuri
router.get("/", controloriDeTaskuri_1.getTaskuri);
// Ruta pentru crearea unui task
router.post("/", controloriDeTaskuri_1.creareTask);
// Ruta pentru actualizarea statusului unui task
router.patch("/:taskId/status", controloriDeTaskuri_1.actualizareStatusTask);
// Ruta pentru actualizarea unui task
router.put("/:taskId", controloriDeTaskuri_1.actualizareTask);
// Ruta pentru ștergerea unui task
router.delete("/:taskId", controloriDeTaskuri_1.stergeTask);
// Ruta pentru adăugarea unui comentariu
router.post("/comentarii", controloriDeTaskuri_1.adaugaComentariu);
// Ruta pentru ștergerea unui comentariu
router.delete("/comentarii/:id", controloriDeTaskuri_1.stergeComentariu);
exports.default = router;
