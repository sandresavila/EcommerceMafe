const brand = {
  name: "MAFE Beauty",
  primary: "#ec4899",
  secondary: "#8b5cf6",
  dark: "#111827",
  muted: "#6b7280",
  light: "#f9fafb",
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const formatCurrency = (value = 0) =>
  Number(value || 0).toLocaleString(
    "es-CO",
    {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }
  );

export const getStoreUrl = () =>
  process.env.FRONTEND_URL ||
  process.env.CLIENT_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_URL ||
  "https://ecommerce-mafe.vercel.app";

const baseEmail = ({
  title,
  subtitle,
  preview,
  children,
  ctaText,
  ctaUrl,
}) => `
  <!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)}</title>
    </head>
    <body style="margin:0;padding:0;background:${brand.light};font-family:Arial,Helvetica,sans-serif;color:${brand.dark};">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        ${escapeHtml(preview || subtitle || title)}
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${brand.light};padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #f3f4f6;box-shadow:0 18px 50px rgba(17,24,39,0.08);">
              <tr>
                <td style="padding:34px 28px;background:linear-gradient(135deg,${brand.primary},${brand.secondary});color:#ffffff;text-align:center;">
                  <div style="font-size:14px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;opacity:0.9;">
                    ${brand.name}
                  </div>
                  <h1 style="margin:14px 0 0;font-size:30px;line-height:1.15;font-weight:900;">
                    ${escapeHtml(title)}
                  </h1>
                  <p style="margin:12px auto 0;max-width:520px;font-size:16px;line-height:1.6;opacity:0.95;">
                    ${escapeHtml(subtitle)}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:30px 24px;">
                  ${children}

                  ${ctaText && ctaUrl ? `
                    <div style="text-align:center;margin-top:30px;">
                      <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:${brand.primary};color:#ffffff;text-decoration:none;padding:15px 24px;border-radius:14px;font-weight:800;">
                        ${escapeHtml(ctaText)}
                      </a>
                    </div>
                  ` : ""}
                </td>
              </tr>

              <tr>
                <td style="padding:22px 24px;background:#f3f4f6;text-align:center;color:${brand.muted};font-size:13px;line-height:1.6;">
                  <strong style="color:${brand.dark};">${brand.name}</strong><br />
                  Belleza, skincare y asesoria personalizada.<br />
                  Este correo fue enviado automaticamente, por favor no respondas directamente.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

export const welcomeEmailTemplate = ({
  nombre,
  storeUrl = getStoreUrl(),
}) => baseEmail({
  title: "Bienvenida a MAFE Beauty",
  subtitle: "Tu cuenta fue creada correctamente. Ya puedes explorar productos, guardar favoritos y hacer pedidos.",
  preview: "Tu cuenta en MAFE Beauty ya esta lista.",
  ctaText: "Ir a la tienda",
  ctaUrl: storeUrl,
  children: `
    <p style="margin:0 0 18px;font-size:17px;line-height:1.7;">
      Hola <strong>${escapeHtml(nombre)}</strong>,
    </p>
    <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:${brand.muted};">
      Gracias por registrarte en <strong>${brand.name}</strong>. Queremos que tu experiencia sea facil, bonita y segura desde el primer pedido.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        ${[
          ["Compra facil", "Explora el catalogo y agrega tus productos favoritos."],
          ["Favoritos", "Guarda productos para encontrarlos rapidamente."],
          ["Asesoria", "Puedes escribirnos por WhatsApp si necesitas ayuda."],
        ].map(([heading, text]) => `
          <td style="display:block;width:100%;padding:10px 0;">
            <div style="background:#fdf2f8;border:1px solid #fce7f3;border-radius:16px;padding:16px;">
              <strong style="color:${brand.primary};font-size:15px;">${heading}</strong>
              <p style="margin:6px 0 0;color:${brand.muted};font-size:14px;line-height:1.5;">${text}</p>
            </div>
          </td>
        `).join("")}
      </tr>
    </table>
  `,
});

const productsTable = (productos = []) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:18px;border:1px solid #f3f4f6;border-radius:16px;overflow:hidden;">
    <thead>
      <tr style="background:#fdf2f8;color:${brand.dark};">
        <th align="left" style="padding:14px;font-size:13px;">Producto</th>
        <th align="center" style="padding:14px;font-size:13px;">Cant.</th>
        <th align="right" style="padding:14px;font-size:13px;">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${productos.map((item) => {
        const subtotal =
          Number(item.precio || item.precio_unitario || 0) *
          Number(item.cantidad || 0);

        return `
          <tr>
            <td style="padding:14px;border-top:1px solid #f3f4f6;font-size:14px;line-height:1.5;">
              <strong>${escapeHtml(item.nombre)}</strong>
              <div style="color:${brand.muted};font-size:13px;">
                ${formatCurrency(item.precio || item.precio_unitario || 0)} c/u
              </div>
            </td>
            <td align="center" style="padding:14px;border-top:1px solid #f3f4f6;font-size:14px;">
              ${Number(item.cantidad || 0)}
            </td>
            <td align="right" style="padding:14px;border-top:1px solid #f3f4f6;font-size:14px;font-weight:800;color:${brand.primary};">
              ${formatCurrency(subtotal)}
            </td>
          </tr>
        `;
      }).join("")}
    </tbody>
  </table>
`;

const statusCopy = {
  pendiente: "Recibimos tu pedido y esta pendiente de gestion.",
  pagado: "Tu pago fue registrado. Pronto prepararemos tu pedido.",
  preparando: "Estamos preparando tus productos con cuidado.",
  enviado: "Tu pedido ya fue enviado. Pronto estara contigo.",
  entregado: "Tu pedido fue marcado como entregado. Gracias por comprar en MAFE Beauty.",
  cancelado: "Tu pedido fue cancelado. Si tienes dudas, contactanos para ayudarte.",
};

export const orderCreatedEmailTemplate = ({
  idPedido,
  nombre,
  direccion,
  productos,
  total,
  orderUrl,
}) => baseEmail({
  title: `Pedido #${idPedido} creado`,
  subtitle: "Gracias por tu compra. Recibimos tu pedido y lo revisaremos para continuar con la gestion.",
  preview: `Tu pedido #${idPedido} fue creado correctamente.`,
  ctaText: orderUrl ? "Ver mi pedido" : "Ir a la tienda",
  ctaUrl: orderUrl || getStoreUrl(),
  children: `
    <p style="margin:0 0 18px;font-size:17px;line-height:1.7;">
      Hola <strong>${escapeHtml(nombre)}</strong>,
    </p>
    <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:${brand.muted};">
      Estos son los detalles de tu pedido. Te avisaremos cuando cambie su estado.
    </p>

    <div style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:18px;padding:18px;margin:20px 0;">
      <p style="margin:0 0 8px;"><strong>Pedido:</strong> #${escapeHtml(idPedido)}</p>
      <p style="margin:0 0 8px;"><strong>Estado:</strong> Pendiente</p>
      <p style="margin:0;"><strong>Direccion de envio:</strong> ${escapeHtml(direccion)}</p>
    </div>

    ${productsTable(productos)}

    <div style="text-align:right;margin-top:20px;">
      <span style="display:inline-block;background:#fdf2f8;color:${brand.primary};font-size:22px;font-weight:900;padding:14px 18px;border-radius:16px;">
        Total: ${formatCurrency(total)}
      </span>
    </div>
  `,
});

export const orderStatusEmailTemplate = ({
  idPedido,
  nombre,
  estado,
  direccion,
  total,
  orderUrl,
}) => {
  const estadoNormalizado =
    String(estado || "").toLowerCase();

  const estadoTexto =
    statusCopy[estadoNormalizado] ||
    "El estado de tu pedido fue actualizado.";

  return baseEmail({
    title: `Pedido #${idPedido}: ${estadoNormalizado || "actualizado"}`,
    subtitle: estadoTexto,
    preview: `Actualizamos el estado de tu pedido #${idPedido}.`,
    ctaText: orderUrl ? "Ver mi pedido" : "Ir a la tienda",
    ctaUrl: orderUrl || getStoreUrl(),
    children: `
      <p style="margin:0 0 18px;font-size:17px;line-height:1.7;">
        Hola <strong>${escapeHtml(nombre)}</strong>,
      </p>
      <p style="margin:0 0 22px;font-size:16px;line-height:1.7;color:${brand.muted};">
        ${escapeHtml(estadoTexto)}
      </p>

      <div style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:18px;padding:18px;margin:20px 0;">
        <p style="margin:0 0 8px;"><strong>Pedido:</strong> #${escapeHtml(idPedido)}</p>
        <p style="margin:0 0 8px;"><strong>Nuevo estado:</strong> ${escapeHtml(estadoNormalizado)}</p>
        <p style="margin:0 0 8px;"><strong>Total:</strong> ${formatCurrency(total)}</p>
        <p style="margin:0;"><strong>Direccion:</strong> ${escapeHtml(direccion)}</p>
      </div>

      <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:${brand.muted};">
        Si necesitas ayuda con tu pedido, puedes contactarnos por los canales oficiales de MAFE Beauty.
      </p>
    `,
  });
};
