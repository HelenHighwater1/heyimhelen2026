import { BlueprintSheet } from "@/components/BlueprintSheet";
import { profile } from "@/content/profile";

export default function HomePage() {
  return (
    <BlueprintSheet>
      <div className="space-y-2">
        <h1 className="font-amatic text-6xl tracking-tight text-white md:text-8xl">
          {profile.name}
        </h1>
        <div className="h-0.5 w-12 bg-white/80" aria-hidden />
        <p className="text-xl tracking-wide text-white/95 md:text-2xl">
          {profile.title}
        </p>
        <p className="text-sm text-white/80">
          Fullstack engineer · San Francisco
        </p>
      </div>

      <div className="mt-10 border-t border-white/30 pt-6">
        <h2 className="mb-4 font-amatic text-base font-bold uppercase tracking-wider text-white md:text-lg">
          Contact
        </h2>
        <ul className="flex flex-wrap gap-3">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="btn-sketch inline-flex border-2 border-white/80 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/20"
            >
              Email
            </a>
          </li>
          {profile.linkedin && (
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sketch inline-flex border-2 border-white/80 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/20"
              >
                LinkedIn
              </a>
            </li>
          )}
          {profile.github && (
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sketch inline-flex border-2 border-white/80 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/20"
              >
                GitHub
              </a>
            </li>
          )}
          {profile.links?.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sketch inline-flex border-2 border-white/80 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-white/20"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </BlueprintSheet>
  );
}
