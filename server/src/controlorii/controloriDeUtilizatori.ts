import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtinerea utilizatorilor dintr-un proiect
export const getUtilizatori = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const utilizatori = await prisma.utilizator.findMany();
    res.json(utilizatori);
  } catch (error: any) {
    res.status(500).json({ message: "Eroare la preluarea utilizatorilor!" });
  }
};
