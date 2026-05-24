"use client";

import Link from "next/link";

import {
  useRouter,
  usePathname,
} from "next/navigation";

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
  Folder,
} from "lucide-react";

import {
  useAuth,
} from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router =
    useRouter();

  const pathname =
    usePathname();

  const [mounted,
    setMounted] =
      useState(false);

  const {
    usuario,
    logout,
  } = useAuth();

  // =====================================
  // MOUNTED
  // =====================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setMounted(true);

      }, 0);

    return () =>
      clearTimeout(timer);

  }, []);

  // =====================================
  // PROTEGER ADMIN
  // =====================================

  useEffect(() => {

    if (!mounted) return;

    if (!usuario) {

      router.push("/");

      return;
    }

    if (
      usuario.rol !== "admin"
    ) {

      router.push("/");
    }

  }, [
    mounted,
    usuario,
    router,
  ]);

  // =====================================
  // LOADING SSR
  // =====================================

  if (
    !mounted ||
    !usuario
  ) {

    return null;
  }

  // =====================================
  // LINKS
  // =====================================

  const links = [

    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      href: "/admin/productos",
      label: "Productos",
      icon: Package,
    },

    {
      href: "/admin/pedidos",
      label: "Pedidos",
      icon: ShoppingBag,
    },

    {
      href: "/admin/categorias",
      label: "Categorías",
      icon: Folder,
    },

    {
      href: "/admin/usuarios",
      label: "Usuarios",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col">

        {/* HEADER */}
        <div className="p-8 border-b">

          <h1 className="text-4xl font-black">

            <span className="text-primary">
              MAFE
            </span>

            <span className="text-dark">
              Admin
            </span>

          </h1>

          <p className="text-gray-500 mt-3">
            Panel administrativo
          </p>

        </div>

        {/* NAV */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto">

          {links.map((link) => {

            const Icon =
              link.icon;

            const active =
              pathname ===
              link.href;

            return (

              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-4 px-5 py-4 rounded-2xl transition font-medium
                  ${
                    active
                      ? "bg-primary text-white shadow-lg"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >

                <Icon className="w-5 h-5" />

                {link.label}

              </Link>
            );
          })}

        </nav>

        {/* USER */}
        <div className="p-5 border-t">

          <div className="bg-gray-50 rounded-3xl p-5">

            {/* INFO */}
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-pink-400 text-white flex items-center justify-center font-black text-xl shadow-lg">

                {usuario.nombre.charAt(0)}

              </div>

              <div>

                <p className="font-bold">

                  {usuario.nombre}

                </p>

                <p className="text-sm text-gray-500 capitalize">

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
              className="mt-5 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-2xl font-semibold"
            >

              <LogOut className="w-5 h-5" />

              Cerrar sesión

            </button>

          </div>

        </div>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">

        {children}

      </main>

    </div>
  );
}