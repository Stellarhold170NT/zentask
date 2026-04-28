# Phase 1: Project Setup & Auth - Context

**Gathered:** 2025-04-28  
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the technical foundation: scaffold Next.js 15 project with TypeScript, Tailwind CSS v4, shadcn/ui; connect Supabase (PostgreSQL + Auth); create database schema for users, organizations, projects, boards, columns, cards, roles, vault; implement authentication flow (signup, login, logout, password reset); set up protected routes and middleware.

</domain>

<decisions>
## Implementation Decisions

### Supabase Setup
- **D-01:** Use cloud Supabase project (free tier) instead of local Docker setup
  - Rationale: Instant setup, no Docker complexity, easier for team collaboration, free tier covers v1 needs
- **D-02:** Store Supabase URL and anon key in `.env.local`
  - Rationale: Standard Next.js env approach, never commit secrets

### Project Structure
- **D-03:** Feature-based directory structure following Next.js App Router conventions
  - `app/(auth)/` — login, signup, forgot-password pages
  - `app/(dashboard)/` — organization list, project list, board views
  - `app/api/` — route handlers (AI chat, webhooks)
  - `components/auth/` — auth-specific components
  - `components/ui/` — shadcn/ui components
  - `components/board/` — Kanban board components
  - `lib/supabase/` — Supabase client configuration
  - `lib/db/` — Drizzle ORM schema and migrations
  - `hooks/` — custom React hooks
  - `types/` — TypeScript type definitions

### Auth & UI
- **D-04:** Custom auth forms using shadcn/ui + React Hook Form + Zod
  - Rationale: Consistent with app UI design, full control over styling (Trello-like feel), better DX than Supabase Auth UI
  - Forms: login, signup, forgot-password, reset-password
- **D-05:** Supabase Auth with email/password + magic link
  - Rationale: Simple to implement, password reset via email, no OAuth complexity in v1
- **D-06:** Use Supabase SSR package (`@supabase/ssr`) for cookie-based sessions
  - Rationale: Secure, HttpOnly cookies, works with Next.js App Router middleware
- **D-07:** Middleware (`middleware.ts`) checks session and redirects unauthenticated users to `/login`
  - Rationale: Centralized auth protection, works across all routes

### Database Schema
- **D-08:** Create full schema in Phase 1 using Drizzle ORM
  - Tables: `profiles`, `organizations`, `organization_members`, `projects`, `boards`, `columns`, `cards`, `roles`, `vault_entries`, `vault_versions`
  - Rationale: Define all relationships upfront for type safety and clarity; migrations can be applied incrementally per phase
- **D-09:** Use `uuid` primary keys for all tables (Supabase default)
  - Rationale: Consistent with Supabase, prevents ID collisions in multi-user scenario
- **D-10:** Enable Row Level Security (RLS) on all tables from day one
  - Rationale: Critical for multi-user security, easier to add policies now than retrofit later
- **D-11:** Use `created_at` and `updated_at` timestamps on all tables
  - Rationale: Audit trail, sorting, debugging

### Drizzle ORM
- **D-12:** Use Drizzle Kit for migrations (`drizzle-kit generate` + `drizzle-kit migrate`)
  - Rationale: Type-safe migrations, SQL-like API, edge-compatible
- **D-13:** Create a single `schema.ts` file for all tables
  - Rationale: Simple for v1, can split into multiple files when schema grows

### Styling
- **D-14:** Tailwind CSS v4 with shadcn/ui `new-york` style
  - Rationale: Modern utility-first CSS, shadcn/ui provides accessible components
- **D-15:** Lucide React for icons
  - Rationale: Consistent icon set, works seamlessly with shadcn/ui

### the agent's Discretion
- Exact color palette and theme configuration (shadcn/ui init will set defaults)
- Specific validation rules beyond password length
- Exact loading skeleton design for auth pages
- Error message copy and localization

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Stack & Architecture
- `.planning/research/STACK.md` §1-6 — Tech stack decisions (Next.js, Supabase, Drizzle)
- `.planning/research/ARCHITECTURE.md` §3 — Build order and component structure
- `.planning/research/PITFALLS.md` §4.1, 4.3 — Auth/security pitfalls

### Requirements
- `.planning/REQUIREMENTS.md` §Authentication — AUTH-01..05
- `.planning/ROADMAP.md` §Phase 1 — Phase goal and success criteria

### Tambo AI (for later phases, but good to know structure)
- `.planning/research/STACK.md` §7 — Tambo AI integration approach

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing codebase — greenfield project
- `package.json` only has `@code-yeongyu/comment-checker` devDependency

### Established Patterns
- None yet — this phase establishes all patterns

### Integration Points
- Supabase project needs to be created manually at supabase.com (or via CLI)
- Environment variables need to be configured in `.env.local`
- Drizzle ORM connects to Supabase PostgreSQL via connection string

</code_context>

<specifics>
## Specific Ideas

- Auth pages should feel minimal and clean — just forms on a centered card (like Linear or Notion login)
- After login, redirect to `/organizations` (list of user's orgs)
- Use `npx shadcn@latest init` to scaffold the project with Next.js template
- Password reset flow: request page → email sent page → reset page with token validation

</specifics>

<deferred>
## Deferred Ideas

- OAuth login (Google/GitHub) — v2 (AUTH-06)
- Two-factor authentication — future milestone
- Custom domain for auth emails — not needed for v1
- Advanced session management (device tracking) — future

</deferred>

---

*Phase: 01-setup-auth*  
*Context gathered: 2025-04-28*  
*Mode: Auto-selected recommended defaults (ultrawork)*
