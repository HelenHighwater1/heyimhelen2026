import { ArcadePanel } from "@/components/ArcadePanel";
import { DogGallery } from "./DogGallery";
import { dogPicturePaths } from "@/content/dogPictures";

export default function DogPicturesPage() {
  return (
    <ArcadePanel>
      <div className="space-y-6">
        <h1 className="font-pixel text-lg text-pac-yellow md:text-2xl">
          BONUS ROUND
        </h1>
        <p className="font-pixel text-[9px] text-white/60">
          {dogPicturePaths.length} PHOTO{dogPicturePaths.length !== 1 ? "S" : ""}{" "}
          COLLECTED
        </p>
        <DogGallery />
      </div>
    </ArcadePanel>
  );
}
