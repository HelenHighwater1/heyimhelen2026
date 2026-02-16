# Portfolio Website - Implementation Guide

This document captures the technical decisions and implementation details agreed for the portfolio project. It complements [requirements.md](./requirements.md), which defines the design and feature requirements.

---

## Technology Stack

| Area | Choice | Notes |
|------|--------|--------|
| **Framework** | Next.js | With static export (`output: 'export'`) for static hosting; no server required. |
| **Styling** | Tailwind CSS | All styling via Tailwind for consistency. |
| **Language** | TypeScript | Used for components and content types. |
| **PDF viewer** | react-pdf | Embedded resume viewer + download link on Resume page. |
| **Masonry layout** | react-masonry-css | Pinterest-style grid for Dog Pictures section. |
| **Deployment** | Vercel | Connect repo for automatic builds and previews. |

---

## Architecture

### Routing

- **Separate URL per section** for SEO, shareability, and browser back/forward behavior.
- Routes:
  - `/` — Main / Home
  - `/resume` — Resume (PDF viewer + download)
  - `/projects` — Projects
  - `/bio` — Personal Bio
  - `/dog-pictures` — Dog Pictures (masonry gallery)
- Navigation remains tab-style (right side, vertical labels) but each tab corresponds to a route.

### Content & Data

- **Content lives in the repo** (no CMS or external API for now).
- Use a **content layer** (e.g. `src/content/` or `content/`) with TypeScript/JSON data files:
  - **Profile**: name, title, contact info, LinkedIn, GitHub, email, etc.
  - **Projects**: array of project objects (name, description, technologies, GitHub link, live demo link where applicable).
  - **Bio**: array of bullet items, each with main text and optional annotation text for hover.
  - **Dog pictures**: list of image paths/filenames so the gallery knows which images in `public/` to display.
- **Assets**:
  - Resume PDF: place in `public/` (e.g. `public/resume.pdf`). Add the file when ready; build the page to expect a known path.
  - Dog images: store in `public/` (e.g. `public/images/dog/`). Gallery reads from the content list to know which images to show.

---

## Implementation Summary

| Topic | Decision |
|-------|----------|
| Build / scaffold | Next.js app with static export and Tailwind. |
| Content source | Repo-based: content files + assets in `public/`. |
| Routes | One route per tab/section (/, /resume, /projects, /bio, /dog-pictures). |
| Resume | PDF in `public/`; react-pdf for in-page viewer and download link. |
| Dog pictures | Images in `public/`; list in content; react-masonry-css for masonry layout. |
| Personal Bio | Bullets with main text + optional annotation text per item (hover shows annotation in blueprint style). |
| Deployment | Vercel (connect repo; static export works out of the box). |

---

## Future Flexibility

- Content structure (e.g. bio annotations) can be changed later without re-architecting.
- If a CMS or API is added later, the content layer can be swapped for API calls.
- Design can be enhanced with more blueprint elements (title blocks, revision notes, etc.) as noted in requirements.md.
