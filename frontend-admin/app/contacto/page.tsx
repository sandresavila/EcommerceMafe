"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 Aquí luego conectamos backend
    console.log(form);

    alert("Mensaje enviado correctamente ✨");

    setForm({
      nombre: "",
      correo: "",
      mensaje: "",
    });
  };

  return (
    <main className="px-6 md:px-10 py-16 max-w-6xl mx-auto">

      {/* HEADER */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Contáctanos
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          ¿Tienes dudas o necesitas ayuda? Estamos aquí para ti.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-10">

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 space-y-4"
        >

          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full mt-1 border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full mt-1 border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mensaje</label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              rows={4}
              className="w-full mt-1 border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl hover-scale"
          >
            Enviar mensaje
          </button>

        </form>

        {/* INFO CONTACTO */}
        <div className="space-y-6">

          <div className="bg-gray-100 p-6 rounded-2xl">
            <h2 className="font-semibold text-lg text-primary">
              Información de contacto
            </h2>

            <p className="text-gray-600 mt-2">
              📍 Soacha, Colombia
            </p>

            <p className="text-gray-600">
              📞 +57 312 499 5091
            </p>

            <p className="text-gray-600">
              ✉ santi.yer@hotmail.com
            </p>
          </div>

          <div className="bg-brand-gradient text-white p-6 rounded-2xl">
            <h2 className="font-semibold text-lg">
              Atención al cliente
            </h2>

            <p className="mt-2 text-sm">
              Lunes a viernes: 8:00 AM - 6:00 PM
            </p>

            <p className="text-sm">
              Sábados: 9:00 AM - 2:00 PM
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}