export interface BioItem {
  text: string;
  annotation?: string;
}

export const bioItems: BioItem[] = [
  {
    text: "Based in [Your City]",
    annotation: "Open to remote and local opportunities.",
  },
  {
    text: "Background in [e.g. Computer Science, self-taught]",
    annotation: "Relevant coursework or learning path.",
  },
  {
    text: "Interested in [e.g. full-stack, frontend, dev tools]",
    annotation: "What you're looking for in your next role.",
  },
  {
    text: "Fun fact or hobby",
    annotation: "Keeps things human and memorable.",
  },
];
