import { SketchPanel } from "@/components/SketchPanel";
import { DogGallery } from "./DogGallery";
import { dogPhotos } from "@/content/dogPictures";

export default function DogPicturesPage() {
  return (
    <SketchPanel>
      <div className="space-y-6">
        <h1 className="font-sketch text-2xl text-sketch-text md:text-3xl">
          doggo!
        </h1>
        <p className="font-sketch text-sm text-sketch-text-muted">
          {dogPhotos.length} photo{dogPhotos.length !== 1 ? "s" : ""}
        </p>
        <DogGallery />
      </div>
    </SketchPanel>
  );
}
