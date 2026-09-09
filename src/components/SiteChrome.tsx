"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const ROUTES_WITHOUT_CHROME = ["/links"];

export const SiteChrome = () => {
  const pathname = usePathname();

  if (ROUTES_WITHOUT_CHROME.includes(pathname)) {
    return null;
  }

  return (
    <>
      <WhatsAppButton />
      <Footer />
    </>
  );
};

export default SiteChrome;
