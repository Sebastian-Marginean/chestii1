"use client";

import React, { useState } from "react";
import HeaderProiect from "@/app/proiecte/HeaderProiect";
import Board from "../VizualizareBoard";
import Lista from "../VizualizareLista";
import Calendar from "../VizualizareCalendar";
import Tabel from "../VizualizareTabel";
import ModelTaskNou from "@/componente/ModelTaskNou";
import PrioritateScazuta from "../PrioritateScazuta";
import Backlog from "../Backlog";
import PrioritateMedie from "../PrioritateMedie";
import PrioritateInalta from "../PrioritateInalta";
import PrioritateUrgenta from "../PrioritateUrgenta";
import TaskuriArhivate from "../TaskuriArhivate";

type Props = {
  params: { id: string };
};

const Proiect = ({ params }: Props) => {
  const { id } = params;
  const [tabActiv, setTabActiv] = useState("Board");
  const [isModalNewTaskOpen, setisModalNewTaskOpen] = useState(false);

  console.log("Proiect componenta este randata");

  return (
    <div>
      <ModelTaskNou
        isOpen={isModalNewTaskOpen}
        onClose={() => setisModalNewTaskOpen(false)}
        id={id}
      />
      <HeaderProiect
        tabActiv={tabActiv}
        setTabActiv={setTabActiv}
        proiectId={Number(id)}
      />
      {tabActiv === "Board" && (
        <Board id={id} setisModalNewTaskOpen={setisModalNewTaskOpen} />
      )}
      {tabActiv === "Calendar" && (
        <Calendar id={id} setisModalNewTaskOpen={setisModalNewTaskOpen} />
      )}
      {tabActiv === "Tabel" && (
        <Tabel id={id} setisModalNewTaskOpen={setisModalNewTaskOpen} />
      )}
      {tabActiv === "Backlog" && (
        <Backlog id={id} setisModalNewTaskOpen={setisModalNewTaskOpen} />
      )}
      {tabActiv === "Prioritate Scazuta" && (
        <PrioritateScazuta
          id={id}
          setisModalNewTaskOpen={setisModalNewTaskOpen}
        />
      )}
      {tabActiv === "Prioritate Medie" && (
        <PrioritateMedie
          id={id}
          setisModalNewTaskOpen={setisModalNewTaskOpen}
        />
      )}
      {tabActiv === "Prioritate Inalta" && (
        <PrioritateInalta
          id={id}
          setisModalNewTaskOpen={setisModalNewTaskOpen}
        />
      )}
      {tabActiv === "Prioritate Urgenta" && (
        <PrioritateUrgenta
          id={id}
          setisModalNewTaskOpen={setisModalNewTaskOpen}
        />
      )}
      {tabActiv === "Taskuri Arhivate" && (
        <TaskuriArhivate
          id={id}
          setisModalNewTaskOpen={setisModalNewTaskOpen}
        />
      )}
    </div>
  );
};

export default Proiect;
