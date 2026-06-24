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
};

export type WooCategory = {
  id: number;
  name: string;
  slug: string;
};

export type WooVariationAttribute = {
  id: number;
  name: string;    // ej: "Color"
  option: string;  // ej: "Rojo"
};

export type WooVariation = {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  attributes: WooVariationAttribute[];
   image: {          
    id: number;
    src: string;
    alt: string;
  } | null;
};

export type PriceRange = {
  min: string;
  max: string;
  isSingle: boolean;
};

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "variable" | "grouped" | "external";
  description: string;
  short_description: string;
  price: string;
  price_html?: string;  // ← agregar
  regular_price: string;
  sale_price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: WooImage[];
  categories: WooCategory[];
  attributes: WooAttribute[];
  variations?: WooVariation[];  // solo en productos variables
  price_range?: PriceRange;     // calculado al fetchear, disponible en todos lados
};