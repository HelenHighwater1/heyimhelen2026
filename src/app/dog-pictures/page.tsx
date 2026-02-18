import { SketchPanel } from "@/components/SketchPanel";
import { DogGallery } from "./DogGallery";
import { dogPicturePaths } from "@/content/dogPictures";

export default function DogPicturesPage() {
  return (
    <SketchPanel>
      <div className="space-y-6">
        <h1 className="font-sketch text-2xl text-sketch-text md:text-3xl">
          dogs!
        </h1>
        <p className="font-sketch text-sm text-sketch-text-muted">
          {dogPicturePaths.length} photo{dogPicturePaths.length !== 1 ? "s" : ""}
        </p>
        <DogGallery />
      </div>
    </SketchPanel>
  );
}
