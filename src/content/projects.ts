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
      "A wine cellar tracking app for managing aging schedules, tasting notes, and historical tasting data. Built to solve a real problem — keeping track of which anniversary wines to open and when.",
    technologies: ["Python", "Flask", "SQLAlchemy", "PostgreSQL", "React", "JavaScript", "Bootstrap"],
    github: "https://github.com/HelenHighwater1/pourfolio",
    liveDemo: "https://pourfolio.io",
    videoDemo: "https://www.youtube.com/watch?v=FUDEdX5lmZ0",
  },
  {
    name: "What If Machine",
    description:
      "Inspired by Professor Farnsworth's What If Machine from Futurama — ask hypothetical questions and get AI-generated answers powered by the OpenAI API.",
    technologies: ["React", "JavaScript", "OpenAI API", "React Router", "Bootstrap"],
    github: "https://github.com/HelenHighwater1/FarnsworthsWhatIf",
  },
  {
    name: "Olaf's Escape",
    description:
      "A browser-based side-scrolling game built with vanilla JavaScript and HTML Canvas. Navigate Olaf through obstacles to escape.",
    technologies: ["JavaScript", "HTML Canvas", "SCSS"],
    github: "https://github.com/HelenHighwater1/Olafs-Escape/",
  },
  {
    name: "UNTAPPD Vintage",
    description:
      "A full-stack clone of Untappd with a vintage aesthetic for discovering, rating, and logging craft beers. Features user auth, search, and filtering.",
    technologies: ["React", "Redux", "Ruby on Rails", "PostgreSQL", "AWS S3"],
    github: "https://github.com/HelenHighwater1/untappedVintage/",
  },
  {
    name: "Flip Up",
    description:
      "A collaborative card-flipping memory game with user authentication, styled-components, and a carousel UI. Built as a team project with a MERN stack.",
    technologies: ["React", "Redux", "Node.js", "Express", "MongoDB", "Passport"],
    github: "https://github.com/amandac3600/Flip_Up/",
  },
];
