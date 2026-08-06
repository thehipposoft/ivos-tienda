import Image from "next/image";
import Link from "next/link";

type SubItem = {
  label: string;
  categoryId: number;
  src: string | null;
  color?: string;
};

const INTERIOR_ITEMS: SubItem[] = [
  { label: "Placas PVC",     categoryId: 95, src: "/assets/images/materiales/placas-pvc.png" },
  { label: "Wall Panel",     categoryId: 96, src: "/assets/images/materiales/rev-interiores-pvc.jpg" },
  { label: "Cielo Raso",      categoryId: 251,  src: "/assets/images/materiales/Item Interior Cielorraso - IVOS.webp" },
  { label: "Piso y Zócalos", categoryId: 252,  src: "/assets/images/materiales/Item Interior Pisos Y Zocalos - IVOS.webp" },
  { label: "Acústicos",      categoryId: 97, src: "/assets/images/materiales/paneles-acusticos.jpg" },
  { label: "Accesorios",     categoryId: 250,  src: "/assets/images/materiales/Item Interior Accesorios - IVOS.webp" },
];

const EXTERIOR_ITEMS: SubItem[] = [
  { label: "StoneFlex",      categoryId: 65, src: "/assets/images/materiales/Item Exterior Stoneflex - IVOS.webp" },
  { label: "Wall Panels",    categoryId: 256, src: "/assets/images/materiales/Item Exterior Wallpanel - IVOS.webp" },
  { label: "Perfiles WPC",   categoryId: 77, src: "/assets/images/materiales/perfiles-wpc.jpg" },
  { label: "Deck",           categoryId: 248,  src: "/assets/images/materiales/Item Exterior Deck - IVOS.webp" },
  { label: "Tubulares",      categoryId: 249,  src: "/assets/images/materiales/Item Exterior Tubulares - IVOS.webp" },
  { label: "Chapas Caladas", categoryId: 94, src: "/assets/images/materiales/chapas-caladas.jpg" },
];

// Interleave: 3 interior + 3 exterior por row para que auto-placement los ubique correctamente
const SUB_ITEMS: SubItem[] = [
  ...INTERIOR_ITEMS.slice(0, 3),
  ...EXTERIOR_ITEMS.slice(0, 3),
  ...INTERIOR_ITEMS.slice(3),
  ...EXTERIOR_ITEMS.slice(3),
];

type Props = {
  title: React.ReactNode;
  subtitle: string;
};

export const Categorias = ({ title, subtitle }: Props) => (
  <section className="mx-auto max-w-7xl py-8">
    <div className="mb-2 text-center">
      <h2 className="text-5xl font-medium uppercase tracking-wide text-[#01222C]">
        {title}
      </h2>
      <p className="mt-1 text-base text-gray-500">{subtitle}</p>
    </div>

    <div className="rounded-3xl shadow-lg p-4">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:grid-rows-[200px_200px_auto_auto]">

        {/* INTERIOR — card principal */}
        <Link
          href="/catalogo?uso=interior&page=1"
          className="group relative col-span-3 min-h-48 overflow-hidden rounded-xl md:row-span-2"
        >
          <Image
            src="/assets/images/materiales/rev-interiores-pvc.jpg"
            alt="Interior"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-brand-blue/15 group-hover:bg-brand-blue/5 duration-700" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-5xl font-bold uppercase tracking-wide text-white drop-shadow">
              Interior
            </span>
          </div>
        </Link>

        {/* EXTERIOR — card principal */}
        <Link
          href="/catalogo?uso=exterior&page=1"
          className="group relative col-span-3 min-h-48 overflow-hidden rounded-xl md:row-span-2"
        >
          <Image
            src="/assets/images/materiales/rev-wpc-exteriores.jpg"
            alt="Exterior"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-brand-blue/5 duration-700" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-5xl font-bold uppercase tracking-wide text-white drop-shadow">
              Exterior
            </span>
          </div>
        </Link>

        {/* Sub-items (intercalados para que el auto-placement los coloque en columnas correctas) */}
        {SUB_ITEMS.map(({ label, categoryId, src, color }) => (
          <Link
            key={label}
            href={categoryId ? `/catalogo?category=${categoryId}&page=1` : "/catalogo"}
            className="group relative block rounded-xl"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl">
              {src ? (
                <Image
                  src={src}
                  alt={label}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div
                  className={`absolute inset-0 ${color ?? "bg-gray-300"} transition-transform duration-500 group-hover:scale-110`}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-brand-blue/50 group-hover:bg-bran-blue/80 group-hover:backdrop-blur-md group-hover:duration-700 duration-300 px-3 py-2">
                <span className="text-sm font-bold text-white">{label}</span>
              </div>
            </div>
          </Link>
        ))}

      </div>
    </div>
  </section>
);
