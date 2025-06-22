import { useAppSelector } from "@/app/redux";
import Header from "@/componente/Header";
import ModelAfisareTask from "@/app/proiecte/ModelAfisareTask";
import ModelTaskNou from "@/componente/ModelTaskNou";
import { useGetTaskuriQuery } from "@/state/api";
import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridNumeClase, dataGridStiluriSx } from "@/resurse/utilitare";
import { Plus, Eye } from "lucide-react";

type Props = {
  id: string;
  setisModalNewTaskOpen: (deschis: boolean) => void;
};

const VizualizareTabel = ({ id, setisModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTaskuriQuery({ proiectId: Number(id) });

  // State pentru modaluri
  const [isModalTaskOpen, setIsModalTaskOpen] = useState(false);
  const [taskSelectat, setTaskSelectat] = useState<any>(null);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: "titlu", headerName: "Titlu", width: 100 },
    { field: "descriere", headerName: "Descriere", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        let color = "bg-gray-200 text-gray-800";
        if (params.value === "Finalizat") color = "bg-green-100 text-green-800";
        if (params.value === "In Progres") color = "bg-blue-100 text-blue-800";
        if (params.value === "In Revizuire")
          color = "bg-orange-100 text-orange-800";
        if (params.value === "De Facut") color = "bg-gray-100 text-gray-800";
        if (params.value === "Blocat") color = "bg-red-100 text-red-800"; // <-- adaugă această linie
        return (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${color}`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "prioritate",
      headerName: "Prioritate",
      width: 100,
      renderCell: (params) => {
        let color = "bg-gray-200 text-gray-800";
        if (params.value === "Urgenta") color = "bg-red-200 text-red-800";
        if (params.value === "Inalta") color = "bg-pink-200 text-pink-800";
        if (params.value === "Medie") color = "bg-yellow-200 text-yellow-800";
        if (params.value === "Scazuta") color = "bg-blue-100 text-blue-800";
        if (params.value === "Backlog") color = "bg-gray-100 text-gray-800";
        return (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${color}`}
          >
            {params.value}
          </span>
        );
      },
    },
    { field: "tags", headerName: "Taguri", width: 100 },
    { field: "dataInceput", headerName: "Data Inceput", width: 95 },
    { field: "dataLimita", headerName: "DataLimita", width: 95 },
    {
      field: "autor",
      headerName: "Autor",
      width: 150,
      renderCell: (params) =>
        params.value && params.value.numeUtilizator
          ? params.value.numeUtilizator
          : "Necunoscut",
    },
    {
      field: "utilizatorAsignat",
      headerName: "Asignat",
      width: 150,
      renderCell: (params) =>
        params.value && params.value.numeUtilizator
          ? params.value.numeUtilizator
          : "Neasignat",
    },
    {
      field: "detalii",
      headerName: "",
      width: 160,
      renderCell: (params) => (
        <div
          className="flex w-full items-center justify-center"
          style={{ height: "100%" }}
        >
          <div className="flex w-full flex-col items-center">
            <div style={{ flex: 1 }} />
            <button
              className="mt-2 flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-3 py-1.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={(e) => {
                e.stopPropagation();
                setTaskSelectat(params.row);
                setIsModalTaskOpen(true);
              }}
            >
              <Eye size={16} />
              Modifica Task-ul
            </button>
            <div style={{ flex: 1 }} />
          </div>
        </div>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  if (isLoading) return <div>Se incarcara...</div>;
  if (error) return <div>A aparut o eroare la preluarea sarcinilor</div>;

  return (
    <div className="h-[540px] w-full rounded-2xl border-4 border-indigo-200 bg-gradient-to-br from-indigo-100 via-blue-50 to-white px-4 pb-8 shadow-2xl xl:px-6">
      <div className="flex items-center gap-4 pb-2 pt-5">
        <div className="flex-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          <Header nume="Tabel" textMic />
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setIsModalNewTaskOpen(true)}
        >
          <Plus size={18} />
          Adaugă un Task
        </button>
      </div>
      {/* MODAL AFISARE/EDITARE TASK */}
      <ModelAfisareTask
        task={taskSelectat}
        isOpen={isModalTaskOpen}
        onClose={() => setIsModalTaskOpen(false)}
      />
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-blue-100 to-white shadow-2xl ring-1 ring-blue-200">
        <DataGrid
          rows={(tasks || []).map((t) => ({ ...t, id: t.id }))}
          columns={columns}
          className={dataGridNumeClase}
          onRowClick={(params) => {
            setTaskSelectat(params.row);
            setIsModalTaskOpen(true);
          }}
          sx={{
            ...dataGridStiluriSx(),
            "& .MuiDataGrid-columnHeaders": {
              background: "linear-gradient(90deg, #e0e7ff 0%, #c7d2fe 100%)",
              color: "#3730a3",
              fontWeight: 700,
              fontSize: "1rem",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            },
            "& .MuiDataGrid-row": {
              transition: "background 0.2s",
              background: "#fff",
              "&:hover": {
                background: "#f1f5f9",
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e7ff",
              background: "transparent",
            },
            "& .MuiDataGrid-footerContainer": {
              background: "#e0e7ff",
              borderBottomLeftRadius: "1rem",
              borderBottomRightRadius: "1rem",
            },
          }}
        />
      </div>
      {/* MODAL ADAUGA TASK NOU */}
      <ModelTaskNou
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />
    </div>
  );
};

export default VizualizareTabel;
