"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controloriDeEchipe_1 = require("../controlorii/controloriDeEchipe");
const router = (0, express_1.Router)();
// Ruta pentru lista de echipe
router.get("/", controloriDeEchipe_1.getEchipe);
exports.default = router;
