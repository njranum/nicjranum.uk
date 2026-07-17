// Data for the home-page career timeline (components/Timeline.tsx).
// Newest first. Dates drive the spine's month/year ruler (its tick density adapts to the
// elapsed time between entries), so `year`/`month` must be real calendar values. Bullets are
// drawn from lib/cv.ts where possible — keep the two in sync when the CV changes.

export interface TimelineEntry {
  year: number
  /** 1–12 */
  month: number
  date: string
  title: string
  bullets: string[]
}

export const timeline: TimelineEntry[] = [
  {
    year: 2026,
    month: 6,
    date: 'June 2026',
    title: 'Living in London — looking for software roles',
    bullets: [
      'Settled in London with full right to work in the UK',
      'Actively interviewing for backend & full-stack roles',
      'Building side projects to stay sharp — including this site',
    ],
  },
  {
    year: 2026,
    month: 4,
    date: 'April 2026',
    title: 'Leaves New Zealand, starts travelling Europe',
    bullets: [
      'Wrapped up eight years of life and work in NZ',
      'Backpacked through Italy, Spain & Portugal',
      'Planned the next chapter: a software career in London',
    ],
  },
  {
    year: 2026,
    month: 3,
    date: 'March 2026',
    title: 'Leaves Gentrack',
    bullets: [
      'Departed after 3+ years to travel and chase new challenges',
      'Handed over ownership of the platform work I led',
      'Left on great terms — still in touch with the team',
    ],
  },
  {
    year: 2024,
    month: 8,
    date: 'August 2024',
    title: 'Promoted to Intermediate Software Engineer',
    bullets: [
      'Led technical delivery of an 18-month energy platform upgrade serving 500,000+ customers',
      'Managed and mentored a team of three engineers',
      'Owned code review and quality gates through to production release',
    ],
  },
  {
    year: 2023,
    month: 1,
    date: 'January 2023',
    title: 'Joins Gentrack as Junior Software Engineer',
    bullets: [
      'Joined the utilities billing platform team in Auckland',
      'Worked across TypeScript, SQL & AWS',
      'Authored software designs defining architecture and implementation approach',
    ],
  },
  {
    year: 2021,
    month: 11,
    date: 'November 2021',
    title: 'Graduates, joins Dempsey Wood Civil as Junior Software Engineer',
    bullets: [
      'B.E. (Hons) in Computer Engineering, University of Canterbury',
      'Sole developer on a full-stack IoT dashboard for real-time telemetry, alerting and remote device control',
      'Wrote C++ microcontroller firmware for motor control and telemetry',
    ],
  },
  {
    year: 2018,
    month: 2,
    date: 'February 2018',
    title: 'Starts at Canterbury University — Computer Engineering',
    bullets: [
      'Began a Bachelor of Engineering (Hons), minoring in Network & Communication Engineering',
      'Fell for systems and low-level programming',
      'Later won first prize in the IEEE UAV instrumentation challenge — a drone swarm tracking insects in 3D',
    ],
  },
]
