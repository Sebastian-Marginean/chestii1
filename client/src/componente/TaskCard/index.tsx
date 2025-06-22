import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type Props = {
  task: Task;
  bgClass?: string;
};

const TaskCard = ({ task, bgClass = "" }: Props) => {
  return (
    <div className={`sha mb-3 rounded bg-white p-4 shadow ${bgClass}`}>
      <p>
        <strong>ID:</strong> {task.id}
      </p>
      <p>
        <strong>Titlu:</strong> {task.titlu}
      </p>
      <p>
        <strong>Descriere:</strong>{" "}
        {typeof task.descriere === "string" && task.descriere.trim() !== ""
          ? task.descriere
          : "Fara descriere"}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Prioritate:</strong> {task.prioritate}
      </p>
      {
        <p>
          <strong>Tags:</strong> {task.tags || "Fara tag"}
        </p>
      }
      <p>
        <strong>Data de inceput:</strong>
        {""}
        {task.dataInceput
          ? format(new Date(task.dataInceput), "P")
          : "Nu a fost setata"}
      </p>
      <p>
        <strong>Data de sfarsit:</strong>
        {""}
        {task.dataLimita
          ? format(new Date(task.dataLimita), "P")
          : "Nu a fost setata"}
      </p>
      <p>
        <strong>Autor:</strong>{" "}
        {task.autor ? task.autor.numeUtilizator : "Necunoscut"}
      </p>
      <p>
        <strong>Asignat:</strong>{" "}
        {task.utilizatorAsignat
          ? task.utilizatorAsignat.numeUtilizator
          : "Neasignat"}
      </p>
    </div>
  );
};

export default TaskCard;
