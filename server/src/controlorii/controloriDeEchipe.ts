import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtinerea echipelor
export const getEchipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const echipe = await prisma.echipa.findMany();

    const echipeCuNumeUtilizatori = await Promise.all(
      echipe.map(async (echipa: any) => {
        const produsOwner = await prisma.utilizator.findUnique({
          where: { id: echipa.produsAdminId },
          select: { numeUtilizator: true },
        });

        const proiectManager = await prisma.utilizator.findUnique({
          where: { id: echipa.proiectManagerId },
          select: { numeUtilizator: true },
        });

        return {
          ...echipa,
          produsOwnerNumeUtilizator: produsOwner?.numeUtilizator,
          proiectManagerNumeUtilizator: proiectManager?.numeUtilizator,
        };
      })
    );

    res.json(echipeCuNumeUtilizatori);
  } catch (error: any) {
    res.status(500).json({
      message: `Eroare la preluarea echipelor: ${error.message}`,
    });
  }
};
