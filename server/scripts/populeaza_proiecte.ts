import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.echipaProiect.deleteMany({}); // Șterge întâi echipele de proiect
  await prisma.proiect.deleteMany({}); // Apoi poți șterge proiectele

  for (let i = 0; i < 1000; i++) {
    await prisma.proiect.create({
      data: {
        nume: `Proiect test ${i}`,
        descriere: `Descriere proiect ${i}`,
      },
    });
  }
  await prisma.$disconnect();
}
main();
