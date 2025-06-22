import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Caută utilizatorul după nume unic
  let utilizator = await prisma.utilizator.findUnique({
    where: { numeUtilizator: "utilizator1" },
  });
  if (!utilizator) {
    utilizator = await prisma.utilizator.create({
      data: {
        numeUtilizator: "utilizator1",
        parola: "test123",
        mail: "utilizator1@test.com",
      },
    });
  }

  // Caută proiectul după id (sau folosește findFirst după nume dacă nu ai id-ul)
  let proiect = await prisma.proiect.findUnique({ where: { id: 1 } });
  if (!proiect) {
    proiect = await prisma.proiect.create({
      data: {
        nume: "Proiect test 1",
        descriere: "Proiect pentru populare taskuri diverse",
      },
    });
  }

  const proiectId = proiect.id;
  const autorUtilizatorId = utilizator.id;
  const statusuri = ["Backlog", "In Progres", "Finalizat", "Blocat", "Arhivat"];
  for (let i = 0; i < 10000; i++) {
    await prisma.task.create({
      data: {
        titlu: `Task special ${i}`,
        status: statusuri[i % statusuri.length],
        proiectId,
        autorUtilizatorId,
        prioritate: "Medie",
      },
    });
  }
  await prisma.$disconnect();
}
main();
