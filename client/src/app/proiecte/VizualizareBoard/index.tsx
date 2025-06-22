import {
  Prioritate,
  useActualizareStatusTaskMutation,
  useGetTaskuriQuery,
  Status,
} from "@/state/api";
import Image from "next/image";
import React from "react";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TipTask } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import ModelAfisareTask from "@/app/proiecte/ModelAfisareTask";

const statusBadge: Record<string, string> = {
  "de facut": "bg-blue-600/90 text-white border-blue-400",
  "in progres": "bg-green-600/90 text-white border-green-400",
  "in revizuire": "bg-yellow-500/90 text-white border-yellow-400",
  finalizat: "bg-purple-700/90 text-white border-purple-400",
  Blocat: "bg-red-700/90 text-white border-red-400",
};

const statusCuloare: Record<string, string> = {
  "De facut": "#2563EB",
  "In progres": "#059669",
  "In revizuire": "#D97706",
  Finalizat: "#7c3aed",
  Blocat: "#dc2626",
};

const prioritateCuloare: Record<string, string> = {
  Urgenta: "border-red-500",
  Inalta: "border-yellow-500",
  Medie: "border-green-500",
  Scazuta: "border-blue-500",
};

type BoardProps = {
  id: string;
  setisModalNewTaskOpen: (deschis: boolean) => void;
};

const statusTask = [
  Status.DeFacut,
  Status.InProgres,
  Status.InRevizuire,
  Status.Blocat, // <-- Mută aici
  Status.Finalizat, // <-- și Finalizat rămâne ultimul
];

const VizualizareBoard = ({ id, setisModalNewTaskOpen }: BoardProps) => {
  const {
    data: taskuri = [],
    isLoading,
    error,
  } = useGetTaskuriQuery({ proiectId: Number(id) });
  const [actualizareStatusTask] = useActualizareStatusTaskMutation();

  const mutaTask = (taskId: number, toStatus: string) => {
    actualizareStatusTask({ taskId, status: toStatus });
  };

  const [isModalTaskOpen, setIsModalTaskOpen] = React.useState(false);
  const [taskSelectat, setTaskSelectat] = React.useState<TipTask | null>(null);

  if (isLoading) return <div>Se incarcara...</div>;
  if (error) return <div>A aparut o eroare la preluarea sarcinilor</div>;
  return (
    <DndProvider backend={HTML5Backend}>
      {/* MODAL AFISARE/EDITARE TASK */}
      <ModelAfisareTask
        task={taskSelectat}
        isOpen={isModalTaskOpen}
        onClose={() => setIsModalTaskOpen(false)}
      />
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-5">
        {statusTask.map((status) => (
          <TaskColoana
            key={status}
            status={status}
            taskuri={taskuri}
            mutaTask={mutaTask}
            setisModalNewTaskOpen={setisModalNewTaskOpen}
            setTaskSelectat={setTaskSelectat}
            setIsModalTaskOpen={setIsModalTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColoanaProps = {
  status: string;
  taskuri: TipTask[];
  mutaTask: (taskId: number, toStatus: string) => void;
  setisModalNewTaskOpen: (deschis: boolean) => void;
  setTaskSelectat: (task: TipTask) => void;
  setIsModalTaskOpen: (open: boolean) => void;
};

const TaskColoana = ({
  status,
  taskuri,
  mutaTask,
  setisModalNewTaskOpen,
  setTaskSelectat,
  setIsModalTaskOpen,
}: TaskColoanaProps) => {
  const [{ terminat }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => mutaTask(item.id, status),
    collect: (monitor: any) => ({
      terminat: monitor.isOver(),
    }),
  }));

  const numaratoareTask = taskuri.filter(
    (task) => task.status === status,
  ).length;

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`flex min-h-[300px] flex-col rounded-xl border-2 p-2 shadow-lg transition-colors duration-200 ${
        terminat ? "ring-2 ring-blue-400" : ""
      } border-blue-200 bg-white/95`}
    >
      <div className="mb-3 flex w-full items-center gap-2">
        <span
          className={`rounded-lg border px-3 py-2 text-base font-bold tracking-wide shadow-sm ${
            statusBadge[statusKey(status)]
          }`}
        >
          {status}
        </span>
        <span
          className="ml-auto inline-block rounded-full bg-blue-100 px-2 py-1 text-center text-sm font-semibold text-blue-700"
          style={{ minWidth: "2rem" }}
        >
          {numaratoareTask}
        </span>

        <button
          className="ml-1 flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-700"
          onClick={() => setisModalNewTaskOpen(true)}
        >
          <Plus size={16}></Plus>
        </button>
      </div>
      {taskuri
        .filter((task) => task.status === status && task.status !== "Arhivat")
        .map((task) => (
          <Task
            key={task.id}
            task={task}
            setTaskSelectat={setTaskSelectat}
            setIsModalTaskOpen={setIsModalTaskOpen}
          />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TipTask;
  setTaskSelectat: (task: TipTask) => void;
  setIsModalTaskOpen: (open: boolean) => void;
};

const Task = ({ task, setTaskSelectat, setIsModalTaskOpen }: TaskProps) => {
  const [{ dragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      dragging: monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedDataInceput = task.dataInceput
    ? format(new Date(task.dataInceput), "P")
    : "";
  const formattedDataLimita = task.dataLimita
    ? format(new Date(task.dataLimita), "P")
    : "";

  const numarDeComentarii = (task.comentarii && task.comentarii.length) || 0;

  const PriorityTag = ({
    prioritate,
  }: {
    prioritate: TipTask["prioritate"];
  }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        prioritate === "Urgenta"
          ? "bg-red-100 text-red-700"
          : prioritate === "Inalta"
            ? "bg-yellow-100 text-yellow-700"
            : prioritate === "Medie"
              ? "bg-green-100 text-green-700"
              : prioritate === "Scazuta"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-700"
      } `}
    >
      {prioritate}
    </div>
  );

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`mb-4 rounded-xl border-l-4 shadow-lg transition-all hover:shadow-2xl ${
        prioritateCuloare[task.prioritate ?? ""] || "border-blue-200"
      } bg-white ${dragging ? "scale-95 opacity-50" : "opacity-100"} `}
    >
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.prioritate && (
              <PriorityTag prioritate={task.prioritate}></PriorityTag>
            )}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button
            className="flex h-6 w-4 flex-shrink-0 items-center justify-center text-blue-700"
            onClick={() => {
              setTaskSelectat(task);
              setIsModalTaskOpen(true);
            }}
          >
            <EllipsisVertical size={22}></EllipsisVertical>
          </button>
        </div>
        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold">{task.titlu}</h4>
        </div>
        <div className="text-xs text-gray-500">
          {formattedDataInceput && <span>{formattedDataInceput} - </span>}
          {formattedDataLimita && <span>{formattedDataLimita}</span>}
        </div>
        <p className="mt-2 text-sm text-gray-600">{task.descriere}</p>
        <div className="mt-4 border-t border-blue-100" />

        {/* utilizatori */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.utilizatorAsignat && (
              <Image
                key={task.utilizatorAsignat.id}
                src={`/${task.utilizatorAsignat.pozaProfilUrl!}`}
                alt={task.utilizatorAsignat.numeUtilizator || ""}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-blue-200 object-cover"
              />
            )}
            {task.autor && (
              <Image
                key={task.autor.id}
                src={`/${task.autor.pozaProfilUrl!}`}
                alt={task.autor.numeUtilizator || ""}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-blue-100 object-cover"
              />
            )}
          </div>
          <div className="flex items-center text-blue-700">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm">{numarDeComentarii}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function statusKey(status: string) {
  return status
    .toLowerCase()
    .replace(/ă/g, "a")
    .replace(/î/g, "i")
    .replace(/â/g, "a")
    .replace(/ș/g, "s")
    .replace(/ț/g, "t")
    .replace(/[^a-z\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default VizualizareBoard;
