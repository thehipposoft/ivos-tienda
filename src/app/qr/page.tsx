import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";

const SITE_URL = "https://ivos.com.ar";
const QR_TARGET_URL = `${SITE_URL}/links`;
const LOGO_SIZE = 200;
const QR_DARK_COLOR = "#171717";
const QR_LIGHT_COLOR = "#ffffff";

export const metadata: Metadata = {
  title: "QR - IVOS",
  description: "Código QR para acceder a los links de IVOS.",
  robots: { index: false, follow: false },
};

export const QrPage = async () => {
  const qrSvg = await QRCode.toString(QR_TARGET_URL, {
    type: "svg",
    margin: 1,
    color: { dark: QR_DARK_COLOR, light: QR_LIGHT_COLOR },
  });

  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col items-center justify-center gap-6 overflow-hidden bg-white px-6 py-10 text-center">
      <Image
        src="/assets/images/logo-azulrojo.png"
        alt="IVOS"
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        className="h-auto w-auto object-contain"
      />

      {/* SVG generado por nosotros a partir de una URL fija, no de input externo */}
      <div
        className="flex aspect-square w-64 max-w-full items-center justify-center rounded-3xl bg-white p-4 shadow-sm ring-1 ring-neutral-200 [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />

      <p className="text-sm text-neutral-500">Escaneá para ver nuestros links</p>
    </main>
  );
};

export default QrPage;
