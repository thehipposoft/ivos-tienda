import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { PRODUCTS_TAG } from "@/lib/woocommerce";

/**
 * Revalidación on-demand del catálogo. Acepta:
 * - Webhook de WooCommerce: firma HMAC-SHA256 del body en X-WC-Webhook-Signature
 * - Llamada manual: Authorization: Bearer <REVALIDATION_SECRET>
 */

const SIGNATURE_HEADER = "x-wc-webhook-signature";

const safeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
};

const isAuthorized = (request: NextRequest, rawBody: string, secret: string): boolean => {
  const signature = request.headers.get(SIGNATURE_HEADER);
  if (signature) {
    const expected = createHmac("sha256", secret).update(rawBody).digest("base64");
    return safeEqual(signature, expected);
  }
  const auth = request.headers.get("authorization");
  return auth !== null && safeEqual(auth, `Bearer ${secret}`);
};

export const POST = async (request: NextRequest) => {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATION_SECRET no configurado" }, { status: 500 });
  }

  const rawBody = await request.text();
  if (!isAuthorized(request, rawBody, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // expire: 0 → la próxima visita regenera con datos frescos (home, catálogo, productos, sitemap)
  revalidateTag(PRODUCTS_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true });
};
