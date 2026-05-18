"use client";

import { useState } from "react";
import Image from "next/image";
import type { WooImage } from "@/types/woocommerce";

const PLACEHOLDER = "/assets/images/producto-placeholder.webp";

type Props = { images: WooImage[] };

export const ProductGallery = ({ images }: Props) => {
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={main?.src ?? PLACEHOLDER}
          alt={main?.alt ?? ""}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.slice(0, 6).map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? "border-[#F94E19]" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
