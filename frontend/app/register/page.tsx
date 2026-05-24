"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import axios from "axios";

import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useRouter,
} from "next/navigation";

export default function RegisterPage() {

  const router =
    useRouter();

  // =====================================
  // STATES
  // =====================================

  const [nombre,
    setNombre] =
      useState("");

  const [correo,
    setCorreo] =
      useState("");

  const [password,
    setPassword] =
      useState("");

  const [confirmPassword,
    setConfirmPassword] =
      useState("");

  const [telefono,
    setTelefono] =
      useState("");

  const [direccion,
    setDireccion] =
      useState("");

  const [showPassword,
    setShowPassword] =
      useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
      useState(false);

  const [loading,
    setLoading] =
      useState(false);

  // =====================================
  // REGISTER
  // =====================================

  const handleRegister =
    async () => {

      try {

        // VALIDACIONES

        if (!nombre.trim()) {

          toast.error(
            "Ingresa tu nombre"
          );

          return;
        }

        if (!correo.trim()) {

          toast.error(
            "Ingresa el correo"
          );

          return;
        }

        if (
          password.length < 6
        ) {

          toast.error(
            "La contraseña debe tener mínimo 6 caracteres"
          );

          return;
        }

        if (
          password !==
          confirmPassword
        ) {

          toast.error(
            "Las contraseñas no coinciden"
          );

          return;
        }

        setLoading(true);

        // REQUEST

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            nombre,
            correo,
            password,
            telefono,
            direccion,
          }
        );

        toast.success(
          "Cuenta creada correctamente ✨"
        );

        // REDIRECT

        setTimeout(() => {

          router.push("/");

        }, 1500);

      } catch (error: unknown) {

        console.error(error);

        toast.error(
          "Error registrando usuario"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <main className="min-h-screen bg-[#F8F9FC] overflow-hidden grid lg:grid-cols-2">

      {/* ===================================== */}
      {/* LEFT */}
      {/* ===================================== */}

      <section className="hidden lg:flex relative overflow-hidden items-center justify-center p-16">

        {/* BG */}
        <div className="absolute inset-0 bg-brand-gradient" />

        {/* GLOW */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-xl text-white fade-in">

          {/* BADGE */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full font-semibold mb-10">

            <Sparkles className="w-5 h-5" />

            Bienvenido a MAFE Beauty

          </div>

          {/* TITLE */}
          <h1 className="text-6xl font-black leading-tight">

            Crea tu cuenta y vive una experiencia beauty premium ✨

          </h1>

          {/* DESC */}
          <p className="mt-8 text-xl text-white/90 leading-relaxed">

            Accede a productos exclusivos, historial de pedidos,
            favoritos y asesoría personalizada.

          </p>

          {/* BENEFITS */}
          <div className="mt-12 space-y-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">

                <ShieldCheck className="w-6 h-6" />

              </div>

              <span className="text-lg">

                Compra segura y protegida

              </span>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">

                <Sparkles className="w-6 h-6" />

              </div>

              <span className="text-lg">

                Productos originales garantizados

              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* RIGHT */}
      {/* ===================================== */}

      <section className="flex items-center justify-center px-4 md:px-8 py-12">

        <div className="w-full max-w-2xl">

          {/* MOBILE HEADER */}
          <div className="lg:hidden text-center mb-10">

            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-5 py-3 rounded-full font-semibold mb-5">

              <Sparkles className="w-5 h-5" />

              Crear cuenta

            </div>

            <h1 className="text-5xl font-black text-dark">

              Bienvenido ✨

            </h1>

          </div>

          {/* CARD */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">

            {/* TOP */}
            <div className="px-8 md:px-10 pt-10">

              <h2 className="text-5xl font-black text-dark">

                Crear cuenta

              </h2>

              <p className="text-gray-500 mt-4 text-lg">

                Regístrate para comenzar tu experiencia MAFE Beauty

              </p>

            </div>

            {/* FORM */}
            <div className="p-8 md:p-10">

              <div className="grid md:grid-cols-2 gap-5">

                {/* NOMBRE */}
                <div className="relative md:col-span-2">

                  <User className="absolute left-5 top-5 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={(e) =>
                      setNombre(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none pl-14 pr-5 py-5 rounded-2xl transition"
                  />

                </div>

                {/* CORREO */}
                <div className="relative md:col-span-2">

                  <Mail className="absolute left-5 top-5 w-5 h-5 text-gray-400" />

                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) =>
                      setCorreo(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none pl-14 pr-5 py-5 rounded-2xl transition"
                  />

                </div>

                {/* PASSWORD */}
                <div className="relative">

                  <Lock className="absolute left-5 top-5 w-5 h-5 text-gray-400" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none pl-14 pr-14 py-5 rounded-2xl transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-5 top-5 text-gray-400"
                  >

                    {showPassword ? (

                      <EyeOff className="w-5 h-5" />

                    ) : (

                      <Eye className="w-5 h-5" />
                    )}

                  </button>

                </div>

                {/* CONFIRM */}
                <div className="relative">

                  <Lock className="absolute left-5 top-5 w-5 h-5 text-gray-400" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none pl-14 pr-14 py-5 rounded-2xl transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-5 top-5 text-gray-400"
                  >

                    {showConfirmPassword ? (

                      <EyeOff className="w-5 h-5" />

                    ) : (

                      <Eye className="w-5 h-5" />
                    )}

                  </button>

                </div>

                {/* TELEFONO */}
                <div className="relative">

                  <Phone className="absolute left-5 top-5 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) =>
                      setTelefono(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none pl-14 pr-5 py-5 rounded-2xl transition"
                  />

                </div>

                {/* DIRECCION */}
                <div className="relative">

                  <MapPin className="absolute left-5 top-5 w-5 h-5 text-gray-400" />

                  <textarea
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) =>
                      setDireccion(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none pl-14 pr-5 py-5 rounded-2xl h-[92px] resize-none transition"
                  />

                </div>

              </div>

              {/* BTN */}
              <button
                onClick={
                  handleRegister
                }
                disabled={
                  loading
                }
                className={`w-full mt-8 h-16 rounded-2xl text-white font-black text-lg shadow-xl transition flex items-center justify-center gap-3
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:scale-[1.01] hover:opacity-90"
                }`}
              >

                {loading ? (

                  "Creando cuenta..."

                ) : (

                  <>
                    Crear cuenta

                    <ArrowRight className="w-5 h-5" />
                  </>
                )}

              </button>

              {/* LOGIN */}
              <div className="mt-8 text-center">

                <p className="text-gray-500 text-lg">

                  ¿Ya tienes cuenta?
                  {" "}

                  <Link
                    href="/"
                    className="text-primary font-bold hover:underline"
                  >

                    Inicia sesión

                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}