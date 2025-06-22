"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controloriDeCautare_1 = require("../controlorii/controloriDeCautare");
const router = (0, express_1.Router)();
// Ruta pentru cautari
router.get("/", controloriDeCautare_1.cauta);
exports.default = router;
