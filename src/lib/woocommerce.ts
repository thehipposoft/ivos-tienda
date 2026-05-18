import type { WooProduct, WooCategory } from "@/types/woocommerce";

const BASE_URL = process.env.NEXT_PUBLIC_WC_URL?.replace(/\/$/, "");
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

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
    `${BASE_URL}/wp-json/wc/v3/products?${query}&${authParams()}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`);
  const data = await res.json();
  return data as WooProduct[];
};

export const getProduct = async (id: number): Promise<WooProduct> => {
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products/${id}?${authParams()}`,
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
    `${BASE_URL}/wp-json/wc/v3/products?${query}&${authParams()}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`);

  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);
  const products = (await res.json()) as WooProduct[];

  return { products, total, totalPages };
};

export const getProductBySlug = async (slug: string): Promise<WooProduct | null> => {
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}&${authParams()}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error(`Error al obtener producto: ${res.status}`);
  const data = (await res.json()) as WooProduct[];
  return data[0] ?? null;
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
