"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
} from "lucide-react";

import {
  useAuth,
} from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [mounted, setMounted] =
  useState(false);

  const {
    usuario,
    logout,
  } = useAuth();

  useEffect(() => {

  setMounted(true);

}, []);

  // PROTEGER ADMIN
  useEffect(() => {

    if (!usuario) {
      router.push("/");
      return;
    }

    if (usuario.rol !== "admin") {
      router.push("/");
    }

  }, [usuario, router]);

  if (!mounted) return null;

  if (!usuario) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-xl p-6 flex flex-col">

        {/* LOGO */}
        <div className="mb-10">

          <h1 className="text-3xl font-bold text-primary">
            MAFE Admin
          </h1>

          <p className="text-gray-500 mt-2">
            Panel administrativo
          </p>

        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-3">

          {/* DASHBOARD */}
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 transition"
          >
            <LayoutDashboard className="w-5 h-5" />

            Dashboard
          </Link>

          {/* PRODUCTOS */}
          <Link
            href="/admin/productos"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 transition"
          >
            <Package className="w-5 h-5" />

            Productos
          </Link>

          {/* PEDIDOS */}
          <Link
            href="/admin/pedidos"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 transition"
          >
            <ShoppingBag className="w-5 h-5" />

            Pedidos
          </Link>

          {/* USUARIOS */}
          <Link
            href="/admin/usuarios"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 transition"
          >
            <Users className="w-5 h-5" />

            Usuarios
          </Link>

        </nav>

        {/* USER */}
        <div className="mt-auto border-t pt-6">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
              {usuario.nombre.charAt(0)}
            </div>

            <div>

              <p className="font-semibold">
                {usuario.nombre}
              </p>

              <p className="text-sm text-gray-500">
                {usuario.rol}
              </p>

            </div>

          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-2xl hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />

            Cerrar sesión
          </button>

        </div>

      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}