"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  Settings,
  ShieldAlert,
  User,
  Users,
  Briefcase,
  CircleHelp,
  X,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setSidebarRestrans } from "@/state";
import { useGetProiecteQuery } from "@/state/api";

// Componentele din Sidebar
const Sidebar = () => {
  const [afiseazaProiecte, setAfiseazaProiecte] = useState(true);
  const [afiseazaPrioritati, setAfiseazaPrioritati] = useState(true);

  const { data: proiecte, error, isLoading } = useGetProiecteQuery();

  const dispatch = useAppDispatch();
  const meniuRestrans = useAppSelector((state) => state.global.sidebarRestrans);

  // Clasa CSS dinamica a sidebar-ului
  const clasaMeniu = `fixed flex flex-col h-full justify-between shadow-2xl rounded-r-2xl transition-all duration-300 ease-in-out z-40 overflow-y-auto bg-gradient-to-b from-indigo-100 via-blue-100 to-white ${
    meniuRestrans ? "w-0 hidden" : "w-64"
  }`;

  return (
    <aside className={clasaMeniu}>
      <div className="flex h-full w-full flex-col justify-start">
        {/* Logo-ul si butonul de inchidere al sidebar-ului */}
        <div className="flex min-h-[56px] w-64 items-center justify-between bg-white px-6 py-3">
          <span className="text-xl font-bold text-gray-800">TaskForge</span>
          {!meniuRestrans && (
            <button
              className="p-2"
              onClick={() => dispatch(setSidebarRestrans(!meniuRestrans))}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500" />
            </button>
          )}
        </div>

        {/* Sectiunea echipa si logo */}
        <div className="flex items-center gap-4 border-y border-gray-200 px-6 py-3 transition-transform hover:scale-105">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full shadow"
          />
          <div>
            <h3 className="text-md font-bold tracking-wide text-indigo-700 drop-shadow">
              Echipa FireBall
            </h3>
          </div>
        </div>

        {/* Link-urile de navigare in sidebar */}
        <nav className="w-full">
          <MeniuLink icon={Home} label="Acasa" href="/acasa" />

          <MeniuLink
            icon={User}
            label="Activitatea ta"
            href="/activitatea-ta"
          />
        </nav>

        {/* PROJECTS LINKS */}
        <button
          onClick={() => setAfiseazaProiecte((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-700"
        >
          <span>Proiecte</span>
          {afiseazaProiecte ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {/* PROJECTS LIST */}
        {afiseazaProiecte &&
          proiecte?.map((proiect) => (
            <MeniuLink
              key={proiect.id}
              icon={Briefcase}
              label={proiect.nume}
              href={`/proiecte/${proiect.id}`}
            />
          ))}
      </div>
    </aside>
  );
};

// Componenta pentru fiecare link din meniu
interface MeniuLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const MeniuLink = ({ href, icon: Icon, label }: MeniuLinkProps) => {
  const pathname = usePathname();
  const esteActiv = pathname === href; // Verifica daca link-ul este activ

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 px-6 py-3 transition-all duration-150 hover:scale-[1.03] hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:shadow-md ${
          esteActiv
            ? "border-l-4 border-blue-500 bg-gradient-to-r from-blue-200 to-indigo-100"
            : ""
        } `}
      >
        {esteActiv && (
          <div className="absolute left-0 top-0 h-full w-[4px] rounded-r bg-blue-500" />
        )}
        <Icon className="h-6 w-6 text-blue-600" />
        <span className="font-semibold text-gray-800">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
