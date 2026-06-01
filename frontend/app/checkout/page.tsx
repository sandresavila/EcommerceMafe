"use client";

import {
  useState,
} from "react";

import axios from "axios";

import Image from "next/image";

import {
  useRouter,
} from "next/navigation";

import {
  useCart,
} from "@/context/CartContext";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";

import {
  toast,
} from "sonner";

export default function CheckoutPage() {

  const router =
    useRouter();

  const {
    cart,
    clearCart,
  } = useCart();

  const {
    token,
    usuario,
  } = useAuth();

  const [direccion,
    setDireccion] =
      useState("");

  const [loading,
    setLoading] =
      useState(false);

  // =====================================
  // TOTAL
  // =====================================

  const subtotal =
    cart.reduce(
      (acc, item) =>
        acc +
        item.precio *
        item.cantidad,
      0
    );

  const envio =
    subtotal > 200000
      ? 0
      : 12000;

  const total =
    subtotal + envio;

  // =====================================
  // FORMATO
  // =====================================

  const formatPrice =
    (value: number) =>

      value.toLocaleString(
        "es-CO",
        {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }
      );

  // =====================================
  // FINALIZAR PEDIDO
  // =====================================

  const finalizarCompra =
    async () => {

      try {

        // LOGIN
        if (!usuario) {

          toast.error(
            "Debes iniciar sesión"
          );

          return;
        }

        // CARRITO
        if (
          cart.length === 0
        ) {

          toast.error(
            "Tu carrito está vacío"
          );

          return;
        }

        // DIRECCION
        if (
          !direccion.trim()
        ) {

          toast.error(
            "Ingresa la dirección de envío"
          );

          return;
        }

        setLoading(true);

        // REQUEST
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/pedidos`,
          {
            direccion_envio:
              direccion,

            productos:
              cart,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Pedido realizado correctamente ✨"
        );

        clearCart();

        setTimeout(() => {

          router.push(
            "/checkout/exito"
          );

        }, 1200);

      } catch (error: unknown) {

        console.error(error);

        let mensaje =
          "Error creando pedido";

        if (
          axios.isAxiosError(error)
        ) {

          mensaje =
            error.response?.data?.message ||
            mensaje;
        }

        toast.error(mensaje);

      } finally {

        setLoading(false);
      }
    };

  return (

    <main className="min-h-screen bg-[#F8F9FC] overflow-hidden px-4 md:px-8 py-14">

      <div className="max-w-7xl mx-auto">

        {/* ===================================== */}
        {/* HERO */}
        {/* ===================================== */}

        <section className="text-center mb-14 fade-in">

          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold mb-6">

            <Sparkles className="w-5 h-5" />

            Compra segura

          </div>

          <h1 className="text-4xl md:text-6xl font-black text-dark">

            Finalizar compra

          </h1>

          <p className="text-gray-500 text-lg mt-5 max-w-2xl mx-auto">

            Revisa tu pedido y completa la información
            para recibir tus productos rápidamente.

          </p>

        </section>

        {/* ===================================== */}
        {/* LAYOUT */}
        {/* ===================================== */}

        <div className="grid xl:grid-cols-3 gap-8">

          {/* ===================================== */}
          {/* LEFT */}
          {/* ===================================== */}

          <div className="xl:col-span-2 space-y-8">

            {/* PRODUCTOS */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10">

              <div className="flex items-center gap-4 mb-10">

                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                  <ShoppingBag className="w-8 h-8" />

                </div>

                <div>

                  <h2 className="text-3xl font-black text-dark">

                    Tus productos

                  </h2>

                  <p className="text-gray-500 mt-2">

                    {cart.length}
                    {" "}
                    productos en el carrito

                  </p>

                </div>

              </div>

              <div className="space-y-6">

                {cart.map((item) => (

                  <div
                    key={item.id_producto}
                    className="flex flex-col md:flex-row gap-5 md:items-center bg-gray-50 rounded-[2rem] p-5"
                  >

                    {/* IMAGE */}
                    <div className="relative w-full md:w-32 h-60 md:h-32 overflow-hidden rounded-3xl">

                      <Image
                        src={
                          item.imagen_url ||
                          "/placeholder.png"
                        }
                        alt={
                          item.nombre
                        }
                        fill
                        className="object-cover"
                      />

                    </div>

                    {/* INFO */}
                    <div className="flex-1">

                      <h3 className="text-2xl font-black text-dark">

                        {item.nombre}

                      </h3>

                      <div className="flex flex-wrap gap-4 mt-4 text-gray-500">

                        <span>

                          Cantidad:
                          {" "}
                          {item.cantidad}

                        </span>

                        <span>

                          Precio:
                          {" "}
                          {formatPrice(
                            item.precio
                          )}

                        </span>

                      </div>

                    </div>

                    {/* TOTAL */}
                    <div className="md:text-right">

                      <p className="text-gray-400 text-sm uppercase tracking-wide">

                        Total

                      </p>

                      <h4 className="text-3xl font-black text-primary mt-2">

                        {formatPrice(
                          item.precio *
                          item.cantidad
                        )}

                      </h4>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* DIRECCION */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10">

              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">

                  <MapPin className="w-8 h-8" />

                </div>

                <div>

                  <h2 className="text-3xl font-black text-dark">

                    Dirección de envío

                  </h2>

                  <p className="text-gray-500 mt-2">

                    Ingresa la dirección completa donde deseas recibir tu pedido

                  </p>

                </div>

              </div>

              <textarea
                value={direccion}
                onChange={(e) =>
                  setDireccion(
                    e.target.value
                  )
                }
                placeholder="Ej: Calle 20 #10-35, apartamento 302, Soacha..."
                className="w-full border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-primary outline-none transition p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] h-40 md:h-44 resize-none text-base md:text-lg"
              />

            </div>

          </div>

          {/* ===================================== */}
          {/* RIGHT */}
          {/* ===================================== */}

          <div>

            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-8 lg:sticky lg:top-8 overflow-hidden">

              {/* BG */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-primary/5 rounded-full blur-3xl" />

              {/* HEADER */}
              <div className="relative flex items-center gap-4 mb-10">

                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">

                  <CreditCard className="w-8 h-8" />

                </div>

                <div>

                  <h2 className="text-3xl font-black text-dark">

                    Resumen

                  </h2>

                  <p className="text-gray-500 mt-2">

                    Detalles de tu compra

                  </p>

                </div>

              </div>

              {/* DETALLE */}
              <div className="relative space-y-6">

                {/* PRODUCTOS */}
                <div className="flex justify-between items-center">

                  <span className="text-gray-500">

                    Productos

                  </span>

                  <span className="font-bold text-dark text-lg">

                    {cart.length}

                  </span>

                </div>

                {/* SUBTOTAL */}
                <div className="flex justify-between items-center">

                  <span className="text-gray-500">

                    Subtotal

                  </span>

                  <span className="font-bold text-dark text-lg">

                    {formatPrice(
                      subtotal
                    )}

                  </span>

                </div>

                {/* ENVIO */}
                <div className="flex justify-between items-center">

                  <span className="text-gray-500 flex items-center gap-2">

                    <Truck className="w-5 h-5" />

                    Envío

                  </span>

                  <span className="font-bold text-dark text-lg">

                    {envio === 0
                      ? "Gratis"
                      : formatPrice(
                          envio
                        )}

                  </span>

                </div>

                {/* BENEFICIO */}
                {envio === 0 && (

                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4">

                    <p className="text-green-700 font-semibold text-sm">

                      🎉 Tu pedido aplica para envío gratis

                    </p>

                  </div>
                )}

                {/* TOTAL */}
                <div className="border-t border-gray-100 pt-6 flex justify-between items-center">

                  <span className="text-2xl font-black text-dark">

                    Total

                  </span>

                  <span className="text-4xl font-black text-primary">

                    {formatPrice(
                      total
                    )}

                  </span>

                </div>

              </div>

              {/* BTN */}
              <button
                onClick={
                  finalizarCompra
                }
                disabled={
                  loading
                }
                className={`relative w-full mt-10 h-16 rounded-3xl text-xl font-black shadow-2xl transition flex items-center justify-center gap-3
                ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-primary hover:scale-[1.02] text-white"
                }`}
              >

                {loading ? (

                  "Procesando..."

                ) : (

                  <>
                    Finalizar compra

                    <ArrowRight className="w-6 h-6" />
                  </>
                )}

              </button>

              {/* SECURITY */}
              <div className="mt-8 bg-gray-50 rounded-2xl p-5">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">

                    <Lock className="w-5 h-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-dark">

                      Compra segura

                    </h3>

                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">

                      Tus datos están protegidos y tu pedido
                      será procesado de forma segura.

                    </p>

                  </div>

                </div>

              </div>

              {/* GARANTIAS */}
              <div className="mt-6 space-y-4">

                <div className="flex items-center gap-3 text-gray-600">

                  <ShieldCheck className="w-5 h-5 text-green-500" />

                  Productos 100% originales

                </div>

                <div className="flex items-center gap-3 text-gray-600">

                  <Truck className="w-5 h-5 text-primary" />

                  Envíos a todo Colombia

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
