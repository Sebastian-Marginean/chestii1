import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.comentariu.deleteMany({});
  await prisma.atribuireTask.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.utilizator.deleteMany({});

  for (let i = 0; i < 5000; i++) {
    await prisma.utilizator.create({
      data: {
        numeUtilizator: `utilizator${i}`,
        parola: "test123",
        mail: `utilizator${i}@test.com`,
      },
    });
  }
  await prisma.$disconnect();
}
main();
