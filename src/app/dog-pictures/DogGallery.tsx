"use client";

import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { dogPhotos } from "@/content/dogPictures";

const breakpointColumns = {
  default: 3,
  1024: 2,
  640: 1,
};

export function DogGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((i) => (i === null ? null : (i + 1) % dogPhotos.length));
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((i) =>
          i === null ? null : (i - 1 + dogPhotos.length) % dogPhotos.length,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const selectedPhoto = selectedIndex !== null ? dogPhotos[selectedIndex] : null;

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {dogPhotos.map((photo, index) => (
          <div
            key={photo.src}
            className="relative mb-4"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="overflow-hidden rounded border-2 border-sketch-stroke-light bg-white shadow-[3px_3px_0_rgba(0,0,0,0.04)] transition-all duration-200 ease-out"
              style={{
                transform:
                  hoveredIndex === index ? "scale(1.04)" : "scale(1)",
                zIndex: hoveredIndex === index ? 20 : 1,
                position: "relative",
                boxShadow:
                  hoveredIndex === index
                    ? "6px 6px 0 rgba(0,0,0,0.1)"
                    : "3px 3px 0 rgba(0,0,0,0.04)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                className="block w-full cursor-pointer object-cover object-center"
                loading="lazy"
                onClick={() => setSelectedIndex(index)}
              />
            </div>

            {/* Caption tooltip */}
            {hoveredIndex === index && (
              <div
                className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 animate-fade-in"
                style={{ bottom: -8, transform: "translateX(-50%) translateY(100%)" }}
              >
                <div className="annotation-callout callout-bottom min-w-[140px] max-w-[220px] px-3 py-2 text-center">
                  <p className="font-sketch text-xs text-sketch-text-muted">
                    {photo.caption}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </Masonry>

      {/* Lightbox */}
      {selectedPhoto !== null && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 font-sketch text-2xl text-white opacity-70 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((i) =>
                i === null ? null : (i - 1 + dogPhotos.length) % dogPhotos.length,
              );
            }}
            aria-label="Previous image"
          >
            ←
          </button>

          {/* Image panel */}
          <div
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.caption}
              className="max-h-[85vh] max-w-[90vw] rounded object-contain shadow-2xl"
            />
            <p className="font-sketch text-sm text-white/90 text-center max-w-[90vw]">
              {selectedPhoto.caption}
            </p>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 font-sketch text-2xl text-white opacity-70 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((i) =>
                i === null ? null : (i + 1) % dogPhotos.length,
              );
            }}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
