import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  
});

export const metadata: Metadata = {
  title: "Tienda IVOS - Revestimientos Alternativos",
  description: "Combinamos conocimiento técnico y visión estética para seleccionar materiales de alta calidad, proponer soluciones innovadoras y garantizar resultados eficientes. No solo vendemos insumos, sino que ayudamos a construir espacios mejor diseñados y más eficientes.",
  keywords: "Tienda IVOS, materiales de alta calidad, soluciones innovadoras, espacios mejor diseñados, revestimientos",
  openGraph: {
    title: "Tienda IVOS - Revestimientos Alternativos",
    description: "Combinamos conocimiento técnico y visión estética para seleccionar materiales de alta calidad, proponer soluciones innovadoras y garantizar resultados eficientes. No solo vendemos insumos, sino que ayudamos a construir espacios mejor diseñados y más eficientes.",
    url: "https://ivos.com.ar",
    siteName: "IVOS",
    images: [
      {
        url: "https://ivos.com.ar/assets/logo-meta.jpg",
        width: 901,
        height: 581,
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};

export const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
        <CartDrawer />
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
