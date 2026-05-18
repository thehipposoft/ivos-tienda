export type WooImage = {
  id: number;
  src: string;
  alt: string;
};

export type WooAttribute = {
  id: number;
  name: string;
  slug: string;
  options: string[];
}

export type WooCategory = {
  id: number;
  name: string;
  slug: string;
};

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "variable" | "grouped" | "external";
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: WooImage[];
  categories: WooCategory[];
  attributes: WooAttribute[];
};
