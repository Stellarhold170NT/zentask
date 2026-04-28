---
source: https://github.com/gsd-build/get-shit-done
collected: 2026-04-28
published: Unknown
---

# Get Shit Done (GSD) - Lightweight meta-prompting for AI coding agents

The "Get Shit Done" (GSD) project is a lightweight meta-prompting and spec-driven development system designed to improve the reliability of AI coding agents like Claude Code by solving "context rot."

### Key Concepts
GSD works by moving away from long-running, single-thread conversations toward a structured, phase-based workflow that uses fresh, isolated contexts for specific tasks.

### Quick Start Usage
Install Command: `npx get-shit-done-cc@latest` (Works on Mac, Windows, and Linux.)

### Core Workflow
1. **Initialize Project:** `/gsd-new-project`
   - Bootstraps project, asks goals/constraints, performs research, and generates a roadmap.
2. **Discuss Phase:** `/gsd-discuss-phase <n>`
   - Captures implementation preferences (UI, libraries, error handling).
3. **Plan Phase:** `/gsd-plan-phase <n>`
   - Creates a detailed plan verified by the system.
4. **Execute Phase:** `/gsd-execute-phase <n>`
   - Spawns fresh agents to execute tasks in parallel with atomic commits.
5. **Verify Work:** `/gsd-verify-work <n>`
   - Guided human-in-the-loop step to test features.

### Advanced Tips
- **Existing Codebases:** Run `/gsd-map-codebase` first to analyze architecture.
- **Assumptions Mode:** Change discussion mode in `/gsd-settings` (set `workflow.discuss_mode` to `'assumptions'`).
- **Automation:** Use flags like `--chain` to automatically proceed between phases.
