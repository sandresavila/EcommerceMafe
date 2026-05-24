"use client";

import Link from "next/link";

import {
  MessageCircle,
} from "lucide-react";

export default function WhatsAppFloat() {

  return (

    <Link
      href="https://wa.me/qr/OY37IJHI5JKUG1"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >

      {/* EFECTO */}
      <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition" />

      {/* BOTÓN */}
      <div className="relative flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105">

        <MessageCircle className="w-6 h-6" />

        <span className="hidden md:block font-semibold">
          Asesoría por WhatsApp
        </span>

      </div>

    </Link>
  );
}