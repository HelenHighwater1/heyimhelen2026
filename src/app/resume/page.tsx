import { SketchPanel } from "@/components/SketchPanel";
import { ResumeViewer } from "./ResumeViewer";

const RESUME_FILENAME = "Helen Highwater Resume.pdf";
const RESUME_PATH = `/${encodeURIComponent(RESUME_FILENAME)}`;

export default function ResumePage() {
  return (
    <SketchPanel>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-sketch text-2xl text-sketch-text md:text-3xl">
            resume
          </h1>
          <a
            href={RESUME_PATH}
            download={RESUME_FILENAME}
            className="btn-sketch font-sketch text-sm text-sketch-blue border-sketch-blue"
          >
            download pdf
            <svg width="14" height="14" viewBox="0 0 14 14" className="ml-1 inline-block" aria-hidden>
              <path d="M7 2 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M3 8 L7 12 L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </a>
        </div>
        <ResumeViewer pdfPath={RESUME_PATH} />
      </div>
    </SketchPanel>
  );
}
