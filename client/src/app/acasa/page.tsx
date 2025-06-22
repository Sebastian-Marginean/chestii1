"use client";

// Importuri pentru hooks, componente și utilitare
import {
  Prioritate,
  Proiect,
  Task,
  useGetProiecteQuery,
  useGetTaskuriQuery,
} from "@/state/api";
import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/componente/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridNumeClase, dataGridStiluriSx } from "@/resurse/utilitare";
import { skipToken } from "@reduxjs/toolkit/query";

// Definim coloanele pentru DataGrid-ul cu taskuri
const taskColumns: GridColDef[] = [
  { field: "titlu", headerName: "Titlu", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "prioritate", headerName: "Prioritate", width: 150 },
  { field: "dataLimita", headerName: "Data Limita", width: 95 },
];

// Culori pentru grafice (pie/bar)
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Componenta principală a paginii de acasă
const HomePage = () => {
  // Fetch proiecte din API
  const { data: proiecte, isLoading: isProiecteLoading } =
    useGetProiecteQuery();

  // Starea pentru proiectul selectat (id-ul proiectului)
  const [selectedProiectId, setSelectedProiectId] = useState<number | null>(
    null,
  );

  // Fetch taskuri pentru proiectul selectat (sau nu face request dacă nu e selectat)
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTaskuriQuery(
    selectedProiectId ? { proiectId: selectedProiectId } : skipToken,
  );

  // Starea pentru rândurile selectate din DataGrid (pentru export)
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  // Selectează implicit primul proiect dacă nu e selectat deja
  React.useEffect(() => {
    if (!selectedProiectId && proiecte && proiecte.length > 0) {
      setSelectedProiectId(proiecte[0].id);
    }
  }, [proiecte, selectedProiectId]);

  // Gestionare stări de încărcare și eroare
  if (isProiecteLoading) return <div>Se incarca proiectele...</div>;
  if (!proiecte) return <div>Eroare la procesarea proiectelor</div>;
  if (tasksLoading || isProiecteLoading) return <div>Se incarca...</div>;
  if (tasksError || !tasks || !proiecte)
    return <div>Eroare la procesarea datelor</div>;

  // Calculează distribuția taskurilor pe priorități
  const prioritateCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { prioritate } = task;
      acc[prioritate as Prioritate] = (acc[prioritate as Prioritate] || 0) + 1;
      return acc;
    },
    {},
  );

  // Array pentru BarChart cu distribuția pe priorități
  const distribuireTask = Object.keys(prioritateCount).map((key) => ({
    name: key,
    Numaratoare: prioritateCount[key],
  }));

  // Calculează distribuția taskurilor pe status
  const statusCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const status = task.status || "Necunoscut";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  // Array pentru PieChart cu distribuția pe status
  const proiectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    Numaratoare: statusCount[key],
  }));

  // Culori pentru grafice și fundaluri (doar light mode)
  const chartColors = {
    bar: "#8884d8",
    barGrid: "#E0E0E0",
    pieFill: "#82ca9d",
    text: "#000000",
  };

  // Fundal pentru carduri (doar light)
  const cardBg = "#fff";

  // Funcție pentru exportul rândurilor selectate din DataGrid în CSV
  const exportSelectedRowsToCSV = () => {
    if (!selectedRows.length) return;
    // Header CSV
    const headers = taskColumns.map((col) => col.headerName).join(",");
    // Fiecare rând selectat
    const rows = selectedRows
      .map((row) =>
        taskColumns
          .map((col) => {
            const value = row[col.field];
            // Escape pentru ghilimele
            return typeof value === "string"
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(","),
      )
      .join("\n");
    // Conținutul CSV
    const csvContent = `${headers}\n${rows}`;
    // Creează și descarcă fișierul
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "taskuri_selectate.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render principal
  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      {/* Header principal */}
      <Header nume="Panou de control al proiectelor" />

      {/* Mesaj de intampinare */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-300 p-6 text-center shadow-lg">
        <h2 className="mb-2 text-2xl font-bold text-white drop-shadow">
          Bun venit în panoul tău de control!
        </h2>
        <p className="text-lg text-white/90">
          Selectează un proiect pentru a vedea progresul și distribuția
          task-urilor. Vizualizează rapid statusul și prioritățile task-urilor
          tale!
        </p>
      </div>

      {/* Dropdown pentru alegerea proiectului */}
      <div className="mb-6 flex items-center gap-2">
        <label className="font-semibold text-indigo-900">
          Alege proiectul:
        </label>
        <select
          value={selectedProiectId ?? ""}
          onChange={(e) => setSelectedProiectId(Number(e.target.value))}
          className="rounded border px-2 py-1"
        >
          {/* Opțiuni pentru fiecare proiect */}
          {proiecte.map((proiect) => (
            <option key={proiect.id} value={proiect.id}>
              {proiect.nume}
            </option>
          ))}
        </select>
      </div>

      {/* Grid cu grafice și tabel */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Statusul Proiectului - PieChart */}
        <div
          className="rounded-lg p-4 shadow"
          style={{ backgroundColor: cardBg }}
        >
          <h3 className="mb-4 text-lg font-semibold">
            Statusul Task-urilor din Proiect
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="Numaratoare"
                data={proiectStatus}
                fill={chartColors.pieFill}
                label
              >
                {/* Fiecare felie primește o culoare diferită */}
                {proiectStatus.map((entry, index) => (
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

        {/* Distributia Prioritatii Task-urilor - BarChart */}
        <div
          className="rounded-lg p-4 shadow"
          style={{ backgroundColor: cardBg }}
        >
          <h3 className="mb-4 text-lg font-semibold">
            Distribuția Priorității Task-urilor
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribuireTask}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="Numaratoare" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task-urile tale - tabel cu selectare și export */}
        <div
          className="rounded-lg p-4 shadow md:col-span-2"
          style={{ backgroundColor: cardBg }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-800">
              <span role="img" aria-label="clipboard">
                📋
              </span>
              Task-urile Proiectului
            </h3>
            <button
              className={`rounded px-4 py-2 font-semibold transition-colors duration-200 ${
                selectedRows.length
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
              onClick={exportSelectedRowsToCSV}
              disabled={selectedRows.length === 0}
            >
              <span role="img" aria-label="download">
                ⬇️
              </span>{" "}
              Exportă selecția CSV
            </button>
          </div>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              getRowClassName={() =>
                "data-grid-row hover:bg-indigo-100 transition-colors"
              }
              getCellClassName={() => "data-grid-cell"}
              className={dataGridNumeClase}
              sx={dataGridStiluriSx()}
              onRowSelectionModelChange={(ids) => {
                // Actualizează rândurile selectate pentru export
                const selected = tasks.filter((row) => ids.includes(row.id));
                setSelectedRows(selected);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
