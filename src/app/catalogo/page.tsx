import Link from "next/link";
import { getProductsWithMeta, getCategories } from "@/lib/woocommerce";
import { Menu } from "@/components/Menu";
import { CatalogProductCard } from "@/components/CatalogProductCard";

const PER_PAGE = 12;

// Único listado de categorías visibles, en el orden deseado.
// "Otros" es un sentinel: muestra todos los productos sin filtro de categoría.
const CATEGORY_WHITELIST = [
  "Acústicos",
  "Chapa Calada",
  "Placa PVC",
  "Muchtek",
  "StoneFlex",
  "WPC Exterior",
] as const;

const OTROS_SENTINEL = "otros";

const USO_OPTIONS = [
  { label: "Interior",          slug: "interior" },
  { label: "Exterior",          slug: "exterior" },
  { label: "Interior y Exterior", slug: "interior-y-exterior" },
] as const;

type Params = {
  category?: string;
  min_price?: string;
  max_price?: string;
  search?: string;
  uso?: string;
  page?: string;
};

type Props = { searchParams: Promise<Params> };

const buildUrl = (base: Params, overrides: Params = {}): string => {
  const merged = { ...base, ...overrides };
  const p = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v); });
  const s = p.toString();
  return `/catalogo${s ? `?${s}` : ""}`;
};

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));

  // "otros" no filtra por categoría en la API
  const apiCategory =
    params.category === OTROS_SENTINEL ? undefined : params.category;

  const [{ products, total, totalPages }, allCategories] = await Promise.all([
    getProductsWithMeta({
      category: apiCategory,
      min_price: params.min_price,
      max_price: params.max_price,
      search: params.search,
      uso: params.uso,
      per_page: PER_PAGE,
      page,
    }),
    getCategories(),
  ]);

  // Filtra y ordena según el whitelist
  const visibleCategories = CATEGORY_WHITELIST.flatMap((name) => {
    const match = allCategories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    return match ? [match] : [];
  });

  const pillBase = {
    min_price: params.min_price,
    max_price: params.max_price,
    search: params.search,
    uso: params.uso,
  };

  return (
    <>
      <Menu />
      <div className="mx-auto max-w-7xl px-8 pt-28 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
          <p className="mt-1 text-sm text-gray-500">{total} productos encontrados</p>
        </div>

        {/* Category pills — full width */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900">Categorías</h3>
          <div className="flex flex-wrap gap-2">
            {/* Todos */}
            <Link
              href={buildUrl(pillBase, { page: "1" })}
              className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                !params.category
                  ? "border-[#F94E19] bg-[#F94E19] font-semibold text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-500"
              }`}
            >
              Todos
            </Link>

            {visibleCategories.map((cat) => (
              <Link
                key={cat.id}
                href={buildUrl(pillBase, { category: String(cat.id), page: "1" })}
                className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                  params.category === String(cat.id)
                    ? "border-[#F94E19] bg-[#F94E19] font-semibold text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-500"
                }`}
              >
                {cat.name}
              </Link>
            ))}

            {/* Otros */}
            <Link
              href={buildUrl(pillBase, { category: OTROS_SENTINEL, page: "1" })}
              className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
                params.category === OTROS_SENTINEL
                  ? "border-[#F94E19] bg-[#F94E19] font-semibold text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-500"
              }`}
            >
              Otros
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-52">

            {/* Búsqueda */}
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Buscar
            </h3>
            <form action="/catalogo" method="GET" className="mb-6 flex flex-col gap-2">
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
            </form>

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
            <form action="/catalogo" method="GET" className="flex flex-col gap-2">
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
            </form>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200">
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
      </div>
    </>
  );
}
