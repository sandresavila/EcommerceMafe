import Link from "next/link";

import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

import Image from "next/image";

export default function NosotrosPage() {

  return (

    <main className="min-h-screen bg-[#F8F9FC] overflow-hidden">

      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}

      <section className="relative px-4 sm:px-6 md:px-10 pt-20 md:pt-24 pb-20 md:pb-28">

        {/* BG */}
        <div className="absolute inset-0 bg-brand-gradient opacity-[0.06]" />

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* TEXT */}
            <div className="fade-in">

              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full font-semibold text-sm mb-6">

                ✨ Belleza • Cuidado • Confianza

              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-dark leading-tight">

                Más que belleza,
                <span className="text-primary block">

                  una experiencia

                </span>

              </h1>

              <p className="mt-8 text-gray-600 text-lg leading-relaxed max-w-2xl">

                En MAFE creemos que la belleza comienza con el cuidado personal.
                Creamos experiencias que inspiran confianza, autenticidad
                y bienestar a través de productos cuidadosamente seleccionados.

              </p>

              <div className="flex flex-wrap gap-4 mt-10">

                <Link
                  href="/productos"
                  className="btn-primary px-8 py-4"
                >

                  Explorar productos

                </Link>

                <Link
                  href="/contacto"
                  className="bg-white px-8 py-4 rounded-2xl shadow-md font-semibold hover:shadow-xl transition"
                >

                  Contáctanos

                </Link>

              </div>

            </div>

            {/* IMAGE */}
            <div className="relative zoom-in">

              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

              <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-accent/20 rounded-full blur-3xl" />

              <div className="relative card-modern overflow-hidden p-3">

                <Image
                  src="/final.jpeg"
                  alt="Belleza MAFE"
                  width={800}
                  height={700}
                  className="w-full h-[550px] object-cover rounded-[1.7rem]"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* HISTORIA */}
      {/* ===================================== */}

      <section className="px-4 sm:px-6 md:px-10 py-20 md:py-24">

        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* IMAGE */}
            <div className="slide-left">

              <div className="card-modern overflow-hidden p-3">

                <Image
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"
                  alt="Historia MAFE"
                  width={800}
                  height={700}
                  className="w-full h-[500px] object-cover rounded-[1.7rem]"
                />

              </div>

            </div>

            {/* CONTENT */}
            <div className="slide-right">

              <span className="text-primary font-bold uppercase tracking-widest text-sm">

                Nuestra historia

              </span>

              <h2 className="text-5xl font-black text-dark mt-4 leading-tight">

                Construyendo confianza
                desde el primer día

              </h2>

              <p className="mt-8 text-gray-600 leading-relaxed text-lg">

                MAFE nació con la visión de ofrecer productos de belleza
                y cuidado personal que realmente marcaran la diferencia.
                Desde nuestros inicios, nos enfocamos en combinar calidad,
                innovación y asesoría personalizada.

              </p>

              <p className="mt-6 text-gray-600 leading-relaxed text-lg">

                Hoy seguimos creciendo gracias a la confianza de nuestros clientes,
                manteniendo el compromiso de brindar experiencias únicas y productos
                que resalten lo mejor de cada persona.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* VALORES */}
      {/* ===================================== */}

      <section className="px-4 sm:px-6 md:px-10 py-20 md:py-24">

        <div className="max-w-7xl mx-auto text-center">

          <span className="text-primary font-bold uppercase tracking-widest text-sm">

            Lo que nos representa

          </span>

          <h2 className="text-5xl font-black text-dark mt-4">

            Nuestros valores

          </h2>

          <p className="text-gray-500 text-lg mt-6 max-w-3xl mx-auto">

            Cada decisión que tomamos está enfocada en brindar calidad,
            confianza y una experiencia premium para nuestros clientes.

          </p>

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">

            {/* CARD */}
            <div className="card-modern p-10 text-left group">

              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition">

                <Sparkles className="w-8 h-8" />

              </div>

              <h3 className="text-2xl font-black text-dark">

                Calidad

              </h3>

              <p className="text-gray-600 mt-5 leading-relaxed">

                Seleccionamos cuidadosamente cada producto para ofrecer
                resultados confiables y experiencias excepcionales.

              </p>

            </div>

            {/* CARD */}
            <div className="card-modern p-10 text-left group">

              <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-8 group-hover:scale-110 transition">

                <ShieldCheck className="w-8 h-8" />

              </div>

              <h3 className="text-2xl font-black text-dark">

                Confianza

              </h3>

              <p className="text-gray-600 mt-5 leading-relaxed">

                Construimos relaciones duraderas con transparencia,
                compromiso y atención personalizada.

              </p>

            </div>

            {/* CARD */}
            <div className="card-modern p-10 text-left group">

              <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-8 group-hover:scale-110 transition">

                <HeartHandshake className="w-8 h-8" />

              </div>

              <h3 className="text-2xl font-black text-dark">

                Innovación

              </h3>

              <p className="text-gray-600 mt-5 leading-relaxed">

                Evolucionamos constantemente para ofrecer tendencias,
                soluciones modernas y experiencias únicas.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* CTA */}
      {/* ===================================== */}

      <section className="px-4 sm:px-6 md:px-10 pb-20 md:pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="relative overflow-hidden rounded-[3rem] bg-brand-gradient px-8 md:px-16 py-20 text-center text-white shadow-2xl">

            {/* DECORATION */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight">

                Descubre lo mejor
                para tu cuidado personal

              </h2>

              <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">

                Explora nuestra selección de productos diseñados
                para resaltar tu belleza y bienestar.

              </p>

              <Link
                href="/productos"
                className="inline-flex mt-10 bg-white text-primary px-10 py-5 rounded-2xl font-bold hover:scale-105 transition shadow-2xl"
              >

                Ver productos

              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
