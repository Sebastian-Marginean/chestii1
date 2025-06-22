import { Router } from "express";
import { cauta } from "../controlorii/controloriDeCautare";

const router = Router();

// Ruta pentru cautari
router.get("/", cauta);

export default router;
