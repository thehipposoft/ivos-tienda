import Image from "next/image";
import { getProducts } from "@/lib/woocommerce";

export const Proyects = async () => {
  const products = await getProducts({ per_page: 24 });

  return (
    <section className="p-8">
      <h2 className="mb-6 text-2xl font-bold">
        Productos ({products.length})
      </h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            {product.images[0] && (
              <div className="relative aspect-square w-full overflow-hidden rounded">
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
            )}
            <span className="font-medium leading-tight">{product.name}</span>
            <span className="text-sm text-gray-500">${product.price}</span>
            <span className="text-xs text-gray-400">{product.stock_status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
