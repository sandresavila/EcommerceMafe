"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search } from "lucide-react";
import { useEffect, useState } from "react"; // Añadido para arreglar el contador

export default function Navbar() {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false); // Para evitar errores de hidratación

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalItems = cart.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  return (
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
            <Link href="/" className="hover:text-primary transition">Inicio</Link>
          </li>
          <li>
            <Link href="/productos" className="hover:text-primary transition">Productos</Link>
          </li>
          {/* BOTÓN DE ADMIN AÑADIDO */}
          <li>
            <Link href="/admin" className="text-primary font-bold hover:opacity-80 transition">
              Admin
            </Link>
          </li>
          <li>
            <Link href="/nosotros" className="hover:text-primary transition">Nosotros</Link>
          </li>
          <li>
            <Link href="/contacto" className="hover:text-primary transition">Contacto</Link>
          </li>
        </ul>

        {/* ACCIONES */}
        <div className="flex items-center gap-4">
          <button className="hover:scale-110 transition text-dark">
            <Search size={20} />
          </button>

          <Link href="/carrito" className="relative">
            <div className="bg-primary text-white p-2 rounded-xl shadow hover:scale-105 transition">
              <ShoppingCart size={20} />
            </div>

            {/* CONTADOR CORREGIDO */}
            {isMounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full transition">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}