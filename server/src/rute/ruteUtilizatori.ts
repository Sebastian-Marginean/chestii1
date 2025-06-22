import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  creareTask,
  getTaskuri,
  actualizareStatusTask,
} from "../controlorii/controloriDeTaskuri";
import { getUtilizatori } from "../controlorii/controloriDeUtilizatori";
import multer from "multer";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // păstrează numele original
  },
});

const upload = multer({ storage });

// Ruta pentru lista de utilizatori
router.get("/", getUtilizatori);

// Ruta pentru detalii utilizator
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const utilizator = await prisma.utilizator.findUnique({
      where: { mail: email },
    });
    if (!utilizator)
      return res.status(404).json({ message: "Utilizator inexistent!" });
    res.json({ utilizator });
  } catch (err) {
    res.status(500).json({ message: "Eroare la preluare utilizator!" });
  }
});

// Ruta pentru update utilizator (fără Multer, fără upload)
router.put("/", async (req, res) => {
  console.log("Cerere update:", req.body); // vezi exact ce primești!
  const { email, username, numeEchipa, numeRol, pozaProfilUrl } = req.body;
  try {
    const utilizator = await prisma.utilizator.update({
      where: { mail: email },
      data: {
        numeUtilizator: username,
        echipaUtilizatorului: numeEchipa,
        functiaUtilizatorului: numeRol,
        pozaProfilUrl: pozaProfilUrl || undefined,
      },
    });
    res.json({ message: "Date actualizate!", utilizator });
  } catch (err) {
    console.error("Eroare la update:", err); // vezi eroarea completă în terminal!
    res.status(500).json({ message: "Eroare la actualizare!" });
  }
});

router.post("/", upload.single("poza"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Nicio imagine trimisă!" });
  res.json({ nume: req.file.originalname });
});

// Ruta pentru schimbarea parolei
router.put("/schimba-parola", async (req, res) => {
  const { email, parolaVeche, parolaNoua } = req.body;
  try {
    const utilizator = await prisma.utilizator.findUnique({
      where: { mail: email },
    });
    if (!utilizator)
      return res.status(404).json({ message: "Utilizator inexistent!" });
    if (utilizator.parola !== parolaVeche)
      return res.status(400).json({ message: "Parola veche incorectă!" });

    await prisma.utilizator.update({
      where: { mail: email },
      data: { parola: parolaNoua },
    });
    res.json({ message: "Parola a fost schimbată cu succes!" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la schimbare parolă!" });
  }
});

export default router;
