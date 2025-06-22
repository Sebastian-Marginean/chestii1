import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { mail, parola } = req.body;
  try {
    const utilizator = await prisma.utilizator.findUnique({ where: { mail } });
    if (!utilizator || utilizator.parola !== parola) {
      return res.status(401).json({ message: "Date incorecte!" });
    }
    const { parola: _, ...utilizatorFaraParola } = utilizator;
    res.status(200).json({ utilizator: utilizatorFaraParola });
  } catch (err) {
    res.status(500).json({ message: "Eroare la autentificare!" });
  }
});

export default router;
