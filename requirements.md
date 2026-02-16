# Portfolio Website - Requirements Document

## Project Overview
Build a personal portfolio website for a junior software engineer with a blueprint-themed design. The site should present professional information in a unique, visually engaging way that mimics architectural blueprints.

## Technology Stack
- **Framework**: React
- **Styling**: Tailwind CSS
- **Additional**: PDF viewer library for resume display

## Design Theme

### Visual Style
- **Theme**: Blueprint-inspired design
- **Color Scheme**: Blueprint-style (blue on white/light background)
- **Grid Pattern**: Visible grid pattern throughout the site to mimic blueprint paper
- **Overall Aesthetic**: Simpler blueprint-inspired look (not overly complex with title blocks or excessive annotations)

### Navigation
- **Location**: Side navigation on the right side of the screen
- **Orientation**: Vertical text orientation for tab labels
- **Style**: Tabs should appear as if they are tabs on a blueprint sheet packet
- **Behavior**: Clicking a tab switches to that section

## Page Structure

### Default View
- The **Main** tab should be active by default when the site first loads

### Tab 1: Main / Home
**Purpose**: Landing page with primary contact information

**Content Required**:
- Name
- Professional title (e.g., "Junior Software Engineer")
- Contact information
- Links to professional profiles (LinkedIn, GitHub, email, etc.)

**Layout**: Should look like a blueprint sheet with the grid pattern visible

---

### Tab 2: Resume
**Purpose**: Display and provide access to the resume

**Features**:
- Embedded PDF viewer to display the resume directly on the page
- Download link/button to allow users to download the PDF file
- Both features should be visible and accessible

**Layout**: Should look like a blueprint sheet with the grid pattern visible

---

### Tab 3: Projects
**Purpose**: Showcase portfolio projects

**Content Per Project**:
- Project name
- Project description
- Technologies used
- GitHub repository link (where applicable)
- Live demo link (where applicable)

**Note**: Not all projects may have both GitHub and live demo links - display only what's available

**Layout**: Should look like a blueprint sheet with the grid pattern visible

---

### Tab 4: Personal Bio
**Purpose**: Share personal background and information

**Format**: 
- Bulleted list of items
- Each bullet point should be interactive
- **Hover Behavior**: When hovering over a bullet point, additional notes/annotations should appear
- **Annotation Style**: The hover annotations should look like blueprint annotations/notes (e.g., callout boxes, lines connecting to the bullet point, blueprint-style text)

**Layout**: Should look like a blueprint sheet with the grid pattern visible

---

### Tab 5: Dog Pictures
**Purpose**: Display photos of the dog

**Layout**: 
- Masonry layout (Pinterest-style grid where images of different heights are arranged in columns)
- Images should be displayed in a visually appealing, responsive grid

**Layout**: Should look like a blueprint sheet with the grid pattern visible

## Technical Requirements

### Each Tab/Section
- Each tab should visually appear as a **separate blueprint sheet**
- All tabs should maintain the blueprint grid pattern background
- Consistent styling across all tabs to maintain the blueprint theme

### Responsive Design
- The site should be responsive and work on different screen sizes
- Consider how the side navigation and blueprint sheets adapt to mobile/tablet views

### User Experience
- Smooth transitions between tabs
- Clear visual indication of which tab is currently active
- All interactive elements should be intuitive and accessible

## Implementation Notes

### Information
- This project uses React with functional components and hooks
- Tailwind CSS should be used for all styling to maintain consistency
- Consider using React Router or similar for navigation between tabs
- For the PDF viewer, research and implement an appropriate React PDF viewer library
- For the masonry layout, consider using a library like `react-masonry-css` or similar
- The blueprint grid pattern can be created using CSS background patterns or Tailwind utilities
- Hover annotations in the bio section will require state management and conditional rendering

## Future Considerations
- The design can be enhanced later with more complex blueprint elements (title blocks, revision notes, etc.)
- Additional tabs or sections can be added following the same blueprint sheet pattern
- Animation and transitions can be refined for a more polished experience
