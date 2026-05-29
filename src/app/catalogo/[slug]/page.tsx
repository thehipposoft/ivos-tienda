import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getAllProductSlugs } from "@/lib/woocommerce";
import { Menu } from "@/components/Menu";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";

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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={product.images} />

          {/* Info */}
          <div className="flex flex-col">
            {/* Categories */}
            <div className="mb-3 flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogo?category=${cat.id}`}
                  className="text-xs font-semibold uppercase tracking-wider text-[#F94E19] hover:underline"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900">
              {product.name}
            </h1>

            {/* Precio + selector de variantes + botón carrito */}
            <ProductInfo product={product} />

            {/* Short description */}
            {product.short_description && (
              <div
                className="prose prose-sm mb-6 max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Stock */}
            <div className="mb-6">
              {product.stock_status === "instock" ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  En stock
                </span>
              ) : product.stock_status === "onbackorder" ? (
                <span className="text-sm text-yellow-600">
                  Disponible bajo pedido
                </span>
              ) : (
                <span className="text-sm text-red-500">Sin stock</span>
              )}
            </div>

            {/* Attributes */}
            {product.attributes.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Especificaciones
                </h3>
                <dl className="flex flex-col gap-2">
                  {product.attributes.map((attr) => (
                    <div key={attr.id} className="flex gap-2 text-sm">
                      <dt className="font-medium text-gray-700">{attr.name}:</dt>
                      <dd className="text-gray-500">{attr.options.join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Full description */}
            {product.description && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Descripción
                </h3>
                <div
                  className="prose prose-sm max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}