import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtinerea listei de proiecte
export const getProiect = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const proiecte = await prisma.proiect.findMany();
    res.json(proiecte);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Eroare la preluarea proiectelor: ${error.message}` });
  }
};

// Crearea unui proiect nou
export const creareProiect = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nume, descriere, dataInceput, dataLimita } = req.body;
  try {
    const proiectNou = await prisma.proiect.create({
      data: {
        nume,
        descriere,
        dataInceput,
        dataLimita,
      },
    });
    res.status(201).json(proiectNou);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Eroare la crearea proiectului: ${error.message}` });
  }
};
