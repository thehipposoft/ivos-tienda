"use client";

import { useState } from "react";
import type { WooProduct, WooVariation } from "@/types/woocommerce";
import { PriceDisplay } from "@/components/PriceDisplay";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductInfo({ product }: { product: WooProduct }) {
  const [selectedVariation, setSelectedVariation] = useState<WooVariation | null>(null);

  return (
    <>
      <div className="mb-6">
        <PriceDisplay product={product} selectedVariation={selectedVariation} />
      </div>
      <AddToCartButton
        product={product}
        onVariationChange={setSelectedVariation}
      />
    </>
  );
}