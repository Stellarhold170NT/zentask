# Requirements: ZenTask

**Defined:** 2025-04-28  
**Core Value:** Users can manage Kanban tasks efficiently through both visual drag-and-drop and natural language AI commands.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across browser sessions
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: Password must be validated for minimum strength (8+ chars)

### Board Management

- [ ] **BOARD-01**: User can create a new Kanban board with a name
- [ ] **BOARD-02**: User can view their board with default columns (To Do, In Progress, Done)
- [ ] **BOARD-03**: User can rename a board
- [ ] **BOARD-04**: User can delete a board (with confirmation)

### Columns

- [ ] **COL-01**: User can add a new column to a board
- [ ] **COL-02**: User can rename a column
- [ ] **COL-03**: User can delete an empty column
- [ ] **COL-04**: Columns maintain their order within a board

### Cards (Tasks)

- [ ] **CARD-01**: User can create a card with title and description
- [ ] **CARD-02**: User can edit a card's title and description
- [ ] **CARD-03**: User can delete a card (with confirmation)
- [ ] **CARD-04**: User can set a due date on a card
- [ ] **CARD-05**: User can set a priority level on a card (Low, Medium, High)
- [ ] **CARD-06**: User can assign labels/tags to a card
- [ ] **CARD-07**: Cards display their metadata (due date, priority, labels) on the card face

### Drag-and-Drop

- [ ] **DND-01**: User can drag a card from one column to another
- [ ] **DND-02**: User can reorder cards within a column by dragging
- [ ] **DND-03**: Drag operation shows visual feedback (ghost card, drop indicator)
- [ ] **DND-04**: Card position/order persists after refresh

### AI Assistant

- [ ] **AI-01**: User can open an AI chat sidebar from any board view
- [ ] **AI-02**: AI can move a card to a different column when asked in natural language
- [ ] **AI-03**: AI can change a card's due date when asked in natural language
- [ ] **AI-04**: AI can create a new card with structured data extracted from natural language description
- [ ] **AI-05**: AI responds with confirmation before executing destructive actions (delete, move)
- [ ] **AI-06**: AI chat streams responses token-by-token (not blocking)

### Search & Filter

- [ ] **SRCH-01**: User can search cards by title or description text
- [ ] **SRCH-02**: User can filter cards by priority level
- [ ] **SRCH-03**: User can filter cards by label/tag
- [ ] **SRCH-04**: Filters can be cleared to show all cards

### UI/UX

- [ ] **UI-01**: App is usable on desktop (primary) and tablet screen sizes
- [ ] **UI-02**: Board layout is responsive and does not break on common viewports
- [ ] **UI-03**: App uses a modern, clean visual design (not default/unstyled)
- [ ] **UI-04**: Loading and empty states are handled gracefully

---

## v2 Requirements

### Authentication

- **AUTH-05**: User can log in with OAuth (Google, GitHub)
- **AUTH-06**: User can reset password via email link

### Collaboration

- **COLLAB-01**: Multiple users can view the same board
- **COLLAB-02**: Real-time updates when another user moves a card

### AI Extended

- **AI-07**: AI can suggest priority for new cards based on content
- **AI-08**: AI can answer project status questions ("What's overdue?")
- **AI-09**: AI can summarize a card's description and comments
- **AI-10**: User can trigger AI commands via Cmd+K command palette

### Comments

- **COMM-01**: User can add comments to a card
- **COMM-02**: User can edit/delete their own comments

### Attachments

- **ATT-01**: User can attach files to a card

### Export

- **EXP-01**: User can export board data as JSON

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Gantt / Timeline view | Not Kanban-native; high complexity for v1 |
| Time tracking | Not core to Kanban workflow; adds UI clutter |
| Resource allocation / workload charts | Requires multi-user data; defer to collaboration phase |
| Native mobile app | Web-first strategy; mobile web sufficient for v1 |
| Email notifications | Adds infrastructure complexity (SMTP, queue); not essential for single-user |
| Calendar integration (Google/Outlook) | Requires OAuth + external API; v2+ |
| Advanced analytics / reports | No data to analyze in v1; add after usage |
| Sprint / Scrum planning | ZenTask is Kanban-focused, not Scrum |
| Workflow automation engine (Jira-style) | AI Assistant covers automation use cases |
| Role-based access control (RBAC) | Single-user focus for v1; add with collaboration |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| BOARD-01 | Phase 2 | Pending |
| BOARD-02 | Phase 2 | Pending |
| BOARD-03 | Phase 2 | Pending |
| BOARD-04 | Phase 2 | Pending |
| COL-01 | Phase 2 | Pending |
| COL-02 | Phase 2 | Pending |
| COL-03 | Phase 2 | Pending |
| COL-04 | Phase 2 | Pending |
| CARD-01 | Phase 3 | Pending |
| CARD-02 | Phase 3 | Pending |
| CARD-03 | Phase 3 | Pending |
| CARD-04 | Phase 3 | Pending |
| CARD-05 | Phase 3 | Pending |
| CARD-06 | Phase 3 | Pending |
| CARD-07 | Phase 3 | Pending |
| DND-01 | Phase 4 | Pending |
| DND-02 | Phase 4 | Pending |
| DND-03 | Phase 4 | Pending |
| DND-04 | Phase 4 | Pending |
| AI-01 | Phase 5 | Pending |
| AI-02 | Phase 5 | Pending |
| AI-03 | Phase 5 | Pending |
| AI-04 | Phase 5 | Pending |
| AI-05 | Phase 5 | Pending |
| AI-06 | Phase 5 | Pending |
| SRCH-01 | Phase 6 | Pending |
| SRCH-02 | Phase 6 | Pending |
| SRCH-03 | Phase 6 | Pending |
| SRCH-04 | Phase 6 | Pending |
| UI-01 | Phase 6 | Pending |
| UI-02 | Phase 6 | Pending |
| UI-03 | Phase 6 | Pending |
| UI-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---

*Requirements defined: 2025-04-28*  
*Last updated: 2025-04-28 after initial definition*
