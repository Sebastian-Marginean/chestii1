import Header from "@/componente/Header";
import React, { useState } from "react";
import { useGetProiecteQuery } from "@/state/api";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Clock,
  Filter,
  Grid3X3,
  Layers3,
  List,
  Lock,
  PlusSquare,
  Share2,
  ShieldAlert,
  Table,
} from "lucide-react";
import ModelProiectNou from "./ModelProiectNou";

type Props = {
  tabActiv: string;
  setTabActiv: (tabNume: string) => void;
  proiectId: number;
};

const HeaderProiect = ({ tabActiv, setTabActiv, proiectId }: Props) => {
  const [isModalProiectNouDeschis, setIsModalProiectNouDeschis] =
    useState(false);
  const { data: proiecte } = useGetProiecteQuery();
  const proiect = proiecte?.find((p) => p.id === proiectId);

  return (
    <div className="px-4 xl:px-6">
      <ModelProiectNou
        isOpen={isModalProiectNouDeschis}
        onClose={() => setIsModalProiectNouDeschis(false)}
      />
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header
          nume={`Board-ul proiectului ${proiect?.nume || ""}`}
          componentaButon={
            <button
              className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalProiectNouDeschis(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" /> Proiect Nou
            </button>
          }
        />
      </div>
      {/* Tab-uri pentru navigare in cadrul proiectului */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButon
            nume="Board"
            icon={<Grid3X3 className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />

          <TabButon
            nume="Calendar"
            icon={<Clock className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />
          <TabButon
            nume="Tabel"
            icon={<Table className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />
          <TabButon
            nume="Backlog"
            icon={<Layers3 className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />

          <TabButon
            nume="Prioritate Scazuta"
            icon={<AlertOctagon className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />
          <TabButon
            nume="Prioritate Medie"
            icon={<AlertTriangle className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />
          <TabButon
            nume="Prioritate Inalta"
            icon={<ShieldAlert className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />
          <TabButon
            nume="Prioritate Urgenta"
            icon={<AlertCircle className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />
          <TabButon
            nume="Taskuri Arhivate"
            icon={<Lock className="h-5 w-5" />}
            setTabActiv={setTabActiv}
            tabActiv={tabActiv}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <Filter className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

type ButonTabProps = {
  nume: string;
  icon?: React.ReactNode;
  setTabActiv: (tabName: string) => void;
  tabActiv: string;
};

const TabButon = ({ nume, icon, setTabActiv, tabActiv }: ButonTabProps) => {
  const activ = tabActiv === nume; // Verifica dacă tab-ul este activ
  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 hover:text-blue-600 sm:px-2 lg:px-4 ${
        activ ? "-mb-2.5 border-b-2 border-blue-600 text-blue-600" : ""
      }`}
      onClick={() => setTabActiv(nume)} // Schimba tab-ul activ
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-5">{icon}</div>
        <span>{nume}</span>
      </div>
    </button>
  );
};

export default HeaderProiect;
