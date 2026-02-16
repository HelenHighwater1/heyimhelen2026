# Portfolio Website – Worklog

Work items derived from [requirements.md](./requirements.md) and [implementation.md](./implementation.md). Check off items by toggling the checkbox (or change `[ ]` to `[x]` in the file).

---

## 1. Project setup

- [x] **1.1** Scaffold Next.js app with TypeScript — Use static export (`output: 'export'`) in next.config
- [x] **1.2** Add and configure Tailwind CSS — All styling via Tailwind
- [x] **1.3** Add dependencies: react-pdf, react-masonry-css — Per implementation.md
- [ ] **1.4** Configure Vercel deployment (optional early) — Connect repo; static export compatible

---

## 2. Content layer

- [x] **2.1** Create content directory (e.g. `src/content/` or `content/`) — TypeScript/JSON data files
- [x] **2.2** Profile content: name, title, contact, LinkedIn, GitHub, email — For Main/Home
- [x] **2.3** Projects content: array (name, description, technologies, GitHub, liveDemo) — Only include links that exist
- [x] **2.4** Bio content: array of items with main text + optional annotation text — For hover callouts
- [x] **2.5** Dog pictures list: image paths/filenames for gallery — Images go in `public/` (e.g. `public/images/dog/`)
- [ ] **2.6** Add `resume.pdf` to `public/` when ready — e.g. `public/resume.pdf`

---

## 3. Blueprint theme & layout

- [x] **3.1** Blueprint color scheme (blue on white/light) — Requirements: blueprint-style
- [x] **3.2** Grid pattern background (CSS/Tailwind) for "blueprint paper" — Visible on all tabs/sheets
- [x] **3.3** Base layout: main content area + right side nav — Each tab = separate "blueprint sheet" look
- [x] **3.4** Keep aesthetic simple (no heavy title blocks/annotations yet) — Per requirements

---

## 4. Navigation

- [x] **4.1** Right-side vertical navigation — Tabs on right
- [x] **4.2** Vertical text orientation for tab labels — "Tabs on blueprint sheet packet" style
- [x] **4.3** Routes: `/`, `/resume`, `/projects`, `/bio`, `/dog-pictures` — Next.js App Router
- [x] **4.4** Tab click switches section (navigates to route)
- [x] **4.5** Main tab active by default (route `/`)
- [x] **4.6** Clear active tab state / visual indication — UX requirement

---

## 5. Pages (by tab)

### Tab 1: Main / Home (`/`)

- [x] **5.1** Layout as blueprint sheet + grid
- [x] **5.2** Name, professional title — From profile content
- [x] **5.3** Contact info + links (LinkedIn, GitHub, email, etc.)

### Tab 2: Resume (`/resume`)

- [x] **5.4** Blueprint sheet layout + grid
- [x] **5.5** Embedded PDF viewer (react-pdf) — Resume from `public/`
- [x] **5.6** Download link/button for PDF — Both viewer and download visible

### Tab 3: Projects (`/projects`)

- [x] **5.7** Blueprint sheet layout + grid
- [x] **5.8** Per project: name, description, technologies — From content
- [x] **5.9** GitHub link (when available)
- [x] **5.10** Live demo link (when available) — Only show existing links

### Tab 4: Personal Bio (`/bio`)

- [x] **5.11** Blueprint sheet layout + grid
- [x] **5.12** Bulleted list from content
- [x] **5.13** Hover on bullet: show annotation/callout — State + conditional render
- [x] **5.14** Annotation style: blueprint callouts (e.g. lines, blueprint-style text) — Per requirements

### Tab 5: Dog Pictures (`/dog-pictures`)

- [x] **5.15** Blueprint sheet layout + grid
- [x] **5.16** Masonry layout (react-masonry-css) — Pinterest-style, responsive
- [x] **5.17** Images from content list + `public/` paths

---

## 6. Responsive & UX

- [ ] **6.1** Responsive layout (mobile, tablet, desktop) — Requirements
- [ ] **6.2** Side nav behavior on small screens — Consider collapse/hamburger or stacked
- [ ] **6.3** Smooth transitions between tabs/sections — UX requirement
- [ ] **6.4** Interactive elements intuitive and accessible — UX requirement

---

## 7. Deployment & polish

- [ ] **7.1** Verify static export builds successfully — `next build` → static output
- [ ] **7.2** Deploy to Vercel (connect repo) — implementation.md
- [ ] **7.3** Optional: refine animations/transitions — Future considerations

---

## Quick reference

- **Routes:** `/` (Main), `/resume`, `/projects`, `/bio`, `/dog-pictures`
- **Stack:** Next.js (static export), TypeScript, Tailwind, react-pdf, react-masonry-css
- **Content:** Repo-based in content layer; PDF and images in `public/`
