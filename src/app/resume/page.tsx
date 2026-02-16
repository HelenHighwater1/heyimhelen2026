import { BlueprintSheet } from "@/components/BlueprintSheet";
import { ResumeViewer } from "./ResumeViewer";

// File in public/ — visitors will download it with this name
const RESUME_FILENAME = "Helen Highwater Resume.pdf";
const RESUME_PATH = `/${encodeURIComponent(RESUME_FILENAME)}`;

export default function ResumePage() {
  return (
    <BlueprintSheet>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-amatic text-5xl text-white md:text-6xl">
            Resume
          </h1>
          <a
            href={RESUME_PATH}
            download={RESUME_FILENAME}
            className="btn-sketch inline-flex items-center border-2 border-white/80 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20"
          >
            Download PDF
          </a>
        </div>
        <ResumeViewer pdfPath={RESUME_PATH} />
      </div>
    </BlueprintSheet>
  );
}
