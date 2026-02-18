import { SketchPanel } from "@/components/SketchPanel";
import { BioList } from "./BioList";

export default function BioPage() {
  return (
    <SketchPanel>
      <div className="space-y-8">
        <h1 className="font-sketch text-2xl text-sketch-text md:text-3xl">
          about me
        </h1>
        <BioList />
      </div>
    </SketchPanel>
  );
}
