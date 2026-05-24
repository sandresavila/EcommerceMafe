import Link from "next/link";

import {
  Sparkles,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

export default function Footer() {

  return (

    <footer className="relative mt-24 overflow-hidden bg-[#111111] text-white">

      <div className="absolute inset-0 bg-gradient-to-b from-[#181818] to-black opacity-90" />

      {/* BG EFFECT */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#E91E63,transparent_35%)]" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

      {/* TOP CTA */}
      <div className="relative border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-xl">

              <Sparkles className="w-7 h-7 text-white" />

            </div>

            <div>

              <h2 className="text-3xl font-black">

                <span className="text-primary">
                  MAFE
                </span>

                {" "}

                Beauty

              </h2>

              <p className="text-gray-300 text-sm mt-1">

                Belleza, skincare y asesoría personalizada

              </p>

            </div>

          </div>

          {/* BTN */}
          <button className="bg-secondary hover:scale-105 hover:shadow-blue-500/30 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 shadow-xl">

            <MessageCircle className="w-5 h-5" />

            Hablar por WhatsApp

          </button>

        </div>

      </div>

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* MARCA */}
        <div>

          <h3 className="text-2xl font-black mb-6">

            <span className="text-primary">
              MAFE
            </span>

            {" "}

            Beauty

          </h3>

          <p className="text-gray-200 leading-relaxed">

            En MAFE te acompañamos en cada compra, brindándote asesoría
            personalizada para ayudarte a encontrar los productos ideales
            según tus necesidades.

          </p>

          {/* REDES */}
          <div className="flex items-center gap-4 mt-8">

            <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-primary transition flex items-center justify-center text-xl">

              📷

            </button>

            <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-primary transition flex items-center justify-center text-xl">

              📘

            </button>

            <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-primary transition flex items-center justify-center text-xl">

              🐦

            </button>

          </div>

        </div>

        {/* NAVEGACIÓN */}
        <div>

          <h3 className="font-bold text-xl mb-7 text-white tracking-wide">

            Navegación

          </h3>

          <ul className="space-y-4">

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
              {
                label: "Mi perfil",
                href: "/perfil",
              },
            ].map((item) => (

              <li key={item.href}>

                <Link
                  href={item.href}
                  className="flex items-center gap-3 text-gray-200 hover:text-primary transition group"
                >

                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />

                  {item.label}

                </Link>

              </li>
            ))}

          </ul>

        </div>

        {/* AYUDA */}
        <div>

          <h3 className="font-bold text-xl mb-7 text-white tracking-wide">

            Atención al cliente

          </h3>

          <ul className="space-y-4 text-gray-200">

            <li className="hover:text-primary transition cursor-pointer">

              Envíos y entregas

            </li>

            <li className="hover:text-primary transition cursor-pointer">

              Cambios y devoluciones

            </li>

            <li className="hover:text-primary transition cursor-pointer">

              Preguntas frecuentes

            </li>

            <li className="hover:text-primary transition cursor-pointer">

              Términos y condiciones

            </li>

            <li className="hover:text-primary transition cursor-pointer">

              Política de privacidad

            </li>

          </ul>

        </div>

        {/* CONTACTO */}
        <div>

          <h3 className="font-bold text-xl mb-7 text-white tracking-wide">

            Contáctanos

          </h3>

          <div className="space-y-5">

            {/* UBICACIÓN */}
            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">

                <MapPin className="w-5 h-5 text-primary" />

              </div>

              <div>

                <p className="font-medium text-white">

                  Ubicación

                </p>

                <p className="text-sm text-gray-300 mt-1">

                  Soacha, Colombia

                </p>

              </div>

            </div>

            {/* TEL */}
            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">

                <Phone className="w-5 h-5 text-primary" />

              </div>

              <div>

                <p className="font-medium text-white">

                  Teléfono

                </p>

                <p className="text-sm text-gray-300 mt-1">

                  +57 311 461 8213

                </p>

              </div>

            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">

                <Mail className="w-5 h-5 text-primary" />

              </div>

              <div>

                <p className="font-medium text-white">

                  Correo

                </p>

                <p className="text-sm text-gray-300 mt-1 break-all">

                  santi.yer@hotmail.com

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="relative border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-300">

          <p className="text-center md:text-left">

            © 2026 MAFE Beauty — Todos los derechos reservados

          </p>

          <div className="flex items-center gap-6">

            <span className="hover:text-primary transition cursor-pointer">

              Privacidad

            </span>

            <span className="hover:text-primary transition cursor-pointer">

              Términos

            </span>

            <span className="hover:text-primary transition cursor-pointer">

              Soporte

            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}