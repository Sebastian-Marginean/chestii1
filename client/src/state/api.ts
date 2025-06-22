import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Proiect {
  id: number;
  nume: string;
  descriere?: string;
  dataInceput?: string;
  dataLimita?: string;
}

export enum Status {
  Backlog = "Backlog",
  DeFacut = "De Facut",
  InProgres = "In Progres",
  InRevizuire = "In Revizuire",
  Finalizat = "Finalizat",
  Blocat = "Blocat",
  Arhivat = "Arhivat",
}

export interface Utilizator {
  id: number;
  numeUtilizator: string;
  pozaProfilUrl?: string;
  echipaId?: number;
  parola: string;
  mail: string;
  functiaUtilizatorului?: string;
  echipaUtilizatorului?: string;
}

export enum Prioritate {
  Urgenta = "Urgenta",
  Inalta = "Inalta",
  Medie = "Medie",
  Scazuta = "Scazuta",
}

export interface Comentariu {
  id: number;
  text: string;
  taskId: number;
  utilizatorId: number;
}

export interface Task {
  id: number;
  titlu: string;
  descriere?: string;
  status?: Status;
  prioritate?: Prioritate;
  tags?: string;
  dataInceput?: string;
  dataLimita?: string;
  proiectId: number;
  points?: number;
  autorUtilizatorId?: number;
  utilizatorAsignatId?: number;
  autor?: Utilizator;
  utilizatorAsignat?: Utilizator;
  comentarii?: Comentariu[];
}

export interface CautaRezultate {
  tasks?: Task[];
  proiecte?: Proiect[];
  utilizatori?: Utilizator[];
}

export interface Echipa {
  id: number;
  numeEchipa: string;
  produsAdminId?: number;
  proiectManagerId?: number;
}

// Crearea API-ului folosind Redux Toolkit
export const api = createApi({
  baseQuery: fetchBaseQuery({
    // Definirea URL-ului de baza pentru API
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  }),
  // Specificarea numelui reducer-ului pentru acest API
  reducerPath: "api",
  tagTypes: ["Proiecte", "Taskuri", "Utilizatori", "Echipe"],
  // Configurarea query-ului de baza pentru a face cereri HTTP

  // Functie care defineste punctele finale (endpoints) ale API-ului
  endpoints: (build) => ({
    getProiecte: build.query<Proiect[], void>({
      query: () => "proiecte",
      providesTags: ["Proiecte"],
    }),
    creazaProiect: build.mutation<Proiect, Partial<Proiect>>({
      query: (proiect) => ({
        url: "proiecte",
        method: "POST",
        body: proiect,
      }),
      invalidatesTags: ["Proiecte"],
    }),
    getTaskuri: build.query<Task[], void | { proiectId: number }>({
      query: (arg) => {
        if (arg && arg.proiectId !== undefined) {
          return `taskuri?proiectId=${arg.proiectId}`;
        }
        return "taskuri";
      },
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Taskuri" as const, id }))
          : [{ type: "Taskuri" as const }],
    }),
    creazaTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "taskuri",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Taskuri"],
    }),
    actualizareStatusTask: build.mutation<
      Task,
      { taskId: number; status: string }
    >({
      query: ({ taskId, status }) => ({
        url: `taskuri/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Taskuri", id: taskId },
      ],
    }),
    actualizareTask: build.mutation<Task, Partial<Task> & { taskId: number }>({
      query: ({ taskId, ...body }) => ({
        url: `taskuri/${taskId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Taskuri", id: taskId },
        { type: "Taskuri", id: "LIST" }, // dacă ai listă de taskuri
      ],
    }),
    getUtilizatori: build.query<Utilizator[], void>({
      query: () => "utilizatori",
      providesTags: ["Utilizatori"],
    }),
    getEchipe: build.query<Echipa[], void>({
      query: () => "echipe",
      providesTags: ["Echipe"],
    }),
    cauta: build.query<CautaRezultate, string>({
      query: (query) => `cauta?query=${query}`,
    }),
    stergeTask: build.mutation<void, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `taskuri/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Taskuri", id: taskId },
        { type: "Taskuri", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProiecteQuery,
  useCreazaProiectMutation,
  useGetTaskuriQuery,
  useCreazaTaskMutation,
  useActualizareStatusTaskMutation,
  useCautaQuery,
  useGetUtilizatoriQuery,
  useGetEchipeQuery,
  useActualizareTaskMutation,
  useStergeTaskMutation,
} = api;

export default api;
