import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_URL } from "@/components/WhatsAppButton";

const INSTAGRAM_URL = "https://www.instagram.com/ivos.ok/";
const LOGO_WIDTH = 350;
const LOGO_HEIGHT = 148;
const LINK_ICON_SIZE = 28;

const LINKS = [
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    external: true,
    icon: (
      <Image src="/assets/images/instagram-icon.svg" alt="" width={LINK_ICON_SIZE} height={LINK_ICON_SIZE} />
    ),
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    external: true,
    icon: (
      <Image src="/assets/images/whatsapp-icon.svg" alt="" width={LINK_ICON_SIZE} height={LINK_ICON_SIZE} />
    ),
  },
  {
    label: "Nuestra página web",
    href: "/",
    external: false,
    icon: (
      <svg width={LINK_ICON_SIZE} height={LINK_ICON_SIZE} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#F94E19" strokeWidth="2" />
        <path d="M2 12h20M12 2c2.5 2.7 4 6.3 4 10s-1.5 7.3-4 10c-2.5-2.7-4-6.3-4-10s1.5-7.3 4-10Z" stroke="#F94E19" strokeWidth="2" />
      </svg>
    ),
  },
] satisfies { label: string; href: string; external: boolean; icon: React.ReactNode }[];

export const metadata: Metadata = {
  title: "Links - IVOS",
  description: "Todos los enlaces de IVOS Revestimientos Alternativos en un solo lugar.",
};

export const LinksPage = () => {
  return (
    <main className="relative flex min-h-screen w-full justify-center overflow-hidden">
      <Image
        src="/assets/images/redes-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-white/90" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-2 px-6 pb-8 pt-[12vh] lg:pt-[8vh]">
        <Image
          src="/assets/images/logo-azulrojo.png"
          alt="IVOS"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority
        />

        <ul className="flex w-full flex-col gap-4">
          {LINKS.map(({ label, href, external, icon }) => (
            <li key={label}>
              <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 rounded-xl bg-white px-6 py-6 font-semibold text-brand-blue shadow-lg transition-colors duration-300 ease-out hover:bg-brand-blue hover:text-white"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                  {icon}
                </span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default LinksPage;
