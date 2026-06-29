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
  },
  {
    slug: 'fix-my-vibe',
    name: 'Fix My Vibe',
    tagline:
      'An MCP server (and CLI) that diagnoses and fixes your AI coding tool setup — inside the editor you already use.',
    status: 'wip',
    stack: ['Python', 'MCP', 'Azure AI Foundry (Foundry IQ)'],
    repo: 'njranum/Fix-My-Vibe',
    summary:
      'AI coding assistants only work as well as their setup files — and most projects never get good ones. Fix My Vibe scans a project, works out which AI tools are in use, finds what’s missing or misconfigured, and generates the right config files for your stack — writing nothing to disk until you confirm exactly which fixes to apply.',
    highlights: [],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}
