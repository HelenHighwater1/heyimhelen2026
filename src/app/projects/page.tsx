import { ArcadePanel } from "@/components/ArcadePanel";
import { projects } from "@/content/projects";

const ghostTagColors = [
  "bg-ghost-red/20 text-ghost-red border-ghost-red/40",
  "bg-ghost-pink/20 text-ghost-pink border-ghost-pink/40",
  "bg-ghost-cyan/20 text-ghost-cyan border-ghost-cyan/40",
  "bg-ghost-orange/20 text-ghost-orange border-ghost-orange/40",
];

export default function ProjectsPage() {
  return (
    <ArcadePanel>
      <div className="space-y-10">
        <h1 className="font-pixel text-lg text-pac-yellow md:text-2xl">
          PROJECTS
        </h1>

        <ul className="space-y-8">
          {projects.map((project, idx) => (
            <li
              key={project.name}
              className="maze-border bg-pac-black/80 p-5 md:p-6"
            >
              <h2 className="font-pixel text-xs leading-relaxed text-pac-yellow md:text-sm">
                LEVEL {idx + 1}: {project.name.toUpperCase()}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                {project.description}
              </p>

              {/* Tech tags — ghost colors */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech, ti) => (
                  <span
                    key={tech}
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${ghostTagColors[ti % ghostTagColors.length]}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links — flashing arcade style */}
              <div className="mt-4 flex flex-wrap gap-5">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pixel text-[9px] text-ghost-cyan transition-opacity hover:animate-arcade-blink"
                  >
                    VIEW CODE &gt;
                  </a>
                )}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pixel text-[9px] text-ghost-orange transition-opacity hover:animate-arcade-blink"
                  >
                    LIVE DEMO &gt;
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ArcadePanel>
  );
}
