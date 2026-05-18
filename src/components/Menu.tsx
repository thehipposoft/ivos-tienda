"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { label: "Placas PVC",        categoryId: 95 },
  { label: "Paneles Acústicos", categoryId: 97 },
  { label: "Chapas Caladas",    categoryId: 94 },
  { label: "WPC Exterior",      categoryId: 93 },
  { label: "Wallpanel",         categoryId: 96 },
  { label: "StoneFlex",         categoryId: 65 },
] satisfies { label: string; categoryId: number }[];

export const Menu = () => {
  const pillRef = useRef<HTMLDivElement>(null);
  const { openCart, items } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "100px top",
        onEnter: () =>
          gsap.to(pillRef.current, {
            width: "72%",
            duration: 1,
            ease: "power2.out",
          }),
        onLeaveBack: () =>
          gsap.to(pillRef.current, {
            width: "92%",
            duration: 1,
            ease: "power2.out",
          }),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-4 z-50 flex justify-center">
      <div
        ref={pillRef}
        className="pointer-events-auto flex w-[92%] max-w-7xl items-center justify-between rounded-4xl bg-white px-8 py-4 shadow-lg"
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/images/logo.png"
            alt="IVOS"
            width={100}
            height={33}
            priority
          />
        </Link>

        {/* Nav */}
        <nav>
          <ul className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map(({ label, categoryId }) => (
              <li key={label}>
                <Link
                  href={categoryId ? `/catalogo?category=${categoryId}&page=1` : "/catalogo"}
                  className="whitespace-nowrap text-sm font-medium text-gray-800 transition-colors duration-200 hover:text-[#F94E19]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons */}
        <div className="flex shrink-0 items-center gap-5">
          <button
            type="button"
            aria-label="Buscar"
            className="hidden text-gray-800 transition-colors duration-200 hover:text-[#F94E19]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label="Carrito"
            className="relative cursor-pointer text-gray-800 transition-colors duration-200 hover:text-[#F94E19]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#F94E19] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
