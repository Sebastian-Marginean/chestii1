import { Proiect } from "@/state/api";
import React from "react";

type Props = {
  proiect: Proiect;
};

function ProiectCard({ proiect }: Props) {
  return (
    <div className="rounded border bg-white p-4 shadow">
      <h3 className="mb-1 text-lg font-bold text-indigo-700">{proiect.nume}</h3>
      <h3 className="mb-2 text-gray-700">{proiect.descriere}</h3>
      <p className="text-sm text-gray-600">
        Data Începerii: {proiect.dataInceput}
      </p>
      <p className="text-sm text-gray-600">Data Limită: {proiect.dataLimita}</p>
    </div>
  );
}

export default ProiectCard;
