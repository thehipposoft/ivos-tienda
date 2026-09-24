import type { Post } from "@/types/instagram";

const FEED_REVALIDATE_SECONDS = 3600;
const FEED_TIMEOUT_MS = 5000;

const cachedFetch = (url: string, headers?: HeadersInit) =>
    fetch(url, {
        headers,
        next: { revalidate: FEED_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });

// Si Instagram falla, la home se renderiza sin feed en vez de romper
export default async function getFeed(): Promise<Post[]> {
    try {
        const response = await cachedFetch(`https://wp.thehipposoft.com/wp-json/hippo/v1/token?website=ivos`, {
            'x-api-key': process.env.WORDPRESS_API_SECRET ?? '',
        });
        if (!response.ok) throw new Error(`Token ${response.status}`);
        const { token } = (await response.json()) as { token: string };

        const res = await cachedFetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url&limit=6&access_token=${token}`);
        if (!res.ok) throw new Error(`Instagram ${res.status}`);
        const resJson = (await res.json()) as { data?: Post[] };

        return resJson.data ?? [];
    } catch (error) {
        console.error('Failed to fetch Instagram feed:', error);
        return [];
    }
}
