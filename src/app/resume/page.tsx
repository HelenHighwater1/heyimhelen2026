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
            download pdf &darr;
          </a>
        </div>
        <ResumeViewer pdfPath={RESUME_PATH} />
      </div>
    </SketchPanel>
  );
}
