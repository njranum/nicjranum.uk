// Single source of truth for the CV page.
// Extracted from assets/Nicholas_Ranum_CV_MAX.pdf (the authoritative PDF served at
// /Nicholas_Ranum_CV.pdf). Keep this in sync with that PDF when the CV changes.

export interface ContactLink {
  label: string
  display: string
  href: string
}

export interface ExperienceEntry {
  role: string
  company: string
  location: string
  start: string
  end: string
  bullets: string[]
}

export interface EducationEntry {
  institution: string
  qualification: string
  location: string
  start: string
  end: string
}

export interface AwardEntry {
  title: string
  issuer: string
  date: string
  description?: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface ProjectEntry {
  name: string
  stack: string[]
  description: string
}

export interface Cv {
  name: string
  tagline: string
  summary: string
  contact: ContactLink[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  awards: AwardEntry[]
  skills: SkillGroup[]
  projects: ProjectEntry[]
  pdfPath: string
}

export const cv: Cv = {
  name: 'Nicholas Ranum',
  tagline: 'Software Engineer',
  summary:
    'Software engineer with over four years of commercial experience in New Zealand, most recently operating at a technical lead level within a global energy software company. Proven track record of owning complex delivery end to end. Based in London with full right to work, actively seeking a software engineering role.',
  pdfPath: '/Nicholas_Ranum_CV.pdf',
  contact: [
    { label: 'Phone', display: '+44 7774 421368', href: 'tel:+447774421368' },
    { label: 'Email', display: 'nicjranum@gmail.com', href: 'mailto:nicjranum@gmail.com' },
    {
      label: 'LinkedIn',
      display: 'linkedin.com/in/nicholas-ranum',
      href: 'https://linkedin.com/in/nicholas-ranum-a18119192',
    },
    { label: 'GitHub', display: 'github.com/njranum', href: 'https://github.com/njranum' },
  ],
  experience: [
    {
      role: 'Intermediate Software Engineer',
      company: 'Gentrack',
      location: 'Auckland, NZ',
      start: 'Jan 2023',
      end: 'Mar 2026',
      bullets: [
        'Led technical delivery of an 18-month energy platform upgrade serving 500,000+ customers, managing a team of 3 engineers',
        'Authored detailed software designs defining architecture and implementation approach',
        'Owned code review and quality gates through to production release, introducing new team practices that reduced review turnaround time and defect escape rate',
      ],
    },
    {
      role: 'Junior Software Engineer',
      company: 'Dempsey Wood Civil',
      location: 'Auckland, NZ',
      start: 'Nov 2021',
      end: 'Jan 2023',
      bullets: [
        'Built a full-stack IoT dashboard (MEAN stack) for real-time telemetry monitoring, alerting, and remote device control as the sole developer',
        'Developed C++ microcontroller firmware for motor control and telemetry reporting, integrated with the web application',
      ],
    },
  ],
  education: [
    {
      institution: 'University of Canterbury',
      qualification:
        'B.E. Hons in Computer Engineering, Minor in Network and Communication Engineering',
      location: 'Christchurch, NZ',
      start: 'Feb 2018',
      end: 'Nov 2021',
    },
  ],
  awards: [
    {
      title: 'First Prize — UAV Instrumentation and Data Processing Trophy',
      issuer: 'Institute of Electrical and Electronics Engineers',
      date: 'Nov 2021',
      description:
        'Drone swarm for insect tracking in 3D space. Software-in-the-loop simulation via Gazebo and ROS, with hardware implementation on Pixhawk controllers.',
    },
  ],
  skills: [
    { label: 'Languages', items: ['TypeScript', 'Python', 'C++', 'SQL'] },
    {
      label: 'Libraries & Frameworks',
      items: ['Node.js', 'React', 'Angular', 'Tailwind', 'Express', 'Next.js', 'Vue.js'],
    },
    {
      label: 'Tools',
      items: [
        'HTML/CSS',
        'Docker',
        'Jenkins',
        'GitHub Actions',
        'Sumo Logic',
        'MySQL',
        'MongoDB',
        'Git',
        'AWS (Lambda, S3, EC2, RDS, IAM, CloudFormation)',
      ],
    },
    {
      label: 'Technical Leadership',
      items: [
        'Technical Mentorship',
        'System Design & Architecture',
        'Code Review',
        'Stakeholder Management',
      ],
    },
    {
      label: 'AI & Automation',
      items: [
        'Spec Driven Development',
        'AI Workflow Automation',
        'MCP Server Development',
        'RAG',
        'Prompt Engineering',
        'MCP Integration',
      ],
    },
  ],
  projects: [
    {
      name: 'pomobar app',
      stack: ['Electron', 'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Notion API'],
      description:
        'A macOS menu bar Pomodoro timer with deep Notion integration. Tracks focus sessions, short and long breaks across daily pomodoro cycles, logs session data to a Notion database, and surfaces a daily planning workflow to set intentions before work begins. Built as a single-user productivity tool with a native macOS aesthetic.',
    },
    {
      name: 'Ask Me Anything — RAG Portfolio Widget',
      stack: ['Python', 'FastAPI', 'Pinecone', 'Claude API', 'React', 'AWS', 'Cloudflare'],
      description:
        'RAG-powered chat widget embedded on a personal portfolio site, letting recruiters query professional background via natural language — built across three fully-designed layers: Notion ingestion, a Python/FastAPI query pipeline, and a React streaming frontend.',
    },
    {
      name: 'Fix My Vibe',
      stack: ['Python', 'MCP', 'Azure AI Foundry (Foundry IQ)'],
      description:
        "Built an MCP server that scans developer project directories, detects misconfigured AI tooling and security risks. Generates best-practice config files grounded via Azure AI Foundry's knowledge retrieval layer.",
    },
  ],
}
