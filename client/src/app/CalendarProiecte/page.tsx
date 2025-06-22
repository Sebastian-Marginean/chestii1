"use client";

import Header from "@/componente/Header";
import { useGetProiecteQuery } from "@/state/api";
import { DisplayOption, Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type TaskTypeItems = "task" | "milestone" | "project";

const COLORS = [
  "#4F8EF7", // albastru vibrant
  "#F76D6D", // roșu coral
  "#F7C948", // galben solar
  "#43D9AD", // verde mentă
  "#A259F7", // mov pastel
  "#F78E4F", // portocaliu
  "#36B5F7", // cyan
  "#F74F8E", // roz
];

const Calendar = () => {
  const { data: proiecte, isLoading, isError } = useGetProiecteQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      proiecte?.map((proiect, idx) => ({
        start: new Date(proiect.dataInceput as string),
        end: new Date(proiect.dataLimita as string),
        name: proiect.nume,
        id: `Proiect-${proiect.id}`,
        type: "project" as Task["type"],
        progress: 50,
        isDisabled: false,
        styles: {
          backgroundColor: COLORS[idx % COLORS.length],
          progressColor: COLORS[idx % COLORS.length],
          backgroundSelectedColor: "#9ba1a6",
        },
      })) || []
    );
  }, [proiecte]);

  const manevrareSchimbareViewMode = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Se incarcara...</div>;
  if (isError || !proiecte)
    return <div>A aparut o eroare la preluarea proiectelor</div>;

  // Header gradient doar pentru light mode
  const headerBg = "bg-gradient-to-r from-indigo-400 to-blue-300";

  return (
    <div className="max-w-full p-8">
      {/* Card de sus cu gradient și mesaj */}
      <div className={`mb-6 rounded-lg ${headerBg} p-6 shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <Header nume="Calendarul Proiectelor" />
            <p className="mt-2 text-lg text-white/90">
              Vizualizează rapid perioada de desfășurare a proiectelor tale și
              planifică eficient!
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              className="rounded-lg border-none bg-white/90 px-4 py-2 font-semibold text-indigo-900 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={displayOptions.viewMode}
              onChange={manevrareSchimbareViewMode}
            >
              <option value={ViewMode.Day}>Ziua</option>
              <option value={ViewMode.Week}>Săptămâna</option>
              <option value={ViewMode.Month}>Luna</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendarul Gantt */}
      <div className="overflow-hidden rounded-md bg-white shadow">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
