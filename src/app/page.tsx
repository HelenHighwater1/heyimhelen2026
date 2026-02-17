import { ArcadePanel } from "@/components/ArcadePanel";
import { PacManGame } from "@/components/PacManGame";
import { profile } from "@/content/profile";

const contactLinks = [
  {
    label: "EMAIL",
    href: `mailto:${profile.email}`,
    color: "bg-ghost-red",
    glowColor: "shadow-[0_0_12px_rgba(255,0,0,0.5)]",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(255,0,0,0.8)]",
  },
  ...(profile.linkedin
    ? [
        {
          label: "LINKEDIN",
          href: profile.linkedin,
          color: "bg-ghost-cyan",
          glowColor: "shadow-[0_0_12px_rgba(0,255,255,0.5)]",
          hoverGlow: "hover:shadow-[0_0_20px_rgba(0,255,255,0.8)]",
        },
      ]
    : []),
  ...(profile.github
    ? [
        {
          label: "GITHUB",
          href: profile.github,
          color: "bg-ghost-orange",
          glowColor: "shadow-[0_0_12px_rgba(255,184,82,0.5)]",
          hoverGlow: "hover:shadow-[0_0_20px_rgba(255,184,82,0.8)]",
        },
      ]
    : []),
  ...(profile.links ?? []).map((link, i) => ({
    label: link.label.toUpperCase(),
    href: link.url,
    color: i % 2 === 0 ? "bg-ghost-pink" : "bg-ghost-cyan",
    glowColor:
      i % 2 === 0
        ? "shadow-[0_0_12px_rgba(255,184,255,0.5)]"
        : "shadow-[0_0_12px_rgba(0,255,255,0.5)]",
    hoverGlow:
      i % 2 === 0
        ? "hover:shadow-[0_0_20px_rgba(255,184,255,0.8)]"
        : "hover:shadow-[0_0_20px_rgba(0,255,255,0.8)]",
  })),
];

export default function HomePage() {
  return (
    <ArcadePanel>
      {/* Hero section */}
      <div className="mb-10 space-y-3">
        <h1 className="font-pixel text-2xl leading-relaxed text-pac-yellow md:text-4xl">
          {profile.name.toUpperCase()}
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-[3px] w-8 bg-pac-blue" />
          <p className="font-pixel text-[10px] leading-relaxed tracking-wide text-white md:text-xs">
            {profile.title.toUpperCase()}
          </p>
        </div>
        <p className="text-sm text-white/60">
          Fullstack engineer &middot; San Francisco
        </p>
      </div>

      {/* Contact — power pellet links */}
      <div className="mb-12">
        <h2 className="mb-5 font-pixel text-xs text-pac-yellow">CONTACT</h2>
        <ul className="flex flex-wrap gap-5">
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
                className={`group flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-200 ${link.glowColor} ${link.hoverGlow} hover:scale-105`}
                style={{ background: "rgba(33,33,222,0.15)" }}
              >
                <span
                  className={`inline-block h-3 w-3 rounded-full ${link.color} animate-pellet-pulse`}
                  aria-hidden
                />
                <span className="font-pixel text-[9px] text-white md:text-[10px]">
                  {link.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mini-game */}
      <div>
        <h2 className="mb-4 font-pixel text-xs text-pac-yellow">
          PLAY A ROUND
        </h2>
        <PacManGame />
      </div>
    </ArcadePanel>
  );
}
