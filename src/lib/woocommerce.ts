import type { WooProduct, WooCategory, WooVariation, PriceRange } from "@/types/woocommerce";

const BASE_URL = process.env.NEXT_PUBLIC_WC_URL?.replace(/\/$/, "");
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

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
  "attributes",
  "variations",
  "short_description",
  "description",
  "price_html",
].join(",");

const authParams = () => `consumer_key=${KEY}&consumer_secret=${SECRET}`;

export type GetProductsParams = {
  category?: string;
  per_page?: number;
  page?: number;
  min_price?: string;
  max_price?: string;
  search?: string;
  uso?: string;
};

export const getProducts = async (
  params: GetProductsParams = {}
): Promise<WooProduct[]> => {
  const query = new URLSearchParams({
    per_page: String(params.per_page ?? 20),
    page: String(params.page ?? 1),
    ...(params.category && { category: params.category }),
    ...(params.min_price && { min_price: params.min_price }),
    ...(params.max_price && { max_price: params.max_price }),
  });

  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products?${query}&_fields=${PRODUCT_FIELDS}&${authParams()}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`);
  const data = (await res.json()) as WooProduct[];

  return data.map((p) => {
    if (p.type !== "variable" || !p.price_html) return p;
    const price_range = parsePriceRange(p.price_html);
    return price_range ? { ...p, price_range } : p;
  });
};



export const getProduct = async (id: number): Promise<WooProduct> => {
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products/${id}?&_fields=${PRODUCT_FIELDS}&${authParams()}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error(`Producto no encontrado: ${res.status}`);
  return res.json() as Promise<WooProduct>;
};

export const getCategories = async (): Promise<WooCategory[]> => {
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products/categories?per_page=100&${authParams()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`Error al obtener categorías: ${res.status}`);
  return res.json() as Promise<WooCategory[]>;
};

export type ProductsMeta = {
  products: WooProduct[];
  total: number;
  totalPages: number;
};

export const getProductsWithMeta = async (
  params: GetProductsParams = {}
): Promise<ProductsMeta> => {
  const query = new URLSearchParams({
    per_page: String(params.per_page ?? 12),
    page: String(params.page ?? 1),
    ...(params.category && { category: params.category }),
    ...(params.min_price && { min_price: params.min_price }),
    ...(params.max_price && { max_price: params.max_price }),
    ...(params.search && { search: params.search }),
    ...(params.uso && { attribute: "pa_uso", attribute_term: params.uso }),
  });

  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products?${query}&_fields=${PRODUCT_FIELDS}&${authParams()}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`);

  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);

  const products = (await res.json()) as WooProduct[];
  const enriched = products.map((p) => {
    if (p.type !== "variable" || !p.price_html) return p;
    const price_range = parsePriceRange(p.price_html);
    return price_range ? { ...p, price_range } : p;
  });
  return { products: enriched, total, totalPages };
};

// ── NUEVO: helper para calcular el rango ───────────────
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
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products/${productId}/variations?per_page=100&_fields=id,price,regular_price,sale_price,stock_status,attributes,image&${authParams()}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
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

export const getProductBySlug = async (
  slug: string
): Promise<WooProduct | null> => {
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}&_fields=${PRODUCT_FIELDS}&${authParams()}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error(`Error al obtener producto: ${res.status}`);
  const data = (await res.json()) as WooProduct[];
  const product = data[0] ?? null;

  // Si es variable, traemos las variaciones en paralelo y calculamos el rango
  if (product?.type === "variable") {
    const variations = await getProductVariations(product.id);
    product.variations = variations;
    product.price_range = calcPriceRange(variations);
  }

  return product;
};

export const getAllProductSlugs = async (): Promise<string[]> => {
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products?per_page=100&_fields=slug&${authParams()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { slug: string }[];
  return data.map(({ slug }) => slug);
};
