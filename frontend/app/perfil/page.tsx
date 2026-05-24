"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  ShoppingBag,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useAuth,
} from "@/context/AuthContext";

export default function PerfilPage() {

  const {
    usuario,
    token,
  } = useAuth();

  const [nombre,
    setNombre] =
      useState("");

  const [correo,
    setCorreo] =
      useState("");

  const [telefono,
    setTelefono] =
      useState("");

  const [direccion,
    setDireccion] =
      useState("");

  const [loading,
    setLoading] =
      useState(true);

  const [saving,
    setSaving] =
      useState(false);

  // =====================================
  // FETCH PERFIL
  // =====================================

  useEffect(() => {

    const fetchPerfil =
      async () => {

        try {

          const response =
            await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/usuarios/perfil`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setNombre(
            response.data.nombre
          );

          setCorreo(
            response.data.correo
          );

          setTelefono(
            response.data.telefono || ""
          );

          setDireccion(
            response.data.direccion || ""
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Error cargando perfil"
          );

        } finally {

          setLoading(false);
        }
      };

    if (token) {

      fetchPerfil();
    }

  }, [token]);

  // =====================================
  // GUARDAR PERFIL
  // =====================================

  const guardarPerfil =
    async () => {

      try {

        if (!nombre.trim()) {

          toast.error(
            "Ingresa tu nombre"
          );

          return;
        }

        setSaving(true);

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/perfil`,
          {
            nombre,
            telefono,
            direccion,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Perfil actualizado correctamente ✨"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Error actualizando perfil"
        );

      } finally {

        setSaving(false);
      }
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">

        <div className="text-center">

          <div className="w-20 h-20 border-[6px] border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />

          <p className="mt-6 text-gray-500 text-lg">

            Cargando perfil...

          </p>

        </div>

      </div>
    );
  }

  return (

    <main className="min-h-screen bg-[#F8F9FC] px-4 md:px-8 py-14 overflow-hidden">

      <div className="max-w-6xl mx-auto">

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div className="text-center mb-14 fade-in">

          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold mb-6">

            <Sparkles className="w-5 h-5" />

            Cuenta personal

          </div>

          <h1 className="text-5xl md:text-6xl font-black text-dark">

            Mi perfil

          </h1>

          <p className="text-gray-500 text-lg mt-5 max-w-2xl mx-auto">

            Gestiona tu información personal, datos de contacto
            y preferencias de tu cuenta.

          </p>

        </div>

        {/* ===================================== */}
        {/* LAYOUT */}
        {/* ===================================== */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ===================================== */}
          {/* SIDEBAR */}
          {/* ===================================== */}

          <aside className="lg:col-span-1 slide-left">

            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">

              {/* TOP */}
              <div className="relative overflow-hidden bg-brand-gradient px-8 py-12 text-white">

                {/* DECOR */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">

                  {/* AVATAR */}
                  <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-5xl font-black border border-white/30 shadow-xl">

                    {usuario?.nombre?.charAt(0)}

                  </div>

                  {/* INFO */}
                  <h2 className="text-3xl font-black mt-6">

                    {nombre}

                  </h2>

                  <p className="text-white/80 mt-2 text-sm break-all">

                    {correo}

                  </p>

                  <span className="mt-5 bg-white/20 px-5 py-2 rounded-full text-sm capitalize font-semibold">

                    {usuario?.rol}

                  </span>

                </div>

              </div>

              {/* STATS */}
              <div className="p-8 space-y-5">

                {/* ITEM */}
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                    <ShieldCheck className="w-7 h-7" />

                  </div>

                  <div>

                    <h3 className="font-bold text-dark">

                      Cuenta segura

                    </h3>

                    <p className="text-sm text-gray-500">

                      Protección activa

                    </p>

                  </div>

                </div>

                {/* ITEM */}
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">

                    <ShoppingBag className="w-7 h-7" />

                  </div>

                  <div>

                    <h3 className="font-bold text-dark">

                      Compras rápidas

                    </h3>

                    <p className="text-sm text-gray-500">

                      Experiencia optimizada

                    </p>

                  </div>

                </div>

                {/* ITEM */}
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">

                    <BadgeCheck className="w-7 h-7" />

                  </div>

                  <div>

                    <h3 className="font-bold text-dark">

                      Cliente verificado

                    </h3>

                    <p className="text-sm text-gray-500">

                      Perfil actualizado

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

          {/* ===================================== */}
          {/* FORM */}
          {/* ===================================== */}

          <section className="lg:col-span-2 slide-right">

            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10">

              {/* TITLE */}
              <div className="mb-10">

                <h2 className="text-4xl font-black text-dark">

                  Información personal

                </h2>

                <p className="text-gray-500 mt-3">

                  Actualiza tus datos personales y de contacto.

                </p>

              </div>

              {/* GRID */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* NOMBRE */}
                <div>

                  <label className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">

                    <User className="w-4 h-4" />

                    Nombre completo

                  </label>

                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) =>
                      setNombre(
                        e.target.value
                      )
                    }
                    className="w-full h-16 border-2 border-gray-200 bg-gray-50 rounded-2xl px-5 outline-none focus:border-primary transition"
                  />

                </div>

                {/* CORREO */}
                <div>

                  <label className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">

                    <Mail className="w-4 h-4" />

                    Correo electrónico

                  </label>

                  <input
                    type="email"
                    value={correo}
                    disabled
                    className="w-full h-16 bg-gray-100 border-2 border-gray-200 rounded-2xl px-5 text-gray-500"
                  />

                </div>

                {/* TELEFONO */}
                <div>

                  <label className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">

                    <Phone className="w-4 h-4" />

                    Teléfono

                  </label>

                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) =>
                      setTelefono(
                        e.target.value
                      )
                    }
                    className="w-full h-16 border-2 border-gray-200 bg-gray-50 rounded-2xl px-5 outline-none focus:border-primary transition"
                  />

                </div>

                {/* DIRECCION */}
                <div className="md:col-span-2">

                  <label className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">

                    <MapPin className="w-4 h-4" />

                    Dirección

                  </label>

                  <textarea
                    value={direccion}
                    onChange={(e) =>
                      setDireccion(
                        e.target.value
                      )
                    }
                    className="w-full border-2 border-gray-200 bg-gray-50 rounded-2xl p-5 h-40 resize-none outline-none focus:border-primary transition"
                  />

                </div>

              </div>

              {/* BTN */}
              <button
                onClick={
                  guardarPerfil
                }
                disabled={
                  saving
                }
                className={`mt-10 w-full h-16 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition
                ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:scale-[1.01]"
                }`}
              >

                <Save className="w-5 h-5" />

                {saving
                  ? "Guardando cambios..."
                  : "Guardar cambios"}

              </button>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}