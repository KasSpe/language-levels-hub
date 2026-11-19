GitHub Copilot instructions
Project purpose
This project is an educational web application for teachers working with language learners. It presents grammatical learning goals by language level and may include teacher-facing management functionality.

The visible interface and user-facing text are primarily in Dutch.

Technology stack
React 18
TypeScript
Vite
React Router
Tailwind CSS
shadcn/ui and Radix UI
Supabase
TanStack React Query
React Hook Form
Zod
Vitest and Testing Library
General rules
Preserve the existing project structure and visual identity.
Use TypeScript for all new source files.
Do not convert the project to Next.js.
Do not replace Vite, React Router, Supabase, Tailwind CSS or shadcn/ui.
Reuse existing components before creating new components.
Use components from src/components/ui where appropriate.
Use Lucide React for icons.
Keep components focused and reasonably small.
Avoid duplicating data-fetching or form logic.
Do not introduce new dependencies unless they are genuinely necessary.
Keep all user-facing text clear and understandable for teachers.
Write user-facing interface text in Dutch unless the surrounding interface uses another language.
Styling
Use Tailwind CSS classes.
Follow existing spacing, typography, colors, border radii and responsive patterns.
Make all new pages usable on desktop, tablet and mobile.
Preserve accessibility, including labels, keyboard navigation and visible focus states.
Do not add decorative emoji when a Lucide icon or text label is more appropriate.
Routing
Use React Router for navigation.
Follow the existing routing structure.
Avoid full-page reloads for internal navigation.
Add a not-found or error state when relevant.
Supabase
Use the existing Supabase client and existing query patterns.
Never hardcode API keys, passwords or secrets.
Never expose a Supabase service-role key in browser code.
Do not disable Row Level Security.
Handle loading, empty and error states for every database request.
Confirm the existing database schema and generated types before changing queries.
Do not create or modify database migrations unless the requested feature requires it.
Forms and validation
Prefer React Hook Form combined with Zod.
Show concise Dutch validation messages.
Prevent duplicate submissions while a request is running.
Show clear success and error feedback.
Testing and validation
Before completing a change, run:

npm run lint
npm run test
npm run build
Add or update Vitest tests for important behaviour.

Do not claim that a change works unless the relevant checks pass.

Working method
For each task:

Inspect the existing implementation.
Identify the smallest safe set of files to change.
Preserve existing functionality.
Implement the requested change.
Add loading, empty and error states where needed.
Run lint, tests and production build.
Summarize which files changed and mention any remaining risks.
