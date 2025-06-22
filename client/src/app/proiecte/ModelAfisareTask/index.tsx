import React, { useState, useEffect } from "react";
import {
  Status,
  Prioritate,
  useActualizareStatusTaskMutation,
  useActualizareTaskMutation,
  useGetUtilizatoriQuery,
  useStergeTaskMutation,
  useGetTaskuriQuery,
} from "@/state/api";
import {
  FaUser,
  FaUserPlus,
  FaCalendarAlt,
  FaTag,
  FaFlag,
  FaInfoCircle,
  FaCheckCircle,
  FaEdit,
  FaCommentDots,
} from "react-icons/fa";

type Props = {
  task: any;
  isOpen: boolean;
  onClose: () => void;
};

type UtilizatorCuId = {
  utilizatorId?: number;
  id?: number;
  numeUtilizator?: string;
  email?: string;
  pozaProfilUrl?: string;
  cognitoId?: string;
  echipaId?: number;
};

const ModelAfisareTask = ({ task, isOpen, onClose }: Props) => {
  if (!isOpen || !task) return null;

  const [titlu, setTitlu] = useState(task.titlu);
  const [descriere, setDescriere] = useState(task.descriere);
  const [status, setStatus] = useState<Status>(task.status);
  const [prioritate, setPrioritate] = useState<Prioritate>(task.prioritate);
  const [tags, setTags] = useState(task.tags);
  const [dataInceput, setDataInceput] = useState(
    task.dataInceput?.slice(0, 10),
  );
  const [dataLimita, setDataLimita] = useState(task.dataLimita?.slice(0, 10));
  const [autorUtilizatorId, setAutorUtilizatorId] = useState(
    task.autor?.utilizatorId ? String(task.autor.utilizatorId) : "",
  );
  const [utilizatorAsignatId, setUtilizatorAsignatId] = useState(
    task.utilizatorAsignat?.utilizatorId
      ? String(task.utilizatorAsignat.utilizatorId)
      : "",
  );
  const [actualizareStatusTask, { isLoading }] =
    useActualizareStatusTaskMutation();
  const [actualizareTask, { isLoading: isLoadingTask }] =
    useActualizareTaskMutation();
  const [stergeTask, { isLoading: isDeleting }] = useStergeTaskMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: utilizatori = [] } = useGetUtilizatoriQuery();
  const { refetch } = useGetTaskuriQuery({ proiectId: task.proiectId });

  const utilizatoriCuId: UtilizatorCuId[] = utilizatori;

  useEffect(() => {
    setTitlu(task.titlu);
    setDescriere(task.descriere);
    setStatus(task.status);
    setPrioritate(task.prioritate);
    setTags(task.tags);
    setDataInceput(task.dataInceput?.slice(0, 10));
    setDataLimita(task.dataLimita?.slice(0, 10));
    setAutorUtilizatorId(
      task.autor?.id !== undefined && task.autor?.id !== null
        ? String(task.autor.id)
        : "",
    );
    setUtilizatorAsignatId(
      task.utilizatorAsignat?.id !== undefined &&
        task.utilizatorAsignat?.id !== null
        ? String(task.utilizatorAsignat.id)
        : "",
    );
  }, [task]);

  useEffect(() => {
    setComentarii(task.comentarii || []);
  }, [task]);

  const toISO = (dateStr: string | undefined) =>
    dateStr ? new Date(dateStr).toISOString() : undefined;

  const handleSave = async () => {
    await actualizareTask({
      taskId: task.id,
      titlu,
      descriere,
      status,
      prioritate,
      tags,
      dataInceput: toISO(dataInceput),
      dataLimita: toISO(dataLimita),
      autorUtilizatorId: autorUtilizatorId
        ? Number(autorUtilizatorId)
        : undefined,
      utilizatorAsignatId: utilizatorAsignatId
        ? Number(utilizatorAsignatId)
        : undefined,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  const handleDelete = async () => {
    await stergeTask({ taskId: task.id });
    refetch();
    onClose();
  };

  const [comentariuNou, setComentariuNou] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingCommentId, setIsDeletingCommentId] = useState<number | null>(
    null,
  );

  const adaugaComentariu = async () => {
    if (!comentariuNou.trim() || !idUtilizatorCurent) return;
    setIsAddingComment(true);
    try {
      await fetch(`http://localhost:8000/comentarii`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: comentariuNou,
          taskId: task.id,
          utilizatorId: idUtilizatorCurent,
        }),
      });
      setComentariuNou("");
      // Refă fetch-ul pentru taskuri și actualizează comentariile locale
      const { data: taskuriNoi } = await refetch();
      const taskActualizat = taskuriNoi?.find((t: any) => t.id === task.id);
      if (taskActualizat) {
        setComentarii(taskActualizat.comentarii || []);
      }
    } finally {
      setIsAddingComment(false);
    }
  };

  const stergeComentariu = async (comentariuId: number) => {
    setIsDeletingCommentId(comentariuId);
    try {
      await fetch(`http://localhost:8000/comentarii/${comentariuId}`, {
        method: "DELETE",
      });
      // Actualizează local lista de comentarii, fără refetch global
      setComentarii((prev: any[]) =>
        prev.filter((comentariu) => comentariu.id !== comentariuId),
      );
    } finally {
      setIsDeletingCommentId(null);
    }
  };

  const [utilizatorCurent, setUtilizatorCurent] = useState<any>(null);

  useEffect(() => {
    const userLS = localStorage.getItem("utilizator");
    if (userLS) setUtilizatorCurent(JSON.parse(userLS));
  }, []);

  const utilizatorComplet = utilizatori.find(
    (u) => u.mail === utilizatorCurent?.email,
  );
  const idUtilizatorCurent = utilizatorComplet?.id;

  const [comentarii, setComentarii] = useState(task.comentarii || []);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="animate-fade-in w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl ring-4 ring-indigo-200">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-indigo-700">
          <FaInfoCircle color="#6366f1" size={24} />
          Detalii Task
        </h2>
        {isSuccess && (
          <div className="mb-4 flex animate-bounce items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-lg font-bold text-white shadow-lg ring-2 ring-green-300 transition-all">
            <FaCheckCircle color="#fff" size={22} />
            Task modificat cu succes!
          </div>
        )}
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
            <FaEdit color="#6366f1" size={18} />
            Titlu
          </label>
          <input
            className="w-full rounded border-2 border-indigo-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            value={titlu}
            onChange={(e) => setTitlu(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
            <FaEdit color="#6366f1" size={18} />
            Descriere
          </label>
          <textarea
            className="w-full rounded border-2 border-indigo-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
              <FaFlag color="#eab308" size={18} />
              Status
            </label>
            <select
              className="w-full rounded border-2 border-yellow-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value={Status.Backlog}>Backlog</option>
              <option value={Status.DeFacut}>De Facut</option>
              <option value={Status.InProgres}>In Progres</option>
              <option value={Status.InRevizuire}>In Revizuire</option>
              <option value={Status.Finalizat}>Finalizat</option>
              <option value={Status.Blocat}>Blocat</option>
              <option value={Status.Arhivat}>Arhivat</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
              <FaFlag color="#ec4899" /> Prioritate
            </label>
            <select
              className="w-full rounded border-2 border-pink-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              value={prioritate}
              onChange={(e) => setPrioritate(e.target.value as Prioritate)}
            >
              <option value={Prioritate.Scazuta}>Scazuta</option>
              <option value={Prioritate.Medie}>Medie</option>
              <option value={Prioritate.Inalta}>Inalta</option>
              <option value={Prioritate.Urgenta}>Urgenta</option>
            </select>
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
              <FaCalendarAlt color="#22c55e" size={18} />
              Data Început
            </label>
            <input
              type="date"
              className="w-full rounded border-2 border-green-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200"
              value={dataInceput}
              onChange={(e) => setDataInceput(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
              <FaCalendarAlt color="#ef4444" size={18} />
              Data Limită
            </label>
            <input
              type="date"
              className="w-full rounded border-2 border-red-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200"
              value={dataLimita}
              onChange={(e) => setDataLimita(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
            <FaTag color="#a21caf" size={18} />
            Taguri
          </label>
          <input
            className="w-full rounded border-2 border-purple-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
              <FaUser color="#2563eb" size={18} />
              Autor
            </label>
            <select
              className="w-full rounded border-2 border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={autorUtilizatorId || ""}
              onChange={(e) => setAutorUtilizatorId(e.target.value)}
            >
              {utilizatoriCuId.map((u) => (
                <option
                  key={u.id ?? u.utilizatorId}
                  value={String(u.id ?? u.utilizatorId)}
                >
                  {u.numeUtilizator}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
              <FaUserPlus color="#ec4899" size={18} />
              Asignat
            </label>
            <select
              className="w-full rounded border-2 border-pink-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              value={utilizatorAsignatId}
              onChange={(e) => setUtilizatorAsignatId(e.target.value)}
            >
              <option value="">Neasignat</option>
              {utilizatoriCuId.map((u) => (
                <option
                  key={u.id ?? u.utilizatorId}
                  value={String(u.id ?? u.utilizatorId)}
                >
                  {u.numeUtilizator}
                </option>
              ))}
            </select>
          </div>
        </div>
        {comentarii && comentarii.length > 0 && (
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 font-semibold text-indigo-700">
              <FaCommentDots color="#6366f1" size={18} />
              Comentarii
            </label>
            <div className="max-h-40 space-y-3 overflow-y-auto pr-2">
              {comentarii.map((comentariu: any) => {
                const utilizator = utilizatoriCuId.find(
                  (u) =>
                    String(u.id ?? u.utilizatorId) ===
                    String(comentariu.utilizatorId),
                );
                return (
                  <div
                    key={comentariu.id}
                    className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-gray-800 shadow"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-semibold text-indigo-700">
                        {utilizator?.numeUtilizator || "Utilizator"}
                      </span>
                      <button
                        onClick={() => stergeComentariu(comentariu.id)}
                        disabled={isDeletingCommentId === comentariu.id}
                        className="ml-2 rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
                      >
                        {isDeletingCommentId === comentariu.id
                          ? "..."
                          : "Șterge"}
                      </button>
                    </div>
                    <div>{comentariu.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-4">
          <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
            <FaCommentDots color="#6366f1" size={18} />
            Adaugă comentariu
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border-2 border-indigo-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={comentariuNou}
              onChange={(e) => setComentariuNou(e.target.value)}
              placeholder="Scrie un comentariu..."
              disabled={isAddingComment}
            />
            <button
              onClick={adaugaComentariu}
              disabled={isAddingComment || !comentariuNou.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
            >
              {isAddingComment ? "Se adaugă..." : "Adaugă"}
            </button>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700 shadow hover:bg-gray-400"
          >
            Închide
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            disabled={isDeleting}
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Ștergere..." : "Șterge"}
          </button>
          <button
            onClick={handleSave}
            disabled={isLoadingTask}
            className="rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-6 py-2 font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            {isLoadingTask
              ? "Se salvează..."
              : isSuccess
                ? "Salvat!"
                : "Salvează"}
          </button>
        </div>
      </div>
      {showConfirmDelete && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="animate-pop-in w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl ring-4 ring-red-200">
            <div className="flex flex-col items-center">
              <span className="mb-2 animate-pulse">
                <FaInfoCircle color="#ef4444" size={40} />
              </span>
              <h3 className="mb-2 text-center text-xl font-bold text-red-700">
                Ești sigur că vrei să ștergi acest task?
              </h3>
              <p className="mb-6 text-center text-gray-600">
                Această acțiune este ireversibilă!
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 shadow hover:bg-gray-300"
                >
                  Anulează
                </button>
                <button
                  onClick={async () => {
                    await handleDelete();
                    setShowConfirmDelete(false);
                  }}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? "Ștergere..." : "Șterge"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelAfisareTask;
