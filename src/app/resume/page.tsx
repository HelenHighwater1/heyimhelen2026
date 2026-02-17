import { ArcadePanel } from "@/components/ArcadePanel";
import { ResumeViewer } from "./ResumeViewer";

const RESUME_FILENAME = "Helen Highwater Resume.pdf";
const RESUME_PATH = `/${encodeURIComponent(RESUME_FILENAME)}`;

export default function ResumePage() {
  return (
    <ArcadePanel>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-pixel text-lg text-pac-yellow md:text-2xl">
            RESUME
          </h1>
          <a
            href={RESUME_PATH}
            download={RESUME_FILENAME}
            className="btn-arcade inline-flex items-center border-2 border-pac-yellow bg-pac-black px-5 py-2.5 font-pixel text-[9px] text-pac-yellow transition-all duration-200 md:text-[10px]"
          >
            INSERT COIN &darr;
          </a>
        </div>
        <ResumeViewer pdfPath={RESUME_PATH} />
      </div>
    </ArcadePanel>
  );
}
