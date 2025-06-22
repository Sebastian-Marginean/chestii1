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

  // Caută orice task existent sau creează unul nou
  let task = await prisma.task.findFirst();
  if (!task) {
    // Creează proiectul dacă nu există
    let proiect = await prisma.proiect.findFirst();
    if (!proiect) {
      proiect = await prisma.proiect.create({
        data: {
          nume: "Proiect test 1",
          descriere: "Proiect pentru populare comentarii",
        },
      });
    }
    task = await prisma.task.create({
      data: {
        titlu: "Task test 1",
        status: "Backlog",
        proiectId: proiect.id,
        autorUtilizatorId: utilizator.id,
        prioritate: "Medie",
      },
    });
  }

  const taskId = task.id;
  const utilizatorId = utilizator.id;

  for (let i = 0; i < 50000; i++) {
    await prisma.comentariu.create({
      data: {
        text: `Comentariu test ${i}`,
        taskId,
        utilizatorId,
      },
    });
  }
  await prisma.$disconnect();
}
main();
