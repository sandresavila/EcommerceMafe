import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// COMPONENTES
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

// 🔥 FUENTE PRINCIPAL (ALINEADA CON TU DISEÑO)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

// 🔥 METADATA (MEJORADA PARA SEO Y PROYECTO)
export const metadata: Metadata = {
  title: "MAFE Beauty | Tienda de Belleza",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-dark font-body">

        {/* PROVIDER GLOBAL */}
        <CartProvider>

          {/* NAVBAR */}
          <Navbar />

          {/* CONTENIDO */}
          <main className="flex-1">
            {children}
          </main>

          {/* FOOTER */}
          <Footer />

        </CartProvider>

      </body>
    </html>
  );
}