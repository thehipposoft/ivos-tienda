import { Suspense } from "react";
import { Menu } from "@/components/Menu";
import { HeroSlider } from "@/components/HeroSlider";
import { Categorias } from "@/components/Categorias";
import { ProductWrapper } from "@/components/ProductWrapper";
import { Post } from "@/types/instagram";
import getFeed from "@/lib/getFeed";
import RedesSociales from "@/components/RedesSociales";
import Contact from "@/components/Contact";

const Home = async () => {

  const instagramFeed: Post[] = await getFeed();
  
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
        <Contact />
        <RedesSociales feedData={instagramFeed} />
      </main>
    </>
  );
};

export default Home;
