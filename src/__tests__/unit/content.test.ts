import { describe, it, expect } from "vitest";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import type { Project } from "@/content/projects";
import { bioItems } from "@/content/bio";
import { dogPhotos } from "@/content/dogPictures";

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

describe("profile", () => {
  it("has a non-empty name", () => {
    expect(typeof profile.name).toBe("string");
    expect(profile.name.trim().length).toBeGreaterThan(0);
  });

  it("has a non-empty title", () => {
    expect(typeof profile.title).toBe("string");
    expect(profile.title.trim().length).toBeGreaterThan(0);
  });

  it("has a valid email address", () => {
    expect(typeof profile.email).toBe("string");
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("linkedin, if present, is a valid URL", () => {
    if (profile.linkedin) {
      expect(isValidUrl(profile.linkedin)).toBe(true);
    }
  });

  it("github, if present, is a valid URL", () => {
    if (profile.github) {
      expect(isValidUrl(profile.github)).toBe(true);
    }
  });

  it("extra links, if present, each have a label and valid URL", () => {
    for (const link of profile.links ?? []) {
      expect(typeof link.label).toBe("string");
      expect(link.label.trim().length).toBeGreaterThan(0);
      expect(isValidUrl(link.url)).toBe(true);
    }
  });
});

describe("projects", () => {
  it("contains at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it.each(projects)("$name — has required string fields", (project: Project) => {
    expect(typeof project.name).toBe("string");
    expect(project.name.trim().length).toBeGreaterThan(0);

    expect(typeof project.description).toBe("string");
    expect(project.description.trim().length).toBeGreaterThan(0);
  });

  it.each(projects)("$name — has a non-empty technologies array", (project: Project) => {
    expect(Array.isArray(project.technologies)).toBe(true);
    expect(project.technologies.length).toBeGreaterThan(0);
    for (const tech of project.technologies) {
      expect(typeof tech).toBe("string");
      expect(tech.trim().length).toBeGreaterThan(0);
    }
  });

  it.each(projects)("$name — optional URL fields are valid when present", (project: Project) => {
    if (project.github) {
      expect(isValidUrl(project.github)).toBe(true);
    }
    if (project.liveDemo) {
      expect(isValidUrl(project.liveDemo)).toBe(true);
    }
    if (project.videoDemo) {
      expect(isValidUrl(project.videoDemo)).toBe(true);
    }
  });
});

describe("bioItems", () => {
  it("contains at least one item", () => {
    expect(bioItems.length).toBeGreaterThan(0);
  });

  it("every item has a non-empty text field", () => {
    for (const item of bioItems) {
      expect(typeof item.text).toBe("string");
      expect(item.text.trim().length).toBeGreaterThan(0);
    }
  });

  it("annotation, when present, is a non-empty string", () => {
    for (const item of bioItems) {
      if (item.annotation !== undefined) {
        expect(typeof item.annotation).toBe("string");
        expect(item.annotation.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("dogPhotos", () => {
  it("contains at least one photo", () => {
    expect(dogPhotos.length).toBeGreaterThan(0);
  });

  it("every photo has a src path starting with /", () => {
    for (const photo of dogPhotos) {
      expect(photo.src).toMatch(/^\//);
    }
  });

  it("every photo has a non-empty caption", () => {
    for (const photo of dogPhotos) {
      expect(typeof photo.caption).toBe("string");
      expect(photo.caption.trim().length).toBeGreaterThan(0);
    }
  });
});
