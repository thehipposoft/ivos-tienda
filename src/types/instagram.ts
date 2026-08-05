export type Post = {
    id: string,
    permalink: string,
    media_url: string,
    caption: string,
    media_type: string,
    thumbnail_url?: string,
  }

export type FeedData = {
    feedData: Post[]
  }