---
topic: Engineering
title: GSD (Get Shit Done) Workflow
summary: A phase-based, spec-driven development system for AI coding agents to prevent context rot.
updated: 2026-04-28
sources: gsd-build; Claude Code Community
raw: [2026-04-28-gsd-build-get-shit-done.md](../../raw/engineering/2026-04-28-gsd-build-get-shit-done.md)
---

# GSD (Get Shit Done) Workflow

GSD is a structured framework designed to optimize the performance of AI coding agents (specifically Claude Code) by decomposing complex development tasks into distinct, manageable phases. Its primary goal is to eliminate **context rot**—the degradation of AI accuracy in long, single-thread conversations.

## Core Philosophy

- **Phase-based isolation**: Each task is executed in a fresh context.
- **Spec-driven**: Development is guided by research and explicit plans.
- **Atomic Execution**: Tasks are performed with clear boundaries and verified outcomes.

## Quy trình Input & Output

GSD không lưu trữ trạng thái trong lịch sử chat mà "ngoại hóa" (externalize) nó vào các file Markdown có cấu trúc trong thư mục `.planning/`.

### 1. Thư mục `.planning/` (Durable Memory)
Đây là "não bộ" của project, nơi lưu trữ mọi kiến thức và kế hoạch:
- `PROJECT.md`: Tầm nhìn, yêu cầu và ràng buộc.
- `REQUIREMENTS.md`: Danh sách yêu cầu có thể kiểm chứng.
- `ROADMAP.md`: Các giai đoạn (phases) và tiêu chí thành công.
- `STATE.md`: Vị trí hiện tại, quyết định đã đưa ra và các blockers.
- `phases/`: Chứa các kế hoạch chi tiết (`PLAN.md`), nghiên cứu (`RESEARCH.md`) và báo cáo xác minh (`VERIFICATION.md`) cho từng giai đoạn.

### 2. Dữ liệu Input
- **Mục tiêu (Goal)**: Ý tưởng hoặc tính năng bạn muốn xây dựng bằng ngôn ngữ tự nhiên.
- **Sở thích triển khai (Preferences)**: Các yêu cầu cụ thể về công nghệ, phong cách code, thư viện.
- **Ngữ cảnh Codebase**: Thông tin từ việc quét mã nguồn hiện tại (`/gsd-map-codebase`).
- **Phản hồi của người dùng**: Input trực tiếp trong quá trình Discuss và Verify.

### 3. Dữ liệu Output
- **File cấu trúc (.md)**: Các file trong `.planning/` đóng vai trò là "System Prompts" cực kỳ chi tiết cho các agent tiếp theo.
- **Mã nguồn (Source Code)**: Các tính năng đã được triển khai hoàn chỉnh.
- **Git History**: Các commit nguyên tử (atomic) đi kèm với giải thích rõ ràng.
- **Báo cáo Verification**: Kết quả kiểm thử đảm bảo code khớp với yêu cầu.

## Quy trình làm việc (Lifecycle)

## Integration with Existing Projects

When working on an established codebase, use:
- `/gsd-map-codebase`: Analyzes the existing architecture, files, and dependencies to ensure new features align with current patterns.

## Tooling Commands

| Command | Description |
|---------|-------------|
| `npx get-shit-done-cc@latest` | Installation/CLI entry |
| `--chain` | Flag to auto-transition between phases |
| `/gsd-settings` | Configure behavior (e.g., discussion mode) |

## See Also
- [Optimizing Engineering Workflow with Agent Skills](agent-skills-optimization.md)
