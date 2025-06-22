"use client";

import { useGetEchipeQuery } from "@/state/api";
import React from "react";
import Header from "@/componente/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridNumeClase, dataGridStiluriSx } from "@/resurse/utilitare";

// Toolbar personalizat
const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "id", headerName: "ID Echipa", width: 100 },
  { field: "numeEchipa", headerName: "Nume Echipa", width: 200 },
  {
    field: "produsOwnerNumeUtilizator",
    headerName: "Owner Produs",
    width: 200,
  },
  {
    field: "proiectManagerNumeUtilizator",
    headerName: "Manager Proiect",
    width: 200,
  },
];

const Echipe = () => {
  const { data: echipe, isLoading, isError } = useGetEchipeQuery();

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-indigo-700">
        Se încarcă echipele...
      </div>
    );
  if (isError || !echipe)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-red-500">
        Eroare la procesarea echipelor
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-8">
      <div className="mb-8 rounded-lg border border-indigo-300 bg-gradient-to-r from-indigo-400 to-blue-300 p-6 shadow-lg">
        <Header nume="Echipe" />
        <p className="mt-2 text-lg text-white/90">
          Vizualizează și exportă rapid lista echipelor și managerii acestora.
        </p>
      </div>
      <div className="mx-auto max-w-5xl rounded-xl border border-indigo-200 bg-white/90 p-6 shadow-lg">
        <DataGrid
          rows={echipe || []}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridNumeClase}
          sx={{
            ...dataGridStiluriSx(),
            borderColor: "#e0e7ff",
            "& .MuiDataGrid-cell": {
              borderColor: "#e0e7ff",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderColor: "#e0e7ff",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f1f5fa",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Echipe;
