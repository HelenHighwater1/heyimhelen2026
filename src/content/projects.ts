export interface Project {
  name: string;
  description: string;
  technologies: string[];
  github?: string;
  liveDemo?: string;
  videoDemo?: string;
}

export const projects: Project[] = [
  {
    name: "PourFolio",
    description:
      "A wine portfolio app for tracking and reviewing your favorite wines.",
    technologies: ["Ruby on Rails", "React", "PostgreSQL"],
    github: "https://github.com/HelenHighwater1/pourfolio",
    videoDemo: "https://www.youtube.com/watch?v=FUDEdX5lmZ0",
  },
  {
    name: "What If Machine",
    description:
      "Inspired by Farnsworth's What If Machine from Futurama — ask hypothetical questions and explore the answers.",
    technologies: ["JavaScript", "React", "Ruby on Rails"],
    github: "https://github.com/HelenHighwater1/FarnsworthsWhatIf",
  },
  {
    name: "Olaf's Escape",
    description:
      "A browser-based game where you help Olaf escape through obstacles and challenges.",
    technologies: ["JavaScript", "HTML Canvas"],
    github: "https://github.com/HelenHighwater1/Olafs-Escape/",
  },
  {
    name: "UNTAPPD Vintage",
    description:
      "A vintage-styled clone of Untappd for discovering and logging craft beers.",
    technologies: ["React", "Ruby on Rails", "PostgreSQL"],
    github: "https://github.com/HelenHighwater1/untappedVintage/",
  },
  {
    name: "Flip Up",
    description:
      "A collaborative card-flipping memory game with a clean, layered UI.",
    technologies: ["React", "Node.js", "Express"],
    github: "https://github.com/amandac3600/Flip_Up/",
  },
];
