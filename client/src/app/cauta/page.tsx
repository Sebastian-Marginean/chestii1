"use client";
import Header from "@/componente/Header";
import ProiectCard from "@/componente/ProiectCard";
import TaskCard from "@/componente/TaskCard";
import UtilizatorCard from "@/componente/UtilizatorCard";
import { useCautaQuery } from "@/state/api";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Search, Users, Folder, ListChecks } from "lucide-react";

function Cauta() {
  const searchParams = useSearchParams();
  const termenDinQuery = searchParams.get("termen") || "";
  const [cautaTerm, setCautaTerm] = useState(termenDinQuery);

  // Actualizează inputul dacă se schimbă query-ul (navigare din Navbar)
  useEffect(() => {
    setCautaTerm(termenDinQuery);
  }, [termenDinQuery]);

  const {
    data: CautaRezultate,
    isLoading,
    isError,
  } = useCautaQuery(cautaTerm, {
    skip: cautaTerm.length < 3,
  });

  const handleCauta = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setCautaTerm(event.target.value);
  }, 500);

  useEffect(() => {
    return handleCauta.cancel;
  }, [handleCauta.cancel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-8">
      <div className="mb-8 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-300 p-6 text-center shadow-lg">
        <Header nume="Căutare inteligentă" />
        <p className="mt-2 text-lg text-white/90">
          Găsește rapid proiecte, task-uri sau utilizatori!
        </p>
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
            <input
              type="text"
              placeholder="Caută după nume, descriere, titlu..."
              className="w-full rounded-lg bg-white/90 px-10 py-3 text-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={cautaTerm}
              onChange={(e) => {
                setCautaTerm(e.target.value);
                handleCauta(e);
              }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-4">
        {isLoading && (
          <p className="text-center text-indigo-700">Se încarcă...</p>
        )}
        {isError && (
          <p className="text-center text-red-500">
            Eroare la procesarea căutării
          </p>
        )}
        {!isLoading && !isError && CautaRezultate && (
          <div className="space-y-8">
            {CautaRezultate.tasks && CautaRezultate.tasks.length > 0 && (
              <div>
                <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-indigo-700">
                  <ListChecks className="h-6 w-6" /> Task-uri
                </h2>
                <div className="grid gap-4 transition-colors md:grid-cols-2">
                  {CautaRezultate.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {CautaRezultate.proiecte && CautaRezultate.proiecte.length > 0 && (
              <div>
                <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-indigo-700">
                  <Folder className="h-6 w-6" /> Proiecte
                </h2>
                <div className="grid gap-4 transition-colors md:grid-cols-2">
                  {CautaRezultate.proiecte.map((proiect) => (
                    <ProiectCard key={proiect.id} proiect={proiect} />
                  ))}
                </div>
              </div>
            )}

            {CautaRezultate.utilizatori &&
              CautaRezultate.utilizatori.length > 0 && (
                <div>
                  <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-indigo-700">
                    <Users className="h-6 w-6" /> Utilizatori
                  </h2>
                  <div className="grid gap-4 transition-colors md:grid-cols-2">
                    {CautaRezultate.utilizatori.map((utilizator) => (
                      <UtilizatorCard
                        key={utilizator.id} // <-- modificat aici
                        utilizator={utilizator}
                      />
                    ))}
                  </div>
                </div>
              )}

            {!CautaRezultate.tasks?.length &&
              !CautaRezultate.proiecte?.length &&
              !CautaRezultate.utilizatori?.length && (
                <p className="text-center text-gray-500">
                  Niciun rezultat găsit.
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cauta;
