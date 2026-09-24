import type {
  WooProduct,
  WooCategory,
  WooVariation,
  PriceRange,
  CatalogProduct,
} from "@/types/woocommerce";
import { normalizeText } from "@/lib/catalog";

const BASE_URL = process.env.NEXT_PUBLIC_WC_URL?.replace(/\/$/, "");
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

// Sin webhook: 1 h de desfase máximo. Con webhook se puede subir a 86400
export const PRODUCTS_REVALIDATE_SECONDS = 3600;
// revalidateTag(PRODUCTS_TAG) invalida todas las páginas con productos
export const PRODUCTS_TAG = "products";

// WooCommerce tarda 2–4 s por request; en runtime cortamos antes de que la función quede colgada
const RUNTIME_TIMEOUT_MS = 5000;
const RUNTIME_LIST_TIMEOUT_MS = 10000;
// En build (no consume compute) WooCommerce se satura con los prerenders en paralelo
const BUILD_TIMEOUT_MS = 30000;
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const FETCH_TIMEOUT_MS = IS_BUILD ? BUILD_TIMEOUT_MS : RUNTIME_TIMEOUT_MS;
const LIST_FETCH_TIMEOUT_MS = IS_BUILD ? BUILD_TIMEOUT_MS : RUNTIME_LIST_TIMEOUT_MS;
const MAX_PER_PAGE = 100;
// Evita loops si la jerarquía de categorías está corrupta
const MAX_CATEGORY_DEPTH = 10;

const PRODUCT_FIELDS = [
  "id",
  "name",
  "slug",
  "type",
  "price",
  "regular_price",
  "sale_price",
  "stock_status",
  "images",
  "categories",
  "tags",
  "attributes",
  "variations",
  "short_description",
  "description",
  "price_html",
].join(",");

const authParams = () => `consumer_key=${KEY}&consumer_secret=${SECRET}`;

// Fetch cacheado, tagueado y con timeout. Si falla, lanza: en ISR Next sigue sirviendo la versión anterior
const wcFetch = async (path: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> => {
  const separator = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE_URL}/wp-json/wc/v3/${path}${separator}${authParams()}`, {
    next: { revalidate: PRODUCTS_REVALIDATE_SECONDS, tags: [PRODUCTS_TAG] },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`WooCommerce ${res.status}: ${path.split("?")[0]}`);
  return res;
};

// Trae todas las páginas en paralelo (hoy 88 productos = 1 página)
const wcFetchAll = async <T,>(path: string, timeoutMs = LIST_FETCH_TIMEOUT_MS): Promise<T[]> => {
  const pagePath = (page: number) => `${path}&per_page=${MAX_PER_PAGE}&page=${page}`;
  const first = await wcFetch(pagePath(1), timeoutMs);
  const totalPages = Number(first.headers.get("X-WP-TotalPages") ?? 1);

  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) =>
      wcFetch(pagePath(i + 2), timeoutMs).then((res) => res.json() as Promise<T[]>)
    )
  );
  const firstData = (await first.json()) as T[];
  return [firstData, ...rest].flat();
};

const withPriceRange = <P extends WooProduct>(p: P): P => {
  if (p.type !== "variable" || !p.price_html) return p;
  const price_range = parsePriceRange(p.price_html);
  return price_range ? { ...p, price_range } : p;
};

// Lista completa (orden de WooCommerce: más nuevos primero). Única fuente para home, catálogo, fichas y sitemap:
// en build sale 1 vez a la red y el resto de las páginas la leen del cache de fetch
export const getAllProducts = async (): Promise<WooProduct[]> => {
  const products = await wcFetchAll<WooProduct>(`products?status=publish&_fields=${PRODUCT_FIELDS}`);
  return products.map(withPriceRange);
};

export type GetProductsParams = {
  category?: string;
  per_page?: number;
  page?: number;
  min_price?: string;
  max_price?: string;
};

export const getProducts = async (
  params: GetProductsParams = {}
): Promise<WooProduct[]> => {
  const query = new URLSearchParams({
    per_page: String(params.per_page ?? 20),
    page: String(params.page ?? 1),
    status: "publish",
    ...(params.category && { category: params.category }),
    ...(params.min_price && { min_price: params.min_price }),
    ...(params.max_price && { max_price: params.max_price }),
  });

  const res = await wcFetch(`products?${query}&_fields=${PRODUCT_FIELDS}`);
  const data = (await res.json()) as WooProduct[];
  return data.map(withPriceRange);
};

export const getProduct = async (id: number): Promise<WooProduct> => {
  const res = await wcFetch(`products/${id}?_fields=${PRODUCT_FIELDS}`);
  return res.json() as Promise<WooProduct>;
};

export const getCategories = async (): Promise<WooCategory[]> =>
  wcFetchAll<WooCategory>("products/categories?_fields=id,name,slug,parent");

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, " ");

// Catálogo completo, recortado a lo que usa la card + datos para filtrar en el cliente
export const getCatalogProducts = async (): Promise<CatalogProduct[]> => {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  const parentOf = new Map(categories.map((c) => [c.id, c.parent ?? 0]));

  // WooCommerce incluye subcategorías al filtrar por categoría
  const withAncestors = (ids: number[]): number[] => {
    const all = new Set(ids);
    ids.forEach((id) => {
      let parent = parentOf.get(id) ?? 0;
      for (let depth = 0; parent && depth < MAX_CATEGORY_DEPTH; depth++) {
        all.add(parent);
        parent = parentOf.get(parent) ?? 0;
      }
    });
    return [...all];
  };

  return products.map((product) => ({
    ...product,
    images: product.images.slice(0, 1).map(({ id, src, alt }) => ({ id, src, alt })),
    categories: product.categories.map(({ id, name, slug }) => ({ id, name, slug })),
    attributes: [],
    tags: undefined,
    description: "",
    short_description: "",
    price_html: undefined,
    categoryIds: withAncestors(product.categories.map((c) => c.id)),
    tagIds: (product.tags ?? []).map((t) => t.id),
    searchText: normalizeText(
      [product.name, stripHtml(product.short_description), stripHtml(product.description)].join(" ")
    ).replace(/\s+/g, " "),
  }));
};

// ── helper para calcular el rango ───────────────
function calcPriceRange(variations: WooVariation[]): PriceRange | undefined {
  const prices = variations
    .map((v) => parseFloat(v.price))
    .filter((p) => !isNaN(p) && p > 0);

  if (prices.length === 0) return undefined;

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return {
    min: String(min),
    max: String(max),
    isSingle: min === max,
  };
}

export const getProductVariations = async (
  productId: number
): Promise<WooVariation[]> => {
  const res = await wcFetch(
    `products/${productId}/variations?per_page=${MAX_PER_PAGE}&_fields=id,price,regular_price,sale_price,stock_status,attributes,image`
  );
  return res.json() as Promise<WooVariation[]>;
};

function parsePriceRange(priceHtml: string): PriceRange | undefined {
  // Decodifica &#36; → $ y &ndash; → – antes de parsear
  const decoded = priceHtml
    .replace(/&#36;/g, "$")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&");

  const match = decoded.match(
    /Price range:\s*\$?([\d.,]+)\s+through\s+\$?([\d.,]+)/
  );

  if (!match) return undefined;

  const parse = (s: string) =>
    parseFloat(s.replace(/\./g, "").replace(",", "."));

  const min = parse(match[1]);
  const max = parse(match[2]);

  if (isNaN(min) || isNaN(max)) return undefined;

  return {
    min: String(min),
    max: String(max),
    isSingle: min === max,
  };
}

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

// Sale de la lista cacheada: evita un request por ficha. null solo si no existe; errores de red lanzan
export const getProductBySlug = async (
  slug: string
): Promise<WooProduct | null> => {
  const target = safeDecode(slug);
  const products = await getAllProducts();
  const found = products.find((p) => safeDecode(p.slug) === target);
  if (!found) return null;

  // Copia: la lista es compartida entre páginas
  const product = { ...found };

  // Las variaciones necesitan el id: no se puede paralelizar
  if (product.type === "variable") {
    const variations = await getProductVariations(product.id);
    product.variations = variations;
    product.price_range = calcPriceRange(variations);
  }

  return product;
};

export const getAllProductSlugs = async (): Promise<string[]> => {
  const products = await getAllProducts();
  return products.map(({ slug }) => slug);
};
