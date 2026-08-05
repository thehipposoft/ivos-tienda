import React from 'react';
import Link from 'next/link';
import { FeedData, Post } from '@/types/instagram';
import Image from 'next/image';

const InstagramFeed = ({feedData}:FeedData) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:p-4 lg:w-[1250px]">
      {feedData.map((val:Post, index) => (
        <Link
          key={val.id}
          href={val.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden shadow lg:h-[400px] h-[200px] w-[40vw] lg:w-[400px] hover:shadow-lg transition relative"
        >
            <Image
                unoptimized
                fill
                src={`${val.media_type === 'VIDEO' ? val.thumbnail_url : val.media_url}`}
                alt={val.caption?.slice(0, 100) || 'Instagram post'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute w-full h-full z-20 inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="text-white text-sm text-center">
                    {val.caption ? val.caption.slice(0, 100) + '...' : 'Sin descripción'}
                </p>
            </div>
        </Link>
      ))}
    </div>
  );
}

export default InstagramFeed