import { Plus } from "lucide-react";
import { useGetTaskuriQuery, useGetProiecteQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type Props = {
  id: string;
  setisModalNewTaskOpen: (deschis: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Calendar = ({ id, setisModalNewTaskOpen }: Props) => {
  const { data: proiecte } = useGetProiecteQuery();
  const proiect = proiecte?.find((p) => p.id === Number(id));

  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTaskuriQuery({ proiectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  // Adaugă funcția pentru culoare în funcție de status
  const statusColor = (status: string) => {
    switch (status) {
      case "Finalizat":
        return "#22c55e"; // verde
      case "In Progres":
        return "#3b82f6"; // albastru
      case "In Revizuire":
        return "#f59e42"; // portocaliu
      case "De Facut":
        return "#64748b"; // gri
      case "Blocate":
        return "#dc2626"; // roșu pentru Blocate
      default:
        return "#a855f7"; // mov
    }
  };

  // Progres calculat după timp (sau poți folosi altceva dacă vrei)
  const getProgress = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now <= startDate) return 0;
    if (now >= endDate) return 100;
    return Math.round(
      ((now.getTime() - startDate.getTime()) /
        (endDate.getTime() - startDate.getTime())) *
        100,
    );
  };

  const ganttTasks = useMemo(() => {
    return (
      tasks
        ?.filter((task) => !!task.dataInceput && !!task.dataLimita)
        .map((task) => {
          const progress = getProgress(
            task.dataInceput || "",
            task.dataLimita || "",
          );
          return {
            start: new Date(task.dataInceput || ""),
            end: new Date(task.dataLimita || ""),
            name: task.prioritate ? `${task.titlu} ` : task.titlu,
            id: `Task-${task.id}`,
            type: "task" as TaskTypeItems,
            progress,
            isDisabled: false,
            styles: {
              backgroundColor: statusColor(task.status || ""),
              progressColor: "#a855f7",
              backgroundSelectedColor: "#322F87",
            },
          };
        }) || []
    );
  }, [tasks]);

  const manevrareSchimbareViewMode = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Se incarcara...</div>;
  if (error) return <div>A aparut o eroare la preluarea sarcinilor</div>;

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <h1 className="me-2 text-2xl font-extrabold tracking-tight text-blue-700">
          Calendarul cu task-uri al proiectului:{" "}
          <span className="text-indigo-500">{proiect?.nume || ""}</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative inline-block w-48">
            <select
              className="focus:shadow-outline block w-full appearance-none rounded-lg border border-blue-400 bg-white px-4 py-2 pr-8 text-blue-700 shadow transition-all hover:border-blue-500 focus:outline-none"
              value={displayOptions.viewMode}
              onChange={manevrareSchimbareViewMode}
            >
              <option value={ViewMode.Day}>Ziua</option>
              <option value={ViewMode.Week}>Săptămâna</option>
              <option value={ViewMode.Month}>Luna</option>
            </select>
          </div>
          <button
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setisModalNewTaskOpen(true)}
          >
            <Plus size={20} />
            Adaugă un Task nou
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-blue-200">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="160px"
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
