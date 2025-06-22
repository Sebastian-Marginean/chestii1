import Model from "@/componente/Model";
import { useCreazaProiectMutation } from "@/state/api";
import React, { useState, useEffect } from "react";
import { formatISO } from "date-fns";
import {
  PlusCircle,
  CalendarDays,
  FileText,
  CheckCircle,
  Info,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModelProiectNou = ({ isOpen, onClose }: Props) => {
  const [creazaProiect, { isLoading }] = useCreazaProiectMutation();
  const [numeProiect, setNumeProiect] = useState("");
  const [descriere, setDescriere] = useState("");
  const [dataInceput, setDataInceput] = useState("");
  const [dataLimita, setDataLimita] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!numeProiect || !dataInceput || !dataLimita) return;

    const dataInceputFormatata = formatISO(new Date(dataInceput), {
      representation: "complete",
    });
    const dataLimitaFormatata = formatISO(new Date(dataLimita), {
      representation: "complete",
    });

    await creazaProiect({
      nume: numeProiect,
      descriere,
      dataInceput: dataInceputFormatata,
      dataLimita: dataLimitaFormatata,
    });

    setIsSuccess(true);
  };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setNumeProiect("");
        setDescriere("");
        setDataInceput("");
        setDataLimita("");
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, onClose]);

  const isFormValid = () =>
    numeProiect && descriere && dataInceput && dataLimita;

  const stiluriInput =
    "w-full rounded-xl border-2 border-indigo-300 p-3 pl-10 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors duration-150";
  const stiluriLabel = "block mb-1 text-sm font-semibold text-indigo-700";
  const stiluriIcon =
    "absolute left-3 top-8 text-indigo-400 pointer-events-none";

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="mx-auto max-w-lg rounded-2xl border-2 border-indigo-300 bg-white p-6 shadow-lg ring-2 ring-indigo-200">
          <div className="mb-6 flex items-center gap-2 text-2xl font-extrabold text-indigo-700">
            <Info color="#6366f1" size={24} />
            Crează un Proiect Nou
          </div>
          {isSuccess && (
            <div className="mb-4 flex animate-bounce items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-lg font-bold text-white shadow-lg ring-2 ring-green-300 transition-all">
              <CheckCircle color="#fff" size={22} />
              Proiect creat cu succes!
            </div>
          )}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="relative">
              <label className={stiluriLabel}>Numele Proiectului</label>
              <span className={stiluriIcon}>
                <PlusCircle size={20} />
              </span>
              <input
                type="text"
                className={stiluriInput}
                placeholder="Numele Proiectului"
                value={numeProiect}
                onChange={(e) => setNumeProiect(e.target.value)}
                style={{ paddingLeft: 44 }}
              />
            </div>
            <div className="relative">
              <label className={stiluriLabel}>Descriere</label>
              <span className={stiluriIcon}>
                <FileText size={20} />
              </span>
              <textarea
                rows={3}
                className={stiluriInput}
                placeholder="Descriere"
                value={descriere}
                onChange={(e) => setDescriere(e.target.value)}
                style={{ paddingLeft: 44 }}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <label className={stiluriLabel}>Data început</label>
                <span className={stiluriIcon}>
                  <CalendarDays size={20} />
                </span>
                <input
                  type="date"
                  className={stiluriInput}
                  value={dataInceput}
                  onChange={(e) => setDataInceput(e.target.value)}
                  style={{ paddingLeft: 44 }}
                />
              </div>
              <div className="relative">
                <label className={stiluriLabel}>Data limită</label>
                <span className={stiluriIcon}>
                  <CalendarDays size={20} />
                </span>
                <input
                  type="date"
                  className={stiluriInput}
                  value={dataLimita}
                  onChange={(e) => setDataLimita(e.target.value)}
                  style={{ paddingLeft: 44 }}
                />
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
                    Se creează...
                  </>
                ) : (
                  <>
                    <PlusCircle size={20} />
                    Creează Proiectul
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ModelProiectNou;
