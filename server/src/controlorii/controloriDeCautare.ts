import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const cauta = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { titlu: { contains: query as string } },
          { descriere: { contains: query as string } },
        ],
      },
    });

    const proiecte = await prisma.proiect.findMany({
      where: {
        OR: [
          { nume: { contains: query as string } },
          { descriere: { contains: query as string } },
        ],
      },
    });

    const utilizatori = await prisma.utilizator.findMany({
      where: {
        OR: [{ numeUtilizator: { contains: query as string } }],
      },
      select: {
        id: true,
        numeUtilizator: true,
        pozaProfilUrl: true, // ← adaugă acest câmp
      },
    });
    res.json({ tasks, proiecte, utilizatori });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Eroare la preluarea cautarilor: ${error.message}` });
  }
};
