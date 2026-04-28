# Architecture: ZenTask

## 1. Overview

ZenTask is a **single-codebase Next.js full-stack application** that combines a Kanban board with an AI Assistant. The architecture follows a layered pattern within a single Next.js project, using Supabase as the managed backend (PostgreSQL + Auth + Realtime).

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Kanban Board │  │  AI Chat     │  │ Cmd+K Palette     │  │
│  │ (Zustand)    │  │  (useChat)   │  │ (cmdk)            │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘  │
│         │                 │                    │              │
├─────────┼─────────────────┼────────────────────┼──────────────┤
│         │          NEXT.JS APP ROUTER          │              │
│         ▼                 ▼                    ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Server       │  │ AI Route     │  │ Server Actions    │  │
│  │ Components   │  │ Handler      │  │ (CRUD mutations)  │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘  │
│         │                 │                    │              │
│         └─────────────────┼────────────────────┘              │
│                           ▼                                   │
│                  ┌──────────────────┐                         │
│                  │   SERVICE LAYER  │                         │
│                  └────────┬─────────┘                         │
│                           ▼                                   │
│                  ┌──────────────────┐                         │
│                  │  DATA ACCESS     │                         │
│                  │  (Supabase SDK)  │                         │
│                  └────────┬─────────┘                         │
├───────────────────────────┼───────────────────────────────────┤
│                           ▼                                   │
│                  ┌──────────────────┐                         │
│                  │    SUPABASE      │                         │
│                  │  PostgreSQL      │                         │
│                  │  Auth / Realtime │                         │
│                  └──────────────────┘                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Major System Components

### 2.1 Frontend (Browser)

| Component | Responsibility | Key Technology |
|-----------|---------------|----------------|
| **Kanban Board UI** | Render columns, cards, drag-drop, visual feedback | React Server + Client Components, shadcn/ui, Tailwind CSS |
| **AI Chat Panel** | Persistent sidebar chat with the AI Assistant | `useChat` hook (Vercel AI SDK), streaming token UI |
| **Command Palette** | Quick single-line AI commands (Cmd+K) | `cmdk`, Vercel AI SDK |
| **Auth UI** | Login, signup, profile forms | Supabase Auth UI helpers, shadcn/ui form components |
| **State Store** | Client-side state for board optimistic updates | Zustand (normalized store) |
| **Drag-Drop Engine** | Card/column reordering, cross-column moves | `@dnd-kit/core` |

### 2.2 Next.js Server (same repo)

| Component | Responsibility | Key Technology |
|-----------|---------------|----------------|
| **App Router Pages** | Route definitions, layout shells, server-side data fetching | Next.js App Router |
| **Server Components** | Fetch board/card data on server, pass to client | React Server Components (default) |
| **Server Actions** | Mutations: create/update/delete cards, columns, boards | Next.js Server Actions (inline with `"use server"`) |
| **AI Route Handler** | POST `/api/chat` — receives messages, streams AI response with tool calls | Vercel AI SDK `streamText()` |
| **Service Layer** (`src/services/`) | Business logic: WIP limit checks, task splitting, policy validation | Plain TypeScript modules |
| **Data Access** (`src/repositories/`) | Type-safe Supabase queries, Row-Level Security filtering | `@supabase/supabase-js` |
| **Auth Middleware** | Session validation, route protection | Supabase Auth helpers, Next.js middleware |

### 2.3 Database (Supabase PostgreSQL)

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `profiles` | User public data (linked to Supabase Auth) | `id (FK → auth.users)`, `email`, `full_name` |
| `projects` | Top-level container for a Kanban board | `id`, `name`, `owner_id` |
| `columns` | Kanban stages (To Do, In Progress, Done, etc.) | `id`, `project_id`, `title`, `order_index`, `wip_limit`, `exit_policy` |
| `tasks` | Work items (cards on the board) | `id`, `column_id`, `project_id`, `title`, `description`, `order_index`, `assignee_id`, `priority`, `end_date`, `metadata` |

> Full DDL defined in [zentask-database-schema.md](../../llm-wiki/wiki/engineering/zentask-database-schema.md).

### 2.4 AI Service

| Component | Responsibility | Key Technology |
|-----------|---------------|----------------|
| **LLM Provider** | Text generation, tool calling decisions | OpenAI GPT-4o / Anthropic Claude / Google Gemini (via Vercel AI SDK provider) |
| **Tool Definitions** | Typed functions the AI can call: `moveCard`, `updateTask`, `createTask`, `splitTask`, `queryBoard` | Zod schemas + `tool()` helper from AI SDK |
| **System Prompt** | Kanban domain context, board schema, column policies, user's current board state | Constructed server-side, injected per request |
| **Streaming** | Real-time token-by-token response to the chat UI | `streamText()` → `toUIMessageStreamResponse()` |

---

## 3. Component Boundaries & Communication

### Boundary Rules

```
BROWSER ←→ SERVER boundary:
  - Browser NEVER calls Supabase directly (no anon key in client for mutations)
  - Browser calls Server Actions for mutations (auto-serialized, CSRF-safe)
  - Browser calls Route Handlers for AI chat (streaming protocol)
  - Browser calls Supabase ONLY for read queries via authenticated RLS (optional optimization)

SERVER ←→ DATABASE boundary:
  - All writes go through Data Access layer (type-safe, RLS-respecting)
  - Service Layer enforces business rules before Data Access calls
  - Supabase admin key used server-side for operations the user shouldn't do directly

AI SERVICE boundary:
  - AI Route Handler is the ONLY entry point to the LLM
  - AI tools call Service Layer (same functions used by Server Actions)
  - AI NEVER accesses the database directly — always through Services
```

### Communication Matrix

| From → To | Mechanism | Direction |
|-----------|-----------|-----------|
| Kanban UI → Server | Server Actions (`action={createCard}`) | Client → Server |
| Kanban UI → Supabase (read) | `supabase.from("tasks").select()` via RLS | Client → Database (read-only) |
| Chat UI → AI Route | `useChat` → `fetch("/api/chat")` | Client → Server |
| AI Route → LLM | Vercel AI SDK (provider API) | Server → External API |
| LLM → AI Tool | Tool `execute()` function | AI → Server (callback) |
| AI Tool → Service | Direct function call | Internal |
| Service → Data Access | Direct function call | Internal |
| Data Access → Supabase | `supabase.from(...)` with service key | Server → Database |
| Supabase → UI (realtime) | Supabase Realtime channel (v2+) | Database → Client (when enabled) |

---

## 4. Data Flow

### 4.1 User Drags a Card (Manual Mutation)

```
1. User drags card from "To Do" to "In Progress"
2. @dnd-kit fires onDragEnd with card ID + target column
3. Zustand store: optimistic update (move card in local state immediately)
4. Zustand triggers Server Action: moveCard(cardId, targetColumnId, newOrderIndex)
5. Server Action → TaskService.moveCard()
6. TaskService.moveCard():
   a. Validate user owns the board
   b. Check WIP limit on target column → if exceeded, return warning (soft enforcement)
   c. Call TaskRepository.updateCardColumn()
7. TaskRepository.updateCardColumn() → supabase.from("tasks").update(...)
8. Return result to Server Action → Return to Client
9. On success: Zustand confirms optimistic state (no change needed)
10. On failure: Zustand rolls back to original state
11. Toast notification: "Card moved" or "WIP limit warning: column has 5/3 tasks"
```

### 4.2 User Sends AI Chat Message (AI Mutation)

```
1. User types "Move the login bug to In Progress" in chat sidebar
2. useChat hook sends messages array to POST /api/chat
3. Route Handler receives { messages }
4. Constructs system prompt with:
   - Current board structure (columns, their IDs, WIP limits, policies)
   - Kanban domain context
   - Available tool descriptions
5. Calls streamText({ model, system, messages, tools })
6. LLM analyzes intent → returns tool call: moveCard({ cardId: "...", targetColumnId: "..." })
7. AI SDK automatically invokes tool's execute() function:
   - Calls TaskService.moveCard() (same service as manual mutation)
   - TaskService returns result (success + warning if WIP exceeded)
8. AI SDK feeds tool result back to LLM
9. LLM generates natural language response: "Done! Moved the login bug to In Progress."
10. Response streams token-by-token back to chat UI
11. Chat UI renders streaming tokens in real-time
12. After stream completes, chat UI triggers board refetch/revalidate to show the change
```

### 4.3 Read Flow (Board Loading)

```
1. User navigates to /board/[projectId]
2. Server Component fetches board data on server:
   → ProjectRepository.getProjectWithColumns()
   → TaskRepository.getTasksByProject()
3. Data passed as props to Client Component tree
4. Zustand store hydrated with server data (initial state)
5. Client renders board: columns → cards, each in correct order
6. Optional: Supabase Realtime subscription for live updates (v2+)
```

---

## 5. State Management — Kanban Board

### Why Zustand?

The kanban board has **high-frequency drag-drop updates** where rendering performance matters. Zustand with **normalized state + selective subscriptions** outperforms React Context or `useReducer`:

- **Normalized state**: Columns and cards stored as flat maps by ID (not nested objects inside columns). A card move only touches two keys (`columnId` on the card, `cardIds` array on source/target columns) — no cascading updates.
- **Selective subscriptions**: Components subscribe to only the slice they need. A card component subscribes to `cards[id]` — when another card moves, this card does NOT re-render.
- **React.memo compatible**: Because Zustand subscriptions bypass prop drilling, `React.memo` works naturally on `KanbanCard` and `KanbanColumn`.

### Store Shape

```typescript
// Normalized board state
interface BoardState {
  // Data
  columns: Record<string, Column>;    // columnId → Column
  cards: Record<string, Task>;        // cardId → Task
  
  // Ordering (array of IDs per column)
  columnOrder: string[];              // ordered column IDs
  cardOrder: Record<string, string[]>; // columnId → ordered card IDs
  
  // UI state
  isSyncing: boolean;                 // true while server action is pending
  selectedCardId: string | null;      // currently selected card (for detail panel)
  
  // Optimistic operations
  undoStack: BoardPatch[];            // for undo functionality
  
  // Actions
  moveCard: (cardId: string, toColumnId: string, toIndex: number) => void;
  updateCard: (cardId: string, updates: Partial<Task>) => void;
  deleteCard: (cardId: string) => void;
  // ...
}
```

### Server State vs. Client State

| What | Where | Why |
|------|-------|-----|
| Board data (cols, cards) | Zustand | Optimistic UI for drag-drop |
| Auth session | Supabase Auth context | Built-in, server-safe |
| AI chat messages | `useChat` internal state | Managed by Vercel AI SDK |
| Command palette open | Zustand UI slice | Global keyboard shortcut (Cmd+K) |
| Card detail modal | Zustand UI slice | Global, accessible from anywhere |
| Route params (projectId) | Next.js `useParams()` | URL-driven, shareable |

---

## 6. AI Integration Architecture

### Design Principle: AI as an Alternative Input Channel

The AI Assistant is **not a separate system** — it's an alternative way to invoke the same mutations that the UI triggers. This means:

- AI tools call the **exact same Service Layer functions** as Server Actions
- All business rules (WIP limits, validation) apply regardless of whether a human or AI performs the action
- Human-in-the-loop for destructive operations (task splitting shows preview before commit)

### Tool Definitions (Server-Side)

```typescript
// src/services/ai/tools.ts
import { tool } from "ai";
import { z } from "zod";
import { TaskService } from "@/services/task-service";

export const boardTools = {
  moveCard: tool({
    description: "Move a task card to a different column",
    inputSchema: z.object({
      cardId: z.string().describe("The UUID of the task card to move"),
      targetColumnId: z.string().describe("The UUID of the destination column"),
      targetIndex: z.number().optional().describe("Position within column (0 = top)"),
    }),
    execute: async ({ cardId, targetColumnId, targetIndex }, { session }) => {
      return TaskService.moveCard(session.user.id, cardId, targetColumnId, targetIndex);
    },
  }),
  
  updateTask: tool({
    description: "Update task properties: title, description, priority, end date, or assignee",
    inputSchema: z.object({
      cardId: z.string().describe("The UUID of the task card"),
      title: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      endDate: z.string().optional().describe("ISO 8601 date string"),
    }),
    execute: async (updates, { session }) => {
      return TaskService.updateTask(session.user.id, updates.cardId, updates);
    },
  }),
  
  createTask: tool({
    description: "Create a new task card in a specific column",
    inputSchema: z.object({
      columnId: z.string().describe("The UUID of the column to add the task to"),
      title: z.string().describe("The title of the new task"),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    }),
    execute: async (input, { session }) => {
      return TaskService.createTask(session.user.id, input);
    },
  }),
  
  splitTask: tool({
    description: "Break a large task into smaller sub-tasks. Returns proposed sub-tasks for user approval.",
    inputSchema: z.object({
      cardId: z.string().describe("The UUID of the task to split"),
      numSubtasks: z.number().optional().describe("Suggested number of sub-tasks (default: AI decides)"),
    }),
    execute: async ({ cardId, numSubtasks }, { session }) => {
      // Returns preview — requires human confirmation before committing
      return TaskService.previewSplit(session.user.id, cardId, numSubtasks);
    },
  }),
  
  queryBoard: tool({
    description: "Query the board for information: bottlenecks, overdue tasks, team load, etc.",
    inputSchema: z.object({
      query: z.string().describe("Natural language query about the board"),
    }),
    execute: async ({ query }, { session }) => {
      return TaskService.queryBoard(session.user.id, query);
    },
  }),
};
```

### Chat Route Handler

```typescript
// src/app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { boardTools } from "@/services/ai/tools";
import { buildSystemPrompt } from "@/services/ai/system-prompt";

export async function POST(req: Request) {
  const session = await getSession(); // Supabase auth
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: await buildSystemPrompt(session.user.id), // includes board context
    messages,
    tools: boardTools,
    maxSteps: 5, // allow multi-step reasoning (tool → response → tool → ...)
  });

  return result.toUIMessageStreamResponse();
}
```

### System Prompt Strategy

The system prompt is dynamically constructed each request to include:

1. **Static domain context**: Kanban principles, available operations, response style
2. **Current board state**: Column names + IDs, WIP limits, card counts per column
3. **User context**: User name, current project name
4. **Tool schemas**: Automatically injected by AI SDK (no need to manually include)

This keeps the LLM grounded in the actual board state without requiring it to query the database through tools first (reducing latency for common operations).

### Chat UI Component

```typescript
// src/components/ai/chat-panel.tsx
"use client";
import { useChat } from "@ai-sdk/react";

export function ChatPanel({ projectId }: { projectId: string }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: { projectId }, // sent with each request
    onFinish: () => {
      // After AI finishes, revalidate board to show mutations
      revalidateBoard(projectId);
    },
  });

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} />
      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

### Human-in-the-Loop Pattern for Destructive Operations

```
For operations like "split task":

1. AI calls splitTask tool → returns { status: "preview", subtasks: [...] }
2. Tool result is NOT committed to DB yet — it's a preview
3. AI generates response: "I've prepared 3 sub-tasks. Review and confirm to create them."
4. Chat UI renders preview cards with "Approve" / "Edit" / "Cancel" buttons
5. User clicks "Approve" → client calls Server Action: approveSplit(splitId, subtasks)
6. Only then are the sub-tasks written to the database
```

---

## 7. Directory Structure

```
zentask/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Route group: login, signup
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/              # Route group: authenticated pages
│   │   │   ├── layout.tsx            # Sidebar + auth guard
│   │   │   ├── page.tsx              # Project list
│   │   │   ├── board/
│   │   │   │   └── [projectId]/
│   │   │   │       ├── page.tsx      # Kanban board (Server Component)
│   │   │   │       └── _components/  # Colocated client components
│   │   │   │           ├── board-view.tsx
│   │   │   │           ├── kanban-column.tsx
│   │   │   │           ├── kanban-card.tsx
│   │   │   │           └── board-store.ts  # Zustand store
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # AI chat streaming endpoint
│   │   └── layout.tsx                # Root layout
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── ai/                       # AI-specific components
│   │   │   ├── chat-panel.tsx
│   │   │   ├── chat-messages.tsx
│   │   │   ├── command-palette.tsx
│   │   │   └── tool-preview-card.tsx
│   │   └── board/                    # Reusable board components
│   │       ├── card-detail-sheet.tsx
│   │       └── wip-limit-badge.tsx
│   │
│   ├── services/                     # Business logic (service layer)
│   │   ├── task-service.ts           # Card CRUD, move, split logic
│   │   ├── column-service.ts         # Column CRUD, reorder
│   │   ├── project-service.ts        # Project CRUD
│   │   └── ai/
│   │       ├── tools.ts              # AI tool definitions
│   │       └── system-prompt.ts      # Dynamic system prompt builder
│   │
│   ├── repositories/                 # Data access layer
│   │   ├── task-repository.ts        # Supabase queries for tasks
│   │   ├── column-repository.ts      # Supabase queries for columns
│   │   └── project-repository.ts     # Supabase queries for projects
│   │
│   ├── lib/                          # Infrastructure
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client (RLS, anon key)
│   │   │   ├── server.ts             # Server client (service role)
│   │   │   └── admin.ts              # Admin client (full access)
│   │   ├── auth.ts                   # Auth helpers, session getter
│   │   └── ai.ts                     # AI SDK provider config
│   │
│   ├── types/                        # Shared TypeScript types
│   │   ├── board.ts                  # Column, Task, Project types
│   │   ├── ai.ts                     # Tool input/output types
│   │   └── database.ts              # Generated Supabase types
│   │
│   └── middleware.ts                 # Auth guard, route protection
│
├── supabase/
│   └── migrations/                   # Database migrations (SQL)
│
├── .planning/                        # GSD workflow artifacts
├── llm-wiki/                         # Knowledge base
├── package.json
└── next.config.ts
```

---

## 8. Suggested Build Order

Dependencies between components determine the build order. Each phase depends on the previous.

### Phase 1: Foundation — Database & Auth

**What**: Supabase project setup, run database migrations, configure auth.

**Why first**: Everything depends on having a database and authentication.

**Deliverables**:
- Supabase project provisioned
- Auth configured (email/password)
- Database schema migrated (profiles, projects, columns, tasks)
- Row-Level Security policies
- `src/lib/supabase/` clients (browser, server, admin)
- `src/middleware.ts` (auth guard)

**Depends on**: Nothing

---

### Phase 2: Data Access & Services

**What**: Repository pattern for type-safe database queries, service layer for business logic.

**Why second**: The UI and AI both call into this layer. It's the shared foundation for all features.

**Deliverables**:
- `src/repositories/` — CRUD operations for all entities
- `src/services/` — Business logic (WIP checking, ordering, validation)
- `src/types/` — Shared TypeScript types
- Server Actions for all mutations (used by UI)

**Depends on**: Phase 1 (Database & Auth)

---

### Phase 3: Project & Board Scaffold

**What**: Basic pages, layouts, project listing, empty board view.

**Why third**: Need the shell before filling it with cards and drag-drop.

**Deliverables**:
- Dashboard layout with sidebar
- Project list page (create, delete projects)
- Board page shell (columns displayed, empty state)
- Basic card creation (no drag-drop yet)
- Auth pages (login/signup)

**Depends on**: Phase 2 (Data Access & Services)

---

### Phase 4: Kanban Board — Full Interaction

**What**: Drag-drop, card editing, column management, WIP limits display.

**Why fourth**: This is the core UX. Builds on the scaffold from Phase 3.

**Deliverables**:
- Zustand store for board state
- `@dnd-kit` drag-drop: card moves, column reorder
- Card detail sheet/drawer (edit title, description, priority, date, assignee)
- Column CRUD (add, rename, delete, set WIP limit, set exit policy)
- WIP limit badge + soft enforcement toast
- Optimistic updates + rollback on failure

**Depends on**: Phase 3 (Board Scaffold)

---

### Phase 5: AI Assistant — Chat & Tools

**What**: AI chat endpoint, tool definitions, streaming UI.

**Why fifth**: AI enhances the core board but is not a blocker for Phase 4.

**Deliverables**:
- `/api/chat` Route Handler (streaming)
- `src/services/ai/tools.ts` — all AI tool definitions
- `src/services/ai/system-prompt.ts` — dynamic system prompt
- Chat panel component (sidebar)
- `useChat` integration with streaming token display
- Tool confirmation UI (for split/preview operations)
- Revalidation trigger after AI mutations

**Depends on**: Phase 4 (Kanban Board) — AI tools call the same services

---

### Phase 6: Command Palette & Polish

**What**: Cmd+K quick commands, keyboard shortcuts, animations, dark mode refinement.

**Why last**: Quality-of-life features that make the app feel premium.

**Deliverables**:
- Command palette (`cmdk`) with AI quick commands
- Keyboard shortcuts for common operations
- Micro-animations (card transitions, drag feedback)
- Dark mode polish (glassmorphism, consistent tokens)
- Undo functionality from Zustand undo stack
- Mobile-responsive adjustments

**Depends on**: Phase 5 (AI Assistant)

---

### Dependency Graph

```
Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4
  (DB)       (Services)   (Shell)     (Kanban)
                                          │
                                          ├──→ Phase 5 (AI)
                                          │
                                          └──→ Phase 6 (Polish)
```

---

## 9. Key Architectural Decisions

### Decision 1: Server Actions over REST for Mutations

**Choice**: Use Next.js Server Actions for all CRUD mutations (create/update/delete cards, columns, projects).

**Rationale**:
- No need to manually create and document REST endpoints
- Automatic CSRF protection (Next.js built-in)
- Type-safe with React form actions
- Co-locatable with the components that call them
- Works with `revalidatePath()` / `revalidateTag()` for cache invalidation

**Trade-off**: Server Actions are React-specific. If a mobile app or external client needs access later, extract the Service Layer into Route Handlers (the Service/Repository layers are already shared).

### Decision 2: Zustand over React Context for Board State

**Choice**: Zustand with normalized state and selective subscriptions.

**Rationale**:
- Drag-drop causes frequent state changes — Context triggers render cascades
- Zustand's selector pattern means only the moved card/column re-renders
- Works with `React.memo` without fighting prop drilling
- Undo stack is trivial to implement with middleware

**Trade-off**: Adds a dependency. For a board this small, `useReducer` would work, but Zustand is only ~1KB and the performance difference is real for drag-drop UX.

### Decision 3: AI Tools Share Service Layer

**Choice**: AI tool `execute()` functions call the same `TaskService` / `ColumnService` as Server Actions.

**Rationale**:
- Single source of truth for business logic (WIP limits, validation)
- No code duplication between human and AI operations
- If a rule changes, it applies everywhere automatically
- Easier to test — test the service, not each tool

**Trade-off**: Service functions must be context-aware (user ID, session). This is handled by passing session from the AI Route Handler into tool execution context.

### Decision 4: Read from Supabase Client-Side (RLS Only)

**Choice**: Allow direct `supabase.from("tasks").select()` calls from the browser for read operations, using Row-Level Security to scope data to the authenticated user.

**Rationale**:
- Reduces load on Next.js server (no need to proxy reads)
- Supabase Realtime subscriptions work natively from the client
- RLS policies ensure users only see their own data

**Trade-off**: Requires careful RLS policy design. All writes still go through Server Actions (never directly from client). This is the Supabase-recommended pattern for Next.js apps.

---

## 10. Cross-Cutting Concerns

### Error Handling

| Layer | Strategy |
|-------|----------|
| **Data Access** | Throw typed errors (`NotFoundError`, `UnauthorizedError`, `ValidationError`) |
| **Service** | Catch repository errors, add context, re-throw or convert to user-facing messages |
| **Server Actions** | Catch service errors, return `{ error: string }` (never throw to client) |
| **AI Tools** | Catch service errors, return descriptive error messages for LLM to explain to user |
| **UI** | Show toast notifications for errors, optimistic rollback on mutation failure |

### Authentication Flow

```
1. User signs up / logs in via Supabase Auth (email/password or OAuth)
2. Supabase sets session cookie (server-side) + stores token in localStorage (client-side)
3. Next.js middleware reads session cookie → allows/redirects
4. Server Components call supabase.auth.getSession() to get user
5. Server Actions call getSession() internally (no need to pass user ID from client)
6. AI Route Handler calls getSession() to identify user and scope tool operations
```

### Security

- **Row-Level Security (RLS)**: All tables have RLS policies that scope rows to `auth.uid()`
- **Server Actions**: Automatically CSRF-protected by Next.js
- **AI Route Handler**: Session-validated; AI tools operate as the authenticated user
- **Service Role Key**: Never exposed to client; used only in `src/lib/supabase/server.ts`
- **AI API Key**: Stored in environment variables only; never sent to browser

---

## 11. Technology Choices Summary

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | Next.js 15+ (App Router) | Full-stack, Server Components, single codebase |
| Styling | Tailwind CSS + shadcn/ui | Design system consistency, dark mode built-in |
| Database | Supabase PostgreSQL | Managed, free tier, built-in Auth + Realtime |
| Auth | Supabase Auth | Integrated with database RLS, session management |
| Drag-Drop | `@dnd-kit/core` | Accessible, touch-friendly, React-native API |
| State Mgmt | Zustand | Tiny, selective subscriptions, undo middleware |
| AI SDK | Vercel AI SDK (`ai` + `@ai-sdk/openai`) | Streaming, tool calling, multi-provider support |
| LLM | OpenAI GPT-4o (default) | Reliable tool calling, fast streaming |
| Command Palette | `cmdk` | Accessible, keyboard-first, composable |
| Forms | React Hook Form + Zod | Server Action compatible, type-safe validation |
| Deployment | Vercel (recommended) | Zero-config Next.js, Edge Functions for AI route |

---

## 12. Open Questions / Future Considerations

| Question | Status | Notes |
|----------|--------|-------|
| Multi-user collaboration (v2) | Out of scope v1 | Supabase Realtime + operational transform |
| AI model fallback | Future | If primary LLM fails, fall back to alternative provider |
| AI tool approval store | Phase 5 design | Where to store pending tool approvals (server-side cache vs DB) |
| Mobile PWA support | Future | Next.js PWA plugin, offline-first with service worker |
| Caching strategy | Phase 3 decision | Next.js `unstable_cache` vs React `cache()` for board data |

---

*Last updated: 2026-04-28*
