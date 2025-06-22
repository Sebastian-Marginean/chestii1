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

  // Caută proiectul după nume unic
  let proiect = await prisma.proiect.findFirst({
    where: { nume: "Proiect test 1" },
  });
  if (!proiect) {
    proiect = await prisma.proiect.create({
      data: {
        nume: "Proiect test 1",
        descriere: "Proiect pentru populare taskuri",
      },
    });
  }

  for (let i = 0; i < 50000; i++) {
    await prisma.task.create({
      data: {
        titlu: `Task Kanban ${i}`,
        status: "Backlog",
        proiectId: proiect.id,
        autorUtilizatorId: utilizator.id,
        prioritate: "Medie",
      },
    });
  }
  await prisma.$disconnect();
}
main();
