import { formatARS } from "@/lib/format";
import type { WooVariation, WooProduct } from "@/types/woocommerce";

const SIZE_CLASSES = {
  lg: { price: "text-3xl font-bold", sale: "text-lg" },
  md: { price: "text-base font-bold", sale: "text-sm" },
  sm: { price: "text-sm font-bold", sale: "text-xs" },
} as const;

type Size = keyof typeof SIZE_CLASSES;

type Props = {
  product: WooProduct;
  selectedVariation?: WooVariation | null;
  size?: Size;
};

export function PriceDisplay({ product, selectedVariation, size = "lg" }: Props) {
  const { price: priceClass, sale: saleClass } = SIZE_CLASSES[size];

  // Caso 1: variación seleccionada → precio puntual
  if (selectedVariation) {
    const hasSale = Boolean(selectedVariation.sale_price);
    return (
      <div className="flex items-baseline gap-3">
        {hasSale && (
          <span className={`${saleClass} text-gray-400 line-through`}>
            {formatARS(selectedVariation.regular_price)}
          </span>
        )}
        <span className={`${priceClass} text-gray-900`}>
          {formatARS(selectedVariation.price)}
        </span>
      </div>
    );
  }

  // Caso 2: producto variable sin selección → rango
  if (product.type === "variable" && product.price_range) {
    const { min, max, isSingle } = product.price_range;
    return (
      <div className="flex items-baseline gap-3">
        <span className={`${priceClass} text-gray-900`}>
          {isSingle ? formatARS(min) : `${formatARS(min)} – ${formatARS(max)}`}
        </span>
      </div>
    );
  }

  // Caso 3: producto simple → precio normal
  const hasSale = Boolean(product.sale_price);
  return (
    <div className="flex items-baseline gap-3">
      {hasSale && (
        <span className={`${saleClass} text-gray-400 line-through`}>
          {formatARS(product.regular_price)}
        </span>
      )}
      <span className={`${priceClass} text-gray-900`}>
        {formatARS(product.price)}
      </span>
    </div>
  );
}