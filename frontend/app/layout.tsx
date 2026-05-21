import type { Metadata } from "next";

import {
  Poppins,
} from "next/font/google";

import "./globals.css";

// COMPONENTES
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// CONTEXTOS
import {
  CartProvider,
} from "@/context/CartContext";

import {
  AuthProvider,
} from "@/context/AuthContext";

// SONNER
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
      className={`${poppins.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col bg-white text-dark font-body">

        {/* AUTH */}
        <AuthProvider>

          {/* CART */}
          <CartProvider>

            {/* TOASTER */}
            <Toaster
              richColors
              position="top-right"
              closeButton
              expand 
            />

            {/* NAVBAR */}
            <Navbar />

            {/* CONTENIDO */}
            <main className="flex-1">
              {children}
            </main>

            {/* FOOTER */}
            <Footer />

          </CartProvider>

        </AuthProvider>

      </body>

    </html>
  );
}