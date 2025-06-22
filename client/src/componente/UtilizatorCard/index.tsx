import { Utilizator } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
  utilizator: Utilizator;
};

const UtilizatorCard = (props: Props) => {
  return (
    <div className="flex items-center rounded border bg-white p-4 shadow">
      {props.utilizator.pozaProfilUrl && (
        <Image
          src={
            props.utilizator.pozaProfilUrl.startsWith("/")
              ? props.utilizator.pozaProfilUrl
              : "/" + props.utilizator.pozaProfilUrl
          }
          alt="poza profil"
          width={32}
          height={32}
          className="mr-4 rounded-full"
        />
      )}
      <div>
        <h3 className="font-semibold text-indigo-700">
          {props.utilizator.numeUtilizator}
        </h3>
        <h3 className="text-gray-700">{props.utilizator.mail}</h3>
      </div>
    </div>
  );
};

export default UtilizatorCard;
