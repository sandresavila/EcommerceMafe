"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  Send,
  MessageCircle,
} from "lucide-react";

import {
  toast,
} from "sonner";

export default function ContactoPage() {

  const [loading,
    setLoading] =
      useState(false);

  const [form,
    setForm] =
      useState({

        nombre: "",

        correo: "",

        mensaje: "",
      });

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange =
    (
      e: React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement
      >
    ) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setLoading(true);

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1200
            )
        );

        toast.success(
          "Mensaje enviado correctamente ✨"
        );

        setForm({

          nombre: "",

          correo: "",

          mensaje: "",
        });

      } catch (error) {

        console.error(error);

        toast.error(
          "Error enviando mensaje"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <main className="min-h-screen bg-[#F8F9FC] overflow-hidden">

      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}

      <section className="relative px-4 sm:px-6 md:px-10 pt-20 md:pt-24 pb-16 md:pb-20">

        {/* BG */}
        <div className="absolute inset-0 bg-brand-gradient opacity-[0.05]" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">

          <div className="fade-in">

            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full font-semibold text-sm mb-6">

              💬 Estamos para ayudarte

            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-dark leading-tight">

              Contáctanos

            </h1>

            <p className="mt-8 text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">

              ¿Tienes dudas, necesitas asesoría o quieres más información
              sobre nuestros productos? Nuestro equipo está listo para ayudarte.

            </p>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* CONTENT */}
      {/* ===================================== */}

      <section className="px-4 sm:px-6 md:px-10 pb-20 md:pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* ===================================== */}
            {/* FORM */}
            {/* ===================================== */}

            <div className="card-modern p-5 sm:p-8 md:p-10 fade-in">

              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                  <MessageCircle className="w-8 h-8" />

                </div>

                <div>

                  <h2 className="text-3xl font-black text-dark">

                    Envíanos un mensaje

                  </h2>

                  <p className="text-gray-500 mt-1">

                    Te responderemos lo antes posible

                  </p>

                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* NOMBRE */}
                <div>

                  <label className="text-sm font-semibold text-gray-700">

                    Nombre completo

                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="input-modern w-full mt-2 px-5 py-4"
                  />

                </div>

                {/* EMAIL */}
                <div>

                  <label className="text-sm font-semibold text-gray-700">

                    Correo electrónico

                  </label>

                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    placeholder="correo@email.com"
                    className="input-modern w-full mt-2 px-5 py-4"
                  />

                </div>

                {/* MENSAJE */}
                <div>

                  <label className="text-sm font-semibold text-gray-700">

                    Mensaje

                  </label>

                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Escribe tu mensaje..."
                    className="input-modern w-full mt-2 px-5 py-4 resize-none"
                  />

                </div>

                {/* BTN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-70"
                >

                  {loading
                    ? "Enviando..."
                    : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar mensaje
                      </>
                    )}

                </button>

              </form>

            </div>

            {/* ===================================== */}
            {/* INFO */}
            {/* ===================================== */}

            <div className="space-y-6 slide-right">

              {/* CONTACTO */}
              <div className="card-modern p-5 sm:p-8">

                <h2 className="text-3xl font-black text-dark mb-8">

                  Información de contacto

                </h2>

                <div className="space-y-6">

                  {/* UBICACION */}
                  <div className="flex items-start gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">

                      <MapPin className="w-6 h-6" />

                    </div>

                    <div>

                      <h3 className="font-bold text-lg">

                        Ubicación

                      </h3>

                      <p className="text-gray-600 mt-1">

                        Soacha, Colombia

                      </p>

                    </div>

                  </div>

                  {/* PHONE */}
                  <div className="flex items-start gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">

                      <Phone className="w-6 h-6" />

                    </div>

                    <div>

                      <h3 className="font-bold text-lg">

                        Teléfono

                      </h3>

                      <p className="text-gray-600 mt-1">

                        +57 312 499 5091

                      </p>

                    </div>

                  </div>

                  {/* EMAIL */}
                  <div className="flex items-start gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">

                      <Mail className="w-6 h-6" />

                    </div>

                    <div>

                      <h3 className="font-bold text-lg">

                        Correo electrónico

                      </h3>

                      <p className="text-gray-600 mt-1 break-all">

                        santi.yer@hotmail.com

                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* HORARIOS */}
              <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient p-5 sm:p-8 text-white shadow-2xl">

                {/* DECOR */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10">

                  <div className="flex items-center gap-4 mb-6">

                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

                      <Clock3 className="w-7 h-7" />

                    </div>

                    <div>

                      <h2 className="text-2xl font-black">

                        Atención al cliente

                      </h2>

                    </div>

                  </div>

                  <div className="space-y-3 text-white/90">

                    <p>

                      Lunes a viernes:
                      {" "}
                      <span className="font-semibold">

                        8:00 AM - 6:00 PM

                      </span>

                    </p>

                    <p>

                      Sábados:
                      {" "}
                      <span className="font-semibold">

                        9:00 AM - 2:00 PM

                      </span>

                    </p>

                    <p>

                      Domingos y festivos:
                      {" "}
                      <span className="font-semibold">

                        Cerrado

                      </span>

                    </p>

                  </div>

                  {/* CTA */}
                  <Link
                    href="/productos"
                    className="inline-flex mt-8 bg-white text-primary px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
                  >

                    Explorar productos

                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
