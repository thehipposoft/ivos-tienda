"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CatalogView } from "@/components/CatalogView";
import { parseCatalogParams, type CatalogParams } from "@/lib/catalog";
import type { CatalogProduct } from "@/types/woocommerce";

type Props = { products: CatalogProduct[] };

const NO_PARAMS: CatalogParams = {};

const CatalogWithParams = ({ products }: Props) => {
  const searchParams = useSearchParams();
  const params = useMemo(() => parseCatalogParams(searchParams), [searchParams]);
  return <CatalogView products={products} params={params} />;
};

// El HTML estático trae el catálogo sin filtros (SEO); el cliente aplica la query
export const CatalogClient = ({ products }: Props) => (
  <Suspense fallback={<CatalogView products={products} params={NO_PARAMS} />}>
    <CatalogWithParams products={products} />
  </Suspense>
);
