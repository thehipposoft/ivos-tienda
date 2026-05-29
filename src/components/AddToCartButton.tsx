"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import type { WooProduct, WooVariation } from "@/types/woocommerce";

type Props = {
  product: WooProduct;
  onVariationChange?: (variation: WooVariation | null) => void; // ← nuevo
};

const QtyControl = ({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (q: number) => void;
}) => (
  <div className="flex overflow-hidden rounded-lg border border-gray-300">
    <button
      type="button"
      onClick={() => onChange(Math.max(1, qty - 1))}
      className="px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-100"
    >
      −
    </button>
    <span className="min-w-10 px-2 py-2.5 text-center text-sm font-medium">
      {qty}
    </span>
    <button
      type="button"
      onClick={() => onChange(qty + 1)}
      className="px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-100"
    >
      +
    </button>
  </div>
);

export const AddToCartButton = ({ product, onVariationChange }: Props) => {

  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const addItem = useCartStore((s) => s.addItem);

  const isVariantAttr = (name: string) => name.toLowerCase() !== "uso";

 const handleAdd = () => {
  const activeVariation = product.variations?.find((v) =>
    v.attributes
      .filter((a) => isVariantAttr(a.name))
      .every((a) => selected[a.name] === a.option)
  );

  addItem({
    id: product.id,
    name: product.name,
    price: activeVariation?.price ?? product.price,
    quantity: qty,
    image: product.images[0]?.src ?? "",
    slug: product.slug,
    selectedAttributes: Object.keys(selected).length > 0 ? selected : undefined,
  });
};


function handleSelect(attrName: string, option: string, isActive: boolean) {
  const next = isActive
    ? Object.fromEntries(Object.entries(selected).filter(([k]) => k !== attrName))
    : { ...selected, [attrName]: option };

  setSelected(next);

  if (onVariationChange && product.variations) {
    const match = product.variations.find((v) =>
      v.attributes
        .filter((a) => isVariantAttr(a.name))
        .every((a) => next[a.name] === a.option)
    );
    onVariationChange(match ?? null);
  }
}

  if (product.type === "variable") {
    const variantAttrs = product.attributes.filter(
      (a) => a.options.length > 0 && a.name.toLowerCase() !== "uso"
    );
    const allSelected =
      variantAttrs.length > 0 &&
      variantAttrs.every((a) => Boolean(selected[a.name]));

    return (
      <div className="flex flex-col gap-4">
        {variantAttrs.map((attr) => (
          <div key={attr.id}>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              {attr.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {attr.options.map((option) => {
                const active = selected[attr.name] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(attr.name, option, active)}
                    className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                      active
                        ? "border-[#F94E19] bg-[#F94E19] font-semibold text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <QtyControl qty={qty} onChange={setQty} />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!allSelected}
            className="flex-1 rounded-xl border border-[#F94E19] bg-[#F94E19] px-8 py-3 text-sm font-bold text-white duration-300 hover:bg-white hover:text-[#F94E19] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {allSelected ? "Agregar al carrito" : "Elegí una opción"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <QtyControl qty={qty} onChange={setQty} />
      <button
        type="button"
        onClick={handleAdd}
        className="flex-1 rounded-xl border border-[#F94E19] bg-[#F94E19] px-8 py-3 text-sm font-bold text-white duration-300 hover:bg-white cursor-pointer hover:text-[#F94E19]"
      >
        Agregar al carrito
      </button>
    </div>
  );
};