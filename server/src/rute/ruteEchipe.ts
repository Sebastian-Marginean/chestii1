import { Router } from "express";
import { getEchipe } from "../controlorii/controloriDeEchipe";

const router = Router();

// Ruta pentru lista de echipe
router.get("/", getEchipe);

export default router;
