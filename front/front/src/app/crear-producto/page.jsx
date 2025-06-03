"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GestionProductos() {
  const router = useRouter();

  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null); // ID del producto en edición

  // Validar rol y cargar productos
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.replace("/login");
    } else {
      fetchProductos();
      setLoading(false);
    }
  }, [router]);

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setMensaje("Error al cargar los productos");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("Enviando...");

    const url = editando
      ? `http://localhost:5000/api/products/${editando}`
      : "http://localhost:5000/api/products";
    const method = editando ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al guardar el producto");

      setMensaje(editando ? " Producto actualizado" : " Producto creado");
      setForm({ name: "", description: "", price: "", stock: "" });
      setEditando(null);
      fetchProductos();
    } catch (err) {
      setMensaje(` ${err.message}`);
    }
  };

  const handleEdit = (producto) => {
    setForm({
      name: producto.name,
      description: producto.description,
      price: producto.price,
      stock: producto.stock,
    });
    setEditando(producto.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar el producto");
      setMensaje("Producto eliminado");
      fetchProductos();
    } catch (err) {
      setMensaje(` ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F1EDE2] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#A68461]">Gestión de Productos</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#F7F1EC] border border-[#E2D6C6] p-6 rounded-xl mb-10 shadow">
          <h3 className="text-xl font-bold text-[#A68461] mb-4">
            {editando ? "Editar Producto" : "Crear Producto"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-[#E2D6C6] rounded-lg bg-white text-[#A68461]"

            />
            <input
              name="price"
              type="number"
              placeholder="Precio"
              value={form.price}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-[#E2D6C6] rounded-lg bg-white text-[#A68461]"
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-[#E2D6C6] rounded-lg bg-white text-[#A68461]"

            />
            <textarea
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              className="px-4 py-2 border border-[#E2D6C6] rounded-lg bg-white text-[#A68461]"

            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full py-3 bg-[#A68461] hover:bg-[#8a6a4c] text-white rounded-xl font-semibold"
          >
            {editando ? "Actualizar" : "Crear"} Producto
          </button>
          {mensaje && (
            <p className="mt-4 text-center text-sm text-[#A68461] font-medium">{mensaje}</p>
          )}
        </form>

        <h3 className="text-2xl font-bold text-[#A68461] mb-4">Lista de Productos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl border border-[#A68461] text-left">
            <thead className="bg-[#E2D6C6] text-[#A68461]">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[#A68461]">
                {productos.map((p) => (
                    <tr key={p.id} className="border-t border-[#A68461]">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.description}</td>
                    <td className="p-3">S/ {parseFloat(p.price).toFixed(2)}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3 space-x-2">
                        <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                        Editar
                        </button>
                        <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                        Eliminar
                        </button>
                    </td>
                    </tr>
                ))}
                {productos.length === 0 && (
                    <tr>
                    <td colSpan="5" className="text-center text-[#A68461] py-4">
                        No hay productos disponibles.
                    </td>
                    </tr>
                )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
