import { Router } from "express";
import { creareProiect, getProiect } from "../controlorii/controloriDeProiecte";

const router = Router();

// Ruta pentru proiecte
router.get("/", getProiect);

// Ruta pentru a crea un proiect
router.post("/", creareProiect);

export default router;
