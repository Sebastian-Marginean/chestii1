import express from "express";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { mail, parola } = req.body;
  try {
    console.log("Cerere primita pentru signup:", mail);
    const existing = await prisma.utilizator.findUnique({ where: { mail } });
    if (existing) {
      return res.status(400).json({ message: "Email deja folosit!" });
    }

    const pozaProfilUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const utilizator = await prisma.utilizator.create({
      data: {
        mail,
        parola,
        numeUtilizator: mail.split("@")[0],
        pozaProfilUrl,
        echipaId: 1,
        functiaUtilizatorului: "Web Crawler",
        echipaUtilizatorului: "Data Team",
      },
    });
    console.log("Utilizator creat:", utilizator);
    res
      .status(201)
      .json({ message: "Utilizator creat cu succes!", utilizator });
  } catch (err) {
    console.error("Eroare la crearea contului:", err);
    res.status(500).json({ message: "Eroare la crearea contului!" });
  }
});

export default router;
