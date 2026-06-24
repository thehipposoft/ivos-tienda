import { Suspense } from "react";
import { Menu } from "@/components/Menu";
import { HeroSlider } from "@/components/HeroSlider";
import { Categorias } from "@/components/Categorias";
import { ProductWrapper } from "@/components/ProductWrapper";

const Home = () => {
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
        <Suspense fallback={<p className="p-8 text-gray-500">Cargando productos...</p>}>
          <ProductWrapper title="Productos destacados" buttonText="Ver todos los productos" buttonHref="/catalogo" />
        </Suspense>
      </main>
    </>
  );
};

export default Home;
