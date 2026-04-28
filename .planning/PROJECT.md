# ZenTask

## What This Is

ZenTask là một ứng dụng quản lý dự án theo mô hình Kanban dành cho team nhỏ (10-15 ngườI), tích hợp AI Assistant qua Tambo AI có khả năng thực hiện các thao tác thông minh như di chuyển task, thay đổi deadline, phân chia công việc, và trả lờI câu hỏI về tiến độ dự án. AI tương tác qua giao diện chat sidebar bên phải. Ứng dụng hỗ trợ nhiều project/board, real-time collaboration, RBAC phân quyền theo organization/project, và có module quản lý env (vault) đơn giản.

Mục tiêu là thay thế Trello cho team nhỏ bằng một công cụ có AI hỗ trợ trực tiếp trong quá trình quản lý công việc.

## Core Value

Team nhỏ có thể quản lý Kanban hiệu quả qua giao diện trực quan (kéo-thả) và lệnh ngôn ngữ tự nhiên qua AI Assistant — giảm thiểu thao tác thủ công, tăng tốc độ quản lý workflow, và hỗ trợ quyết định phân bổ công việc.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Team (10-15 ngườI) có thể đăng ký/đăng nhập và quản lý Kanban boards
- [ ] Hỗ trợ nhiều project/board với organization/project hierarchy
- [ ] AI Assistant qua Tambo AI có thể thao tác task bằng ngôn ngữ tự nhiên
- [ ] Real-time collaboration giữa các thành viên team
- [ ] RBAC phân quyền theo organization và project
- [ ] Vault-like env manager (list env, version)
- [ ] Giao diện dễ dùng như Trello

### Out of Scope

- Native mobile app — web-first
- Tích hợp calendar bên ngoài (Google Calendar, Outlook) — v2+
- Email notifications — v2+
- Advanced analytics/ reports — v2+
- Gantt chart / timeline view — v2+
- Time tracking — v2+

## Context

- Dự án greenfield — khởi tạo từ đầu
- Target user: team nhỏ 10-15 ngườI đang dùng Trello nhưng thiếu AI
- AI Assistant là differentiator chính so với Trello
- Tambo AI là framework AI chính (generative UI toolkit for React)
- Supabase làm managed backend (PostgreSQL, Auth, Realtime)
- Frontend-only approach — không cần backend riêng

## Constraints

- **Tech stack**: React (Next.js), Tambo AI, Supabase
- **AI**: Tambo AI với Supabase MCP hoặc custom tools
- **Data persistence**: Supabase (PostgreSQL + Realtime)
- **Auth**: Supabase Auth
- **Hosting**: Free tier (Vercel + Supabase Free)
- **No backend server**: Frontend-only, gọi Supabase trực tiếp
- **UI**: Phải dễ dùng như Trello

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tambo AI thay vì Vercel AI SDK | Generative UI toolkit, MCP support, stream props vào React components | — Pending |
| Supabase (PostgreSQL + Auth + Realtime) | Managed backend, free tier, RLS, real-time subscriptions | — Pending |
| Frontend-only (không backend riêng) | Giảm complexity, host free, phù hợp Supabase BaaS | — Pending |
| Organization/Project hierarchy | Phân quyền RBAC cần cấu trúc org/project | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2025-04-28 after user clarifications*
