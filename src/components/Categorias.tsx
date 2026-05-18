import Image from "next/image";
import Link from "next/link";

const CATEGORIAS = [
  { label: "Placas de PVC",    categoryId: 95, src: "/assets/images/materiales/placas-pvc.png" },
  { label: "Paneles Acústicos",categoryId: 97, src: "/assets/images/materiales/paneles-acusticos.jpg" },
  { label: "Rev. Interiores",  categoryId: 96, src: "/assets/images/materiales/rev-interiores-pvc.jpg" },   // verificar: Wallpanel?
  { label: "Rev. Exteriores",  categoryId: 93, src: "/assets/images/materiales/rev-wpc-exteriores.jpg" },   // verificar: WPC Exterior?
  { label: "Chapas Caladas",   categoryId: 94, src: "/assets/images/materiales/chapas-caladas.jpg" },
  { label: "Perfiles WPC",     categoryId: 93, src: "/assets/images/materiales/perfiles-wpc.jpg" },         // verificar: WPC Exterior?
] satisfies { label: string; categoryId: number; src: string }[];

type Props = {
  title: React.ReactNode;
  subtitle: string;
};

export const Categorias = ({ title, subtitle }: Props) => {
  return (
    <section className="mx-auto max-w-7xl py-8">
      {/* Heading */}
      <div className="mb-2 text-center">
        <h2 className="text-5xl font-medium uppercase tracking-wide text-[#01222C]">
          {title}
        </h2>
        <p className="mt-1 text-base text-gray-500">{subtitle}</p>
      </div>

      {/* Grid container */}
      <div className="rounded-3xl shadow-lg p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIAS.map(({ label, categoryId, src }) => (
            <Link
              key={label}
              href={`/catalogo?category=${categoryId}&page=1`}
              className="group relative block overflow-hidden rounded-xl"
            >
              <div className="relative aspect-5/5">
                <Image
                  src={src}
                  alt={label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-brand-blue/80 px-3 py-3">
                  <span className="text-md font-bold text-white">{label}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
