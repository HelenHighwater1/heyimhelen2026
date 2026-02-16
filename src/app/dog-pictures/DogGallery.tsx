"use client";

import Masonry from "react-masonry-css";
import { dogPicturePaths } from "@/content/dogPictures";

const breakpointColumns = {
  default: 3,
  1024: 2,
  640: 1,
};

export function DogGallery() {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {dogPicturePaths.map((src, index) => (
        <div
          key={src}
          className="mb-4 overflow-hidden rounded border-2 border-white/40 bg-white/10 shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Dog photo ${index + 1}`}
            className="block w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      ))}
    </Masonry>
  );
}
