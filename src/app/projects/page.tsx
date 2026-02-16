import { BlueprintSheet } from "@/components/BlueprintSheet";
import { projects } from "@/content/projects";

export default function ProjectsPage() {
  return (
    <BlueprintSheet>
      <div className="space-y-10">
        <h1 className="font-amatic text-5xl text-white md:text-6xl">
          Projects
        </h1>

        <ul className="space-y-8">
          {projects.map((project) => (
            <li
              key={project.name}
              className="border-b border-white/20 pb-8 last:border-0 last:pb-0"
            >
              <h2 className="font-amatic text-xl font-bold text-white md:text-2xl">
                {project.name}
              </h2>
              <p className="mt-2 text-white/90">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-white/90 underline hover:text-white"
                  >
                    GitHub
                  </a>
                )}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-white/90 underline hover:text-white"
                  >
                    Live demo
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </BlueprintSheet>
  );
}
