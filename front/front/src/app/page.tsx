"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [cart, setCart] = useState([]);
  const [role, setRole] = useState('');

  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");

    if (!storedRole || storedRole !== "user") {
      router.replace("/login");
    } else {
      setRole(storedRole);
      setUsername(storedUsername || "Usuario");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("https://examenomar.onrender.com/api/products");
        if (!res.ok) throw new Error("Error al obtener productos");

        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      }
    };

    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    setCart((prev) => [...prev, producto]);
  };

  if (loading) return null;

  return (
    <main className="min-h-screen flex bg-[#F1EDE2] p-6 gap-6">
      {/* Sección de productos */}
      <section className="flex-1">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#375497]">Bienvenido, {username}</h1>
          {/* Icono carrito solo en mobile */}
          <div className="lg:hidden relative">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                {cart.length}
              </span>
            )}
          </div>
        </header>

        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
            >
              <div>
                {prod.image_url && (
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <h2 className="text-lg font-semibold text-[#375497]">{prod.name}</h2>
                <p className="text-gray-600 mt-1">${prod.price}</p>
                <p className="text-sm text-gray-500">Stock: {prod.stock}</p>
                <p className="text-sm text-gray-400">{prod.description}</p>
              </div>
              <button
                onClick={() => agregarAlCarrito(prod)}
                className="mt-4 bg-[#375497] text-white py-2 rounded hover:bg-[#2c4374] transition"
              >
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sidebar del carrito */}
      <aside className="w-80 bg-white rounded-xl shadow p-4 hidden lg:flex flex-col">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">🛒 Carrito</h2>
          {cart.length > 0 && (
            <span className="bg-red-600 text-black text-xs rounded-full px-2">{cart.length}</span>
          )}
        </header>

        {cart.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between text-sm border-b py-1">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
        )}

        {cart.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="font-semibold">
              Total: ${cart.reduce((acc, item) => acc + item.price, 0)}
            </p>
            <button
              className="mt-2 bg-green-600 text-black py-2 rounded hover:bg-green-700 w-full transition"
              onClick={() => {
                localStorage.setItem("cart", JSON.stringify(cart));
                router.push("/checkout");
              }}
            >
              Finalizar compra
            </button>
          </div>
        )}
      </aside>
    </main>
  );
}
