"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Main", href: "/" },
  { label: "Resume", href: "/resume" },
  { label: "Projects", href: "/projects" },
  { label: "Personal Bio", href: "/bio" },
  { label: "Dog Pictures", href: "/dog-pictures" },
] as const;

export function SideNav() {
  const pathname = usePathname();
  const normalizedPath = pathname === "" ? "/" : pathname;

  return (
    <nav
      className="flex w-14 shrink-0 flex-col gap-1 border-l-2 border-blueprint-primary/40 bg-blueprint-pale/80 py-6 md:min-h-screen md:w-20"
      style={{ boxShadow: "-4px 0 12px rgba(0, 44, 140, 0.08)" }}
      aria-label="Main navigation"
    >
      <div className="flex flex-col gap-1 px-0.5">
        {tabs.map(({ label, href }) => {
          const isActive = normalizedPath === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex min-h-[72px] items-center justify-center rounded-l-lg border-2 border-blueprint-primary/50 border-b-blueprint-primary/30 border-r-0 px-1 py-3 text-2xl font-bold transition-all duration-200
                md:min-h-[96px] md:px-2 md:text-3xl
                ${isActive ? "border-blueprint-primary border-r-2 -mr-0.5 bg-white pl-2 pr-1 text-blueprint-primary shadow-md" : "bg-white/70 text-blueprint-primary/80 hover:bg-white hover:text-blueprint-primary"}
              `}
            >
              <span
                className="font-amatic origin-center md:[writing-mode:vertical-rl] md:[text-orientation:mixed] md:rotate-180"
                style={{ fontFamily: 'Amatic SC, cursive' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
