import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getAllProductSlugs } from "@/lib/woocommerce";
import { Menu } from "@/components/Menu";
import { ProductPageClient } from "@/components/ProductPageClient";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = async () => {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <Menu />
      <div className="mx-auto max-w-6xl px-8 pt-28 pb-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/catalogo" className="hover:text-gray-700">
            Catálogo
          </Link>
          <span>/</span>
          {product.categories[0] && (
            <>
              <Link
                href={`/catalogo?category=${product.categories[0].id}`}
                className="hover:text-gray-700"
              >
                {product.categories[0].name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-700">{product.name}</span>
        </nav>

        {/* Todo lo interactivo + descripción */}
        <ProductPageClient product={product} />

      </div>
    </>
  );
}