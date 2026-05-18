"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import { formatARS } from "@/lib/format";
import { Menu } from "@/components/Menu";

const PLACEHOLDER = "/assets/images/producto-placeholder.webp";

export default function FinalizarPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildWhatsAppMessage(items, { name, phone, notes });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (items.length === 0) {
    return (
      <>
        <Menu />
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-8 text-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-300">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <p className="mb-6 text-lg font-semibold text-gray-700">Tu carrito está vacío</p>
          <Link
            href="/catalogo"
            className="rounded-xl bg-[#F94E19] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Ver productos
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div className="mx-auto max-w-6xl px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10">
          <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/catalogo" className="hover:text-gray-700">Catálogo</Link>
            <span>/</span>
            <span className="text-gray-700">Finalizar pedido</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar pedido</h1>
          <p className="mt-1 text-sm text-gray-500">
            Revisá tu pedido y completá tus datos para consultarnos por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* Resumen del pedido */}
          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
              Resumen ({totalItems} {totalItems === 1 ? "producto" : "productos"})
            </h2>

            <ul className="flex flex-col divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 p-4">
                  <Link href={`/catalogo/${item.slug}`} className="shrink-0">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={item.image || PLACEHOLDER}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <Link href={`/catalogo/${item.slug}`} className="text-sm font-semibold leading-tight text-gray-900 hover:text-[#F94E19]">
                          {item.name}
                        </Link>
                        {item.selectedAttributes && (
                          <p className="text-xs text-gray-400">
                            {Object.entries(item.selectedAttributes)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar"
                        className="shrink-0 text-gray-300 transition-colors hover:text-red-400"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex overflow-hidden rounded-lg border border-gray-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] px-1 py-1 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatARS(String(Number(item.price) * item.quantity))}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4">
              <span className="text-sm font-semibold text-gray-700">Total estimado</span>
              <span className="text-2xl font-bold text-gray-900">{formatARS(String(total))}</span>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              * Los precios son orientativos. Un asesor te confirmará disponibilidad y precio final.
            </p>
          </div>

          {/* Formulario de contacto */}
          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
              Tus datos
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre <span className="text-[#F94E19]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#F94E19] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                  Teléfono <span className="text-[#F94E19]">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 11 1234-5678"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#F94E19] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
                  Notas <span className="text-xs font-normal text-gray-400">(opcional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Consultás por disponibilidad, medidas, color..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#F94E19] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] py-4 text-sm font-bold text-white duration-300 border border-[#25D366] hover:bg-white hover:text-[#25D366] cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L0 24l6.335-1.508A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.369l-.359-.214-3.758.895.944-3.655-.236-.374A9.819 9.819 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                </svg>
                Consultar por WhatsApp
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
