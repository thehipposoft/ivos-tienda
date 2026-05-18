"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import type { WooProduct } from "@/types/woocommerce";
import { ProductCard } from "@/components/ProductCard";

const BREAKPOINTS = { md: 768, lg: 1024 } as const;

const getIpp = (): number => {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth >= BREAKPOINTS.lg) return 4;
  if (window.innerWidth >= BREAKPOINTS.md) return 2;
  return 1;
};

type Props = { products: WooProduct[] };

export const ProductSlider = ({ products }: Props) => {
  const [idx, setIdx] = useState(0);
  const [ipp, setIpp] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const maxIdx = Math.max(0, products.length - ipp);

  useEffect(() => {
    const update = () => setIpp(getIpp());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Reset position on breakpoint change
  useEffect(() => {
    gsap.set(trackRef.current, { x: 0 });
    setIdx(0);
  }, [ipp]);

  const goTo = (newIdx: number) => {
    const clamped = Math.max(0, Math.min(newIdx, maxIdx));
    const cw = containerRef.current?.offsetWidth ?? 0;
    gsap.to(trackRef.current, {
      x: -(clamped * (cw / ipp)),
      duration: 0.55,
      ease: "power2.out",
    });
    setIdx(clamped);
  };

  // Track width = N pages wide; item width = 1/N of track = 1/ipp of container
  const trackStyle = { width: `${(products.length / ipp) * 100}%` };
  const itemStyle = { width: `${100 / products.length}%` };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        type="button"
        onClick={() => goTo(idx - 1)}
        disabled={idx === 0}
        aria-label="Anterior"
        className="absolute cursor-pointer left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded border border-gray-300 bg-white text-gray-800 transition-colors hover:border-brand-orange disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Track container */}
      <div ref={containerRef} className="mx-12 overflow-hidden">
        <div ref={trackRef} style={trackStyle} className="flex will-change-transform gap-4">
          {products.map((product) => (
            <div key={product.id} style={itemStyle} className="shrink-0 max-h-max ">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Right arrow */}
      <button
        type="button"
        onClick={() => goTo(idx + 1)}
        disabled={idx >= maxIdx}
        aria-label="Siguiente"
        className="absolute cursor-pointer right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded border border-gray-300 bg-white text-gray-800 transition-colors hover:border-brand-orange disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: maxIdx + 1 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Producto ${i + 1}`}
            className={`h-3 w-3 rounded-full cursor-pointer transition-colors duration-200 ${
              i === idx ? "bg-gray-800" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
