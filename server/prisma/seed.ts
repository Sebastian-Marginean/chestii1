import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Stergerea tuturor datelor din tabele
async function stergeToateDatele(orderedFileNames: string[]) {
  const numeModele = orderedFileNames.map((numeFisier) => {
    // Numele modelului din numele fisierului
    const numeModel = path.basename(numeFisier, path.extname(numeFisier));
    return numeModel.charAt(0).toUpperCase() + numeModel.slice(1);
  });

  // Stergem datele din fiecare model
  for (const numeModel of numeModele) {
    const model: any = prisma[numeModel as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Datele sunt sterse din ${numeModel}`);
    } catch (error) {
      console.error(`Eroare la stergerea datelor din ${numeModel}:`, error);
    }
  }
}

// Functia pentru popularea bazei de date
async function main() {
  // Path-ul directorului
  const pathDirector = path.join(__dirname, "datePtSQL");

  // Lista fisierelor JSON in ordinea corecta pentru inserare
  const orderedFileNames = [
    "echipa.json",
    "proiect.json",
    "echipaProiect.json",
    "utilizator.json",
    "task.json",
    "comentariu.json",
    "atribuireTask.json",
  ];

  // Stergem toate datele existente in tabele
  await stergeToateDatele(orderedFileNames);

  // Parcurgem fiecare fisier JSON si inseram datele in baza de date
  for (const numeFisier of orderedFileNames) {
    const pathFisier = path.join(pathDirector, numeFisier);
    const datePtSQL = JSON.parse(fs.readFileSync(pathFisier, "utf-8"));
    const numeModel = path.basename(numeFisier, path.extname(numeFisier));
    const model: any = prisma[numeModel as keyof typeof prisma];

    try {
      for (const data of datePtSQL) {
        await model.create({ data });
      }
      console.log(`Initializat ${numeModel} cu date din ${numeFisier}`);
    } catch (error) {
      console.error(
        `Eroare la initializarea datelor pentru ${numeModel}:`,
        error
      );
    }
  }
}

// Apelam functia si ne asiguram ca, conexiunea la baza de date este inchisa la final
main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
