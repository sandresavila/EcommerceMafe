import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid md:grid-cols-4 gap-10">

        {/* MARCA */}
        <div>
          <h2 className="text-2xl font-bold text-primary">
            MAFE Beauty
          </h2>

          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            En MAFE te acompañamos en cada compra, brindándote asesoría
            personalizada para que encuentres los productos de belleza
            ideales según tus necesidades.
          </p>
        </div>

        {/* NAVEGACIÓN */}
        <div>
          <h3 className="font-semibold mb-4 text-primary">
            Navegación
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li>
              <Link href="/" className="hover:text-white transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/productos" className="hover:text-white transition">
                Productos
              </Link>
            </li>
            <li>
              <Link href="/categorias" className="hover:text-white transition">
                Categorías
              </Link>
            </li>
            <li>
              <Link href="/asesoria" className="hover:text-white transition">
                Asesoría
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-white transition">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* AYUDA */}
        <div>
          <h3 className="font-semibold mb-4 text-primary">
            Atención al cliente
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li className="hover:text-white transition cursor-pointer">
              Envíos
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Devoluciones
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Soporte
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Preguntas frecuentes
            </li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h3 className="font-semibold mb-4 text-primary">
            Contáctanos
          </h3>

          <ul className="space-y-3 text-gray-300 text-sm">
            <li>📍 Colombia</li>
            <li>📞 +57 311 461 8213</li>
            <li>✉ santi.yer@hotmail.com</li>
          </ul>

          {/* BOTÓN WHATSAPP */}
          <button className="mt-4 bg-secondary px-4 py-2 rounded-xl hover-scale text-sm">
            💬 Hablar por WhatsApp
          </button>

          {/* REDES */}
          <div className="flex gap-4 text-xl mt-6">

            <span className="hover:text-primary hover:scale-110 transition cursor-pointer">
              📷
            </span>

            <span className="hover:text-primary hover:scale-110 transition cursor-pointer">
              📘
            </span>

            <span className="hover:text-primary hover:scale-110 transition cursor-pointer">
              🐦
            </span>

          </div>

        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="text-center py-6 border-t border-gray-700 text-sm text-gray-400">
        © 2026 MAFE Beauty — Todos los derechos reservados
      </div>

    </footer>
  );
}