import { BlueprintSheet } from "@/components/BlueprintSheet";
import { DogGallery } from "./DogGallery";
import { dogPicturePaths } from "@/content/dogPictures";

export default function DogPicturesPage() {
  return (
    <BlueprintSheet>
      <div className="space-y-6">
        <h1 className="font-amatic text-5xl text-white md:text-6xl">
          Dog Pictures
        </h1>
        <p className="text-white/90">
          {dogPicturePaths.length} photo{dogPicturePaths.length !== 1 ? "s" : ""} in the gallery.
        </p>
        <DogGallery />
      </div>
    </BlueprintSheet>
  );
}
