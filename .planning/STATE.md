# State: ZenTask

**Project:** ZenTask  
**Status:** All 10 Phases Complete
**Last updated:** 2025-04-28

---

## Project Reference

See: `.planning/PROJECT.md` (updated 2025-04-28)

**Core value:** Team nhỏ (10-15 ngườI) có thể quản lý Kanban tasks hiệu quả qua cả visual drag-and-drop và natural language AI commands.
**Current focus:** Complete — all v1 requirements implemented

---

## Phase Status

| Phase | Status | Requirements | Completed |
|-------|--------|--------------|-----------|
| 1: Project Setup & Auth | ✅ Complete | AUTH-01..05 | 5/5 |
| 2: Organization & Project | ✅ Complete | ORG-01..03, PROJ-01..03 | 6/6 |
| 3: Board & Column Core | ✅ Complete | BOARD-01..04, COL-01..04 | 8/8 |
| 4: Card CRUD & Metadata | ✅ Complete | CARD-01..08 | 8/8 |
| 5: Drag-and-Drop | ✅ Complete | DND-01..04 | 4/4 |
| 6: AI Assistant (Tambo AI) | ✅ Complete | AI-01..08 | 8/8 |
| 7: Real-Time Collaboration | ✅ Complete | RTC-01..03 | 3/3 |
| 8: RBAC | ✅ Complete | RBAC-01..05 | 5/5 |
| 9: Vault (Env Manager) | ✅ Complete | VAULT-01..04 | 4/4 |
| 10: Search, Filter & Polish | ✅ Complete | SRCH-01..05, UI-01..05 | 10/10 |

**Overall:** 61/61 requirements complete

**Phase 8 Deliverables:**
- Role checks added to `createColumn`, `updateColumn`, `deleteColumn` (owner/admin only)
- Role checks added to `createBoard`, `updateBoard` (owner/admin only)
- Role checks added to `createProject`, `updateProject` (owner/admin only)
- `BoardColumns` receives `userRole` prop and conditionally renders column edit/delete buttons
- `CreateColumnDialog` gated on board page by role
- `CreateBoardDialog` gated on project page by role
- `CreateProjectDialog` gated on org page by role

**Phase 9 Deliverables:**
- Vault server actions: `getVaultEntries`, `createVaultEntry`, `updateVaultEntry`, `deleteVaultEntry`, `getVaultVersions`
- Vault page at `/org/[slug]/vault` with entry cards
- Create/edit/delete dialogs for vault entries
- Version history dialog showing previous values with changer and date
- Project-scoped entries support
- Owner/admin-only access enforcement
- Vault link added to org layout header

**Phase 10 Deliverables:**
- Search input filtering cards by title and description
- Priority filter dropdown (Low/Medium/High)
- Assignee filter dropdown with "Unassigned" option
- Label filter dropdown (auto-populated from card labels)
- Clear filters button with active filter count badge
- Filtered card count display
- Client-side filtering in `BoardColumns` with `useMemo`

---

## Active Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tambo AI cho AI Assistant | Generative UI toolkit, MCP support, stream props vào React components, phù hợp React-only stack | ✅ Implemented |
| Supabase (PostgreSQL + Auth + Realtime) | Managed backend, free tier, RLS, real-time subscriptions, không cần backend riêng | ✅ Migration applied, DB connected, Realtime enabled |
| Frontend-only (không backend riêng) | Giảm complexity, host free (Vercel + Supabase Free), phù hợp team nhỏ | ✅ Working |
| Organization/Project hierarchy | Phân quyền RBAC cần cấu trúc org/project, phân biệt multiple teams | ✅ Implemented |
| Next.js 15 App Router | Full-stack React, Supabase integration tốt, AI SDK compatible | ✅ Next.js 16.2.4 |
| @dnd-kit cho drag-and-drop | Active maintenance, accessible, performant, React-native | ✅ Implemented |

---

## Blockers

None.

---

## Notes

- All 10 phases complete — 61/61 requirements satisfied
- User clarifications applied: Tambo AI, RBAC, Org/Project, Vault env, real-time collaboration, team 10-15
- Research completed: STACK, FEATURES, ARCHITECTURE, PITFALLS, SUMMARY
- Tambo AI research: MCP support, tool calling, streaming, React hooks (useTambo, useTamboThreadInput)
- Requirements defined: 50 v1, 11 v2
- Roadmap: 10 sequential phases
- Config: YOLO mode, balanced model profile, parallel execution enabled

---

*State file — updated after each phase transition*
