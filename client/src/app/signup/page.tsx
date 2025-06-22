"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [mail, setMail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmParola, setConfirmParola] = useState("");
  const [eroare, setEroare] = useState("");
  const [utilizator, setUtilizator] = useState<{
    username: string;
    email: string;
    numeEchipa: string;
    numeRol: string;
    pozaProfilUrl: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userLS = localStorage.getItem("utilizator");
    if (userLS) setUtilizator(JSON.parse(userLS));
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const userLS = localStorage.getItem("utilizator");
      if (userLS) setUtilizator(JSON.parse(userLS));
      else setUtilizator(null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setEroare("");
    if (parola !== confirmParola) {
      setEroare("Parolele nu coincid!");
      return;
    }
    const res = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, parola }),
    });
    const data = await res.json();
    if (!res.ok) setEroare(data.message);
    else {
      const userNou = {
        username: data.utilizator.numeUtilizator || "",
        email: data.utilizator.mail || "",
        numeEchipa: data.utilizator.echipaUtilizatorului || "",
        numeRol: data.utilizator.functiaUtilizatorului || "",
        pozaProfilUrl: data.utilizator.pozaProfilUrl || "",
      };
      localStorage.setItem("utilizator", JSON.stringify(userNou));
      window.dispatchEvent(new Event("storage"));
      toast.success("Cont creat cu succes! 🎉", {
        style: {
          borderRadius: "10px",
          background: "#4f46e5",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.1rem",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#4f46e5",
        },
      });
      setTimeout(() => {
        window.location.href = "/acasa";
      }, 1500);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-end"
      style={{
        backgroundImage: "url('/PozaLoginBuna-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mr-0 flex w-full max-w-md flex-col items-center rounded-2xl border border-indigo-100 bg-white/70 p-6 shadow-2xl backdrop-blur-md sm:max-w-sm md:mr-12 md:max-w-md md:p-10">
        <img
          src="/logo.png"
          alt="TaskForge"
          className="mb-4 h-16 w-16 drop-shadow-lg"
        />
        <h2 className="mb-2 text-3xl font-extrabold text-indigo-700">
          Creează cont
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Completează datele pentru a-ți crea un cont TaskForge
        </p>
        <form onSubmit={handleSignup} className="flex w-full flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
            className="rounded-lg border border-indigo-200 p-4 text-lg transition focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Parola"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            required
            className="rounded-lg border border-indigo-200 p-4 text-lg transition focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirmă parola"
            value={confirmParola}
            onChange={(e) => setConfirmParola(e.target.value)}
            required
            className="rounded-lg border border-indigo-200 p-4 text-lg transition focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 p-3 font-semibold text-white shadow transition hover:bg-indigo-700"
          >
            Creează cont
          </button>
          {eroare && <p className="text-center text-red-500">{eroare}</p>}
        </form>
        <div className="mt-8 flex w-full flex-col items-center">
          <span className="text-sm text-gray-500">Ai deja cont?</span>
          <button
            onClick={() => router.push("/login")}
            className="mt-2 rounded-lg border border-indigo-600 px-6 py-2 font-semibold text-indigo-600 transition hover:bg-indigo-50"
            type="button"
          >
            Autentificare
          </button>
        </div>
      </div>
    </div>
  );
}
