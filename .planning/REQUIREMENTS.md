# Requirements: ZenTask

**Defined:** 2025-04-28  
**Core Value:** Team nhỏ (10-15 ngườI) có thể quản lý Kanban tasks hiệu quả qua cả visual drag-and-drop và natural language AI commands.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across browser sessions
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: Password must be validated for minimum strength (8+ chars)
- [ ] **AUTH-05**: User can reset password via email link

### Organization & Project

- [ ] **ORG-01**: User can create an organization
- [ ] **ORG-02**: User can invite members to organization via email
- [ ] **ORG-03**: Organization has a name and slug
- [ ] **PROJ-01**: User can create a project within an organization
- [ ] **PROJ-02**: User can view list of projects in an organization
- [ ] **PROJ-03**: User can rename and delete a project

### Board Management

- [ ] **BOARD-01**: User can create a Kanban board within a project
- [ ] **BOARD-02**: User can view a board with default columns (To Do, In Progress, Done)
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
- [ ] **CARD-08**: User can assign a card to a team member

### Drag-and-Drop

- [ ] **DND-01**: User can drag a card from one column to another
- [ ] **DND-02**: User can reorder cards within a column by dragging
- [ ] **DND-03**: Drag operation shows visual feedback (ghost card, drop indicator)
- [ ] **DND-04**: Card position/order persists after refresh

### AI Assistant (Tambo AI)

- [ ] **AI-01**: User can open an AI chat sidebar from any board view
- [ ] **AI-02**: AI can move a card to a different column when asked in natural language
- [ ] **AI-03**: AI can change a card's due date when asked in natural language
- [ ] **AI-04**: AI can create a new card with structured data extracted from natural language description
- [ ] **AI-05**: AI can assign a card to a team member when asked
- [ ] **AI-06**: AI responds with confirmation before executing destructive actions (delete, move)
- [ ] **AI-07**: AI chat streams responses token-by-token (not blocking)
- [ ] **AI-08**: AI can answer project status questions ("What's overdue?", "Who has the most tasks?")

### Real-Time Collaboration

- [ ] **RTC-01**: Changes made by one user appear on other users' screens within seconds
- [ ] **RTC-02**: Card moves are synchronized in real-time across sessions
- [ ] **RTC-03**: New cards/columns appear in real-time for all connected users

### RBAC (Role-Based Access Control)

- [ ] **RBAC-01**: Organization has roles: Owner, Admin, Member
- [ ] **RBAC-02**: Owner can manage organization settings and delete organization
- [ ] **RBAC-03**: Admin can manage projects, boards, and invite members
- [ ] **RBAC-04**: Member can create/edit cards and move tasks
- [ ] **RBAC-05**: Permissions are enforced at API and UI level

### Vault (Env Manager)

- [ ] **VAULT-01**: Organization can store environment variables (key-value pairs)
- [ ] **VAULT-02**: Env variables are versioned (history of changes)
- [ ] **VAULT-03**: Only Owner and Admin can view/edit vault
- [ ] **VAULT-04**: Env variables can be organized by project

### Search & Filter

- [ ] **SRCH-01**: User can search cards by title or description text
- [ ] **SRCH-02**: User can filter cards by priority level
- [ ] **SRCH-03**: User can filter cards by label/tag
- [ ] **SRCH-04**: User can filter cards by assignee
- [ ] **SRCH-05**: Filters can be cleared to show all cards

### UI/UX

- [ ] **UI-01**: App is usable on desktop (primary) and tablet screen sizes
- [ ] **UI-02**: Board layout is responsive and does not break on common viewports
- [ ] **UI-03**: App uses a modern, clean visual design (not default/unstyled)
- [ ] **UI-04**: Loading and empty states are handled gracefully
- [ ] **UI-05**: Giao diện dễ dùng như Trello (intuitive, minimal clicks)

---

## v2 Requirements

### Authentication

- **AUTH-06**: User can log in with OAuth (Google, GitHub)

### Collaboration Extended

- **COLLAB-01**: In-app notifications for task assignments and mentions
- **COLLAB-02**: Activity log/history for each card

### AI Extended

- **AI-09**: AI can suggest priority for new cards based on content
- **AI-10**: AI can summarize a card's description and comments
- **AI-11**: User can trigger AI commands via Cmd+K command palette

### Comments

- **COMM-01**: User can add comments to a card
- **COMM-02**: User can edit/delete their own comments

### Attachments

- **ATT-01**: User can attach files to a card

### Export

- **EXP-01**: User can export board data as JSON or CSV

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Gantt / Timeline view | Not Kanban-native; high complexity for v1 |
| Time tracking | Not core to Kanban workflow; adds UI clutter |
| Resource allocation / workload charts | Requires historical data; defer to v2 |
| Native mobile app | Web-first strategy; mobile web sufficient for v1 |
| Email notifications | Adds infrastructure complexity (SMTP, queue); v2 |
| Calendar integration (Google/Outlook) | Requires OAuth + external API; v2+ |
| Advanced analytics / reports | No data to analyze in v1; add after usage |
| Sprint / Scrum planning | ZenTask is Kanban-focused, not Scrum |
| Workflow automation engine (Jira-style) | AI Assistant covers automation use cases |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| ORG-01 | Phase 2 | Pending |
| ORG-02 | Phase 2 | Pending |
| ORG-03 | Phase 2 | Pending |
| PROJ-01 | Phase 2 | Pending |
| PROJ-02 | Phase 2 | Pending |
| PROJ-03 | Phase 2 | Pending |
| BOARD-01 | Phase 3 | Pending |
| BOARD-02 | Phase 3 | Pending |
| BOARD-03 | Phase 3 | Pending |
| BOARD-04 | Phase 3 | Pending |
| COL-01 | Phase 3 | Pending |
| COL-02 | Phase 3 | Pending |
| COL-03 | Phase 3 | Pending |
| COL-04 | Phase 3 | Pending |
| CARD-01 | Phase 4 | Pending |
| CARD-02 | Phase 4 | Pending |
| CARD-03 | Phase 4 | Pending |
| CARD-04 | Phase 4 | Pending |
| CARD-05 | Phase 4 | Pending |
| CARD-06 | Phase 4 | Pending |
| CARD-07 | Phase 4 | Pending |
| CARD-08 | Phase 4 | Pending |
| DND-01 | Phase 5 | Pending |
| DND-02 | Phase 5 | Pending |
| DND-03 | Phase 5 | Pending |
| DND-04 | Phase 5 | Pending |
| AI-01 | Phase 6 | Pending |
| AI-02 | Phase 6 | Pending |
| AI-03 | Phase 6 | Pending |
| AI-04 | Phase 6 | Pending |
| AI-05 | Phase 6 | Pending |
| AI-06 | Phase 6 | Pending |
| AI-07 | Phase 6 | Pending |
| AI-08 | Phase 6 | Pending |
| RTC-01 | Phase 7 | Pending |
| RTC-02 | Phase 7 | Pending |
| RTC-03 | Phase 7 | Pending |
| RBAC-01 | Phase 8 | Pending |
| RBAC-02 | Phase 8 | Pending |
| RBAC-03 | Phase 8 | Pending |
| RBAC-04 | Phase 8 | Pending |
| RBAC-05 | Phase 8 | Pending |
| VAULT-01 | Phase 9 | Pending |
| VAULT-02 | Phase 9 | Pending |
| VAULT-03 | Phase 9 | Pending |
| VAULT-04 | Phase 9 | Pending |
| SRCH-01 | Phase 10 | Pending |
| SRCH-02 | Phase 10 | Pending |
| SRCH-03 | Phase 10 | Pending |
| SRCH-04 | Phase 10 | Pending |
| SRCH-05 | Phase 10 | Pending |
| UI-01 | Phase 10 | Pending |
| UI-02 | Phase 10 | Pending |
| UI-03 | Phase 10 | Pending |
| UI-04 | Phase 10 | Pending |
| UI-05 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 50 total
- Mapped to phases: 50
- Unmapped: 0 ✓

---

*Requirements defined: 2025-04-28*  
*Last updated: 2025-04-28 after user clarifications*
