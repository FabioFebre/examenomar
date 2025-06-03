"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    correo: "",
  });

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      router.push("/");
    }
  }, [router]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.direccion || !form.correo) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    console.log("Datos de envío:", form);
    console.log("Productos comprados:", cart);
    alert("¡Compra realizada con éxito!");

    // Limpiar carrito
    localStorage.removeItem("cart");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#F1EDE2] p-8 text-black">
      <h1 className="text-3xl font-bold text-[#375497] mb-6">Finalizar Compra</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-black">Tus datos</h2>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleInput}
            className="w-full p-3 border rounded text-black"
            required
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleInput}
            className="w-full p-3 border rounded text-black"
            required
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleInput}
            className="w-full p-3 border rounded text-black"
            required
          />

          <button className="bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700 transition">
            Confirmar pedido
          </button>
        </form>

        {/* Resumen de compra */}
        <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 text-black">
          <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>
          {cart.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item, i) => (
                <li key={i} className="flex justify-between text-sm border-b py-1">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 font-semibold">
            Total: ${cart.reduce((acc, item) => acc + item.price, 0)}
          </p>
        </div>
      </div>
    </main>
  );
}
