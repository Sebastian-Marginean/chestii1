"use client";
import React from "react";
// import componente
import Navbar from "@/componente/Navbar";
import Sidebar from "@/componente/Sidebar";
// import StoreProvider si selectorul global
import StoreProvider, { useAppSelector } from "./redux";

// structura paginii dashboard-ului
const StructuraDashboard = ({ children }: { children: React.ReactNode }) => {
  // global pentru a obtine starea meniului restrans
  const meniuRestrans = useAppSelector((state) => state.global.sidebarRestrans);

  return (
    <div className="flex min-h-screen w-full bg-gray-100 text-gray-900">
      <Sidebar />
      <main
        className={`flex w-full flex-col transition-all duration-300 ${
          meniuRestrans ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

// PanouPrincipal incapsuleaza StructuraDashboard si furnizeaza contextul global prin StoreProvider
const PanouPrincipal = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      {/* este responsabil pentru a furniza starea globala pentru toate componentele children */}
      <StructuraDashboard>{children}</StructuraDashboard>
    </StoreProvider>
  );
};

export default PanouPrincipal;
