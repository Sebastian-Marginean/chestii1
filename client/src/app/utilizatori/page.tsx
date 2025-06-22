"use client";

import { useGetUtilizatoriQuery } from "@/state/api";
import React from "react";
import Header from "@/componente/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridNumeClase, dataGridStiluriSx } from "@/resurse/utilitare";

// Toolbar personalizat
const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

// Coloane adaptate la datele tale
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "numeUtilizator", headerName: "Nume Utilizator", width: 180 },
  {
    field: "pozaProfilUrl",
    headerName: "Poza de Profil",
    width: 110,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-indigo-400 shadow">
          <Image
            src={`/${params.value}`}
            alt={params.row.numeUtilizator}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    ),
  },
];

const Utilizatori = () => {
  const { data: utilizatori, isLoading, isError } = useGetUtilizatoriQuery();

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-indigo-700">
        Se încarcă utilizatorii...
      </div>
    );
  if (isError || !utilizatori)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-red-500">
        Eroare la procesarea utilizatorilor
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-8">
      <div className="mb-8 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-300 p-6 shadow-lg">
        <Header nume="Utilizatori" />
        <p className="mt-2 text-lg text-white/90">
          Vizualizează și exportă rapid lista utilizatorilor platformei.
        </p>
      </div>
      <div className="mx-auto max-w-5xl rounded-xl bg-white/90 p-6 shadow-lg">
        <DataGrid
          rows={utilizatori || []}
          columns={columns}
          getRowId={(row) => row.id}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridNumeClase}
          sx={dataGridStiluriSx()}
        />
      </div>
    </div>
  );
};

export default Utilizatori;
