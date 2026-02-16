import { BlueprintSheet } from "@/components/BlueprintSheet";
import { BioList } from "./BioList";

export default function BioPage() {
  return (
    <BlueprintSheet>
      <div className="space-y-8">
        <h1 className="font-amatic text-5xl text-white md:text-6xl">
          Personal Bio
        </h1>
        <BioList />
      </div>
    </BlueprintSheet>
  );
}
