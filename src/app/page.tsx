import { Suspense } from "react";
import { Menu } from "@/components/Menu";
import { HeroSlider } from "@/components/HeroSlider";
import { Categorias } from "@/components/Categorias";
import { ProductWrapper } from "@/components/ProductWrapper";
import { Footer } from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Menu />
      <HeroSlider />
      <main>
        <Categorias
          title={
            <>
              REMODELÁ <span className="font-bold">SIN OBRA</span>
            </>
          }
          subtitle="Una nueva generación de materiales"
        />
        <Suspense fallback={<p className="p-8 text-gray-500">Cargando productos...</p>}>
          <ProductWrapper title="Últimos productos" buttonText="Ver todos los productos" buttonHref="/catalogo" />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default Home;
