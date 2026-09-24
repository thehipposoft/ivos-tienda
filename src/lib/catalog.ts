import type { CatalogProduct } from "@/types/woocommerce";

// Replica en el cliente los filtros que antes hacía la REST API de WooCommerce

export const PER_PAGE = 12;

export const OTROS_SENTINEL = "otros";

export const MENU_CATEGORIES = [
  { label: "Chapa Calada", categoryId: "94" },
  { label: "Deck", categoryId: "248" },
  { label: "Perfiles WPC", categoryId: "77" },
  { label: "Muchtek", categoryId: "92" },
  { label: "Pisos y Zócalos", categoryId: "252" },
  { label: "Placa PVC", categoryId: "95" },
  { label: "StoneFlex", categoryId: "65" },
  { label: "Tubulares", categoryId: "249" },
  { label: "Wall Panel Exterior", categoryId: "256" },
  { label: "Wall Panel Interior", categoryId: "247" },
] as const;

export const USO_OPTIONS = [
  { label: "Interior", slug: "interior" },
  { label: "Exterior", slug: "exterior" },
  { label: "Interior y Exterior", slug: "interior-y-exterior" },
] as const;

export const USO_TAG_IDS: Record<string, number> = {
  interior: 253,
  exterior: 254,
  "interior-y-exterior": 255,
};

export type CatalogParams = {
  category?: string;
  min_price?: string;
  max_price?: string;
  search?: string;
  uso?: string;
  page?: string;
};

const PARAM_KEYS = ["category", "min_price", "max_price", "search", "uso", "page"] as const;

export const parseCatalogParams = (searchParams: URLSearchParams): CatalogParams =>
  Object.fromEntries(
    PARAM_KEYS.flatMap((key) => {
      const value = searchParams.get(key);
      return value ? [[key, value]] : [];
    })
  );

export const buildCatalogUrl = (base: CatalogParams, overrides: CatalogParams = {}): string => {
  const merged = { ...base, ...overrides };
  const p = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v); });
  const s = p.toString();
  return `/catalogo${s ? `?${s}` : ""}`;
};

// Minúsculas y sin acentos, como la collation de MySQL que usa WordPress
export const normalizeText = (text: string): string =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const toNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const n = parseFloat(value);
  return Number.isNaN(n) ? undefined : n;
};

// Rango de precio del producto (variables: min–max de variaciones)
const priceBounds = (product: CatalogProduct): [number, number] => {
  const base = parseFloat(product.price) || 0;
  const min = toNumber(product.price_range?.min) ?? base;
  const max = toNumber(product.price_range?.max) ?? base;
  return [min, max];
};

export const filterCatalog = (
  products: CatalogProduct[],
  params: CatalogParams
): CatalogProduct[] => {
  // "otros" no filtra por categoría
  const categoryId =
    params.category && params.category !== OTROS_SENTINEL ? Number(params.category) : undefined;
  const tagId = params.uso ? USO_TAG_IDS[params.uso] : undefined;
  const minPrice = toNumber(params.min_price);
  const maxPrice = toNumber(params.max_price);
  // WordPress exige que aparezcan todos los términos
  const terms = params.search ? normalizeText(params.search).split(/\s+/).filter(Boolean) : [];

  return products.filter((product) => {
    if (categoryId !== undefined && !product.categoryIds.includes(categoryId)) return false;
    if (tagId !== undefined && !product.tagIds.includes(tagId)) return false;

    // Solapamiento de rangos, igual que wc_product_meta_lookup
    if (minPrice !== undefined || maxPrice !== undefined) {
      const [min, max] = priceBounds(product);
      if (minPrice !== undefined && max < minPrice) return false;
      if (maxPrice !== undefined && min > maxPrice) return false;
    }

    return terms.every((term) => product.searchText.includes(term));
  });
};

export const parsePage = (page: string | undefined): number => {
  const n = Number(page ?? 1);
  return Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1;
};
