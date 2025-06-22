import { X } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  nume: string;
};

function Model({ children, isOpen, onClose, nume }: Props) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
        <Header
          nume={nume}
          componentaButon={
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600"
              onClick={onClose}
            >
              <X size={18}></X>
            </button>
          }
          textMic
        />
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default Model;
