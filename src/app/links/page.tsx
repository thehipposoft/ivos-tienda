import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_URL } from "@/components/WhatsAppButton";

const INSTAGRAM_URL = "https://www.instagram.com/ivos.ok/";
const LOGO_WIDTH = 260;
const LOGO_HEIGHT = 108;
const LINK_ICON_SIZE = 28;

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.7404858464733!2d-65.4106297!3d-24.7700855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc3d7c9590759%3A0x241c18ada1bffa66!2sIVOS%20-%20Revestimientos%20Alternativos!5e0!3m2!1sen!2smx!4v1743870234313!5m2!1sen!2smx";
const ADDRESS = "Balcarce 1587, Salta Capital";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `IVOS - Revestimientos Alternativos, ${ADDRESS}`
)}`;

const LINKS = [
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    icon: (
      <Image src="/assets/images/instagram-icon.svg" alt="" width={LINK_ICON_SIZE} height={LINK_ICON_SIZE} />
    ),
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: (
      <Image src="/assets/images/whatsapp-icon.svg" alt="" width={LINK_ICON_SIZE} height={LINK_ICON_SIZE} />
    ),
  },
  {
    label: "Nuestra página web",
    href: "/",
    icon: (
      <svg width={LINK_ICON_SIZE} height={LINK_ICON_SIZE} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#F94E19" strokeWidth="2" />
        <path d="M2 12h20M12 2c2.5 2.7 4 6.3 4 10s-1.5 7.3-4 10c-2.5-2.7-4-6.3-4-10s1.5-7.3 4-10Z" stroke="#F94E19" strokeWidth="2" />
      </svg>
    ),
  },
] satisfies { label: string; href: string; icon: React.ReactNode }[];

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

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 pb-6 pt-[3vh] lg:pt-[1vh]">
        <Image
          src="/assets/images/logo-azulrojo.png"
          alt="IVOS"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority
        />

        <ul className="flex w-full flex-col gap-4">
          {LINKS.map(({ label, href, icon }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
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

        <div className="mt-2 flex w-full flex-col items-center gap-3">
          <div className="w-full overflow-hidden rounded-2xl shadow-lg">
            <iframe
              src={MAP_EMBED_URL}
              width="350"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-50 w-full"
            />
          </div>
          <Link
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex underline items-center gap-2 font-medium text-brand-blue transition-colors duration-300 ease-out hover:text-brand-red"
          >
            <svg width="16" height="19" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 0c2.3869 0 4.6761.948211 6.364 2.63604C17.0518 4.32387 18 6.61305 18 9c0 3.074-1.676 5.59-3.442 7.395-.8823.8921-1.8451 1.7008-2.876 2.416l-.426.29-.2.133-.377.24-.336.205-.416.242c-.28237.1612-.60187.2459-.927.2459-.32513 0-.64463-.0847-.927-.2459l-.416-.242-.52-.32-.192-.125-.41-.273c-1.11217-.7525-2.1481-1.6119-3.093-2.566C1.676 14.589 0 12.074 0 9c0-2.38695.948211-4.67613 2.63604-6.36396C4.32387.948211 6.61305 0 9 0Zm0 6c-.39397 0-.78407.0776-1.14805.22836-.36398.15077-.69469.37174-.97327.65032-.27858.27858-.49955.60929-.65032.97327C6.0776 8.21593 6 8.60603 6 9c0 .39397.0776.78407.22836 1.1481.15077.3639.37174.6946.65032.9732.27858.2786.60929.4996.97327.6503C8.21593 11.9224 8.60603 12 9 12c.79565 0 1.5587-.3161 2.1213-.8787C11.6839 10.5587 12 9.79565 12 9c0-.79565-.3161-1.55871-.8787-2.12132C10.5587 6.31607 9.79565 6 9 6Z" fill="#F94E19" />
            </svg>
            <p>{ADDRESS}</p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LinksPage;
