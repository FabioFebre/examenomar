'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", { // <-- confirma esta URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usuario, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Usuario o contraseña incorrectos");
      }

      const data = await res.json();

      if (data.role === "admin") {
        localStorage.setItem("role", "admin");
        router.push("/crear-producto");
      } else if (data.role === "user") {
        localStorage.setItem("role", "user");
        router.push("/");
      } else {
        setError("Rol de usuario no reconocido");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#F1EDE2]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-center text-[#375497]">Login</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#375497]"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#375497]"
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-[#375497] text-white py-3 rounded hover:bg-[#2c4374] transition"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
