"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatARS } from "@/lib/format";
import type { WooProduct } from "@/types/woocommerce";

const PLACEHOLDER = "/assets/images/producto-placeholder.webp";

type Props = { product: WooProduct };

export const CatalogProductCard = ({ product }: Props) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.src ?? "",
      slug: product.slug,
    });
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-md">
      {/* Imagen */}
      <Link href={`/catalogo/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]?.src ?? PLACEHOLDER}
          alt={product.images[0]?.alt || product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link href={`/catalogo/${product.slug}`}>
          <p className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900 hover:text-[#F94E19]">
            {product.name}
          </p>
        </Link>

        <div className="flex items-center gap-2">
          {product.sale_price && (
            <span className="text-xs text-gray-400 line-through">
              {formatARS(product.regular_price)}
            </span>
          )}
          <span className="text-sm font-bold text-gray-900">
            {formatARS(product.price)}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2">
          {product.type === "simple" ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full cursor-pointer rounded-lg bg-white hover:bg-brand-orange border border-brand-orange text-brand-orange py-2 text-xs font-bold duration-300 hover:text-white"
            >
              Añadir al carrito
            </button>
          ) : (
            <Link
              href={`/catalogo/${product.slug}`}
              className="block cursor-pointer w-full rounded-lg border border-gray-300 py-2 text-center text-xs font-bold text-gray-700 transition-colors hover:border-[#F94E19] hover:text-[#F94E19]"
            >
              Ver opciones
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
