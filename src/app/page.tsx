import { Menu } from "@/components/Menu";
import { HeroSlider } from "@/components/HeroSlider";
import { Categorias } from "@/components/Categorias";
import { ProductWrapper } from "@/components/ProductWrapper";
import getFeed from "@/lib/getFeed";
import { getProducts } from "@/lib/woocommerce";
import RedesSociales from "@/components/RedesSociales";
import Contact from "@/components/Contact";

const FEATURED_PRODUCTS_COUNT = 20;

const Home = async () => {
  // En paralelo: antes el feed bloqueaba el fetch de productos
  const [instagramFeed, products] = await Promise.all([
    getFeed(),
    getProducts({ per_page: FEATURED_PRODUCTS_COUNT }),
  ]);

  return (
    <>
      <Menu />
      <HeroSlider />
      <main>
        <Categorias
          title={
            <>
               <span className="font-bold">INNOVACIÓN</span>
            </>
          }
          subtitle="Nueva generación de materiales"
        />
        <ProductWrapper products={products} title="Productos destacados" buttonText="Ver todos los productos" buttonHref="/catalogo" />
        <Contact />
        <RedesSociales feedData={instagramFeed} />
      </main>
    </>
  );
};

export default Home;
