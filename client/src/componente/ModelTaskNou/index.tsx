import {
  Prioritate,
  Status,
  useCreazaTaskMutation,
  useGetUtilizatoriQuery,
} from "@/state/api";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaUserPlus,
  FaCalendarAlt,
  FaTag,
  FaFlag,
  FaCheckCircle,
  FaEdit,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

const ModelTaskNou = ({ isOpen, onClose, id }: Props) => {
  const [creazaTask, { isLoading }] = useCreazaTaskMutation();
  const { data: utilizatori = [] } = useGetUtilizatoriQuery();
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [status, setStatus] = useState<Status>(Status.Backlog);
  const [prioritate, setPrioritate] = useState<Prioritate>(Prioritate.Scazuta);
  const [tags, setTags] = useState("");
  const [dataInceput, setDataInceput] = useState("");
  const [dataLimita, setDataLimita] = useState("");
  const [autorUtilizatorId, setAutorUtilizatorId] = useState("");
  const [utilizatorAsignatId, setUtilizatorAsignatId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!titlu || !autorUtilizatorId) return;

    await creazaTask({
      titlu,
      descriere,
      status,
      prioritate,
      tags,
      dataInceput: dataInceput
        ? new Date(dataInceput).toISOString()
        : undefined,
      dataLimita: dataLimita ? new Date(dataLimita).toISOString() : undefined,
      autorUtilizatorId: parseInt(autorUtilizatorId),
      utilizatorAsignatId: utilizatorAsignatId
        ? parseInt(utilizatorAsignatId)
        : undefined,
      proiectId: Number(id),
    });
    setIsSuccess(true);
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setTitlu("");
        setDescriere("");
        setStatus(Status.Backlog);
        setPrioritate(Prioritate.Scazuta);
        setTags("");
        setDataInceput("");
        setDataLimita("");
        setAutorUtilizatorId("");
        setUtilizatorAsignatId("");
      }, 1200);
    }
  }, [isSuccess, onClose]);

  const isFormValid = () => titlu && autorUtilizatorId;

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="mx-auto max-w-lg rounded-2xl border-2 border-indigo-300 bg-white p-6 shadow-lg ring-2 ring-indigo-200">
          <div className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-indigo-700">
            <FaInfoCircle color="#6366f1" size={24} />
            Crează un Task Nou
          </div>
          {isSuccess && (
            <div className="mb-4 flex animate-bounce items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-lg font-bold text-white shadow-lg ring-2 ring-green-300 transition-all">
              <FaCheckCircle color="#fff" size={22} />
              Task creat cu succes!
            </div>
          )}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div>
              <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
                <FaEdit color="#6366f1" size={18} />
                Titlu
              </label>
              <input
                type="text"
                className="w-full rounded border-2 border-indigo-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Titlu"
                value={titlu}
                onChange={(e) => setTitlu(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
                <FaEdit color="#6366f1" size={18} />
                Descriere
              </label>
              <textarea
                className="w-full rounded border-2 border-indigo-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Descriere"
                value={descriere}
                onChange={(e) => setDescriere(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
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
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
                  <FaFlag color="#ec4899" size={18} />
                  Prioritate
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
            <div>
              <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
                <FaTag color="#a21caf" size={18} />
                Taguri
              </label>
              <input
                type="text"
                className="w-full rounded border-2 border-purple-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
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
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 flex items-center gap-2 font-semibold text-indigo-700">
                  <FaUser color="#2563eb" size={18} />
                  Autor
                </label>
                <select
                  className="w-full rounded border-2 border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={autorUtilizatorId}
                  onChange={(e) => setAutorUtilizatorId(e.target.value)}
                >
                  <option value="">Alege autorul</option>
                  {utilizatori.map((u: any) => (
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
                  {utilizatori.map((u: any) => (
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
            <div className="mt-6 flex w-full gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 shadow transition-all hover:bg-gray-300"
              >
                Închide
              </button>
              <button
                type="submit"
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-4 py-2 text-base font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  !isFormValid() || isLoading
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Crează...
                  </>
                ) : (
                  <>Crează Task-ul</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ModelTaskNou;
