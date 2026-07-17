// Data for the home-page career timeline (components/Timeline.tsx).
// Newest first. Dates drive the spine's month/year ruler (its tick density adapts to the
// elapsed time between entries), so `year`/`month` must be real calendar values.
// Copy is grounded in the verified-facts file of the CV repo
// (../cv/docs/Verified_Facts_and_Bullets.md) — same honesty rules apply here: no invented
// numbers, "mentored" not "led", prototype claims stay prototypes.

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
    title: 'Settled in London, looking for the next role',
    bullets: [
      'Based in London with full right to work — no sponsorship needed',
      'Interviewing for full-stack and backend roles, focused on modern-stack and AI-native development',
      'Building things in the meantime — this site and its RAG-powered “Ask” widget among them',
    ],
  },
  {
    year: 2026,
    month: 3,
    date: 'March 2026',
    title: 'Wrapped up at Gentrack, left NZ, went travelling',
    bullets: [
      'Closed out three years on the energy platform and handed my work over properly',
      'Traded Auckland for a backpack — the Czech Republic, Italy, Albania & Greece',
      'Left on great terms, with London waiting at the end of the trip',
    ],
  },
  {
    year: 2024,
    month: 8,
    date: 'August 2024',
    title: 'Promoted to Intermediate Software Engineer',
    bullets: [
      'Worked on an 18-month upgrade taking a 500,000+ customer energy retailer from a legacy monolith to microservices',
      'Reverse-engineered undocumented behaviour from a locked-down legacy system so the new platform matched the original exactly at go-live',
      'Mentored three junior engineers on the upgrade — authoring designs, reviewing code and supporting day-to-day delivery',
    ],
  },
  {
    year: 2023,
    month: 1,
    date: 'January 2023',
    title: 'Joined Gentrack — into the deep end of energy billing',
    bullets: [
      'Junior engineer on the billing platform for an Australian energy retailer',
      'Delivered new features and reworked existing logic so that medically dependent customers would not receive electricity disconnections',
    ],
  },
  {
    year: 2021,
    month: 11,
    date: 'November 2021',
    title: 'Graduated — and straight in as a one-person dev team',
    bullets: [
      'B.E. (Hons) in Computer Engineering from the University of Canterbury',
      'Signed off with first prize in the IEEE UAV challenge — a drone swarm tracking insects in 3D, built in ROS/Gazebo simulation and then flown on real Pixhawk hardware',
      'Joined Dempsey Wood Civil as their sole developer — prototyped a system that opened a sediment-pond valve automatically once water-quality sensors showed the water was safe to discharge',
    ],
  },
  {
    year: 2020,
    month: 11,
    date: 'November 2020',
    title: 'First taste of industry — interning at Angus Robertson Mechanical',
    bullets: [
      'Fitted IoT edge devices to the motor controllers on industrial roll-forming machines, capturing motor and machine telemetry',
      'Pulled the telemetry into SQL Server and built an ASP.NET MVC dashboard for monitoring the machines — a proof of concept',
      'The start of a running theme: hardware talking to web dashboards showed up again in my first job',
    ],
  },
  {
    year: 2018,
    month: 2,
    date: 'February 2018',
    title: 'Moved to Christchurch to study Computer Engineering',
    bullets: [
      'Started a B.E. (Hons) at the University of Canterbury, minoring in network & communication engineering',
      'Found a lasting love of systems and low-level programming',
      'Joined the uni ski club, played football and tennis — and made lifelong friends along the way',
    ],
  },
  {
    year: 2017,
    month: 11,
    date: 'November 2017',
    title: 'Finished high school — first full-time job at Kennards Hire',
    bullets: [
      'Serviced and maintained construction equipment and hire gear',
      'Kept it going part-time all the way through university — study by day, spanners on the side',
    ],
  },
]
