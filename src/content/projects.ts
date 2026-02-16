export interface Project {
  name: string;
  description: string;
  technologies: string[];
  github?: string;
  liveDemo?: string;
}

export const projects: Project[] = [
  {
    name: "Sample Project",
    description:
      "A short description of what the project does and what you built.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/yourusername/sample-project",
    liveDemo: "https://sample-project.vercel.app",
  },
  {
    name: "Another Project",
    description: "Another project with only a GitHub link.",
    technologies: ["Node.js", "PostgreSQL"],
    github: "https://github.com/yourusername/another-project",
  },
];
