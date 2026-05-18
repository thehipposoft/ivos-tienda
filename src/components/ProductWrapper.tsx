import { getProducts } from "@/lib/woocommerce";
import { ProductSlider } from "@/components/ProductSlider";
import Link from "next/link";

type Props = { title: string, buttonText?: string, buttonHref?: string };

export const ProductWrapper = async ({ title, buttonText, buttonHref }: Props) => {
  const products = await getProducts({ per_page: 20 });

  return (
    <section className=" py-12 max-w-7xl mx-auto">
      <h2 className="mb-8 text-4xl font-bold text-gray-900">{title}</h2>
      <ProductSlider products={products} />
      {buttonText && buttonHref && (
        <Link
          href={buttonHref}
          className="inline-block px-6 py-3 mt-6 text-white bg-brand-orange duration-300 hover:bg-white border border-brand-orange hover:border-brand-blue hover:text-brand-blue rounded-lg"
        >
          {buttonText}
        </Link>
      )}
    </section>
  );
};
