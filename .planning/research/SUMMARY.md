# Research Synthesis: ZenTask

> **Synthesized from:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md  
> **Date:** 2025-04-28

---

## Key Findings

### Stack Decision

| Layer | Choice | Confidence |
|---|---|---|
| **Frontend** | Next.js 15 + React 19 + TypeScript | HIGH |
| **Styling** | Tailwind CSS v4 + shadcn/ui (new-york) | HIGH |
| **Drag & Drop** | @dnd-kit/core + @dnd-kit/sortable | HIGH |
| **Database** | PostgreSQL 16 via Supabase | HIGH |
| **ORM** | Drizzle ORM | MEDIUM-HIGH |
| **Auth** | Better Auth (fallback: Supabase Auth) | MEDIUM |
| **AI SDK** | Vercel AI SDK v5 (GPT-4o-mini / Claude Sonnet / Gemini Flash) | HIGH |
| **Backend** | Next.js API Routes + Server Actions | HIGH |
| **State** | Zustand + TanStack Query | HIGH |
| **Validation** | Zod + React Hook Form | HIGH |
| **Deploy** | Vercel + Supabase | HIGH |

**Why this stack:** Single-codebase full-stack with Next.js App Router. Supabase provides managed PostgreSQL + Auth. Vercel AI SDK gives unified LLM API with streaming and tool calling. Zero-cost MVP on free tiers.

### Table Stakes Features

10 must-have Kanban features: boards, columns, cards (CRUD), drag-and-drop, auth, card metadata (due date, priority, labels), comments, filter/search, responsive design, board settings.

**Build order hint:** Auth → Board → Columns → Cards → DnD → Metadata → Comments → Filter → Responsive → Settings.

### AI Differentiator

5 core AI capabilities:
1. **Natural Language Task Manipulation** — move tasks, change dates, assign via chat
2. **AI Task Creation** — describe task in NL, AI extracts structured data
3. **Project Status Q&A** — ask about progress, bottlenecks, workload
4. **Smart Priority Suggestions** — AI suggests priority based on context
5. **Task Summarization** — condense comments/description into status

AI UX: persistent sidebar chat + Cmd+K command palette. Human-in-the-loop confirmation for destructive actions.

### Architecture Pattern

Single-codebase Next.js with layered architecture:
- **Presentation:** React components (Server + Client), Zustand for board state
- **API:** Route Handlers (AI streaming), Server Actions (CRUD)
- **Service Layer:** Shared business logic (called by both UI and AI tools)
- **Data Access:** Supabase client with RLS
- **Infrastructure:** Supabase (DB + Auth), Vercel (hosting)

AI is an alternative input channel — its tools call the same Service Layer as UI Server Actions.

### Critical Pitfalls to Watch

| Pitfall | Severity | Phase |
|---------|----------|-------|
| Monolithic board state (nested objects) | **BLOCKER** | Phase 3 |
| Drag-drop full-board rerenders | High | Phase 4 |
| AI hallucination on state changes | **BLOCKER** | Phase 5 |
| Prompt injection via task content | High | Phase 5 |
| LLM cost explosion | High | Phase 5 |
| Integer position for card ordering | High | Phase 1 |
| Missing FK indexes | Medium | Phase 1 |
| No soft delete / audit trail | Medium | Phase 1 |
| Storing JWT in localStorage | High | Phase 2 |
| Over-trusting LLM output (no validation) | **BLOCKER** | Phase 5 |

---

## Competitive Positioning

**Gap identified:** No tool combines Trello's Kanban simplicity with agentic AI that actually performs actions (not just summarizes). Most AI PM features are passive — ZenTask's AI manipulates board state directly.

**Position:** Trello's simplicity + AI that takes action.

---

## MVP Cost Estimate

- **Vercel Hobby:** $0 (generous free tier)
- **Supabase Free:** $0 (500MB DB, 2GB bandwidth)
- **LLM API:** $0-5/month at low usage (GPT-4o-mini is ~$0.15/1M input tokens)

**Total MVP hosting cost: $0-5/month.**

---

## Recommended v1 Scope

1. Auth (signup/login)
2. Single board with columns + cards
3. Drag-and-drop between columns
4. Card metadata (title, description, due date, priority, labels)
5. AI chat sidebar with natural language task manipulation
6. Filter + search
7. Responsive design

Deferred to v2: multiple boards, comments, command palette, advanced AI features (summarization, smart priority), OAuth, attachments.

---

*Synthesized: 2025-04-28*
