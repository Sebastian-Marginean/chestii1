import React from "react";

type Props = {
  nume: string;
  componentaButon?: any;
  textMic?: boolean;
};

const Header = ({ nume, componentaButon, textMic = false }: Props) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between">
      <h1 className={`${textMic ? "text-lg" : "text-2xl"} font-semibold`}>
        {nume}
      </h1>
      {componentaButon}
    </div>
  );
};

export default Header;
