import { Task, useGetTaskuriQuery } from "@/state/api";
import TaskCard from "@/componente/TaskCard";
import Header from "@/componente/Header";
import { Plus, Download } from "lucide-react";
import React from "react";

type Props = {
  id: string;
  setisModalNewTaskOpen: (deschis: boolean) => void;
};

// Funcție pentru export CSV
function exportTasksToCSV(tasks: Task[]) {
  if (!tasks?.length) return;
  const fields = [
    "id",
    "titlu",
    "descriere",
    "status",
    "prioritate",
    "dataInceput",
    "dataLimita",
  ];
  const header = fields.join(",");
  const rows = tasks.map((task) =>
    fields
      .map(
        (field) =>
          `"${String((task as any)[field] ?? "").replace(/"/g, '""')}"`,
      )
      .join(","),
  );
  const csvContent = [header, ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "taskuri.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const ListView = ({ id, setisModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTaskuriQuery({ proiectId: Number(id) });

  const [statusFiltru, setStatusFiltru] = React.useState("");
  const [prioritateFiltru, setPrioritateFiltru] = React.useState("");

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-indigo-700">
        Se încarcă taskurile...
      </div>
    );
  if (error || !tasks)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-red-500">
        Eroare la procesarea taskurilor
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-8">
      <div className="mb-8 rounded-lg border border-indigo-300 bg-gradient-to-r from-indigo-400 to-blue-300 p-6 shadow-lg">
        <Header nume="Lista Cu Task-uri" />
        <p className="mt-2 text-lg text-white/90">
          Vizualizează, filtrează și exportă rapid lista taskurilor tale.
        </p>
      </div>
      <div className="mx-auto max-w-5xl rounded-xl border border-indigo-200 bg-white/90 p-6 shadow-lg">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setisModalNewTaskOpen(true)}
          >
            <Plus size={18} />
            Adaugă un Task
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-indigo-400 bg-white px-4 py-2 text-indigo-700 transition-all hover:bg-indigo-50"
            onClick={() => {
              const filteredTasks =
                tasks?.filter(
                  (task) =>
                    (!statusFiltru || task.status === statusFiltru) &&
                    (!prioritateFiltru || task.prioritate === prioritateFiltru),
                ) || [];
              exportTasksToCSV(filteredTasks);
            }}
            disabled={
              !tasks?.some(
                (task) =>
                  (!statusFiltru || task.status === statusFiltru) &&
                  (!prioritateFiltru || task.prioritate === prioritateFiltru),
              )
            }
          >
            <Download size={18} />
            Exportă CSV
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-indigo-400 bg-white px-3 py-2 text-indigo-700"
            value={statusFiltru}
            onChange={(e) => setStatusFiltru(e.target.value)}
          >
            <option value="">Toate statusurile</option>
            <option value="De Facut">De Făcut</option>
            <option value="In Progres">În Progres</option>
            <option value="In Revizuire">În Revizuire</option>
            <option value="Finalizat">Finalizat</option>
            <option value="Blocat">Blocat</option>
          </select>
          <select
            className="rounded-md border border-indigo-400 bg-white px-3 py-2 text-indigo-700"
            value={prioritateFiltru}
            onChange={(e) => setPrioritateFiltru(e.target.value)}
          >
            <option value="">Toate prioritățile</option>
            <option value="Backlog">Backlog</option>
            <option value="Scazuta">Scăzută</option>
            <option value="Medie">Medie</option>
            <option value="Inalta">Inalta</option>
            <option value="Urgenta">Urgenta</option>
          </select>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {tasks
            ?.filter(
              (task) =>
                (!statusFiltru || task.status === statusFiltru) &&
                (!prioritateFiltru || task.prioritate === prioritateFiltru),
            )
            .map((task: Task) => (
              <div key={task.id} className="rounded-xl bg-white p-4">
                <TaskCard task={task} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListView;
