import type { CartItem } from "@/store/cartStore";

const WA_NUMBER = "543875750595"; // número con código de país, sin + ni espacios

export type ContactInfo = {
  name: string;
  phone: string;
  notes?: string;
};

export function buildWhatsAppMessage(items: CartItem[], contact: ContactInfo): string {
  const lines = items.map((item) => {
    const attrs = item.selectedAttributes
      ? ` (${Object.entries(item.selectedAttributes).map(([k, v]) => `${k}: ${v}`).join(", ")})`
      : "";
    return `• ${item.quantity}x ${item.name}${attrs} — $${(parseFloat(item.price) * item.quantity).toLocaleString("es-AR")}`;
  });

  const total = items.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const message = [
    "Hola! Me gustaría consultar por el siguiente pedido:",
    "",
    ...lines,
    "",
    `*Total: $${total.toLocaleString("es-AR")}*`,
    "",
    "---",
    `Nombre: ${contact.name}`,
    `Teléfono: ${contact.phone}`,
    ...(contact.notes ? [`Notas: ${contact.notes}`] : []),
  ].join("\n");

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}