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
          className="maze-border relative mb-4 overflow-hidden bg-pac-black"
        >
          {/* Corner pellet decorations */}
          <div className="absolute left-2 top-2 z-10 h-1.5 w-1.5 rounded-full bg-pac-dot opacity-60" />
          <div className="absolute right-2 top-2 z-10 h-1.5 w-1.5 rounded-full bg-pac-dot opacity-60" />
          <div className="absolute bottom-2 left-2 z-10 h-1.5 w-1.5 rounded-full bg-pac-dot opacity-60" />
          <div className="absolute bottom-2 right-2 z-10 h-1.5 w-1.5 rounded-full bg-pac-dot opacity-60" />

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
