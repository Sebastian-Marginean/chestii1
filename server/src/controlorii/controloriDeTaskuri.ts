import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtinerea task-urilor dintr-un proiect
export const getTaskuri = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { proiectId } = req.query;

  let where: any = {};
  if (proiectId !== undefined && proiectId !== null && proiectId !== "") {
    where.proiectId = Number(proiectId);
  }

  const taskuri = await prisma.task.findMany({
    where,
    include: {
      autor: true,
      utilizatorAsignat: true,
      comentarii: true,
    },
  });

  res.json(taskuri);
};

// Crearea unui task nou
export const creareTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    titlu,
    descriere,
    status,
    prioritate,
    tags,
    dataInceput,
    dataLimita,
    points,
    proiectId,
    autorUtilizatorId,
    utilizatorAsignatId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        titlu,
        descriere,
        status,
        prioritate,
        tags,
        dataInceput,
        dataLimita,
        points,
        proiectId,
        autorUtilizatorId,
        utilizatorAsignatId,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Eroare la crearea taskului: ${error.message}` });
  }
};

// Actualizarea statusului unui task
export const actualizareStatusTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const taskActualizat = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(taskActualizat);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Eroare la actualizarea taskului: ${error.message}` });
  }
};

// Actualizarea unui task
export const actualizareTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const {
    titlu,
    descriere,
    status,
    prioritate,
    tags,
    dataInceput,
    dataLimita,
    autorUtilizatorId,
    utilizatorAsignatId,
  } = req.body;
  try {
    const taskActualizat = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        titlu,
        descriere,
        status,
        prioritate,
        tags,
        dataInceput,
        dataLimita,
        autorUtilizatorId,
        utilizatorAsignatId,
      },
    });
    res.json(taskActualizat);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Eroare la actualizarea taskului: ${error.message}` });
  }
};

// Ștergerea unui task
export const stergeTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    // Șterge toate comentariile asociate taskului
    await prisma.comentariu.deleteMany({
      where: { taskId: Number(taskId) },
    });
    // Șterge taskul
    await prisma.task.delete({
      where: { id: Number(taskId) },
    });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Eroare la ștergerea taskului!" });
  }
};

// Adăugarea unui comentariu la un task
export const adaugaComentariu = async (req: Request, res: Response) => {
  const { text, taskId, utilizatorId } = req.body;
  console.log("Comentariu primit:", { text, taskId, utilizatorId }); // <-- adaugă asta
  if (!text || !taskId || !utilizatorId) {
    return res.status(400).json({ message: "Date lipsă!" });
  }
  try {
    const comentariu = await prisma.comentariu.create({
      data: {
        text: req.body.text,
        taskId: req.body.taskId,
        utilizatorId: req.body.utilizatorId,
        // fără id!
      },
    });
    res.status(201).json(comentariu);
  } catch (error) {
    console.error(error); // <-- adaugă asta pentru a vedea eroarea reală
    res.status(500).json({ message: "Eroare la adăugare comentariu!" });
  }
};

// Ștergerea unui comentariu
export const stergeComentariu = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.comentariu.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Eroare la ștergere comentariu!" });
  }
};
