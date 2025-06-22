-- CreateTable
CREATE TABLE "Proiect" (
    "id" SERIAL NOT NULL,
    "nume" TEXT NOT NULL,
    "descriere" TEXT,
    "dataInceput" TIMESTAMP(3),
    "dataLimita" TIMESTAMP(3),

    CONSTRAINT "Proiect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilizator" (
    "id" SERIAL NOT NULL,
    "numeUtilizator" TEXT NOT NULL,
    "pozaProfilUrl" TEXT,
    "echipaId" INTEGER,
    "parola" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "functiaUtilizatorului" TEXT,
    "echipaUtilizatorului" TEXT,

    CONSTRAINT "Utilizator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Echipa" (
    "id" SERIAL NOT NULL,
    "numeEchipa" TEXT NOT NULL,
    "produsAdminId" INTEGER,
    "proiectManagerId" INTEGER,

    CONSTRAINT "Echipa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "titlu" TEXT NOT NULL,
    "descriere" TEXT,
    "status" TEXT,
    "tags" TEXT,
    "prioritate" TEXT,
    "dataInceput" TIMESTAMP(3),
    "dataLimita" TIMESTAMP(3),
    "proiectId" INTEGER NOT NULL,
    "points" INTEGER,
    "autorUtilizatorId" INTEGER NOT NULL,
    "utilizatorAsignatId" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EchipaProiect" (
    "id" SERIAL NOT NULL,
    "echipaId" INTEGER NOT NULL,
    "proiectId" INTEGER NOT NULL,

    CONSTRAINT "EchipaProiect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentariu" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "utilizatorId" INTEGER NOT NULL,

    CONSTRAINT "Comentariu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtribuireTask" (
    "id" SERIAL NOT NULL,
    "utilizatorId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "AtribuireTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilizator_numeUtilizator_key" ON "Utilizator"("numeUtilizator");

-- CreateIndex
CREATE UNIQUE INDEX "Utilizator_mail_key" ON "Utilizator"("mail");

-- AddForeignKey
ALTER TABLE "Utilizator" ADD CONSTRAINT "Utilizator_echipaId_fkey" FOREIGN KEY ("echipaId") REFERENCES "Echipa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_proiectId_fkey" FOREIGN KEY ("proiectId") REFERENCES "Proiect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_autorUtilizatorId_fkey" FOREIGN KEY ("autorUtilizatorId") REFERENCES "Utilizator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_utilizatorAsignatId_fkey" FOREIGN KEY ("utilizatorAsignatId") REFERENCES "Utilizator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EchipaProiect" ADD CONSTRAINT "EchipaProiect_echipaId_fkey" FOREIGN KEY ("echipaId") REFERENCES "Echipa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EchipaProiect" ADD CONSTRAINT "EchipaProiect_proiectId_fkey" FOREIGN KEY ("proiectId") REFERENCES "Proiect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentariu" ADD CONSTRAINT "Comentariu_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentariu" ADD CONSTRAINT "Comentariu_utilizatorId_fkey" FOREIGN KEY ("utilizatorId") REFERENCES "Utilizator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtribuireTask" ADD CONSTRAINT "AtribuireTask_utilizatorId_fkey" FOREIGN KEY ("utilizatorId") REFERENCES "Utilizator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtribuireTask" ADD CONSTRAINT "AtribuireTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
