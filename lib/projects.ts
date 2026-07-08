// Single source of truth for the Projects pages.
// Each entry drives a card on /projects and a detail page at /projects/[slug].
// Add a new project by appending one object here — no page changes required.

export interface ProjectBlock {
  heading: string
  body: string
}

export interface ProjectMedia {
  src: string
  alt: string
  caption?: string
  /** Full-width hero (e.g. a demo gif). Non-featured items form a gallery grid. */
  featured?: boolean
}

export interface Project {
  slug: string
  name: string
  /** One-line hook shown on the card and detail hero. */
  tagline: string
  status: 'shipped' | 'wip'
  stack: string[]
  /** GitHub repo in "owner/name" form — drives the repo card + shields badges. */
  repo: string
  /** Optional live demo link on this site or elsewhere. */
  live?: { href: string; label: string }
  /** Short summary for the detail hero. */
  summary: string
  /** Bulleted highlights on the detail page. Empty for WIP projects. */
  highlights: string[]
  /** Optional longer narrative sections on the detail page. */
  blocks?: ProjectBlock[]
  /** Optional screenshots / demo media on the detail page. */
  media?: ProjectMedia[]
}

export const projects: Project[] = [
  {
    slug: 'pomobar',
    name: 'pomobar',
    tagline: 'A macOS menu-bar Pomodoro timer that logs every focus session to Notion.',
    status: 'shipped',
    stack: ['Electron', 'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Notion API'],
    repo: 'njranum/pomobar',
    summary:
      'pomobar lives in the macOS tray — no dock icon, no window to manage — and pulls the day’s scheduled tasks straight from a Notion database, so the timer and the real to-do list are the same thing. Every completed session is written back to Notion as an honest record of where focus time actually went.',
    highlights: [
      'Menu-bar popover UI with configurable focus / short-break / long-break durations and pomodoros-per-cycle.',
      'Two-way Notion sync — starts focus sessions against scheduled tasks, marks them done, and logs every session to a sessions database.',
      'Local-first writes: sessions hit disk before the network, so a flaky connection never loses data.',
      'Crash recovery — in-progress sessions are persisted on every transition and restored on relaunch.',
      'Daily planning, goal tracking with streaks, native completion banners, and an optional Discord webhook.',
    ],
    blocks: [
      {
        heading: 'Why it exists',
        body: 'Every other timer I tried was a silo — you’d finish a session and the data died with it. pomobar reads the day’s scheduled tasks from Notion, times the work against them, and writes each completed session back as a record I can review later. The timer is the logging tool.',
      },
    ],
    media: [
      {
        src: '/projects/pomobar/pomo_demo.gif',
        alt: 'A full pomobar cycle — pick a task, start focus, count down, then mark complete and write back to Notion.',
        caption: 'One full cycle: pick a task, focus, then the mark-complete write-back to Notion.',
        featured: true,
      },
      {
        src: '/projects/pomobar/pomo_select_focus_task.png',
        alt: 'pomobar task picker showing today’s plan and scheduled tasks pulled from Notion.',
        caption: 'Today’s plan and scheduled tasks, pulled straight from Notion — pick one and start.',
      },
      {
        src: '/projects/pomobar/pomo_tick.png',
        alt: 'pomobar popover counting down during an active focus session.',
        caption: 'An active focus session, timed against the chosen task.',
      },
      {
        src: '/projects/pomobar/pomo_mark_complete.png',
        alt: 'pomobar prompting to mark the task complete when a focus session ends.',
        caption: 'When a session ends on a task, pomobar offers to mark it done in Notion.',
      },
      {
        src: '/projects/pomobar/pomo_goals.png',
        alt: 'pomobar goals strip tracking pomodoros and focus minutes with a running streak.',
        caption: 'Daily goals track pomodoros and focus minutes, with a running streak.',
      },
    ],
  },
  {
    slug: 'rag',
    name: 'Ask Me Anything — RAG Widget',
    tagline:
      'A RAG-powered chat widget that answers recruiters’ questions about my background in natural language.',
    status: 'shipped',
    stack: ['Python', 'FastAPI', 'Pinecone', 'Claude API', 'React', 'AWS', 'Cloudflare'],
    repo: 'njranum/ama-rag',
    live: { href: '/ask', label: 'Try it live' },
    summary:
      'Visitors ask natural-language questions about my professional background and get grounded, conversational answers — the model answers about me, in the third person, citing its sources. Built across three fully-designed layers: Notion ingestion, a Python/FastAPI query pipeline, and a React streaming frontend.',
    highlights: [
      'Ingestion: Notion → chunk → hosted Pinecone embedding (llama-text-embed-v2 @ 384-dim, cosine) → vector store.',
      'Query pipeline: retrieve → relevance gate → grounded prompt → Claude Haiku 4.5, streamed over SSE from FastAPI.',
      'Answers are grounded and cited — a relevance gate keeps the model from answering off-corpus questions.',
      'Cloud rollout on AWS Lightsail + Cloudflare, with Lambda + EventBridge for scheduled ingestion.',
      'The frontend widget is a first-party, style-isolated component embedded directly in this site at /ask.',
    ],
    blocks: [
      {
        heading: 'Architecture',
        body: 'The widget is split into independently designed layers so each can be reasoned about and tested on its own: a Notion ingestion pipeline, a Python/FastAPI retrieval-and-serving pipeline, and a React streaming frontend. Embedding is a hosted API call by design — there is deliberately no local torch / sentence-transformers dependency.',
      },
    ],
    media: [
      {
        src: '/projects/rag/demo.gif',
        alt: 'A full ask-me-anything cycle — type a question, watch the answer stream in token by token, source cards appear, then an off-topic question is politely declined by the relevance gate.',
        caption: 'One full cycle: ask a question, watch it stream in, see the sources — then an off-topic question is turned away by the relevance gate.',
        featured: true,
      },
      {
        src: '/projects/rag/widget_idle.png',
        alt: 'The idle Ask Me Anything widget with an empty question box and suggested-question chips.',
        caption: 'The idle widget — an empty ask box with suggested questions to get started.',
      },
      {
        src: '/projects/rag/widget_streaming.png',
        alt: 'The widget rendering an answer as it streams in token by token from the FastAPI backend over SSE.',
        caption: 'An answer streaming in token by token, served over SSE from FastAPI.',
      },
      {
        src: '/projects/rag/widget_sources.png',
        alt: 'Source cards below a completed answer, grouped by portfolio page with a preview snippet and a read-more link.',
        caption: 'Every answer is grounded — the source cards show the portfolio content it drew from.',
      },
      {
        src: '/projects/rag/widget_decline.png',
        alt: 'An off-topic question answered with a polite decline and no source cards, showing the relevance gate at work.',
        caption: 'Ask something off-corpus and the relevance gate declines — no sources, no hallucinated answer.',
      },
    ],
  },
  {
    slug: 'fix-my-vibe',
    name: 'Fix My Vibe',
    tagline:
      'An MCP server (and CLI) that diagnoses and fixes your AI-coding setup — and the security bugs AI assistants leave behind — inside the editor you already use.',
    status: 'shipped',
    stack: ['Python', 'MCP', 'FastMCP', 'Azure AI Foundry', 'Azure AI Search', 'Foundry IQ'],
    repo: 'njranum/Fix-My-Vibe',
    summary:
      'AI coding assistants only work as well as their setup files — and most projects never get good ones. Fix My Vibe scans a project, works out which AI tools are in use (Claude Code, Cursor, Copilot, Windsurf, Aider), finds what’s missing or misconfigured, generates the right config files for your stack, and repairs the security issues AI assistants routinely introduce — writing nothing to disk until you confirm exactly which fixes to apply. It runs as an MCP server, so an agent can call it as a set of tools and do the work in place; the same engine also ships as a standalone CLI.',
    highlights: [
      'Two front doors, one engine — the MCP server and the fix-my-vibe CLI share the exact same orchestrator; planning can never write files, and applying is the only writer.',
      'Deterministic where it should be, AI where it counts — detection, security scanning, config generation, and writes are pure offline Python; the LLM is reserved for the parts that genuinely reason. Moving the boilerplate out of the model cut an end-to-end run from 8m51s to 1m38s (−82%).',
      'Confirmation built into the protocol — apply_fixes uses an MCP elicitation prompt (one checkbox per fix) as its gate, and code edits default to unchecked. No confirmation channel → nothing is written.',
      'It fixes code, not just flags it — repairs the bugs AI assistants commonly introduce (hardcoded secrets, eval/exec, SQL string interpolation, disabled TLS, debug=True, shell=True), each a confirmed diff with a versioned .bak backup and a re-verify pass, all reversible with --undo.',
      'Grounded, not guessed — in Foundry mode each fix is backed by a curated OWASP / CWE / NIST knowledge base retrieved over Azure AI Search (Foundry IQ), and it degrades gracefully to a fully-offline local mode if Azure is unreachable.',
    ],
    blocks: [
      {
        heading: 'How it works',
        body: 'Two front doors — Claude Code over MCP and the fix-my-vibe CLI — feed one deterministic Python engine that runs Scan → Research → Plan → Remediate → Apply → Verify. The whole pipeline is read-only up to a single confirmation gate; only the Apply stage writes, and only the fixes you tick. Tool detection runs in layers — config-file signatures, a PATH check, and .vscode recommendations — so a tool is found whether it left a config file, is installed, or is only a suggested extension.',
      },
      {
        heading: 'Safety, enforced in code',
        body: 'The safety properties are covered by the test suite, not just documented: it never writes without explicit confirmation, backs up before overwriting with versioned backups so a second run never destroys the pristine original, never escapes the target directory (every write is path-traversal checked), and proves every code patch before offering it — each must parse, clear its finding, introduce no new findings, and be relocated by content rather than a stale line number, or it is dropped rather than applied blind.',
      },
    ],
    media: [
      {
        src: '/projects/fix-my-vibe/architecture.svg',
        alt: 'Fix My Vibe architecture: two front doors — Claude Code (MCP) and the fix-my-vibe CLI — feed one deterministic Python engine running Scan · Research · Plan · Remediate · a you-confirm gate · Apply · Verify, grounded by Foundry IQ over Azure AI Search.',
        caption: 'Two front doors, one engine — a read-only pipeline with a single confirmation gate between it and any writes.',
        featured: true,
      },
      {
        src: '/projects/fix-my-vibe/mcp-setup.gif',
        alt: 'Registering the MCP server — claude mcp add fix-my-vibe, then claude mcp list showing fix-my-vibe Connected.',
        caption: 'Registering the server with Claude Code — then it shows up as three callable tools.',
      },
      {
        src: '/projects/fix-my-vibe/elicitation-prompt.png',
        alt: 'The apply_fixes confirmation prompt — one checkbox per proposed fix; untick anything and it is never written.',
        caption: 'The confirmation gate — one checkbox per fix, code edits unticked by default. Only what you tick is written.',
      },
      {
        src: '/projects/fix-my-vibe/generated-security-md.png',
        alt: 'An example generated SECURITY.md — a security audit with OWASP and CWE citations.',
        caption: 'An example generated SECURITY.md — each finding written up with its OWASP / CWE reference.',
      },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}
