# Roadmap: ZenTask

**Created:** 2025-04-28  
**Granularity:** Fine (10 phases)  
**Mode:** YOLO (auto-approve)  
**Core Value:** Team nhỏ (10-15 ngườI) có thể quản lý Kanban tasks hiệu quả qua cả visual drag-and-drop và natural language AI commands.

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Project Setup & Auth | Scaffold the app, Supabase, and auth | AUTH-01..05 | 5 |
| 2 | Organization & Project | Organization/project hierarchy and invites | ORG-01..03, PROJ-01..03 | 6 |
| 3 | Board & Column Core | Users can create boards and manage columns | BOARD-01..04, COL-01..04 | 8 |
| 4 | Card CRUD & Metadata | Users can create and manage task cards | CARD-01..08 | 8 |
| 5 | Drag-and-Drop | Smooth drag-and-drop interaction | DND-01..04 | 4 |
| 6 | AI Assistant (Tambo AI) | AI chat sidebar that manipulates tasks via NL | AI-01..08 | 8 |
| 7 | Real-Time Collaboration | Multi-user real-time sync via Supabase Realtime | RTC-01..03 | 3 |
| 8 | RBAC | Role-based access control | RBAC-01..05 | 5 |
| 9 | Vault (Env Manager) | Simple env variable manager with versioning | VAULT-01..04 | 4 |
| 10 | Search, Filter & Polish | Search/filter cards and final UI/UX polish | SRCH-01..05, UI-01..05 | 10 |

**Total:** 10 phases | 61 requirements mapped | All v1 requirements covered ✓

---

## Phase Details

### Phase 1: Project Setup & Auth

**Goal:** Scaffold Next.js project, Supabase backend, database schema, and authentication.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05

**What this phase delivers:**
- Next.js 15 project scaffolded with App Router, TypeScript, Tailwind CSS v4, shadcn/ui
- Supabase project connected (PostgreSQL, Auth, Realtime)
- Database schema: users, organizations, projects, boards, columns, cards, roles, vault
- Drizzle ORM migrations
- Auth flow: signup, login, logout, password reset, session persistence
- Password validation (8+ characters)
- Protected routes middleware

**Success criteria:**
1. Developer can run `npm run dev` and see the app locally
2. New user can sign up with email/password
3. User can log in and remain authenticated after page refresh
4. User can log out and is redirected to login page
5. Passwords under 8 characters are rejected at signup
6. User can request password reset via email
7. Database migrations run successfully and schema is queryable

**Canonical refs:**
- `.planning/research/STACK.md` §1-6
- `.planning/research/ARCHITECTURE.md` §3
- `.planning/research/PITFALLS.md` §4.1, 4.3

**UI hint:** no

---

### Phase 2: Organization & Project

**Goal:** Organization/project hierarchy with member invites.

**Requirements:** ORG-01, ORG-02, ORG-03, PROJ-01, PROJ-02, PROJ-03

**What this phase delivers:**
- Organization creation (name, slug)
- Organization list page
- Invite members via email
- Project creation within organization
- Project list page
- Project rename and delete
- Organization settings page

**Success criteria:**
1. User can create an organization with name and slug
2. User can invite another user via email to organization
3. Invited user can join organization
4. User can create a project within an organization
5. User can view all projects in an organization
6. User can rename and delete a project

**Canonical refs:**
- `.planning/research/ARCHITECTURE.md` §3

**UI hint:** yes — organization/project navigation

---

### Phase 3: Board & Column Core

**Goal:** Users can create and manage Kanban boards with customizable columns.

**Requirements:** BOARD-01, BOARD-02, BOARD-03, BOARD-04, COL-01, COL-02, COL-03, COL-04

**What this phase delivers:**
- Board list within a project
- Board creation form (name)
- Board detail page showing columns
- Default columns: "To Do", "In Progress", "Done"
- Column management: add, rename, delete (empty only)
- Column ordering persisted
- Board rename and delete (with confirmation)

**Success criteria:**
1. User sees a list of boards within a project
2. User can create a new board and it appears in the list
3. Opening a board shows 3 default columns
4. User can add a new column
5. User can rename any column
6. User can delete an empty column
7. Column order persists after refresh
8. User can rename and delete a board with confirmation

**Canonical refs:**
- `.planning/research/PITFALLS.md` §1.4, 5.1

**UI hint:** yes — board layout is primary visual surface

---

### Phase 4: Card CRUD & Metadata

**Goal:** Users can create, edit, and manage task cards with rich metadata.

**Requirements:** CARD-01, CARD-02, CARD-03, CARD-04, CARD-05, CARD-06, CARD-07, CARD-08

**What this phase delivers:**
- Card creation within any column
- Card detail modal with full editing
- Card fields: title, description (Markdown), due date, priority, labels, assignee
- Card deletion with confirmation
- Cards display metadata compactly on board view
- Assignee dropdown (organization members)

**Success criteria:**
1. User can create a card in any column
2. User can click a card to edit all fields
3. User can delete a card with confirmation
4. Due date picker works and persists
5. Priority selector shows Low/Medium/High
6. Labels can be added/removed and display as colored badges
7. Card face shows priority, due date, labels, assignee
8. User can assign a card to any organization member

**Canonical refs:**
- `.planning/research/PITFALLS.md` §1.1

**UI hint:** yes — card design is central to Kanban UX

---

### Phase 5: Drag-and-Drop

**Goal:** Smooth, performant drag-and-drop for moving and reordering cards.

**Requirements:** DND-01, DND-02, DND-03, DND-04

**What this phase delivers:**
- @dnd-kit integration
- Cards draggable between columns
- Cards reorderable within a column
- Visual feedback during drag
- Optimistic UI updates with rollback
- Card positions persist after refresh
- Normalized state management

**Success criteria:**
1. User can drag a card from one column to another smoothly
2. User can reorder cards within a column
3. Visual feedback visible during drag
4. Card position persists after refresh
5. Failed moves roll back UI with error message
6. Dragging one card does not cause full-board re-render

**Canonical refs:**
- `.planning/research/PITFALLS.md` §1.1, 1.2, 1.3
- `.planning/research/STACK.md` §3

**UI hint:** yes — drag-and-drop is core interaction

---

### Phase 6: AI Assistant (Tambo AI)

**Goal:** AI chat sidebar that understands natural language and manipulates tasks.

**Requirements:** AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, AI-07, AI-08

**What this phase delivers:**
- Collapsible AI chat sidebar on board view
- Tambo AI integration with tool calling
- TamboProvider wrapping the app
- AI tools registered: moveCard, updateCardDueDate, createCard, assignCard
- Streaming chat UI
- Human-in-the-loop confirmation for destructive actions
- Project status Q&A capability

**Success criteria:**
1. User can open AI chat sidebar from any board
2. AI moves card when asked ("Move 'Fix bug' to Done")
3. AI changes due date when asked
4. AI creates card from natural language description
5. AI assigns card to team member when asked
6. AI asks for confirmation before destructive actions
7. AI responses stream in real-time
8. AI answers project status questions accurately

**Canonical refs:**
- `.planning/research/PITFALLS.md` §2.1, 2.2, 2.3, 2.5
- `.planning/research/STACK.md` §7 (Tambo AI)
- `.planning/research/ARCHITECTURE.md` §4.3, §5

**UI hint:** yes — chat sidebar design and AI interaction

---

### Phase 7: Real-Time Collaboration

**Goal:** Multi-user real-time synchronization via Supabase Realtime.

**Requirements:** RTC-01, RTC-02, RTC-03

**What this phase delivers:**
- Supabase Realtime subscriptions for boards, columns, cards
- Card moves sync in real-time across sessions
- New cards/columns appear instantly for all users
- Presence/awareness (optional: who is viewing)
- Conflict resolution for simultaneous edits

**Success criteria:**
1. Two users viewing same board see card moves within 1-2 seconds
2. New cards created by one user appear for others immediately
3. Column changes sync in real-time
4. No data loss when multiple users edit simultaneously

**Canonical refs:**
- `.planning/research/STACK.md` §6 (Supabase Realtime)

**UI hint:** no

---

### Phase 8: RBAC

**Goal:** Role-based access control for organizations and projects.

**Requirements:** RBAC-01, RBAC-02, RBAC-03, RBAC-04, RBAC-05

**What this phase delivers:**
- Roles: Owner, Admin, Member
- Permission matrix (who can do what)
- UI element visibility based on role
- API route protection based on role
- Organization ownership transfer

**Success criteria:**
1. Organization has Owner, Admin, Member roles
2. Owner can delete organization and manage all settings
3. Admin can create projects, invite members, manage boards
4. Member can create/edit cards and move tasks
5. UI hides actions user doesn't have permission for

**Canonical refs:**
- `.planning/research/ARCHITECTURE.md` §2.1

**UI hint:** no

---

### Phase 9: Vault (Env Manager)

**Goal:** Simple environment variable manager with versioning.

**Requirements:** VAULT-01, VAULT-02, VAULT-03, VAULT-04

**What this phase delivers:**
- Vault page per organization
- Add/edit/delete env variables (key-value)
- Version history (who changed what, when)
- Role-based access (only Owner/Admin)
- Project-scoped env variables

**Success criteria:**
1. Owner/Admin can add env variables to organization
2. Env variables show version history
3. Only Owner/Admin can view/edit vault
4. Env variables can be scoped to specific projects
5. Previous versions can be viewed (not necessarily restored in v1)

**Canonical refs:**
- `.planning/research/FEATURES.md` (vault as unique feature)

**UI hint:** yes — vault UI design

---

### Phase 10: Search, Filter & Polish

**Goal:** Users can find cards quickly and the app feels polished.

**Requirements:** SRCH-01..05, UI-01..05

**What this phase delivers:**
- Text search across card titles and descriptions
- Filter by priority, label, assignee
- Clear all filters
- Responsive layout (desktop + tablet)
- Loading skeletons and empty states
- Modern, cohesive visual design (Trello-like)
- Error boundaries
- Keyboard shortcuts (optional)

**Success criteria:**
1. Search box filters cards by title/description
2. Filter by priority/label/assignee works
3. Clear filters button resets all filters
4. App works on tablet without breaking
5. Empty states show friendly messages
6. Loading states show skeletons
7. Visual design is consistent and modern
8. UI feels intuitive like Trello

**Canonical refs:**
- `.planning/research/FEATURES.md` §1

**UI hint:** yes — final visual polish

---

## Dependency Graph

```
Phase 1: Setup & Auth
    │
    ▼
Phase 2: Organization & Project
    │
    ▼
Phase 3: Board & Column Core
    │
    ▼
Phase 4: Card CRUD & Metadata
    │
    ▼
Phase 5: Drag-and-Drop
    │
    ▼
Phase 6: AI Assistant (Tambo AI)
    │
    ▼
Phase 7: Real-Time Collaboration
    │
    ▼
Phase 8: RBAC
    │
    ▼
Phase 9: Vault (Env Manager)
    │
    ▼
Phase 10: Search, Filter & Polish
```

**Sequential by design:** Each phase builds on the previous. Auth → Org/Project → Board → Card → DnD → AI → Real-time → RBAC → Vault → Polish.

---

## Anti-Patterns to Avoid

1. **Don't over-engineer AI prompts** — Start simple with Tambo AI, iterate based on feedback
2. **Don't build custom backend** — Supabase covers all backend needs
3. **Don't skip RLS policies** — Critical for multi-user security
4. **Don't store sensitive data unencrypted** — Vault env variables need encryption at rest
5. **Don't ignore mobile viewport** — At least tablet-friendly required

---

*Roadmap created: 2025-04-28*  
*Next step: /gsd-discuss-phase 1*
