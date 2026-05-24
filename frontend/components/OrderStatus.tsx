"use client";

import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
  XCircle,
  CreditCard,
} from "lucide-react";

// =====================================
// TYPES
// =====================================

interface Props {
  estado: string;
}

// =====================================
// CONFIG
// =====================================

const estados = [
  "pendiente",
  "pagado",
  "preparando",
  "enviado",
  "entregado",
];

export default function OrderStatus({
  estado,
}: Props) {

  // =====================================
  // CANCELADO
  // =====================================

  if (estado === "cancelado") {

    return (

      <div className="bg-red-50 border border-red-200 rounded-3xl p-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center">

            <XCircle className="w-7 h-7" />

          </div>

          <div>

            <h3 className="font-black text-red-600 text-xl">

              Pedido cancelado

            </h3>

            <p className="text-red-500 text-sm mt-1">

              Este pedido fue cancelado.

            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================
  // INDEX ACTUAL
  // =====================================

  const currentStep =
    estados.indexOf(estado);

  // =====================================
  // DATA
  // =====================================

  const steps = [

    {
      label: "Pendiente",
      icon: Clock3,
    },

    {
      label: "Pagado",
      icon: CreditCard,
    },

    {
      label: "Preparando",
      icon: PackageCheck,
    },

    {
      label: "Enviado",
      icon: Truck,
    },

    {
      label: "Entregado",
      icon: CheckCircle2,
    },
  ];

  return (

    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

      {/* TITLE */}
      <div className="mb-8">

        <h2 className="text-2xl font-black">

          Estado del pedido

        </h2>

        <p className="text-gray-500 mt-2">

          Seguimiento en tiempo real

        </p>

      </div>

      {/* STEPS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

        {steps.map(
          (
            step,
            index
          ) => {

            const completed =
              index <= currentStep;

            const Icon =
              step.icon;

            return (

              <div
                key={step.label}
                className="flex-1 flex md:flex-col items-center gap-4 relative"
              >

                {/* LINE */}
                {index <
                  steps.length - 1 && (

                  <div
                    className={`
                    hidden md:block absolute top-7 left-[55%] w-full h-1 rounded-full
                    ${
                      index <
                      currentStep
                        ? "bg-primary"
                        : "bg-gray-200"
                    }
                  `}
                  />
                )}

                {/* ICON */}
                <div
                  className={`
                  relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all
                  ${
                    completed
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
                >

                  <Icon className="w-6 h-6" />

                </div>

                {/* TEXT */}
                <div className="text-center">

                  <p
                    className={`
                    font-bold
                    ${
                      completed
                        ? "text-primary"
                        : "text-gray-400"
                    }
                  `}
                  >

                    {step.label}

                  </p>

                  {index ===
                    currentStep && (

                    <span className="text-xs text-primary font-semibold">

                      Estado actual

                    </span>
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}