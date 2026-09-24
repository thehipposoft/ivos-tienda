import type { Metadata } from "next";
import { getCatalogProducts } from "@/lib/woocommerce";
import { Menu } from "@/components/Menu";
import { CatalogClient } from "@/components/CatalogClient";

// Canonical único para todas las variantes de filtros
export const metadata: Metadata = {
  alternates: { canonical: "https://ivos.com.ar/catalogo" },
};

// Estático + ISR: filtros, búsqueda y paginación corren en el cliente
export default async function CatalogoPage() {
  const products = await getCatalogProducts();

  return (
    <>
      <Menu />
      <div className="mx-auto max-w-7xl px-8 pt-20 pb-12">
        <CatalogClient products={products} />
      </div>
    </>
  );
}
