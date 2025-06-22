"use client";
import { useEffect, useState } from "react";
import {
  useGetUtilizatoriQuery,
  useGetTaskuriQuery,
  useGetProiecteQuery,
  Status,
  Task,
} from "@/state/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Header from "@/componente/Header";
import ModelAfisareTask from "@/app/proiecte/ModelAfisareTask";

const COLORS = [
  "#6366f1",
  "#22d3ee",
  "#f59e42",
  "#10b981",
  "#ef4444",
  "#a21caf",
];

export default function ActivitateaTa() {
  const [utilizatorCurent, setUtilizatorCurent] = useState<any>(null);
  const [taskSelectat, setTaskSelectat] = useState<Task | null>(null);
  const [modalDeschis, setModalDeschis] = useState(false);

  // Ia utilizatorul curent din localStorage
  useEffect(() => {
    const userLS = localStorage.getItem("utilizator");
    if (userLS) setUtilizatorCurent(JSON.parse(userLS));
  }, []);

  // Fetch date din store
  const { data: utilizatori = [], isLoading: loadingUtilizatori } =
    useGetUtilizatoriQuery();
  const { data: toateProiectele = [] } = useGetProiecteQuery();
  const { data: toateTaskurile = [], isLoading: loadingTaskuri } =
    useGetTaskuriQuery();

  // Găsește utilizatorul complet după email
  const utilizatorComplet = utilizatori.find(
    (u) => u.mail === utilizatorCurent?.email,
  );
  const idUtilizator = utilizatorComplet?.id;

  // Filtrează taskurile pentru utilizatorul curent
  const taskuri = toateTaskurile.filter(
    (task: Task) =>
      task.utilizatorAsignatId === idUtilizator ||
      task.autorUtilizatorId === idUtilizator,
  );

  // Proiecte asociate (din taskuri)
  const proiecteUnice = Array.from(
    new Map(
      taskuri
        .filter((task) => task.proiectId)
        .map((task) => {
          const proiect = toateProiectele.find((p) => p.id === task.proiectId);
          return proiect ? [proiect.id, proiect] : null;
        })
        .filter(Boolean) as [number, any][],
    ).values(),
  );

  // Statistici pentru grafice
  const statusCount: Record<string, number> = {};
  taskuri.forEach((t) => {
    const status = t.status || "Necunoscut";
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
  const statusData = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value,
  }));

  const proiecteCount: Record<string, number> = {};
  taskuri.forEach((t) => {
    const proiect = toateProiectele.find((p) => p.id === t.proiectId);
    if (proiect) {
      proiecteCount[proiect.nume] = (proiecteCount[proiect.nume] || 0) + 1;
    }
  });
  const proiecteData = Object.entries(proiecteCount).map(([name, value]) => ({
    name,
    value,
  }));

  if (loadingUtilizatori || loadingTaskuri || !utilizatorCurent)
    return <div className="p-8">Se încarcă datele...</div>;
  if (!utilizatorComplet)
    return (
      <div className="p-8 text-red-600">
        Nu există date pentru utilizatorul conectat.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-8">
      <Header nume="Activitatea ta" />
      <div className="mx-auto max-w-4xl rounded-xl bg-white/80 p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-indigo-700">
              Salut, {utilizatorComplet.numeUtilizator}!
            </h2>
            <p className="text-gray-600">Iată activitatea ta în platformă:</p>
          </div>
          <div className="flex items-center gap-3">
            {utilizatorComplet.pozaProfilUrl && (
              <img
                src={`/${utilizatorComplet.pozaProfilUrl}`}
                alt="Poza profil"
                className="h-16 w-16 rounded-full border-2 border-indigo-400 object-cover shadow"
              />
            )}
            <div>
              <div className="font-semibold text-indigo-800">
                {utilizatorComplet.numeUtilizator}
              </div>
              <div className="text-sm text-gray-500">
                {utilizatorComplet.functiaUtilizatorului}
              </div>
            </div>
          </div>
        </div>

        {/* Statistici rapide */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-indigo-100 p-6 text-center shadow">
            <div className="text-3xl font-bold text-indigo-700">
              {taskuri.length}
            </div>
            <div className="text-gray-700">Task-uri totale</div>
          </div>
          <div className="rounded-lg bg-blue-100 p-6 text-center shadow">
            <div className="text-3xl font-bold text-blue-700">
              {proiecteUnice.length}
            </div>
            <div className="text-gray-700">Proiecte implicate</div>
          </div>
          <div className="rounded-lg bg-green-100 p-6 text-center shadow">
            <div className="text-3xl font-bold text-green-700">
              {taskuri.filter((t) => t.status === Status.Finalizat).length}
            </div>
            <div className="text-gray-700">Task-uri finalizate</div>
          </div>
        </div>

        {/* Grafice */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold text-indigo-700">
              Distribuție taskuri pe status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#6366f1"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold text-indigo-700">
              Taskuri pe proiect
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={proiecteData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Listă taskuri */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-indigo-700">
            Task-urile tale
          </h3>
          {taskuri.length === 0 ? (
            <div className="text-gray-500">Nu ai taskuri asociate.</div>
          ) : (
            <ul className="divide-y divide-indigo-100">
              {taskuri.map((task) => (
                <li
                  key={task.id}
                  className="flex cursor-pointer flex-col py-3 transition hover:bg-indigo-50 md:flex-row md:items-center md:justify-between"
                  onClick={() => {
                    setTaskSelectat(task);
                    setModalDeschis(true);
                  }}
                >
                  <div>
                    <div className="font-semibold text-indigo-800">
                      {task.titlu}
                    </div>
                    <div className="text-sm text-gray-500">
                      {task.descriere}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 md:mt-0">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                      {task.status}
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {task.prioritate}
                    </span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {toateProiectele.find((p) => p.id === task.proiectId)
                        ?.nume || "Fără proiect"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal pentru afisarea detaliilor task-ului selectat */}
        {taskSelectat && modalDeschis && (
          <ModelAfisareTask
            task={taskSelectat}
            isOpen={modalDeschis}
            onClose={() => setModalDeschis(false)}
          />
        )}
      </div>
    </div>
  );
}
