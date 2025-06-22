import { Router } from "express";
import {
  creareTask,
  getTaskuri,
  actualizareStatusTask,
  actualizareTask,
  stergeTask, // adaugă importul
  adaugaComentariu,
  stergeComentariu,
} from "../controlorii/controloriDeTaskuri";

const router = Router();

// Ruta pentru lista de taskuri
router.get("/", getTaskuri);

// Ruta pentru crearea unui task
router.post("/", creareTask);

// Ruta pentru actualizarea statusului unui task
router.patch("/:taskId/status", actualizareStatusTask);

// Ruta pentru actualizarea unui task
router.put("/:taskId", actualizareTask);

// Ruta pentru ștergerea unui task
router.delete("/:taskId", stergeTask);

// Ruta pentru adăugarea unui comentariu
router.post("/comentarii", adaugaComentariu);

// Ruta pentru ștergerea unui comentariu
router.delete("/comentarii/:id", stergeComentariu);

export default router;
