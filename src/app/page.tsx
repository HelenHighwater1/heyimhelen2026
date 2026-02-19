import { SketchPanel } from "@/components/SketchPanel";
import { TechDiagram } from "@/components/TechDiagram";
import { profile } from "@/content/profile";

const contactLinks = [
  {
    label: "email",
    href: `mailto:${profile.email}`,
    color: "text-sketch-coral",
    borderColor: "border-sketch-coral",
  },
  ...(profile.linkedin
    ? [
        {
          label: "linkedin",
          href: profile.linkedin,
          color: "text-sketch-blue",
          borderColor: "border-sketch-blue",
        },
      ]
    : []),
  ...(profile.github
    ? [
        {
          label: "github",
          href: profile.github,
          color: "text-sketch-text",
          borderColor: "border-sketch-text",
        },
      ]
    : []),
  ...(profile.links ?? []).map((link, i) => ({
    label: link.label.toLowerCase(),
    href: link.url,
    color: i % 2 === 0 ? "text-sketch-green" : "text-sketch-purple",
    borderColor:
      i % 2 === 0 ? "border-sketch-green" : "border-sketch-purple",
  })),
];

export default function HomePage() {
  return (
    <SketchPanel>
      {/* Hero section */}
      <div className="mb-10 space-y-3">
        <h1 className="font-sketch text-3xl leading-relaxed text-sketch-text md:text-5xl">
          {profile.name}
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-8 bg-sketch-stroke-light" />
          <p className="font-sketch text-sm leading-relaxed tracking-wide text-sketch-text-muted md:text-base">
            {profile.title}
          </p>
        </div>
      </div>

      {/* Tech stack diagram */}
      <div className="mb-14">
        <h2 className="mb-5 font-sketch text-base text-sketch-text">
          tech stack
        </h2>
        <TechDiagram />
      </div>

      {/* Contact links */}
      <div>
        <h2 className="mb-4 font-sketch text-base text-sketch-text">
          get in touch
        </h2>
        <ul className="flex flex-wrap gap-4">
          {contactLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className={`btn-sketch inline-flex items-center gap-2 font-sketch text-sm ${link.color} ${link.borderColor} border-2`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </SketchPanel>
  );
}
