"use client";

import { useMemo } from "react";
import Link from "next/link";
import Form from "next/form";
import { CatalogProductCard } from "@/components/CatalogProductCard";
import { CatalogFilterPanel } from "@/components/CatalogFilterPanel";
import {
  MENU_CATEGORIES,
  OTROS_SENTINEL,
  PER_PAGE,
  USO_OPTIONS,
  buildCatalogUrl as buildUrl,
  filterCatalog,
  parsePage,
  type CatalogParams,
} from "@/lib/catalog";
import type { CatalogProduct } from "@/types/woocommerce";

type Props = { products: CatalogProduct[]; params: CatalogParams };

// Markup idéntico al /catalogo server-rendered anterior
export const CatalogView = ({ products: allProducts, params }: Props) => {
  const page = parsePage(params.page);

  const filtered = useMemo(() => filterCatalog(allProducts, params), [allProducts, params]);
  const total = filtered.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const products = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const pillBase = {
    min_price: params.min_price,
    max_price: params.max_price,
    search: params.search,
    uso: params.uso,
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
        <p className="mt-1 text-sm text-gray-500">{total} productos encontrados</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <CatalogFilterPanel>
          {/* Categorías */}
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Categorías
          </h3>
          <div className="mb-6 flex flex-wrap gap-1.5">
            <Link
              href={buildUrl(pillBase, { page: "1" })}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                !params.category
                  ? "border-[#F94E19] bg-[#F94E19] font-semibold text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              Todos
            </Link>

            {MENU_CATEGORIES.map((cat) => {
              const active = params.category === cat.categoryId;
              return (
                <Link
                  key={cat.categoryId}
                  href={active ? buildUrl(pillBase, { page: "1" }) : buildUrl(pillBase, { category: cat.categoryId, page: "1" })}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    active
                      ? "border-[#F94E19] bg-[#F94E19] font-semibold text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}

            {/* Otros */}
            {(() => {
              const active = params.category === OTROS_SENTINEL;
              return (
                <Link
                  href={active ? buildUrl(pillBase, { page: "1" }) : buildUrl(pillBase, { category: OTROS_SENTINEL, page: "1" })}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    active
                      ? "border-[#F94E19] bg-[#F94E19] font-semibold text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  Otros
                </Link>
              );
            })()}
          </div>

          {/* Búsqueda */}
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Buscar
          </h3>
          {/* key: resetea defaultValue al cambiar la URL sin recargar */}
          <Form key={`search-${params.search ?? ""}`} action="/catalogo" className="mb-6 flex flex-col gap-2">
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            {params.min_price && (
              <input type="hidden" name="min_price" value={params.min_price} />
            )}
            {params.max_price && (
              <input type="hidden" name="max_price" value={params.max_price} />
            )}
            {params.uso && (
              <input type="hidden" name="uso" value={params.uso} />
            )}
            <input type="hidden" name="page" value="1" />

            <div className="relative">
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder="Nombre del producto..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-9 text-sm focus:border-[#F94E19] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#F94E19]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>

            {params.search && (
              <Link
                href={buildUrl({ category: params.category, min_price: params.min_price, max_price: params.max_price, uso: params.uso }, { page: "1" })}
                className="text-center text-xs text-gray-400 hover:text-gray-700"
              >
                Limpiar búsqueda
              </Link>
            )}
          </Form>

          {/* Uso */}
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Uso
          </h3>
          <div className="mb-6 flex flex-col gap-1.5">
            {USO_OPTIONS.map(({ label, slug }) => {
              const active = params.uso === slug;
              return (
                <Link
                  key={slug}
                  href={buildUrl(
                    { category: params.category, min_price: params.min_price, max_price: params.max_price, search: params.search },
                    { uso: active ? undefined : slug, page: "1" }
                  )}
                  className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
                    active
                      ? "border-[#F94E19] bg-[#F94E19] font-semibold text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Precio */}
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Precio
          </h3>
          <Form
            key={`price-${params.min_price ?? ""}-${params.max_price ?? ""}`}
            action="/catalogo"
            className="flex flex-col gap-2"
          >
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            {params.search && (
              <input type="hidden" name="search" value={params.search} />
            )}
            {params.uso && (
              <input type="hidden" name="uso" value={params.uso} />
            )}
            <input type="hidden" name="page" value="1" />

            <div>
              <label className="text-xs text-gray-500">Mínimo</label>
              <input
                type="number"
                name="min_price"
                defaultValue={params.min_price}
                placeholder="$ 0"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#F94E19] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Máximo</label>
              <input
                type="number"
                name="max_price"
                defaultValue={params.max_price}
                placeholder="Sin límite"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#F94E19] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-1 w-full rounded-lg bg-[#F94E19] py-2 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
            >
              Aplicar
            </button>

            {(params.min_price || params.max_price) && (
              <Link
                href={buildUrl({ category: params.category, search: params.search, uso: params.uso }, { page: "1" })}
                className="text-center text-xs text-gray-400 hover:text-gray-700"
              >
                Limpiar precio
              </Link>
            )}
          </Form>
        </CatalogFilterPanel>

        {/* Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex min-h-96 lg:min-w-4xl w-full items-center justify-center rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">No se encontraron productos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              {page > 1 ? (
                <Link
                  href={buildUrl(params, { page: String(page - 1) })}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  ← Anterior
                </Link>
              ) : (
                <span className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-300">
                  ← Anterior
                </span>
              )}
              <span className="text-sm text-gray-500">{page} / {totalPages}</span>
              {page < totalPages ? (
                <Link
                  href={buildUrl(params, { page: String(page + 1) })}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Siguiente →
                </Link>
              ) : (
                <span className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-300">
                  Siguiente →
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
