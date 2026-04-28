# ZenTask — Technology Stack Decision Document

> **Status:** Final  
> **Last updated:** 2025-04-28  
> **Context:** Greenfield Kanban project management web app with AI Assistant. Target: individuals & small teams. v1 scope: Core Kanban + AI natural-language task manipulation.

---

## 1. Frontend Framework: Next.js 15 (App Router)

**Recommendation:** Next.js 15.2+ with React 19, TypeScript 5.7+

**Why Next.js over alternatives:**

| Criteria | Next.js 15 | React (SPA-only) | Vue 3 | SvelteKit |
|---|---|---|---|---|
| AI integration (streaming) | Native Route Handlers + Server Actions | Needs separate backend | Needs separate backend | +server endpoints |
| Server-side rendering | Built-in (SSR, RSC) | Client-only (CSR) | Nuxt required | Built-in |
| API routes co-location | Yes | No | No | Partial |
| Kanban ecosystem | Largest (dnd-kit, hello-pangea) | Same but needs API | Smaller | Minimal |
| AI SDK compatibility | First-class (Vercel AI SDK) | Works but manual | Works but less mature | Limited |
| Full-stack DX | Single codebase | Two codebases | Two codebases | Single codebase |

**Specific version pin:** `next@15.2.x` (stable App Router, React Server Components, Server Actions)

**Why not React SPA alone:** ZenTask needs server-side API endpoints for AI streaming, database access, and auth. A pure SPA would require a separate backend—doubling infrastructure complexity for v1.

**Why not Vue/Svelte:** While both are excellent, React's ecosystem has significantly more production-ready Kanban and AI integration libraries. The Next.js + Vercel AI SDK synergy is unmatched.

**Confidence:** **HIGH** — Next.js 15 is the industry standard for full-stack React applications in 2025. Countless Kanban projects (kanvas, taskflow, kanban-board) use this exact stack.

---

## 2. Styling & UI Components: Tailwind CSS v4 + shadcn/ui

**Recommendation:** Tailwind CSS v4.0+ + shadcn/ui (new-york style)

**Why this combination:**

- **Tailwind CSS v4:** Rust-based engine, OKLCH color space, CSS-first `@theme` directive. Zero-configuration. Industry standard for 2025.
- **shadcn/ui:** Not a package — copy-paste components you own. Accessible (Radix UI primitives), beautifully styled, fully customizable. Works with React 19 + Tailwind v4.
- **Sonner** for toast notifications (recommended by shadcn/ui team).
- **Lucide React** for icon library.

**Why not alternatives:**

| Alternative | Why NOT |
|---|---|
| MUI / Material UI | Heavy bundle (100KB+), opinionated design, slow to customize |
| Ant Design | Enterprise-focused, excessive for small-team Kanban |
| Chakra UI | Losing community momentum to shadcn/ui |
| Bootstrap | Outdated paradigm, not React-native |
| CSS Modules | Slower development velocity vs utility-first |

**Confidence:** **HIGH** — This is the dominant 2025 React styling stack. Tailwind + shadcn/ui is now default in Next.js templates.

---

## 3. Drag-and-Drop: @dnd-kit/core + @dnd-kit/sortable

**Recommendation:** `@dnd-kit/core@6.x` + `@dnd-kit/sortable@8.x`

**Why @dnd-kit:**

- **Actively maintained** (2.8M+ weekly downloads)
- **Accessible:** Keyboard navigation, screen reader support, ARIA attributes built-in
- **Performant:** ~10KB gzipped core, supports virtualization for 100+ cards
- **Multi-container:** Native support for Kanban boards (dragging between columns)
- **TypeScript-first:** Excellent type inference
- **Plugin system:** Sortable preset, modifiers (snap-to-grid), custom collision detection

**Why NOT alternatives:**

| Library | Status | Why NOT |
|---|---|---|
| react-beautiful-dnd | **DEPRECATED** | Atlassian abandoned it. No React 19 support. Do not use for new projects. |
| hello-pangea/dnd | Maintained fork of rbd | Viable, but dnd-kit is more flexible and has larger ecosystem |
| @atlaskit/pragmatic-drag-and-drop | Viable | Atlassian's successor. Headless, tiny (<4KB). But requires more custom implementation. Overkill for standard Kanban. |
| react-dnd | Legacy | Outdated API, heavy boilerplate |

**Confidence:** **HIGH** — @dnd-kit is the consensus community recommendation for new React drag-and-drop projects in 2025.

---

## 4. Database: PostgreSQL (via Supabase)

**Recommendation:** PostgreSQL 16 via Supabase managed service

**Why PostgreSQL + Supabase:**

Kanban data is **inherently relational**: Boards → Columns → Tasks → Subtasks. This maps cleanly to relational tables with foreign keys and cascading operations.

- **Supabase free tier:** 500MB database, 50MB file storage, 5GB bandwidth, 2 projects. Generous for MVP and beyond.
- **Built-in Auth:** Comes with Supabase Auth (email/password, OAuth, magic links). No separate auth service.
- **Real-time subscriptions:** Database changes broadcast to clients via WebSocket. Future-proof for v2 collaboration.
- **Row Level Security (RLS):** Fine-grained access control at database level.
- **pgvector:** Native vector embeddings support — enables future AI semantic search.
- **ACID transactions:** Data integrity guaranteed for multi-step Kanban operations.

**Why NOT alternatives:**

| Alternative | Why NOT |
|---|---|
| MongoDB (Atlas) | Document model wrong for relational Kanban data. Schema-less means more application-level validation. Joins are painful. Overkill post-licensing changes (SSPL). |
| SQLite (Turso/LibSQL) | Great for edge/SQLite-lovers, but no built-in auth, real-time, or storage. Requires more infrastructure. |
| PlanetScale | MySQL-based. Good but serverless driver adds latency. Supabase has more integrated features. |
| Firebase Firestore | NoSQL, proprietary lock-in, complex querying for relational data, expensive at scale |

**Confidence:** **HIGH** — PostgreSQL is the right choice for 90% of web applications (per multiple independent analyses). Supabase adds auth + real-time + storage as bonus.

---

## 5. ORM / Database Client: Drizzle ORM

**Recommendation:** `drizzle-orm@1.x` + `drizzle-kit@1.x`

**Why Drizzle over Prisma:**

| Criteria | Drizzle ORM | Prisma 7 |
|---|---|---|
| Bundle size | ~7KB | ~40KB+ |
| Edge runtime | Native (Cloudflare, Vercel Edge, Bun) | Via Prisma Accelerate |
| Cold start | Instant | Slower engine init |
| Query style | SQL-like chainable (feels like writing SQL) | Higher-level object API |
| Schema definition | TypeScript files (no separate schema language) | Prisma schema file (.prisma) |
| Migration files | Plain SQL you own | SQL generated from Prisma schema |
| npm downloads (Q4 2025) | ~5.1M/week (growing) | ~4.3M/week |

**Decision:** Drizzle ORM. We're building on Vercel (edge-adjacent), want minimal cold starts, and prefer explicit SQL control. Drizzle's TypeScript inference is excellent and matches our TypeScript-first approach.

**When Prisma would be better:** Teams without SQL expertise, need for Prisma Studio visual explorer, or using Prisma Accelerate/Pulse ecosystem. Not our case.

**Confidence:** **MEDIUM-HIGH** — Drizzle has overtaken Prisma in downloads and is the trending choice. Both are excellent; Drizzle edges ahead for our specific constraints.

---

## 6. Authentication: Better Auth

**Recommendation:** `better-auth@1.x`

**Why Better Auth:**

- **Self-hosted, open-source, free forever** — No per-user cost, no vendor lock-in
- **TypeScript-first:** Session types inferred automatically from config. No manual augmentation.
- **Batteries included:** Email/password, OAuth (Google, GitHub), magic links, 2FA, passkeys — all as plugins
- **Organization/team support:** Built-in plugin (future-proof for team features)
- **Database adapters:** Works with Drizzle, Prisma, Mongoose, Kysely
- **Active development:** Fastest-growing auth library (50K → 500K weekly in 12 months)

**Why NOT alternatives:**

| Alternative | Why NOT |
|---|---|
| Auth.js v5 (NextAuth) | In slow-maintenance mode. Core team moved to Better Auth (Sept 2025). v5 never left beta. |
| Clerk | Excellent DX, but paid after 10K MAU ($0.02/MAU). US-only data storage. Vendor lock-in. |
| Supabase Auth | Viable alternative if using Supabase. Less flexible for custom flows. Still an option. |
| Lucia v3 | Deprecated as library (Sept 2024). Now just architecture patterns. |
| Auth0 | Enterprise-focused, expensive, complex setup |

**Alternative consideration:** If we go all-in on Supabase, using Supabase Auth directly is also viable and reduces dependencies. However, Better Auth gives more flexibility and better TypeScript DX.

**Confidence:** **MEDIUM** — Better Auth is the rising star but newer than established options. Supabase Auth is our "safe fallback" since we're already using Supabase for the database.

---

## 7. AI / LLM Integration

### Primary SDK: Vercel AI SDK v5+

**Recommendation:** `ai@5.x` (Vercel AI SDK Core + UI)

**Why Vercel AI SDK:**

- **Provider-agnostic:** Same API for OpenAI, Anthropic, Google, xAI, and open-source models. Change models with 1 line.
- **`streamText` + `generateText`:** Streaming AI responses to UI in real-time
- **Tool calling:** Define tools with Zod schemas — AI can call `moveTask`, `updateDeadline`, `createTask`, `deleteTask` etc.
- **Multi-step tool calls:** AI executes chained operations (e.g., "move task A to Done and unblock task B")
- **React hooks:** `useChat`, `useCompletion` for seamless AI chat UI
- **Framework-agnostic:** Works equally well with Next.js, React, Svelte, Vue
- **MCP support:** Model Context Protocol for external tool integration

### LLM Model Strategy

| Tier | Model | Use Case | Input $/1M | Output $/1M | Why |
|---|---|---|---|---|---|
| **Primary (cost-effective)** | GPT-4o-mini (OpenAI) | Daily task operations, simple NL commands | $0.15 | $0.60 | Cheapest reliable model. 128K context. |
| **Complex reasoning** | Claude Sonnet 4 (Anthropic) | Multi-step task operations, ambiguous requests | $3.00 | $15.00 | Best reasoning quality. 200K context. |
| **Fallback / Free tier** | Gemini 2.0 Flash (Google) | Prototyping, free-tier production | $0.10 | $0.40 | Cheapest. Free tier (60 RPM). 1M context. |

**Why NOT open-source/self-hosted models (for v1):**
- Ollama/Llama 3: Requires GPU server, adds infrastructure complexity
- Local models are slower, less capable at tool calling for complex Kanban operations  
- v1 priority is shipping fast — cloud APIs are the right choice

**Why NOT building custom OpenAI client:**
- Vercel AI SDK handles streaming, tool calling, retries, and multi-provider switching
- Custom client = reinventing wheels = more bugs = slower delivery

**AI Assistant Tool Definitions (v1 scope):**

```typescript
tools: {
  createTask: tool({ /* boardId, columnId, title, description, dueDate */ }),
  updateTask: tool({ /* taskId, title?, description?, dueDate? */ }),
  moveTask: tool({ /* taskId, targetColumnId */ }),
  deleteTask: tool({ /* taskId */ }),
  reorderTask: tool({ /* taskId, newPosition */ }),
  getBoardContext: tool({ /* boardId */ }), // Give AI board state awareness
}
```

**Cost estimate (v1):** At 100 AI commands/day, ~2K tokens avg per interaction: ~$3-5/month using primarily GPT-4o-mini. Free tier from Gemini covers prototyping.

**Confidence:** **HIGH** — Vercel AI SDK is the de facto standard for TypeScript AI integration. Tool calling is production-proven.

---

## 8. Backend / API Approach: Next.js Server-First

**Recommendation:** Next.js API Routes + Server Actions (co-located in app directory)

**Architecture:**
```
app/
  api/
    ai/route.ts          → AI chat endpoint (Vercel AI SDK streamText)
    boards/route.ts      → Board CRUD
    tasks/route.ts       → Task CRUD
  (actions)/
    board-actions.ts     → Server Actions (form mutations)
    task-actions.ts      → Server Actions (drag-and-drop updates)
  boards/[id]/
    page.tsx             → Kanban board page (server component shell)
    board-client.tsx     → Client: dnd-kit + AI chat panel
```

**Why no separate backend (Express, Hono, Elysia):**

- **v1 is single-user/small-team** — no need for microservices
- **Next.js full-stack** provides everything we need: SSR, API routes, server actions, middleware
- **Co-location** = faster development, shared types, single deployment
- **Server Actions** replace REST endpoints for form mutations — simpler code, progressive enhancement

**When to extract a separate backend (v2+):** When we need WebSocket for real-time collaboration, separate scaling, or background job processing.

**If a separate backend becomes necessary:** Hono (edge-native, multi-runtime) or Elysia (Bun-native, best TypeScript inference). NOT Express (legacy, poor TypeScript support).

**Confidence:** **HIGH** — Next.js monolith is the correct v1 architecture. Proven pattern in dozens of Kanban apps.

---

## 9. State Management: React Context + TanStack Query

**Recommendation:** 
- **Server state:** `@tanstack/react-query@5.x` (caching, refetching, optimistic updates)
- **Client state:** React Context (lightweight state) + `nuqs` (URL query state)

**Why NOT Redux/Zustand:**

- Redux: Excessive boilerplate for a Kanban app. Over-engineering for our scope.
- Zustand: Good lightweight alternative but React Query handles 80% of our state (server data)
- Jotai/Recoil: Atomic state is overkill for this app

**Confidence:** **HIGH** — TanStack Query is the standard for server-state in React. React Context is sufficient for remaining client state.

---

## 10. Form Handling & Validation: React Hook Form + Zod

**Recommendation:** 
- `react-hook-form@7.x` — Performant form state (minimal re-renders)
- `zod@3.x` — Schema validation (shared with AI tool definitions, API validation)

**Why:** Forms are critical for task creation/edit. React Hook Form is the lightest option. Zod integrates seamlessly with Vercel AI SDK tool definitions and Drizzle schemas.

**Confidence:** **HIGH**

---

## 11. Deployment & Hosting

**Recommendation:** Vercel (Hobby → Pro) + Supabase (Free → Pro)

| Service | Tier | Cost | What You Get |
|---|---|---|---|
| **Vercel** | Hobby (dev/MVP) | **$0** | 100GB bandwidth, 1M function invocations, preview deploys, HTTPS, edge network. **Non-commercial use only.** |
| **Vercel** | Pro (production) | **$20/mo** | 1TB bandwidth, 2M function invocations, team collaboration, commercial use allowed |
| **Supabase** | Free | **$0** | 500MB database, 50MB storage, 5GB bandwidth, 2 projects |
| **Supabase** | Pro (scale) | **$25/mo** | 8GB database, 100GB storage, 50GB bandwidth, point-in-time recovery |

**Total at MVP (free): $0/month.**  
**Total at production (Pro): ~$45/month.**

**Why Vercel over alternatives:**

| Platform | Why NOT |
|---|---|
| Cloudflare Pages | Limited Next.js ISR/SSR support. Some Node.js APIs don't work in Workers runtime. |
| Railway | Usage-based billing can spike. No free tier (trial credits only). Good for DB+backend combos. |
| Netlify | Slower build times, less optimal Next.js integration |
| DigitalOcean / VPS | Requires DevOps. More control but slower to ship. Can migrate later. |
| AWS Amplify | Complex setup. Poor DX compared to Vercel. |

**Why NOT self-hosting (for v1):** Diverts energy from building features to managing infrastructure. Vercel's preview deploys per PR is invaluable for development velocity.

**Confidence:** **HIGH** — Vercel is built by the Next.js team. The integration is unparalleled.

---

## 12. Additional Libraries

| Category | Choice | Version | Why |
|---|---|---|---|
| **Date handling** | date-fns | 4.x | Tree-shakeable, immutable, no Moment.js bloat |
| **Unique IDs** | nanoid | 5.x | Faster and smaller than UUID for client-generated IDs |
| **Animations** | Framer Motion | 11.x | Declarative, handles layout animations perfectly for Kanban |
| **CSV Import/Export** | PapaParse | 5.x | De facto standard for CSV in browser |
| **Error monitoring** | Sentry | 8.x | Generous free tier, great Next.js integration |
| **Analytics** | PostHog | Cloud | Open-source, self-hostable, privacy-friendly |
| **Package manager** | pnpm | 9.x | Faster, stricter, disk-efficient. Default for Next.js projects. |

---

## 13. What We Are NOT Using (and Why)

| Technology | Reason for Avoiding |
|---|---|
| **Redis** | Not needed for v1 single-user. Add when real-time collaboration or caching is needed. |
| **WebSocket (Socket.io)** | v1 is single-user Kanban. Real-time is v2 scope. Supabase Realtime covers basic needs. |
| **GraphQL** | Over-engineering for Kanban CRUD. REST + RSC is simpler. |
| **tRPC** | Viable but adds complexity. Server Actions handle type-safe mutations. |
| **Docker (for dev)** | Vercel deploys without containers. Can add later if needed. |
| **Kubernetes** | Enterprise-grade orchestration. Massively over-engineered for this scope. |
| **Microservices** | Premature architecture. Monolith first, split later when needed. |
| **React Native / Expo** | v1 is web-only. Mobile app is v2+ scope. |
| **Ollama / Local LLMs** | Adds GPU infrastructure complexity. Cloud APIs are simpler and more capable for v1. |
| **MySQL / PlanetScale** | PostgreSQL is more capable (JSONB, pgvector, full-text search). |
| **MongoDB / Document DB** | Relational data shouldn't be forced into documents. |

---

## 14. Stack Summary (One-Page)

```
┌─────────────────────────────────────────────────────────────┐
│                        ZenTask Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🖥  Frontend:    Next.js 15 (App Router) + React 19          │
│  🎨  Styling:     Tailwind CSS v4 + shadcn/ui (new-york)     │
│  🖱  Drag & Drop: @dnd-kit/core + @dnd-kit/sortable         │
│  🤖 AI SDK:      Vercel AI SDK v5 (OpenAI/Claude/Gemini)    │
│  🗄  Database:    PostgreSQL 16 (Supabase)                    │
│  📦 ORM:         Drizzle ORM + drizzle-kit                  │
│  🔐 Auth:        Better Auth (primary) / Supabase Auth       │
│  📡 Backend:     Next.js API Routes + Server Actions        │
│  📊 State:       TanStack Query + React Context             │
│  ✅ Validation:  Zod + React Hook Form                       │
│  🚀 Deploy:      Vercel (frontend+API) + Supabase (DB)      │
│  📦 Package:     pnpm                                       │
│                                                               │
│  💰 Total MVP Cost: $0/month                                  │
│  💰 Production Cost: ~$45/month (Vercel Pro + Supabase Pro)  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 15. Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Better Auth is newer (less adoption) | Medium | Fallback to Supabase Auth if issues arise. Both work with PostgreSQL. |
| Vercel Hobby plan → commercial restriction | Medium | Migrate to Pro ($20/mo) when ready for production. Cost is predictable. |
| LLM API costs at scale | Low | Model tiering: GPT-4o-mini for most tasks, Gemini Flash as cost fallback. |
| dnd-kit breaking changes | Low | Stable v6/v8 API. Large community. Atlassian's react-beautiful-dnd was the only major deprecation. |
| Next.js version churn | Low | Next.js 15 is stable. App Router is the recommended path. |

---

## 16. References

- [State of JavaScript 2025 — Backend Frameworks](https://2025.stateofjs.com/en-US/libraries/back-end-frameworks/)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Better Auth — Rising Next.js Auth Standard](https://www.pkgpulse.com/blog/better-auth-vs-nextauth-v5-vs-clerk-2026)
- [dnd-kit — Community Drag-and-Drop Standard](https://www.pkgpulse.com/blog/dnd-kit-vs-react-beautiful-dnd-vs-pragmatic-drag-drop-2026)
- [Drizzle ORM vs Prisma 2026](https://www.pkgpulse.com/blog/drizzle-orm-vs-prisma-2026-update)
- [Supabase vs MongoDB for Project Management Apps](https://www.leanware.co/insights/supabase-vs-mongodb)
- [Next.js Deployment Options 2026](https://deploywise.dev/blog/nextjs-deployment-options-2026)
- [LLM API Pricing Comparison](https://aifreeapi.com/en/posts/gemini-api-vs-openai-vs-claude-2026-cost-guide)
