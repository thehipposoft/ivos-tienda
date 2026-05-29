"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useCartStore } from "@/store/cartStore";
import { formatARS } from "@/lib/format";

const CHECKOUT_URL = "/finalizar";
const PLACEHOLDER = "/assets/images/producto-placeholder.webp";

export const CartDrawer = () => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;

    if (isOpen) {
      gsap.set(drawer, { x: "100%" });
      gsap.set(backdrop, { opacity: 0, display: "block" });
      gsap.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(drawer, { x: "0%", duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: "power2.in" });
      gsap.to(drawer, {
        x: "100%",
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => gsap.set(backdrop, { display: "none" }),
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={closeCart}
        className="fixed inset-0 z-40 hidden bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        style={{ transform: "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Carrito</h2>
            {totalItems > 0 && (
              <span className="rounded-full bg-[#F94E19] px-2 py-0.5 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-gray-400 transition-colors hover:text-gray-700 cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="text-sm text-gray-400">Tu carrito está vacío</p>
              <button
                type="button"
                onClick={closeCart}
                className="text-sm cursor-pointer font-semibold text-[#F94E19] hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <>
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.cartItemId} className="flex gap-4">
                  <Link href={`/catalogo/${item.slug}`} onClick={closeCart} className="shrink-0">
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
                        <Link
                          href={`/catalogo/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-semibold leading-tight text-gray-900 hover:text-[#F94E19] cursor-pointer"
                        >
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
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label="Eliminar"
                        className="shrink-0 text-gray-300 transition-colors hover:text-red-400 cursor-pointer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex overflow-hidden rounded-lg border border-gray-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-gray-500 transition-colors hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="min-w-8 px-1 py-1 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-500 transition-colors hover:bg-gray-100"
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

            <button
              type="button"
              onClick={clearCart}
              className="mt-4 w-full cursor-pointer text-center text-sm text-gray-400 transition-colors hover:text-red-500"
            >
              Vaciar carrito
            </button>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-xl font-bold text-gray-900">{formatARS(String(total))}</span>
            </div>
            <Link
              href={CHECKOUT_URL}
              onClick={closeCart}
              className="block w-full rounded-xl bg-[#F94E19] py-3.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Finalizar pedido →
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 w-full text-center cursor-pointer text-sm text-gray-400 hover:text-gray-700"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};
