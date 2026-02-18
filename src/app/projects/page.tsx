import { SketchPanel } from "@/components/SketchPanel";
import { SketchBox } from "@/components/SketchBox";
import { projects } from "@/content/projects";

const tagColors = [
  "border-sketch-blue text-sketch-blue",
  "border-sketch-coral text-sketch-coral",
  "border-sketch-green text-sketch-green",
  "border-sketch-purple text-sketch-purple",
  "border-sketch-amber text-sketch-amber",
];

export default function ProjectsPage() {
  return (
    <SketchPanel>
      <div className="space-y-10">
        <h1 className="font-sketch text-2xl text-sketch-text md:text-3xl">
          projects
        </h1>

        <ul className="space-y-8">
          {projects.map((project, idx) => (
            <li key={project.name}>
              <SketchBox
                strokeColor={
                  ["#4a90d9", "#6ba368", "#e07a5f", "#8b5cf6", "#d4a843"][
                    idx % 5
                  ]
                }
              >
                <h2 className="font-sketch text-base leading-relaxed text-sketch-text md:text-lg">
                  {project.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-sketch-text-muted">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, ti) => (
                    <span
                      key={tech}
                      className={`sketch-tag ${tagColors[ti % tagColors.length]}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-4 flex flex-wrap gap-5">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sketch-link font-sketch text-sm"
                    >
                      view code &rarr;
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sketch-link font-sketch text-sm"
                      style={{ color: "var(--sketch-green)" }}
                    >
                      live demo &rarr;
                    </a>
                  )}
                  {project.videoDemo && (
                    <a
                      href={project.videoDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sketch-link font-sketch text-sm"
                      style={{ color: "var(--sketch-coral)" }}
                    >
                      video demo &rarr;
                    </a>
                  )}
                </div>
              </SketchBox>
            </li>
          ))}
        </ul>
      </div>
    </SketchPanel>
  );
}
