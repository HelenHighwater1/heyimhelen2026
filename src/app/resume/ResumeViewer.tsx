"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumeViewerProps {
  pdfPath: string;
}

export function ResumeViewer({ pdfPath }: ResumeViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => setContainerWidth(el.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div className="overflow-hidden rounded border border-blueprint-line/30 bg-white">
        {error ? (
          <div className="flex min-h-[400px] items-center justify-center p-8 text-center text-blueprint-line">
            <p>
              Unable to load PDF. You can{" "}
              <a href={pdfPath} download className="underline">
                download the resume
              </a>{" "}
              instead.
            </p>
          </div>
        ) : (
          <Document
            file={pdfPath}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setError("Failed to load PDF")}
            loading={
              <div className="flex min-h-[400px] items-center justify-center text-blueprint-line">
                Loading…
              </div>
            }
          >
            {numPages !== null &&
              containerWidth !== null &&
              Array.from(new Array(numPages), (_, i) => (
                <Page
                  key={`page_${i + 1}`}
                  pageNumber={i + 1}
                  width={containerWidth}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="!border-0"
                />
              ))}
          </Document>
        )}
      </div>
    </div>
  );
}
