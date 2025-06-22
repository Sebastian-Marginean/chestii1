import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globalStyles.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";

// Import fonturi
const interFont = Inter({ subsets: ["latin"] });

// Definirea metadatelor pt pagina
export const metadata: Metadata = {
  title: "TaskForge",
  description:
    "TaskForge - Organizeaza si gestioneaza eficient sarcinile tale.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
  },
};

// Structura generala a paginii
export default function AspectGeneral({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${interFont.className} min-h-screen bg-white`}>
        <ClientLayout>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
