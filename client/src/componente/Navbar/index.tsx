import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { setSidebarRestrans } from "@/state";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { Menu, Search, Settings, Briefcase, Users, User } from "lucide-react";

const BaraNavigatie = () => {
  const dispatch = useAppDispatch();
  const meniuRestrans = useAppSelector((state) => state.global.sidebarRestrans);

  const [searchTerm, setSearchTerm] = useState("");
  const [utilizator, setUtilizator] = useState<{
    numeUtilizator: string;
    pozaProfilUrl?: string;
  } | null>(null);
  const [dropdownDeschis, setDropdownDeschis] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const userLS = localStorage.getItem("utilizator");
    if (userLS) {
      setUtilizator(JSON.parse(userLS));
    }
  }, []);

  // Închide dropdown la click în afara lui
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownDeschis(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Actualizare utilizator din storage
  useEffect(() => {
    function handleStorageChange() {
      const user = localStorage.getItem("utilizator");
      if (user) setUtilizator(JSON.parse(user));
      else setUtilizator(null);
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSearch = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    // Pentru Enter sau click pe lupa
    if (
      (e as React.KeyboardEvent<HTMLInputElement>).key === "Enter" ||
      (e as React.MouseEvent<SVGSVGElement, MouseEvent>).type === "click"
    ) {
      if (searchTerm.length >= 3) {
        router.push(`/cauta?termen=${encodeURIComponent(searchTerm)}`);
        setSearchTerm("");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("utilizator");
    window.location.href = "/login"; // face refresh și redirect
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Exemplu de request, adaptează URL-ul și opțiunile după nevoie
    await fetch("/api/update-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(utilizator),
    });
    localStorage.setItem("utilizator", JSON.stringify(utilizator));
    window.dispatchEvent(new Event("storage"));
    window.location.reload(); // forțează refresh, Navbar va citi datele noi
  };

  return (
    <nav className="flex items-center justify-between bg-gray-50 px-4 py-3 shadow">
      {/* Buton meniu (stanga) */}
      <div className="flex items-center gap-6">
        {meniuRestrans && (
          <button
            onClick={() => dispatch(setSidebarRestrans(!meniuRestrans))}
            className="rounded p-2 hover:bg-gray-200"
          >
            <Menu className="h-7 w-7 text-gray-700" />
          </button>
        )}
      </div>

      {/* Butoane de navigare + search bar (dreapta) */}
      <div className="flex items-center gap-3">
        {/* Butoane de navigare */}
        <Link
          href="/CalendarProiecte"
          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-3 py-2 text-sm font-semibold text-white shadow transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Briefcase className="h-5 w-5" />
          Calendar
        </Link>
        <Link
          href="/echipe"
          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-400 via-blue-400 to-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <Users className="h-5 w-5" />
          Echipe
        </Link>
        <Link
          href="/utilizatori"
          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow transition-all hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <User className="h-5 w-5" />
          Utilizatori
        </Link>

        {/* Search bar la final, în dreapta */}
        <div className="relative w-[240px]">
          <Search
            className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-600"
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder="Cauta..."
            className="w-full rounded-lg bg-gray-100 px-3 py-2 pl-9 text-sm text-gray-800 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Dropdown pentru setări și logout */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="rounded p-2 transition-all hover:bg-gray-200"
            onClick={() => setDropdownDeschis((v) => !v)}
            type="button"
          >
            <Settings className="h-6 w-6 text-gray-800" />
          </button>
          {dropdownDeschis && (
            <div className="absolute right-0 z-50 mt-2 w-40 rounded bg-white shadow-lg">
              <Link
                href="/setari"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setDropdownDeschis(false)}
              >
                Setări cont
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              >
                Ieșire cont
              </button>
            </div>
          )}
        </div>
        <div className="hidden h-6 w-[1px] bg-gray-300 md:block"></div>

        {utilizator ? (
          <div className="ml-4 flex items-center gap-2">
            {utilizator.pozaProfilUrl ? (
              <img
                src={utilizator.pozaProfilUrl}
                alt="Poza profil"
                className="h-8 w-8 rounded-full border object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                }}
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-400 font-bold text-white">
                {utilizator.numeUtilizator?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <span className="font-medium text-gray-800">
              {utilizator.numeUtilizator}
            </span>
          </div>
        ) : (
          <Link
            href="/login"
            className="ml-4 rounded bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-700"
          >
            Autentificare
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BaraNavigatie;
