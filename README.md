# Reading Platform Frontend

A modern reading and writing platform built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui components.

- **Live Demo:** https://hz-reading-platform.vercel.app/
- **Project:** User-authenticated reading dashboard with works management, bookmarking, history, publishing, rating, and file upload support.

## Key Features

- Authentication flow with sign-in and sign-up pages
- Dashboard sections for home, bookmarked items, reading history, published works, scored works, and writing new works
- Read and edit individual works via nested routes
- Upload and manage files via a backend API route
- Responsive UI using Tailwind CSS and shadcn/ui primitives
- Theme-aware interface with tooltips and animated components

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui and Radix UI primitives
- @aws-sdk/client-s3 for file upload integration
- date-fns for date formatting
- react-select, recharts, embla-carousel-react, input-otp for enhanced interaction
- zod for runtime schema validation
- sonner for toast notifications

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  auth/
    signin/page.tsx
    signup/page.tsx
  api/
    upload/route.ts
  (dashboard)/
    home/page.tsx
    bookmarked/page.tsx
    history/page.tsx
    published/page.tsx
    scored/page.tsx
    works/page.tsx
    works/[id]/edit/page.tsx
    works/[id]/read/page.tsx
    works/write/page.tsx
components/
  app-sidebar.tsx
  category-select.tsx
  file-upload-field.tsx
  signin-form.tsx
  signup-form.tsx
  site-header.tsx
  work-card.tsx
  work-form-write.tsx
  work-read.tsx
  work-pagination.tsx
  ui/   (shared UI primitives)
context/
  AuthContext.tsx
hooks/
  use-work.ts
  use-works.ts
  use-bookmarked-works.ts
  use-history-works.ts
  use-published-works.ts
lib/
  api.ts
  auth.api.ts
  bookmark.api.ts
  work.api.ts
  upload.api.ts
  jwt.ts
  utils.ts
types/
  work.ts
  api.ts
  user.ts

```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

## Notes

- The application expects authenticated users before accessing the dashboard.
- File upload support is implemented in `app/api/upload/route.ts`.
- UI components are built with reusable shadcn/ui and custom primitives.

## Contact

For questions or improvements, open an issue or submit a pull request.
