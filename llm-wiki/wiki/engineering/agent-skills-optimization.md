# Optimizing Engineering Workflow with Agent Skills

This article summarizes the internal best practices and experiences of leveraging specialized Agent Skills within our development environment. By integrating these tools, we move from "vibe coding" to a more structured, predictable, and rigorous engineering process.

## 1. Knowledge Management: The Single Source of Truth
We utilize the **llm-wiki** structure to maintain a compounding knowledge base.

*   **Ingestion Pipeline**: Use **markitdown** to convert raw assets (PDFs, scientific papers, documentation) into markdown before ingesting them into the `raw/` directory. This ensures that the agent has high-fidelity source material to work with.
*   **Knowledge Consolidation**: The **Compile** step of the wiki is critical. Instead of just storing snippets, we synthesize knowledge into comprehensive articles (like our Kanban summary) that cross-reference multiple sources.

## 2. Strategic Planning: Stress-Testing Designs
Before writing a single line of code for complex features, we engage in a "Thinking Phase."

*   **Design Reviews with `grill-me`**: We use the `grill-me` skill to simulate a rigorous technical interview. This forces us to resolve edge cases and decision-tree branches early, preventing costly refactors later.
*   **PRD Generation**: Use the conversation history to generate PRDs and break them down into vertical slices (using `to-prd` and `to-issues` patterns).

## 3. Code Quality and Architecture
As the codebase grows, we use automated insights to maintain health.

*   **Architectural Guardrails**: The **improve-codebase-architecture** skill is used to scan for "deepening" opportunities—identifying where logic should be consolidated or where the domain language (Ubiquitous Language) is drifting.
*   **Contextual Understanding**: We leverage **gitnexus** (via MCP) for 360-degree views of symbols. This is essential for impact analysis before making changes to shared modules.

## 4. UI/UX Consistency
For front-end development, we standardize on **shadcn-ui**. This ensures that even when the agent generates new components, they adhere to our established design system tokens and accessibility standards.

## Summary of Workflow
1.  **Ingest**: Raw material -> `markitdown` -> `llm-wiki/raw`.
2.  **Synthesis**: `llm-wiki/raw` -> Analysis -> `llm-wiki/wiki`.
3.  **Design**: Concept -> `grill-me` -> PRD/Issues.
4.  **Execute**: Code -> `gitnexus` (Impact Analysis) -> `shadcn-ui` (UI).
5.  **Refine**: `improve-codebase-architecture`.

---
**Sources**: Internal Workflow Optimization, 2026.
**Raw**: [llm-wiki/SKILL.md](../../SKILL.md)
