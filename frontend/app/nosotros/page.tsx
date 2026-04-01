export default function NosotrosPage() {
  return (
    <main className="px-6 md:px-10 py-16 max-w-6xl mx-auto">

      {/* HERO */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Sobre Nosotros
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          En MAFE creemos que la belleza comienza con el cuidado personal.
          Nuestra misión es ofrecer productos de alta calidad que resalten
          lo mejor de cada persona.
        </p>
      </section>

      {/* HISTORIA */}
      <section className="grid md:grid-cols-2 gap-10 items-center mb-16">

        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
          alt="Belleza"
          className="rounded-2xl shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-bold text-primary">
            Nuestra historia
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            MAFE nació con la visión de crear una marca que combine calidad,
            innovación y confianza. Desde nuestros inicios, hemos trabajado
            para ofrecer productos que realmente aporten valor al cuidado
            personal de nuestros clientes.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Hoy seguimos creciendo, comprometidos con brindar una experiencia
            única y productos que marquen la diferencia.
          </p>
        </div>

      </section>

      {/* VALORES */}
      <section className="mb-16 text-center">

        <h2 className="text-3xl font-bold text-primary mb-10">
          Nuestros valores
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-primary">
              Calidad
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Seleccionamos cuidadosamente cada producto para garantizar
              los mejores resultados.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-primary">
              Confianza
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Construimos relaciones basadas en transparencia y compromiso.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-primary">
              Innovación
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Estamos en constante evolución para ofrecer lo mejor.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-brand-gradient text-white text-center py-12 rounded-2xl">

        <h2 className="text-3xl font-bold">
          Descubre nuestros productos
        </h2>

        <p className="mt-2">
          Encuentra lo mejor para tu cuidado personal
        </p>

        <a href="/productos">
          <button className="mt-6 bg-gold text-dark px-6 py-3 rounded-xl hover-scale">
            Ver productos
          </button>
        </a>

      </section>

    </main>
  );
}