# ZenTask Feature Research

> **Status:** Research Complete  
> **Last Updated:** 2026-04-28  
> **Reference:** [PROJECT.md](../PROJECT.md) — Core value: Kanban PM + AI Assistant differentiator for individuals & small teams

---

## Research Methodology

Feature landscape was analyzed across existing tools (Trello, Jira, Linear, Asana, ClickUp, Plane, Focalboard, Taiga, Taskosaur, Wrike) and AI-capable PM tools (ClickUp Brain, Linear AI, Wrike Copilot, Asana AI Studio, Taskosaur AI Mode). Features were classified by competitive landscape analysis, v1 viability assessment, and alignment with ZenTask's core value proposition: **"AI-powered Kanban that reduces manual operations."**

---

## 1. Table Stakes (Must-Have — Users Will Leave Without These)

These are non-negotiable features every Kanban PM tool must have. Without them, the product fails the "is this usable?" test immediately.

| # | Feature | Description | Complexity | Dependencies |
|---|---------|-------------|------------|--------------|
| 1.1 | **Board Creation & Management** | Users can create, rename, delete multiple Kanban boards. Each board represents a project or workspace. | Low | Auth (1.5) |
| 1.2 | **Columns / Lists** | Boards contain columns representing workflow stages (e.g., To Do → In Progress → Done). Users can add, rename, reorder, delete columns. Default 3 columns on new board. | Low | Board (1.1) |
| 1.3 | **Card Creation & CRUD** | Cards (tasks) with title, description (Markdown), and metadata. Full create/read/update/delete lifecycle. | Medium | Board (1.1), Columns (1.2) |
| 1.4 | **Drag-and-Drop** | Smooth drag-and-drop to move cards between columns, reorder within columns. Visual feedback (ghosting, drop indicators). | Medium | Cards (1.3), Columns (1.2) |
| 1.5 | **User Authentication** | Email/password sign-up, login, session management. Password reset. (OAuth providers in v1.5+) | Medium | Database, User model |
| 1.6 | **Card Metadata** | Due dates, priority levels (Low/Medium/High/Critical), labels/tags, assignee. Displayed on card face in compact form. | Low | Cards (1.3) |
| 1.7 | **Comments** | Users can add comments on cards for discussion and context. Plain text + Markdown. Timestamped, editable, deletable. | Low | Cards (1.3), Auth (1.5) |
| 1.8 | **Filter & Search** | Basic text search across card titles and descriptions. Filter by label, priority, assignee, due date range. | Medium | Cards (1.3), Card Metadata (1.6) |
| 1.9 | **Responsive Design** | The app works on desktop and tablet. Mobile-friendly (not native app). Fluid layout, touch-friendly drag-drop. | Medium | UI Framework |
| 1.10 | **Board Settings** | Per-board settings: name, description, background color/image, column order. Card default visibility options. | Low | Board (1.1) |

### Table Stakes Summary

- **Total: 10 features**
- **Complexity Range: Low–Medium**
- **MVP Dependency Chain:** Auth → Board → Columns → Cards → Metadata → DnD → Comments → Filter → Responsive → Settings
- **Build Order Hint:** Start with Auth + Board + Columns (foundation), then Cards + DnD (core UX), then everything else.

> **Why these are table stakes:** Every major Kanban tool (Trello, Asana, ClickUp, Focalboard) ships these. A Kanban board without drag-and-drop, or one without search, is considered broken. Users coming from Trello/Asana will immediately notice missing items in this list.

---

## 2. AI Assistant Features (Key Differentiator)

The AI Assistant is what makes ZenTask different. Instead of being a passive add-on button, the AI is integrated as a **chat-based co-pilot** that can both answer questions and take action on the user's behalf.

### 2.1 Core AI Capabilities

| # | Feature | Description | Complexity | Dependencies |
|---|---------|-------------|------------|--------------|
| 2.1.1 | **Natural Language Task Manipulation** | User can tell the AI: *"Move 'Fix login bug' to In Progress"*, *"Change the deadline on 'API docs' to next Friday"*, *"Assign the marketing task to me"*. AI parses intent and performs the action via API. | **High** | Cards (1.3), Card Metadata (1.6), LLM API, Action Execution Engine |
| 2.1.2 | **AI Task Creation** | User describes a task in natural language: *"Create a task for updating the onboarding flow with screenshots, due next Wednesday, high priority"*. AI extracts structured data (title, description, due date, priority) and creates the card. | **High** | Cards (1.3), LLM API |
| 2.1.3 | **Project Status Q&A** | User asks: *"What's overdue?"*, *"How many tasks are in review?"*, *"Who has the most assigned work?"*. AI queries the board state and answers in natural language. | **High** | Cards (1.3), Card Metadata (1.6), LLM API, Board State Query Engine |
| 2.1.4 | **Smart Priority Suggestions** | When user creates or edits a task, AI analyzes title, description, and existing workload to suggest a priority level. Optional: the user can accept or override. | Medium | Cards (1.3), LLM API |
| 2.1.5 | **Task Summarization** | On demand, AI summarizes a card's comments, description, and activity into a concise status update. Useful for catching up on long-running tasks. | Medium | Cards (1.3), Comments (1.7), LLM API |

### 2.2 AI UX & Interaction

| # | Feature | Description | Complexity | Dependencies |
|---|---------|-------------|------------|--------------|
| 2.2.1 | **Chat Sidebar** | Persistent chat panel (toggleable) where user interacts with AI. Conversation history preserved per session. Clear distinction between informational responses and action confirmations. | Medium | AI Core (2.1.x), UI Framework |
| 2.2.2 | **Action Confirmation** | When AI wants to perform an action (move card, change date, create task), it shows a confirmation card with the proposed change. User approves or rejects. **No silent mutations.** | Low | Chat Sidebar (2.2.1), AI Core (2.1.x) |
| 2.2.3 | **Context-Aware Suggestions** | While viewing a card, AI surfaces relevant suggestions: *"This task has been in review for 5 days — want me to flag it?"* or *"3 similar tasks were completed last week"*. | Medium | AI Core (2.1.x), Cards (1.3) |
| 2.2.4 | **Error & Edge Case Handling** | Graceful handling when AI cannot parse a request: *"I'm not sure what you mean by that. Did you want to create a task or move an existing one?"* Clear error boundaries, rate limiting, fallback prompts. | Medium | LLM API |

### 2.3 AI Technical Considerations

| # | Consideration | Notes |
|---|---------------|-------|
| 2.3.1 | **LLM Provider** | Primary: OpenAI (GPT-4o-mini for cost efficiency). Fallback: Anthropic Claude. Use structured output / function calling for action extraction. |
| 2.3.2 | **Prompt Engineering** | System prompt defines ZenTask's schema (boards, columns, cards, fields). Strict output format for actions. Few-shot examples for task creation, date parsing, priority inference. |
| 2.3.3 | **Latency & UX** | Streaming responses for chat. Optimistic UI updates for confirmed actions. Loading skeleton during AI processing. Target: < 3s for simple queries, < 8s for complex actions. |
| 2.3.4 | **Cost Management** | Rate limiting per user. Cache common board-state queries (30s TTL). Use cheaper model for classification/intent detection, premium model for complex reasoning. |
| 2.3.5 | **Privacy & Safety** | All AI prompts include only board/card data — no PII beyond username. Action whitelist (AI can only do: move, create, update metadata, answer queries). Audit log for AI actions. |

### AI Features Summary

- **Total: 9 features** (5 core + 4 UX/tech)
- **Complexity Range: Medium–High**
- **Critical Path:** AI Core (2.1.1 + 2.1.2 + 2.1.3) → Chat Sidebar → Action Confirmation → Suggestions
- **The Big Bet:** Natural language task manipulation (2.1.1) and Project Status Q&A (2.1.3) are the **primary differentiators**. If these deliver a genuinely useful experience, ZenTask has a defensible position vs. Trello/Asana/Linear.

> **Why AI is the differentiator:** Current Kanban tools bolt AI on as an afterthought — a "generate summary" button or basic auto-triage. ZenTask's AI is an **agent**: it reasons about board state, takes action, and provides conversational Q&A. This transforms the interaction model from "click through UI" to "just say what you want."

---

## 3. Nice-to-Have Enhancements (v1.5–v2)

Features that enhance the core experience but are not critical for launch. These are candidates for post-v1 iteration based on user feedback.

| # | Feature | Description | Complexity | Target Version |
|---|---------|-------------|------------|----------------|
| 3.1 | **OAuth Login** | Google, GitHub login options in addition to email/password. | Low | v1.5 |
| 3.2 | **Multi-Board Views** | View cards from multiple boards in a single filtered view (cross-project dashboard). | Medium | v2 |
| 3.3 | **Card Attachments** | Upload files/images to cards. Local storage or S3-backed. | Low | v1.5 |
| 3.4 | **Due Date Reminders** | In-app notification when a task is approaching or past its due date. | Low | v1.5 |
| 3.5 | **Templates** | Pre-built board templates (Bug Tracker, Content Calendar, Sprint Board). | Medium | v2 |
| 3.6 | **Keyboard Shortcuts** | Power-user keyboard shortcuts for common actions (navigate cards, quick-create, move). | Medium | v2 |
| 3.7 | **AI Daily Digest** | AI generates an end-of-day summary: *"Today you completed 3 tasks. 2 are still in progress. 1 overdue."* | Medium | v2 |
| 3.8 | **AI Workflow Suggestions** | AI analyzes board patterns and suggests column optimizations: *"You rarely use the 'Testing' column — consider merging it into Review."* | Medium | v2 |
| 3.9 | **Dark/Light Theme** | Toggle-able visual theme support. | Low | v1.5 |
| 3.10 | **Export/Import** | Export board as JSON/CSV. Import from Trello JSON export. | Medium | v2 |

---

## 4. Anti-Features (Deliberately NOT in Scope)

These are features that are commonly requested or present in full PM suites, but are **explicitly excluded** from ZenTask's scope. Including them would dilute the core value proposition, explode v1 complexity, and likely not serve the target user (individuals/small teams seeking simplicity).

### 4.1 Excluded — Never in Scope

| # | Anti-Feature | Why Excluded | What Users Should Use Instead |
|---|--------------|--------------|-------------------------------|
| 4.1.1 | **Gantt Charts / Timeline Views** | Complex scheduling that competes against Kanban simplicity. Adds significant UI complexity for little gain in single-user/small-team context. | Jira, Asana Timeline, MS Project |
| 4.1.2 | **Time Tracking** | Requires timer UIs, reporting, billable hours logic. Adds legal/compliance risks if used for payroll. Distracts from Kanban flow. | Toggl, Harvest, Clockify |
| 4.1.3 | **Resource Allocation / Workload Management** | Capacity planning, percentage allocation, workload heatmaps. Requires organizational hierarchy data. Enterprise feature, not for small teams. | Monday.com, Wrike, Resource Guru |
| 4.1.4 | **Real-Time Multi-User Collaboration (WebSockets)** | WebSocket infrastructure, conflict resolution, presence indicators. Massive complexity spike. v1 is single-user or simple multi-user with polling. | Linear, Notion, Figma |
| 4.1.5 | **Native Mobile App** | Native iOS/Android doubles the codebase and maintenance burden. Web responsive covers 90% of mobile use cases for v1. | Trello Mobile, Asana Mobile |
| 4.1.6 | **Email Notifications** | Email infrastructure, template management, unsubscribe flows, spam compliance (CAN-SPAM, GDPR). Major ops overhead for marginal v1 benefit. | In-app notifications only |
| 4.1.7 | **Calendar Integration (Google/Outlook)** | OAuth scope management, sync conflict resolution, two-way sync logic. High integration complexity. | Manual due dates on cards |

### 4.2 Excluded for v1 — Revisit in v2+

| # | Anti-Feature | Why Excluded for v1 | Revisit Criteria |
|---|--------------|---------------------|------------------|
| 4.2.1 | **Sprint / Scrum Planning** | Velocity tracking, burndown charts, story points, sprint ceremonies. These are Scrum-specific, not Kanban. Adding them would dilute the Kanban identity. | If user demand is overwhelming and doesn't conflict with Kanban simplicity |
| 4.2.2 | **Custom Workflow Engine** | Conditional transitions, post-functions, validators, custom status lifecycles (Jira-style). Turns a simple Kanban into an enterprise workflow tool. Anti-Kanban philosophy. | Only if enterprise segment becomes target (unlikely for ZenTask) |
| 4.2.3 | **Analytics Dashboards** | Cumulative flow diagrams, cycle time, throughput charts, lead time distribution. Valuable but requires significant data collection over time to be useful. Premature in v1. | After 6+ months of usage data exists |
| 4.2.4 | **WIP Limits (Hard Enforcement)** | True Kanban WIP limits that block card movement when exceeded. Adds complexity to drag-and-drop logic. Soft warnings via AI are a better v1 approach. | If users demonstrate need for flow constraint enforcement |
| 4.2.5 | **Permissions & Roles (RBAC)** | Admin/Editor/Viewer roles, board-level permissions, team management. Premature for single-user/small-team v1. Simple "board owner" suffices. | When multi-user collaboration goes beyond 5 people |
| 4.2.6 | **Integration Marketplace / Power-Ups** | Plugin architecture with third-party integrations. Requires stable API, documentation, developer portal, sandbox. Massive scope. | After stable public API exists (v2+) |
| 4.2.7 | **Goal Tracking / OKRs** | Alignment of tasks to strategic goals, progress tracking, KPI dashboards. Different product category entirely. | Only if product pivots to strategy-execution alignment |

### Anti-Features Summary

- **Never: 7 items** — These fundamentally conflict with ZenTask's identity as a simple, AI-powered Kanban tool.
- **Revisit v2+: 7 items** — Potentially valuable but premature. User feedback will determine which (if any) to build.

> **The discipline:** Saying "no" is harder than saying "yes." Every anti-feature here has passionate advocates who would argue for its inclusion. But each one would add weeks/months to v1 development, complexity that slows iteration, and UI surface area that dilutes the core Kanban+AI experience.

---

## 5. Feature Dependency Graph (Simplified)

```
Auth (1.5)
  └── Board (1.1)
        └── Columns (1.2)
              └── Cards (1.3)
                    ├── Card Metadata (1.6) ──┬── Filter & Search (1.8)
                    ├── Comments (1.7)        ├── Drag-and-Drop (1.4)
                    └── [AI Core] ────────────┬── NL Task Manipulation (2.1.1)
                                              ├── AI Task Creation (2.1.2)
                                              ├── Status Q&A (2.1.3)
                                              ├── Priority Suggestions (2.1.4)
                                              └── Task Summarization (2.1.5)
                                                    └── Chat Sidebar (2.2.1)
                                                          └── Action Confirmation (2.2.2)
```

### Recommended Build Phases

| Phase | Features | Est. Effort | Deliverable |
|-------|----------|-------------|-------------|
| **Phase 0: Foundation** | Auth (1.5), Board (1.1), Columns (1.2), Cards (1.3) | 1-2 weeks | Users can create boards, columns, and cards (static, no DnD) |
| **Phase 1: Core Kanban** | DnD (1.4), Card Metadata (1.6), Comments (1.7), Board Settings (1.10) | 1-2 weeks | Fully functional Kanban board with drag-and-drop |
| **Phase 2: Polish** | Filter/Search (1.8), Responsive (1.9) | 1 week | Usable, searchable, mobile-friendly Kanban |
| **Phase 3: AI MVP** | Chat Sidebar (2.2.1), Action Confirmation (2.2.2), NL Task Manipulation (2.1.1) | 2-3 weeks | AI can move cards and change dates via chat |
| **Phase 4: AI Extended** | AI Task Creation (2.1.2), Status Q&A (2.1.3), Priority Suggestions (2.1.4) | 2-3 weeks | AI as full co-pilot — create, query, suggest |
| **Phase 5: AI Polish** | Task Summarization (2.1.5), Context-Aware Suggestions (2.2.3), Error Handling (2.2.4) | 1-2 weeks | Production-quality AI experience |

---

## 6. Competitive Landscape (Feature-Level)

| Feature | Trello | Asana | Linear | ClickUp | Jira | **ZenTask Target** |
|---------|--------|-------|--------|---------|------|-------------------|
| Kanban Board | ✅ | ✅ Board view | ✅ | ✅ (1 of 15 views) | ✅ | ✅ Core |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Core |
| AI Task Creation | ❌ | ✅ (limited) | ✅ (triage) | ✅ Brain | ✅ (Atlassian Int.) | ✅ **Differentiator** |
| AI Natural Language Actions | ❌ | ❌ | ❌ | ⚠️ Partial | ❌ | ✅ **Primary Differentiator** |
| AI Status Q&A | ❌ | ❌ | ❌ | ✅ (ask anything) | ❌ | ✅ **Primary Differentiator** |
| Gantt/Timeline | ⚠️ Power-Up | ✅ Timeline | ✅ Roadmap | ✅ | ✅ Advanced | ❌ Anti-feature |
| Time Tracking | ⚠️ Power-Up | ✅ | ❌ | ✅ | ✅ | ❌ Anti-feature |
| Sprint/Scrum | ❌ | ❌ | ✅ Cycles | ✅ | ✅ | ❌ Anti-feature |
| Free Tier | 10 boards | Limited | Unlimited members, 250 issues | Limited | 10 users | ✅ Free (v1 target) |

### Market Gap

No existing tool combines:
1. **Simple, pure Kanban** (like Trello's simplicity)
2. **Agentic AI that takes action** (not just summarizes)
3. **Natural language interface** as first-class interaction model

This is ZenTask's positioning: **Trello's simplicity × AI agent capabilities = the fastest way to manage Kanban tasks.**

---

## 7. Risks & Assumptions

| # | Risk / Assumption | Mitigation |
|---|-------------------|------------|
| 7.1 | **AI latency degrades UX** — LLM response times (2-8s) may feel slow vs. instant drag-drop | Optimistic UI updates, streaming responses, action confirmation UI that doesn't block |
| 7.2 | **AI hallucination causes wrong actions** — AI might misinterpret "move to Done" | Action confirmation (2.2.2) is non-negotiable. User always approves before AI acts. Function calling with validated output schema. |
| 7.3 | **LLM costs scale unpredictably** — Chat-based AI means many API calls per user | Rate limiting, model tiering (GPT-4o-mini as default), caching board state queries |
| 7.4 | **Users don't trust AI actions** — Some users will never let AI move their cards | AI features are optional. All manual Kanban features work independently. AI is additive, not replacement. |
| 7.5 | **Kanban-only is too narrow** — Users might want list/calendar views | Watch analytics. Add alternative views (list view) only if data shows strong demand. Kanban-first philosophy. |
| 7.6 | **Competitors add AI faster** — Trello/Asana ship AI features while ZenTask is building | Move fast on the "agentic action" angle (NL task manipulation). Competitors are adding "AI summaries" — a shallower integration. |

---

## Appendix A: Research Sources

- Tech Insider: Linear vs Jira (2026) — Feature comparison matrix
- AI:PRODUCTIVITY: Linear vs Jira deep dive — AI features analysis
- Atlassian Blog: Trello vs Jira — Feature scope comparison
- TechRepublic: 7 Best Open Source Kanban Boards (2026)
- GitHub: Plane (48k stars), Focalboard (25k stars), Planka, Kanvas
- StackCompare & Toggl: Kanban tool rankings and feature matrices (2026)
- Businessmap: Vital Kanban Board Features (2026)
- CPO Club: Feature Creep — Anti-patterns and MVP discipline
- Wrike AI, Asana AI Studio, Taskosaur: AI-first PM tool analysis
- Project-Management.com: 8 Best AI PM Tools (2026)

---

*This document will be reviewed and updated at each phase transition to reflect validated assumptions and new discoveries.*
