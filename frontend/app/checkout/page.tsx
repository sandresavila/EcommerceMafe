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

        // LOADING
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

        // SUCCESS
        toast.success(
          "Pedido realizado correctamente"
        );

        // LIMPIAR CARRITO
        clearCart();

        // REDIRECT
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-extrabold text-gray-800 mb-3">
            Checkout
          </h1>

          <p className="text-gray-500 text-lg">
            Finaliza tu compra de forma segura ✨
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* IZQUIERDA */}
          <div className="lg:col-span-2 space-y-8">

            {/* PRODUCTOS */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8">

              <div className="flex items-center gap-3 mb-8">

                <ShoppingBag className="w-7 h-7 text-primary" />

                <h2 className="text-3xl font-bold">
                  Tus productos
                </h2>

              </div>

              <div className="space-y-6">

                {cart.map((item) => (

                  <div
                    key={item.id_producto}
                    className="flex gap-5 items-center border-b border-gray-100 pb-6"
                  >

                    {/* IMAGEN */}
                    {item.imagen_url && (

                      <Image
                        src={item.imagen_url}
                        alt={item.nombre}
                        width={120}
                        height={120}
                        className="w-28 h-28 object-cover rounded-3xl shadow"
                      />
                    )}

                    {/* INFO */}
                    <div className="flex-1">

                      <h3 className="font-bold text-xl text-gray-800">
                        {item.nombre}
                      </h3>

                      <p className="text-gray-500 mt-2">
                        Cantidad:
                        {" "}
                        {item.cantidad}
                      </p>

                      <p className="text-primary font-bold text-lg mt-2">
                        $
                        {item.precio}
                      </p>

                    </div>

                    {/* TOTAL */}
                    <div className="text-right">

                      <p className="font-bold text-2xl text-gray-800">

                        $
                        {item.precio *
                          item.cantidad}

                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* DIRECCION */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8">

              <div className="flex items-center gap-3 mb-6">

                <MapPin className="w-7 h-7 text-primary" />

                <h2 className="text-3xl font-bold">
                  Dirección de envío
                </h2>

              </div>

              <textarea
                value={direccion}
                onChange={(e) =>
                  setDireccion(
                    e.target.value
                  )
                }
                placeholder="Ingresa la dirección completa..."
                className="w-full border-2 border-gray-200 focus:border-primary outline-none transition p-5 rounded-3xl h-40 resize-none text-lg"
              />

            </div>

          </div>

          {/* DERECHA */}
          <div className="space-y-8">

            {/* RESUMEN */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 sticky top-8">

              <div className="flex items-center gap-3 mb-8">

                <CreditCard className="w-7 h-7 text-primary" />

                <h2 className="text-3xl font-bold">
                  Resumen
                </h2>

              </div>

              {/* INFO */}
              <div className="space-y-5">

                <div className="flex justify-between text-lg">

                  <span className="text-gray-500">
                    Productos
                  </span>

                  <span className="font-semibold">
                    {cart.length}
                  </span>

                </div>

                <div className="flex justify-between text-lg">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    $
                    {subtotal}
                  </span>

                </div>

                <div className="flex justify-between text-lg">

                  <span className="text-gray-500 flex items-center gap-2">

                    <Truck className="w-5 h-5" />

                    Envío

                  </span>

                  <span className="font-semibold">

                    {envio === 0
                      ? "Gratis"
                      : `$${envio}`}

                  </span>

                </div>

                <div className="border-t pt-6 flex justify-between items-center">

                  <span className="text-2xl font-bold">
                    Total
                  </span>

                  <span className="text-3xl font-extrabold text-primary">
                    $
                    {total}
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
                className={`w-full mt-10 py-5 rounded-3xl text-xl font-bold shadow-xl transition
                ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-primary hover:opacity-90 text-white"
                }`}
              >

                {loading
                  ? "Procesando..."
                  : "Finalizar compra"}

              </button>

              {/* INFO */}
              <p className="text-gray-400 text-sm text-center mt-5 leading-relaxed">

                Al finalizar tu compra aceptas nuestros términos y condiciones.

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}