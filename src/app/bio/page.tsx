import { ArcadePanel } from "@/components/ArcadePanel";
import { BioList } from "./BioList";

export default function BioPage() {
  return (
    <ArcadePanel>
      <div className="space-y-8">
        <h1 className="font-pixel text-lg text-pac-yellow md:text-2xl">
          PERSONAL BIO
        </h1>
        <BioList />
      </div>
    </ArcadePanel>
  );
}
