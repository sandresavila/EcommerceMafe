import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-dark mt-20">

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid md:grid-cols-4 gap-10">

        {/* MARCA */}
        <div>
          <h2 className="text-2xl font-bold text-primary">
            MAFE Beauty
          </h2>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            Belleza, cuidado y confianza en cada producto.
            Diseñado para resaltar lo mejor de ti.
          </p>
        </div>

        {/* NAVEGACIÓN */}
        <div>
          <h3 className="font-semibold mb-4 text-primary">
            Navegación
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/productos" className="hover:text-primary transition">
                Productos
              </Link>
            </li>
            <li>
              <Link href="/nosotros" className="hover:text-primary transition">
                Nosotros
              </Link>
            </li>

            <li>
               <Link href="/contacto" className="hover:text-primary transition">
                Contacto
               </Link>
            </li>
          </ul>
        </div>

        {/* AYUDA */}
        <div>
          <h3 className="font-semibold mb-4 text-primary">
            Ayuda
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li className="hover:text-primary transition cursor-pointer">
              Envíos
            </li>
            <li className="hover:text-primary transition cursor-pointer">
              Devoluciones
            </li>
            <li className="hover:text-primary transition cursor-pointer">
              Soporte
            </li>
          </ul>
        </div>

        {/* REDES */}
        <div>
          <h3 className="font-semibold mb-4 text-primary">
            Síguenos
          </h3>

          <div className="flex gap-4 text-xl">

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
      <div className="text-center py-6 border-t text-sm text-gray-500">
        © 2026 MAFE Beauty — Todos los derechos reservados
      </div>

    </footer>
  );
}