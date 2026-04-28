# State: ZenTask

**Project:** ZenTask  
**Status:** Initialized — Ready for Phase 1  
**Last updated:** 2025-04-28

---

## Project Reference

See: `.planning/PROJECT.md` (updated 2025-04-28)

**Core value:** Team nhỏ (10-15 ngườI) có thể quản lý Kanban tasks hiệu quả qua cả visual drag-and-drop và natural language AI commands.
**Current focus:** Phase 1 — Project Setup & Auth

---

## Phase Status

| Phase | Status | Requirements | Completed |
|-------|--------|--------------|-----------|
| 1: Project Setup & Auth | ◆ Code Complete | AUTH-01..05 | 5/5 |
| 2: Organization & Project | ○ Pending | ORG-01..03, PROJ-01..03 | 0/6 |
| 3: Board & Column Core | ○ Pending | BOARD-01..04, COL-01..04 | 0/8 |
| 4: Card CRUD & Metadata | ○ Pending | CARD-01..08 | 0/8 |
| 5: Drag-and-Drop | ○ Pending | DND-01..04 | 0/4 |
| 6: AI Assistant (Tambo AI) | ○ Pending | AI-01..08 | 0/8 |
| 7: Real-Time Collaboration | ○ Pending | RTC-01..03 | 0/3 |
| 8: RBAC | ○ Pending | RBAC-01..05 | 0/5 |
| 9: Vault (Env Manager) | ○ Pending | VAULT-01..04 | 0/4 |
| 10: Search, Filter & Polish | ○ Pending | SRCH-01..05, UI-01..05 | 0/10 |

**Overall:** 5/61 requirements complete

---

## Active Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tambo AI cho AI Assistant | Generative UI toolkit, MCP support, stream props vào React components, phù hợp React-only stack | — Pending |
| Supabase (PostgreSQL + Auth + Realtime) | Managed backend, free tier, RLS, real-time subscriptions, không cần backend riêng | — Pending |
| Frontend-only (không backend riêng) | Giảm complexity, host free (Vercel + Supabase Free), phù hợp team nhỏ | — Pending |
| Organization/Project hierarchy | Phân quyền RBAC cần cấu trúc org/project, phân biệt multiple teams | — Pending |
| Next.js 15 App Router | Full-stack React, Supabase integration tốt, AI SDK compatible | — Pending |
| @dnd-kit cho drag-and-drop | Active maintenance, accessible, performant, React-native | — Pending |

---

## Blockers

- **Supabase project needed** to apply Drizzle migration and test auth flows. `.env.local` has placeholder values.

---

## Notes

- User clarifications applied: Tambo AI, RBAC, Org/Project, Vault env, real-time collaboration, team 10-15
- Research completed: STACK, FEATURES, ARCHITECTURE, PITFALLS, SUMMARY
- Tambo AI research: MCP support, tool calling, streaming, React hooks (useTambo, useTamboThreadInput)
- Requirements defined: 50 v1, 11 v2
- Roadmap: 10 sequential phases
- Config: YOLO mode, balanced model profile, parallel execution enabled

---

*State file — updated after each phase transition*
