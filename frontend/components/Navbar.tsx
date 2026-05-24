"use client";

import Link from "next/link";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  ShoppingCart,
  User,
  X,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Heart,
  Search,
  ChevronDown,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

import {
  useCart,
} from "@/context/CartContext";

import {
  useAuth,
} from "@/context/AuthContext";

import Image from "next/image";

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

  const [showUserMenu,
    setShowUserMenu] =
      useState(false);

  const [scrolled,
    setScrolled] =
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

  const menuRef =
    useRef<HTMLDivElement>(null);

  // =====================================
  // MOUNT
  // =====================================

  useEffect(() => {

    setMounted(true);

  }, []);

  // =====================================
  // SCROLL EFFECT
  // =====================================

  useEffect(() => {

    const handleScroll =
      () => {

        setScrolled(
          window.scrollY > 10
        );
      };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  // =====================================
  // CLOSE DROPDOWN
  // =====================================

  useEffect(() => {

    const handleClickOutside =
      (
        event: MouseEvent
      ) => {

        if (
          menuRef.current &&
          !menuRef.current.contains(
            event.target as Node
          )
        ) {

          setShowUserMenu(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

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

      {/* ===================================== */}
      {/* NAVBAR */}
      {/* ===================================== */}

      <header
        className={`sticky top-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-white/85 backdrop-blur-2xl shadow-lg border-b border-white/20"
            : "bg-white/70 backdrop-blur-xl"
        }`}
      >

        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">

          {/* ===================================== */}
          {/* LEFT */}
          {/* ===================================== */}

          <div className="flex items-center gap-10">

            {/* LOGO */}
            <Link
              href="/"
              className="relative group"
            >

              <div className="flex items-center gap-3">

                <div className="w-24 h-14 rounded-full overflow-hidden shadow-lg border border-pink-100 bg-white flex items-center justify-center px-2">

                  <Image
                    src="/logo2.png"
                    alt="MAFE Logo"
                    width={90}
                    height={50}
                    className="object-contain"
                    priority
                  />

                </div>

                <div className="leading-tight">

                  <h1 className="text-2xl font-black tracking-tight">

                    <span className="text-primary">
                      MAFE
                    </span>

                    <span className="text-dark">
                      Beauty
                    </span>

                  </h1>

                  <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 font-semibold">

                    Beauty Store

                  </p>

                </div>

              </div>

            </Link>

            {/* NAV DESKTOP */}
            <nav className="hidden lg:flex items-center gap-2">

              {[
                {
                  label: "Inicio",
                  href: "/",
                },
                {
                  label: "Productos",
                  href: "/productos",
                },
                {
                  label: "Nosotros",
                  href: "/nosotros",
                },
                {
                  label: "Contacto",
                  href: "/contacto",
                },
              ].map((item) => (

                <Link
                  key={item.href}
                  href={item.href}
                  className="px-5 py-3 rounded-2xl text-gray-700 font-medium hover:bg-primary/10 hover:text-primary transition"
                >

                  {item.label}

                </Link>
              ))}

            </nav>

          </div>

          {/* ===================================== */}
          {/* RIGHT */}
          {/* ===================================== */}

          <div className="flex items-center gap-3 md:gap-4">

            {/* SEARCH */}
            <Link
              href="/productos"
              className="hidden md:flex w-11 h-11 rounded-2xl bg-gray-100 hover:bg-primary hover:text-white transition items-center justify-center"
            >

              <Search className="w-5 h-5" />

            </Link>

            {/* CART */}
            <Link
              href="/carrito"
              className="relative w-11 h-11 rounded-2xl bg-gray-100 hover:bg-primary hover:text-white transition flex items-center justify-center"
            >

              <ShoppingCart className="w-5 h-5" />

              {totalItems > 0 && (

                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white px-1">

                  {totalItems}

                </span>
              )}

            </Link>

            {/* USER */}
            {usuario ? (

              <div
                className="relative"
                ref={menuRef}
              >

                {/* BTN */}
                <button
                  onClick={() =>
                    setShowUserMenu(
                      !showUserMenu
                    )
                  }
                  className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 transition px-3 py-2 rounded-2xl"
                >

                  {/* AVATAR */}
                  <div className="w-11 h-11 rounded-2xl bg-brand-gradient text-white flex items-center justify-center font-black shadow-lg">

                    {usuario.nombre.charAt(0)}

                  </div>

                  {/* INFO */}
                  <div className="hidden md:flex flex-col text-left">

                    <span className="font-bold text-sm text-dark">

                      {usuario.nombre}

                    </span>

                    <span className="text-xs text-gray-500 capitalize">

                      {usuario.rol}

                    </span>

                  </div>

                  <ChevronDown className="hidden md:block w-4 h-4 text-gray-400" />

                </button>

                {/* MENU */}
                {showUserMenu && (

                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">

                    {/* TOP */}
                    <div className="bg-brand-gradient p-6 text-white relative overflow-hidden">

                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

                      <div className="relative z-10">

                        <div className="flex items-center gap-4">

                          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-black">

                            {usuario.nombre.charAt(0)}

                          </div>

                          <div>

                            <h3 className="font-black text-xl">

                              {usuario.nombre}

                            </h3>

                            <p className="text-white/80 text-sm mt-1">

                              {usuario.correo}

                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* LINKS */}
                    <div className="p-4 space-y-2">

                      <Link
                        href="/perfil"
                        onClick={() =>
                          setShowUserMenu(false)
                        }
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-gray-100 transition font-medium"
                      >

                        <User className="w-5 h-5 text-primary" />

                        Mi perfil

                      </Link>

                      <Link
                        href="/favoritos"
                        onClick={() =>
                          setShowUserMenu(false)
                        }
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-gray-100 transition font-medium"
                      >

                        <Heart className="w-5 h-5 text-primary" />

                        Favoritos

                      </Link>

                      <Link
                        href="/mis-pedidos"
                        onClick={() =>
                          setShowUserMenu(false)
                        }
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-gray-100 transition font-medium"
                      >

                        <Package className="w-5 h-5 text-primary" />

                        Mis pedidos

                      </Link>

                      {/* ADMIN */}
                      {usuario.rol ===
                        "admin" && (

                        <Link
                          href="/admin"
                          onClick={() =>
                            setShowUserMenu(false)
                          }
                          className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold transition"
                        >

                          <LayoutDashboard className="w-5 h-5" />

                          Panel administrador

                        </Link>
                      )}

                    </div>

                    {/* LOGOUT */}
                    <div className="p-4 border-t border-gray-100">

                      <button
                        onClick={() => {

                          logout();

                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-50 text-red-500 transition font-semibold"
                      >

                        <LogOut className="w-5 h-5" />

                        Cerrar sesión

                      </button>

                    </div>

                  </div>
                )}

              </div>

            ) : (

              <button
                onClick={() =>
                  setShowLogin(true)
                }
                className="hidden md:flex items-center gap-3 bg-primary hover:opacity-90 text-white px-6 py-3 rounded-2xl shadow-xl transition font-bold"
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
              className="lg:hidden w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center"
            >

              {mobileMenu ? (

                <X className="w-6 h-6" />

              ) : (

                <Menu className="w-6 h-6" />
              )}

            </button>

          </div>

        </div>

        {/* ===================================== */}
        {/* MOBILE MENU */}
        {/* ===================================== */}

        {mobileMenu && (

          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-5 animate-fade-in">

            <div className="space-y-2">

              {[
                {
                  label: "Inicio",
                  href: "/",
                },
                {
                  label: "Productos",
                  href: "/productos",
                },
                {
                  label: "Nosotros",
                  href: "/nosotros",
                },
                {
                  label: "Contacto",
                  href: "/contacto",
                },
              ].map((item) => (

                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-gray-100 transition font-medium"
                >

                  <ShoppingBag className="w-5 h-5 text-primary" />

                  {item.label}

                </Link>
              ))}

              {!usuario && (

                <button
                  onClick={() => {

                    setShowLogin(true);

                    setMobileMenu(false);
                  }}
                  className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold"
                >

                  Iniciar sesión

                </button>
              )}

            </div>

          </div>
        )}

      </header>

      {/* ===================================== */}
      {/* LOGIN MODAL */}
      {/* ===================================== */}

      {showLogin && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl fade-in">

            {/* CLOSE */}
            <button
              onClick={() =>
                setShowLogin(false)
              }
              className="absolute top-5 right-5 w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
            >

              <X className="w-5 h-5" />

            </button>

            {/* HEADER */}
            <div className="text-center mb-10">

              <div className="w-20 h-20 mx-auto rounded-[2rem] bg-brand-gradient text-white flex items-center justify-center shadow-xl mb-6">

                <Sparkles className="w-9 h-9" />

              </div>

              <h2 className="text-4xl font-black text-dark">

                Bienvenido ✨

              </h2>

              <p className="text-gray-500 mt-3 text-lg">

                Inicia sesión para continuar

              </p>

            </div>

            {/* INPUTS */}
            <div className="space-y-5">

              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) =>
                  setCorreo(
                    e.target.value
                  )
                }
                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none p-5 rounded-2xl transition"
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
                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none p-5 rounded-2xl transition"
              />

            </div>

            {/* ERROR */}
            {error && (

              <p className="text-red-500 text-sm mt-4 font-medium">

                {error}

              </p>
            )}

            {/* BTN */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-8 bg-primary hover:opacity-90 transition text-white py-5 rounded-2xl font-black text-lg shadow-xl"
            >

              {loading
                ? "Ingresando..."
                : "Iniciar sesión"}

            </button>

            {/* REGISTER */}
            <p className="text-center text-gray-500 mt-7">

              ¿No tienes cuenta?
              {" "}

              <Link
                href="/register"
                className="text-primary font-bold hover:underline"
                onClick={() =>
                  setShowLogin(false)
                }
              >

                Crea cuenta

              </Link>

            </p>

          </div>

        </div>
      )}

    </>
  );
}