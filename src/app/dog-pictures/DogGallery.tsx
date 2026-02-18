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
          className="relative mb-4 overflow-hidden rounded border-2 border-sketch-stroke-light bg-white shadow-[3px_3px_0_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[4px_4px_0_rgba(0,0,0,0.08)]"
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
