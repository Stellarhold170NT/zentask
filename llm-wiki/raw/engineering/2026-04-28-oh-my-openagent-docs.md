---
source: https://ohmyopenagent.com/docs
collected: 2026-04-28
tool: markitdown
---

# Configuration Reference

Oh My OpenAgent is highly opinionated but adjustable to taste. Most users don't need to configure anything — run `bunx oh-my-openagent install` and go.

## Config File Locations
- `.opencode/oh-my-openagent.json` (Project level)
- `~/.config/opencode/oh-my-openagent.json` (User level)

JSONC is supported, allowing comments and trailing commas.

## Agents
Configure specific behaviors for the built-in agents: Sisyphus, Hephaestus, Oracle, Librarian, Explore, Multimodal Looker, Prometheus, Metis, Momus, Atlas, and Sisyphus Junior.

### Override Options
| Option | Type | Description |
| --- | --- | --- |
| model | string | Model identifier (e.g., openai/gpt-4o) |
| variant | string | Model variant (max, high, medium, low) |
| category | string | Inherit configuration from a category |
| temperature | number | Sampling temperature (0-2) |
| prompt | string | Override the system prompt completely |
| tools | Record | Enable or disable specific tools |
| reasoningEffort | string | low, medium, high, xhigh |

### Permissions
| Permission | Values | Description |
| --- | --- | --- |
| edit | ask / allow / deny | File editing capabilities |
| bash | ask / allow / deny | Bash command execution |
| webfetch | ask / allow / deny | Web request capabilities |

## Categories
Categories allow you to define shared configurations that agents can inherit from.

| Category | Default Model | Description |
| --- | --- | --- |
| visual-engineering | gemini-3.1-pro (high) | Frontend, UI/UX, design tasks |
| ultrabrain | gpt-5.3-codex (xhigh) | Deep logical reasoning |
| deep | gpt-5.3-codex (medium) | Autonomous problem-solving |
| quick | claude-haiku-4-5 | Trivial, fast tasks |

## Hooks
Hooks allow you to extend functionality at various lifecycle points (e.g., `agent-usage-reminder`, `auto-update-checker`, `comment-checker`, `think-mode`).

## MCPs
- **websearch**: Powered by Exa.
- **context7**: Documentation retrieval.
- **grep_app**: GitHub code search.

## Browser Automation
- **playwright**: Full browser automation (default).
- **agent-browser**: Lightweight browser agent.

## Experimental Features
Options like `aggressive_truncation`, `auto_resume`, `preemptive_compaction`.
