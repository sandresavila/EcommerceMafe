"use client";

import Link from "next/link";

import {
  useState,
  useEffect,
} from "react";

import {
  ShoppingCart,
  User,
  X,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";

import {
  useCart,
} from "@/context/CartContext";

import {
  useAuth,
} from "@/context/AuthContext";

export default function Navbar() {

  const { cart } =
    useCart();

  const {
    usuario,
    login,
    logout,
  } = useAuth();

  const [showLogin,
    setShowLogin] =
      useState(false);

  const [mobileMenu,
    setMobileMenu] =
      useState(false);

  const [correo,
    setCorreo] =
      useState("");

  const [password,
    setPassword] =
      useState("");

  const [loading,
    setLoading] =
      useState(false);

  const [error,
    setError] =
      useState("");

  const [mounted,
    setMounted] =
      useState(false);

  useEffect(() => {

    setMounted(true);

  }, []);

  // =====================================
  // TOTAL CARRITO
  // =====================================

  const totalItems =
    cart.reduce(
      (acc, item) =>
        acc +
        item.cantidad,
      0
    );

  // =====================================
  // LOGIN
  // =====================================

  const handleLogin =
    async () => {

      try {

        setLoading(true);

        setError("");

        await login(
          correo,
          password
        );

        setShowLogin(false);

        setCorreo("");

        setPassword("");

      } catch (error) {

        console.error(error);

        setError(
          "Correo o contraseña incorrectos"
        );

      } finally {

        setLoading(false);
      }
    };

  if (!mounted)
    return null;

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link
            href="/"
            className="text-3xl font-black tracking-tight"
          >

            <span className="text-primary">
              MAFE
            </span>

            <span className="text-dark">
              Beauty
            </span>

          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-700">

            <Link
              href="/"
              className="hover:text-primary transition"
            >
              Inicio
            </Link>

            <Link
              href="/productos"
              className="hover:text-primary transition"
            >
              Productos
            </Link>

            <Link
              href="/nosotros"
              className="hover:text-primary transition"
            >
              Nosotros
            </Link>

            <Link
              href="/contacto"
              className="hover:text-primary transition"
            >
              Contacto
            </Link>

          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">

            {/* ADMIN BTN */}
            {usuario?.rol ===
              "admin" && (

              <Link
                href="/admin"
                className="hidden md:flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-2xl font-semibold hover:bg-primary hover:text-white transition"
              >

                <LayoutDashboard className="w-4 h-4" />

                Panel Admin

              </Link>
            )}

            {/* CARRITO */}
            <Link
              href="/carrito"
              className="relative hover:scale-110 transition"
            >

              <ShoppingCart className="w-6 h-6 text-gray-700" />

              {totalItems > 0 && (

                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">

                  {totalItems}

                </span>
              )}

            </Link>

            {/* USUARIO */}
            {usuario ? (

              <div className="flex items-center gap-4">

                {/* AVATAR */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-pink-400 text-white flex items-center justify-center font-bold shadow-lg">

                  {usuario.nombre.charAt(0)}

                </div>

                {/* INFO */}
                <div className="hidden md:flex flex-col">

                  <span className="font-semibold text-sm">
                    {usuario.nombre}
                  </span>

                  <span className="text-xs text-gray-500 capitalize">
                    {usuario.rol}
                  </span>

                </div>

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 border px-4 py-2 rounded-2xl hover:bg-gray-100 transition text-sm"
                >

                  <LogOut className="w-4 h-4" />

                  Salir

                </button>

              </div>

            ) : (

              <button
                onClick={() =>
                  setShowLogin(true)
                }
                className="hidden md:flex items-center gap-2 bg-primary hover:scale-105 transition text-white px-5 py-3 rounded-2xl shadow-lg"
              >

                <User className="w-5 h-5" />

                Iniciar sesión

              </button>
            )}

            {/* MOBILE BTN */}
            <button
              onClick={() =>
                setMobileMenu(
                  !mobileMenu
                )
              }
              className="lg:hidden"
            >

              <Menu className="w-7 h-7" />

            </button>

          </div>

        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (

          <div className="lg:hidden bg-white border-t px-6 py-6 space-y-5 shadow-xl">

            <Link
              href="/"
              className="block"
            >
              Inicio
            </Link>

            <Link
              href="/productos"
              className="block"
            >
              Productos
            </Link>

            <Link
              href="/nosotros"
              className="block"
            >
              Nosotros
            </Link>

            <Link
              href="/contacto"
              className="block"
            >
              Contacto
            </Link>

            {/* ADMIN */}
            {usuario?.rol ===
              "admin" && (

              <>
                <hr />

                <Link
                  href="/admin/dashboard"
                  className="block text-primary font-semibold"
                >
                  Panel Admin
                </Link>
              </>
            )}

          </div>
        )}

      </header>

      {/* MODAL LOGIN */}
      {showLogin && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-md rounded-[2rem] p-10 relative shadow-2xl animate-fade-in">

            {/* CLOSE */}
            <button
              onClick={() =>
                setShowLogin(false)
              }
              className="absolute top-5 right-5 hover:scale-110 transition"
            >

              <X className="w-5 h-5" />

            </button>

            {/* HEADER */}
            <div className="text-center mb-8">

              <h2 className="text-4xl font-black">
                Bienvenido ✨
              </h2>

              <p className="text-gray-500 mt-3">
                Inicia sesión para continuar
              </p>

            </div>

            {/* INPUTS */}
            <div className="space-y-4">

              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) =>
                  setCorreo(
                    e.target.value
                  )
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full border-2 border-gray-200 focus:border-primary outline-none p-4 rounded-2xl"
              />

            </div>

            {/* ERROR */}
            {error && (

              <p className="text-red-500 text-sm mt-3">

                {error}

              </p>
            )}

            {/* BTN */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-6 bg-primary hover:opacity-90 transition text-white py-4 rounded-2xl font-bold text-lg"
            >

              {loading
                ? "Ingresando..."
                : "Iniciar sesión"}

            </button>

          </div>

        </div>
      )}
    </>
  );
}