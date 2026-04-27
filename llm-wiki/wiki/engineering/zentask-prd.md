# PRD: Zentask - AI Kanban for Teams

## 1. Overview
Zentask is a modern project management application that combines the rigorous principles of the Kanban Method with the power of Generative AI. It aims to provide a high-fidelity, real-time board for small teams, where an AI Assistant acts as a "Flow Master" to help manage tasks, deadlines, and process health.

## 2. Strategic Objectives
*   **Visualize Flow**: Provide a premium, real-time interface for task management.
*   **Agentic Assistance**: Enable a command-based AI to perform complex operations like task splitting and natural language querying.
*   **Enforce Kanban Principles**: Promote lean habits (Limit WIP, Explicit Policies) through flexible AI guidance rather than rigid enforcement.

## 3. Technology Stack
*   **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui.
*   **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime).
*   **AI Integration**: Vercel AI SDK (Function Calling for board operations).

## 4. Functional Requirements

### 4.1. Kanban Board (Core Engine)
*   **Dynamic Columns**: Users can create, rename, and reorder columns.
*   **WIP Limits**: Each column can have an optional Work-In-Progress limit.
*   **Explicit Policies**: Each column includes a "Policy" field (e.g., "Done criteria") that the AI can read and interpret.
*   **Real-time Sync**: Actions performed by the AI or other team members update the UI instantly via Supabase Realtime.

### 4.2. AI Assistant (Command-based)
*   **Interaction Modes**:
    *   **Command Palette (Cmd+K)**: Quick, single-line commands for moving tasks or updating metadata.
    *   **Sidebar Assistant**: Persistent chat for deep analysis, task splitting, and project-wide queries.
*   **Core Capabilities**:
    *   **Task Splitting**: Breaking large tasks into smaller, manageable sub-tasks.
    *   **Natural Language Querying**: Answering questions about bottlenecks, overdue tasks, or team load.
    *   **Metadata Management**: Changing end dates, assignees, and priority via natural language.

### 4.3. Safety & Flow Control
*   **Flexible WIP Enforcement**: If an action (manual or AI) violates a WIP limit, the AI issues a warning and asks for confirmation but does not block the action.
*   **Human-in-the-loop**: For generative actions (like task splitting), the AI presents a preview. The user can edit or delete proposed sub-tasks before they are committed to the database.

## 5. Data Model (High-Level)
*   **Projects**: `id, name, description, owner_id`.
*   **Columns**: `id, project_id, title, order, wip_limit, exit_policy`.
*   **Tasks**: `id, column_id, title, description, assignee_id, end_date, priority, metadata`.
*   **Audit Log**: Tracking changes made by the AI vs. Humans.

## 6. User Experience (Aesthetics)
*   **Design System**: shadcn/ui components (Dark mode by default, glassmorphism elements).
*   **Micro-animations**: Smooth transitions when moving cards or expanding the command palette.
*   **Feedback Loops**: Subtle toasts and AI notifications for WIP warnings.

---
**Sources**: Grill-me Session, April 2026.
**Status**: Draft / Under Review.
