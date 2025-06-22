"use client";
import Header from "@/componente/Header";
import React, { useEffect, useState } from "react";
import { User, Mail, Users, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const Setari = () => {
  const [utilizator, setUtilizator] = useState({
    username: "",
    email: "",
    numeEchipa: "",
    numeRol: "",
    pozaProfilUrl: "",
  });
  const [parolaVeche, setParolaVeche] = useState("");
  const [parolaNoua, setParolaNoua] = useState("");
  const [confirmParolaNoua, setConfirmParolaNoua] = useState("");
  const [parolaSchimbata, setParolaSchimbata] = useState(false);

  // Preia datele din localStorage la montare
  useEffect(() => {
    const userLS = localStorage.getItem("utilizator");
    if (userLS) {
      const user = JSON.parse(userLS);
      const email = user.email;
      if (email) {
        fetch(`http://localhost:8000/utilizatori/${email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.utilizator) {
              const userNou = {
                username: data.utilizator.numeUtilizator || "",
                email: data.utilizator.mail || "",
                numeEchipa: data.utilizator.echipaUtilizatorului || "",
                numeRol: data.utilizator.functiaUtilizatorului || "",
                pozaProfilUrl: data.utilizator.pozaProfilUrl || "",
              };
              setUtilizator(userNou);
              localStorage.setItem("utilizator", JSON.stringify(userNou));
            }
          });
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUtilizator({ ...utilizator, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/utilizatori", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(utilizator),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Eroare la update: " + (err.message || res.status));
        return;
      }
      const data = await res.json();
      // Folosește cheile corecte!
      const userNou = {
        numeUtilizator: data.utilizator.numeUtilizator,
        email: data.utilizator.mail,
        numeEchipa: data.utilizator.echipaUtilizatorului,
        numeRol: data.utilizator.functiaUtilizatorului,
        pozaProfilUrl: data.utilizator.pozaProfilUrl,
      };
      localStorage.setItem("utilizator", JSON.stringify(userNou));
      window.dispatchEvent(new Event("storage"));
      toast.success("Cont modificat cu succes! 🎉", {
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
    } catch (err) {
      alert("Eroare la fetch: " + err);
    }
  };

  const handlePozaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("poza", file);

      const res = await fetch("http://localhost:8000/upload-poza", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.nume) {
        setUtilizator((prev) => ({
          ...prev,
          pozaProfilUrl: data.nume,
        }));
      }
    }
  };

  const handleSchimbaParola = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parolaNoua !== confirmParolaNoua) {
      toast.error("Parolele noi nu coincid!");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:8000/utilizatori/schimba-parola",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: utilizator.email,
            parolaVeche,
            parolaNoua,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Eroare la schimbare parolă!");
      } else {
        toast.success("Parola a fost schimbată cu succes! 🔒");
        setParolaVeche("");
        setParolaNoua("");
        setConfirmParolaNoua("");
        setParolaSchimbata(true);
        setTimeout(() => setParolaSchimbata(false), 3000);
      }
    } catch (err) {
      toast.error("Eroare la fetch!");
    }
  };

  const stilLabel =
    "flex items-center gap-2 text-sm font-semibold text-indigo-800";
  const stilInput =
    "mt-1 mb-4 block w-full rounded-lg border border-gray-300 bg-white/90 shadow-sm p-3 text-indigo-900 transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white p-8">
      <div className="mb-8 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-300 p-6 shadow-lg">
        <Header nume="Setări cont" />
        <p className="mt-2 text-lg text-white/90">
          Vezi și gestionează informațiile contului tău.
        </p>
      </div>
      <div className="mx-auto max-w-xl rounded-xl bg-white/80 p-8 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className={stilLabel}>
              <User className="h-5 w-5" /> Username
            </label>
            <input
              className={stilInput}
              name="username"
              value={utilizator.username}
              onChange={handleChange}
            />
            <label className={stilLabel}>
              <Mail className="h-5 w-5" /> Email
            </label>
            <input
              className={stilInput}
              name="email"
              value={utilizator.email}
              onChange={handleChange}
              readOnly
            />
            <label className={stilLabel}>
              <Users className="h-5 w-5" /> Echipa
            </label>
            <input
              className={stilInput}
              name="numeEchipa"
              value={utilizator.numeEchipa}
              onChange={handleChange}
            />
            <label className={stilLabel}>
              <Briefcase className="h-5 w-5" /> Funcția
            </label>
            <input
              className={stilInput}
              name="numeRol"
              value={utilizator.numeRol}
              onChange={handleChange}
            />
            <label className={stilLabel}>Imagine profil</label>
            {utilizator.pozaProfilUrl && (
              <img
                src={`${utilizator.pozaProfilUrl}`}
                alt="Poza profil"
                className="mb-4 h-24 w-24 object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handlePozaChange}
              className="mb-4 mt-1 block w-full rounded-lg border border-gray-300 bg-white/90 p-3 text-indigo-900 transition-colors"
            />
            <button
              className="mt-4 rounded bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700"
              onClick={handleSave}
            >
              Salvează modificările
            </button>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-indigo-900">
              Schimbă parola
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Asigură-te că parola nouă este una sigură și unică.
            </p>
            <form onSubmit={handleSchimbaParola} className="mt-8 space-y-3">
              <label className={stilLabel}>Parola veche</label>
              <input
                type="password"
                className={stilInput}
                value={parolaVeche}
                onChange={(e) => setParolaVeche(e.target.value)}
                required
              />

              <label className={stilLabel}>Parola nouă</label>
              <input
                type="password"
                className={stilInput}
                value={parolaNoua}
                onChange={(e) => setParolaNoua(e.target.value)}
                required
              />
              <label className={stilLabel}>Confirmă parola nouă</label>
              <input
                type="password"
                className={stilInput}
                value={confirmParolaNoua}
                onChange={(e) => setConfirmParolaNoua(e.target.value)}
                required
              />
              <button
                type="submit"
                className="rounded bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700"
              >
                Schimbă parola
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setari;
