import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/PriceDisplay";
import type { WooProduct } from "@/types/woocommerce";

type Props = { product: WooProduct };

export const ProductCard = ({ product }: Props) => {
  const ctaLabel =
    product.type === "variable" ? "Seleccionar opciones" : "Añadir al carrito";

  return (
    <Link href={`/catalogo/${product.slug}`} className="group flex cursor-pointer flex-col overflow-hidden rounded-lg bg-gray-100 max-h-max">
      {/* Image */}
      <div className="relative aspect-square w-full bg-gray-100">
        {product.images[0] ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <Image
            src="/assets/images/producto-placeholder.webp"
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col items-center gap-1  px-4 pb-5 pt-4 text-center">
        <p className="text-lg font-semibold leading-tight text-brand-blue">
          {product.name}
        </p>
        <PriceDisplay product={product} size="md" />

        {/* CTA — visible on hover */}
        <button
          type="button"
          className="mt-2 w-full border-brand-blue border py-2 text-[11px] font-bold uppercase tracking-widest text-brand-blue opacity-0 duration-300 group-hover:opacity-100 hover:bg-brand-orange hover:border-brand-orange hover:text-white hover:cursor-pointer"
        >
          {ctaLabel}
        </button>
      </div>
    </Link>
  );
};
