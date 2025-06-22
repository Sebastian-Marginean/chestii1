"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mail, setMail] = useState("");
  const [parola, setParola] = useState("");
  const [eroare, setEroare] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEroare("");
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, parola }),
    });
    const data = await res.json();
    if (!res.ok) setEroare(data.message);
    else {
      const userNou = {
        username: data.utilizator.numeUtilizator,
        email: data.utilizator.mail,
        numeEchipa: data.utilizator.echipaUtilizatorului,
        numeRol: data.utilizator.functiaUtilizatorului,
        pozaProfilUrl: data.utilizator.pozaProfilUrl,
      };
      localStorage.setItem("utilizator", JSON.stringify(userNou));
      window.location.href = "/";
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
          Bine ai revenit!
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Autentifică-te pentru a accesa TaskForge
        </p>
        <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
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
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 p-3 font-semibold text-white shadow transition hover:bg-indigo-700"
          >
            Login
          </button>
          {eroare && <p className="text-center text-red-500">{eroare}</p>}
        </form>
        <div className="mt-8 flex w-full flex-col items-center">
          <span className="text-sm text-gray-500">Nu ai cont?</span>
          <button
            onClick={() => router.push("/signup")}
            className="mt-2 rounded-lg border border-indigo-600 px-6 py-2 font-semibold text-indigo-600 transition hover:bg-indigo-50"
            type="button"
          >
            Creează cont
          </button>
        </div>
      </div>
    </div>
  );
}
