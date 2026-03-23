"use client";

import { SketchBox } from "@/components/SketchBox";

/** Primary sketch stroke (matches tailwind sketch-stroke). */
const SKETCH_STROKE = "#1e1e1e";

export type BlogTeaserProps = {
  title: string;
  summary: string;
  thumbnail: string;
  url: string;
  /** ISO date from JSON; reserved for future use */
  date?: string;
};

/**
 * Small teaser for the latest blog post (data from static JSON at build time).
 * Double Rough.js frames: outer around the row, inner on the square thumbnail (black strokes).
 */
export function BlogTeaser({
  title,
  summary,
  thumbnail,
  url,
}: BlogTeaserProps) {
  return (
    <section aria-labelledby="blog-teaser-heading">
      <h2
        id="blog-teaser-heading"
        className="mb-4 font-sketch text-base text-sketch-text"
      >
        latest from the{" "}
        <a
          href="https://anyway-i-shipped-it.com"
          target="_blank"
          rel="noopener noreferrer"
          className="sketch-link"
          style={{ color: "var(--sketch-blue)" }}
        >
          blog
        </a>
      </h2>
      {/* Outer sketch frame around thumbnail + copy */}
      <SketchBox
        className="min-w-0 w-full"
        strokeColor={SKETCH_STROKE}
        roughness={1.15}
        padding="p-3 md:p-4"
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-inherit no-underline transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[2px]"
        >
          <div className="flex gap-4">
            <div className="w-24 shrink-0 md:w-28">
              <SketchBox
                strokeColor={SKETCH_STROKE}
                roughness={0.8}
                padding="p-1"
              >
                <div className="aspect-square overflow-hidden rounded-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element -- matches projects page; remote blog URL */}
                  <img
                    src={thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SketchBox>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-sketch text-base leading-relaxed text-sketch-text md:text-lg">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-sketch-text-muted">
                {summary}
              </p>
              <p className="mt-3 font-sketch text-sm">
                <span
                  className="sketch-link"
                  style={{ color: "var(--sketch-blue)" }}
                >
                  read the post &rarr;
                </span>
              </p>
            </div>
          </div>
        </a>
      </SketchBox>
    </section>
  );
}
