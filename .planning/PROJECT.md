# ZenTask

## What This Is

ZenTask là một ứng dụng quản lý dự án theo mô hình Kanban, tích hợp AI Assistant có khả năng thực hiện các thao tác thông minh như di chuyển task, thay đổi deadline, và gợi ý quản lý công việc thông qua ngôn ngữ tự nhiên. Mục tiêu là tạo ra trải nghiệm quản lý task trực quan, nhanh chóng và được AI hỗ trợ.

## Core Value

NgườI dùng có thể quản lý công việc Kanban hiệu quả bằng cả giao diện trực quan (kéo-thả) và lệnh ngôn ngữ tự nhiên qua AI Assistant — giảm thiểu thao tác thủ công và tăng tốc độ quản lý workflow.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] NgườI dùng có thể tạo và quản lý board Kanban với nhiều column
- [ ] NgườI dùng có thể tạo, chỉnh sửa, xóa task card trong board
- [ ] AI Assistant có thể nhận lệnh ngôn ngữ tự nhiên để thao tác task (move, đổi deadline,…)
- [ ] Hệ thống xác thực ngườI dùng (đăng ký/đăng nhập)
- [ ] Giao diện responsive, hiện đại, dễ sử dụng

### Out of Scope

- Real-time collaboration đa ngườI dùng (WebSocket) — tập trung single-user trước
- Mobile native app — web-first
- Tích hợp calendar bên ngoài (Google Calendar, Outlook)
- Email notifications — tập trung core Kanban + AI trước
- Advanced analytics/ reports — v2+

## Context

- Dự án greenfield — khởi tạo từ đầu
- Target user: cá nhân hoặc team nhỏ cần quản lý công việc đơn giản
- AI Assistant là differentiator chính so với các công cụ Kanban truyền thống
- Ưu tiên v1: core Kanban + AI assistant hoạt động ổn định

## Constraints

- **Tech stack**: Web-based, modern framework (React/Vue/Next.js)
- **Timeline**: v1 trong 1-2 tháng
- **AI**: Sử dụng LLM API (OpenAI/Claude/Gemini) cho AI Assistant
- **Data persistence**: Database cho task, board, user data
- **Budget**: Tận dụng free tier AI APIs và open-source tools nếu có thể

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web app (browser-based) | Cross-platform, không cần install | — Pending |
| AI Assistant qua chat interface | Natural UX, dễ tiếp cận | — Pending |
| Kanban là core UI pattern | Trực quan, phổ biến, phù hợp AI manipulation | — Pending |

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
*Last updated: 2025-04-28 after initialization*
