"use client";

import { useState } from "react";
import type { WooProduct, WooVariation } from "@/types/woocommerce";
import { PriceDisplay } from "@/components/PriceDisplay";
import { AddToCartButton } from "@/components/AddToCartButton";

type Props = {
  product: WooProduct;
  onVariationChange?: (variation: WooVariation | null) => void;
};

export function ProductInfo({ product, onVariationChange }: Props) {
  const [selectedVariation, setSelectedVariation] = useState<WooVariation | null>(null);

  function handleVariationChange(variation: WooVariation | null) {
    setSelectedVariation(variation);
    onVariationChange?.(variation);  // sube al page.tsx si lo necesitás
  }

  return (
    <>
      <div className="mb-6">
        <PriceDisplay product={product} selectedVariation={selectedVariation} stacked />
      </div>
      <AddToCartButton
        product={product}
        onVariationChange={handleVariationChange}
      />
    </>
  );
}