import Link from "next/link";

export default function CheckoutExitoPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">

      <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-xl">

        <h1 className="text-5xl font-bold text-green-600 mb-6">
          ¡Pedido realizado!
        </h1>

        <p className="text-gray-600 text-lg mb-10">
          Tu pedido fue creado correctamente.
        </p>

        <Link
          href="/"
          className="bg-primary text-white px-8 py-4 rounded-2xl inline-block"
        >
          Volver al inicio
        </Link>

      </div>

    </div>
  );
}