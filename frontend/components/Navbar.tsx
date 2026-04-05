"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, User } from "lucide-react";

export default function Navbar() {
  const { cart } = useCart();
  const [showLogin, setShowLogin] = useState(false);

  // Simulación de usuario (luego lo conectas con auth real)
  const user = null; // cambia esto cuando tengas login real

  const totalItems = cart.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary tracking-wide">
              MAFE Beauty
            </h1>
          </Link>

          {/* MENU */}
          <ul className="hidden md:flex gap-8 text-dark font-medium">
            <li>
              <Link href="/" className="hover:text-primary transition">
                Inicio
              </Link>
            </li>

            <li>
              <Link href="/productos" className="hover:text-primary transition">
                Productos
              </Link>
            </li>

            <li>
              <Link href="/categorias" className="hover:text-primary transition">
                Categorías
              </Link>
            </li>

            <li>
              <Link href="/asesoria" className="hover:text-primary transition">
                Asesoría
              </Link>
            </li>

            <li>
              <Link href="/contacto" className="hover:text-primary transition">
                Contacto
              </Link>
            </li>
          </ul>

          {/* ACCIONES */}
          <div className="flex items-center gap-4">

            {/* BUSCAR */}
            <button className="hover:scale-110 transition text-dark">
              <Search size={20} />
            </button>

            {/* CARRITO */}
            <Link href="/carrito" className="relative">

              <div className="bg-primary text-white p-2 rounded-xl shadow hover:scale-105 transition">
                <ShoppingCart size={20} />
              </div>

              {/* CONTADOR */}
              <span
                suppressHydrationWarning
                className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full transition ${
                  totalItems > 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                {totalItems}
              </span>

            </Link>

            {/* LOGIN / USUARIO */}
            {user ? (
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="bg-secondary text-white w-9 h-9 rounded-full flex items-center justify-center">
                  U
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                <User size={18} />
                <span className="hidden md:block">Iniciar sesión</span>
              </button>
            )}

          </div>

        </div>
      </nav>

      {/* MODAL LOGIN */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-xl relative">

            {/* CERRAR */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center text-primary">
              Bienvenido a MAFE 💖
            </h2>

            <p className="text-center text-gray-500 mt-2">
              Accede para una mejor experiencia
            </p>

            {/* GOOGLE */}
            <button className="w-full mt-6 border py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continuar con Google
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-400 text-sm">o</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* FORM */}
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full border p-3 rounded-xl mb-3"
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="w-full border p-3 rounded-xl"
            />

            <button className="w-full mt-4 bg-primary text-white py-3 rounded-xl hover-scale">
              Iniciar sesión
            </button>

          </div>
        </div>
      )}
    </>
  );
}