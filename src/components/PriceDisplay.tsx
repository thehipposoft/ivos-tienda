import { formatARS } from "@/lib/format";
import type { WooVariation, WooProduct } from "@/types/woocommerce";

const SIZE_CLASSES = {
  lg: { price: "text-3xl font-bold", sale: "text-3xl font-bold" },
  md: { price: "text-[14px] md:text-base font-bold", sale: "text-[14px] md:text-base font-bold" },
  sm: { price: "text-sm font-bold", sale: "text-sm font-bold" },
} as const;

type Size = keyof typeof SIZE_CLASSES;

type Props = {
  product: WooProduct;
  selectedVariation?: WooVariation | null;
  size?: Size;
  stacked?: boolean;
};

export function PriceDisplay({ product, selectedVariation, size = "lg", stacked = false }: Props) {
  const { price: priceClass, sale: saleClass } = SIZE_CLASSES[size];

  // Caso 1: variación seleccionada → precio puntual
  if (selectedVariation) {
    const hasSale = Boolean(selectedVariation.sale_price);

    if (stacked && hasSale) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className={`${saleClass} text-gray-400`}>
              {formatARS(selectedVariation.regular_price)}
            </span>
            <span className="text-xs text-gray-400">(Tarjeta)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`${priceClass} text-gray-900`}>
              {formatARS(selectedVariation.price)}
            </span>
            <span className="text-xs text-gray-500">(Efectivo/Transferencia)</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
        {hasSale && (
          <>
            <span className={`${saleClass} text-gray-400`}>
              {formatARS(selectedVariation.regular_price)}
            </span>
            <span className="text-gray-600">-</span>
          </>
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

  // Caso 3: producto simple
  const hasSale = Boolean(product.sale_price);

  if (stacked && hasSale) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className={`${saleClass} text-gray-400`}>
            {formatARS(product.regular_price)}
          </span>
          <span className="text-xs text-gray-400">(Tarjeta)</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`${priceClass} text-gray-900`}>
            {formatARS(product.price)}
          </span>
          <span className="text-xs text-gray-500">(Efectivo/Transferencia)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
      {hasSale && (
        <>
          <span className={`${saleClass} text-gray-400`}>
            {formatARS(product.regular_price)}
          </span>
          <span className="text-gray-600">-</span>
        </>
      )}
      <span className={`${priceClass} text-gray-900`}>
        {formatARS(product.price)}
      </span>
    </div>
  );
}
