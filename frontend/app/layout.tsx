import type {
  Metadata,
} from "next";

import {
  Poppins,
} from "next/font/google";

import "./globals.css";

// =====================================
// COMPONENTES
// =====================================

import Navbar
  from "@/components/Navbar";

import Footer
  from "@/components/Footer";

import WhatsAppFloat
  from "@/components/WhatsAppFloat";

// =====================================
// CONTEXTOS
// =====================================

import {
  CartProvider,
} from "@/context/CartContext";

import {
  AuthProvider,
} from "@/context/AuthContext";

import {
  FavoritesProvider,
} from "@/context/FavoritesContext";

// =====================================
// SONNER
// =====================================

import {
  Toaster,
} from "sonner";

// =====================================
// FUENTE
// =====================================

const poppins =
  Poppins({
    subsets: ["latin"],
    weight: [
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ],
    variable:
      "--font-body",
  });

// =====================================
// METADATA
// =====================================

export const metadata:
  Metadata = {

  title:
    "MAFE Beauty | Tienda de Belleza",

  description:
    "Compra productos de belleza con asesoría personalizada. Maquillaje, skincare, cuidado personal y más en MAFE.",

  keywords: [
    "belleza",
    "cosméticos",
    "skincare",
    "maquillaje",
    "tienda online",
    "Colombia",
  ],

  icons: {
    icon: "/favicon.ico",
  },
};

// =====================================
// ROOT LAYOUT
// =====================================

export default function RootLayout({
  children,
}: {
  children:
    React.ReactNode;
}) {

  return (

    <html
      lang="es"
      className={`${poppins.variable} h-full scroll-smooth`}
      data-scroll-behavior="smooth"
    >

      <body className="min-h-full flex flex-col bg-white text-dark font-body overflow-x-hidden">

        {/* AUTH */}
        <AuthProvider>

          {/* FAVORITOS */}
          <FavoritesProvider>

            {/* CART */}
            <CartProvider>

              {/* TOASTER */}
              <Toaster
                richColors
                position="top-right"
                closeButton
                expand
                toastOptions={{
                  classNames: {
                    toast:
                      "rounded-2xl shadow-xl border border-gray-100",
                  },
                }}
              />

              {/* NAVBAR */}
              <Navbar />

              {/* CONTENIDO */}
              <main className="flex-1">

                {children}

              </main>

              {/* WHATSAPP FLOAT */}
              <WhatsAppFloat />

              {/* FOOTER */}
              <Footer />

            </CartProvider>

          </FavoritesProvider>

        </AuthProvider>

      </body>

    </html>
  );
}