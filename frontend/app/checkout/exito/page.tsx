import Link from "next/link";

import {
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function CheckoutExitoPage() {

  return (

    <main className="min-h-screen bg-[#F8F9FC] overflow-hidden flex items-center justify-center px-4 py-14">

      <div className="relative max-w-2xl w-full">

        {/* BG EFFECT */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

        {/* CARD */}
        <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden">

          {/* TOP */}
          <div className="bg-brand-gradient px-8 md:px-12 py-14 text-center text-white relative overflow-hidden">

            {/* DECORATION */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-3xl" />

            <div className="relative">

              {/* ICON */}
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center mx-auto shadow-2xl">

                <CheckCircle2 className="w-20 h-20 text-white" />

              </div>

              {/* TITLE */}
              <div className="mt-10">

                <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full font-semibold mb-6">

                  <Sparkles className="w-4 h-4" />

                  Pedido confirmado

                </div>

                <h1 className="text-5xl md:text-6xl font-black leading-tight">

                  ¡Pedido realizado!

                </h1>

                <p className="text-white/90 text-lg mt-6 max-w-xl mx-auto leading-relaxed">

                  Tu pedido fue creado correctamente y ya
                  estamos preparándolo para enviarlo.

                </p>

              </div>

            </div>

          </div>

          {/* BODY */}
          <div className="px-8 md:px-12 py-12">

            {/* INFO */}
            <div className="grid md:grid-cols-3 gap-5 mb-10">

              {/* PROCESO */}
              <div className="bg-gray-50 rounded-3xl p-6 text-center">

                <div className="w-16 h-16 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-5">

                  <ShoppingBag className="w-8 h-8" />

                </div>

                <h3 className="font-black text-dark text-lg">

                  Pedido recibido

                </h3>

                <p className="text-sm text-gray-500 mt-3 leading-relaxed">

                  Hemos recibido tu pedido correctamente.

                </p>

              </div>

              {/* PREPARACION */}
              <div className="bg-gray-50 rounded-3xl p-6 text-center">

                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5">

                  <Sparkles className="w-8 h-8" />

                </div>

                <h3 className="font-black text-dark text-lg">

                  Preparación

                </h3>

                <p className="text-sm text-gray-500 mt-3 leading-relaxed">

                  Estamos organizando y preparando tu compra.

                </p>

              </div>

              {/* ENVIO */}
              <div className="bg-gray-50 rounded-3xl p-6 text-center">

                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5">

                  <ShieldCheck className="w-8 h-8" />

                </div>

                <h3 className="font-black text-dark text-lg">

                  Envío seguro

                </h3>

                <p className="text-sm text-gray-500 mt-3 leading-relaxed">

                  Tu pedido será enviado de forma segura.

                </p>

              </div>

            </div>

            {/* MESSAGE */}
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 text-center mb-10">

              <p className="text-gray-700 leading-relaxed text-lg">

                Puedes consultar el estado de tu pedido
                en cualquier momento desde la sección
                de
                {" "}

                <span className="font-bold text-primary">

                  Mis pedidos

                </span>

                .

              </p>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col md:flex-row gap-4">

              {/* PEDIDOS */}
              <Link
                href="/mis-pedidos"
                className="flex-1"
              >

                <button className="w-full h-16 rounded-3xl bg-primary text-white font-black text-lg hover:scale-[1.02] transition shadow-xl flex items-center justify-center gap-3">

                  Ver mis pedidos

                  <ArrowRight className="w-5 h-5" />

                </button>

              </Link>

              {/* HOME */}
              <Link
                href="/"
                className="flex-1"
              >

                <button className="w-full h-16 rounded-3xl border-2 border-primary text-primary font-black text-lg hover:bg-primary hover:text-white transition">

                  Volver al inicio

                </button>

              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}