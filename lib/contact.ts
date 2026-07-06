// Contact channels for the /contact page.
// Email, LinkedIn and GitHub are pulled from the CV (lib/cv.ts) so there's still a single
// source of truth for those. The scheduling link lives only here — set SCHEDULING_URL below.

import { cv } from './cv'

export type ChannelIconName = 'linkedin' | 'github' | 'calendar'

export interface ContactChannel {
  label: string
  /** Short, mono-styled identifier shown under the label (handle / booking slug). */
  handle: string
  href: string
  /** One-line reason a visitor would pick this channel. */
  description: string
  icon: ChannelIconName
}

const byLabel = (label: string) => {
  const found = cv.contact.find(c => c.label === label)
  if (!found) throw new Error(`contact: no "${label}" entry in cv.contact`)
  return found
}

const emailEntry = byLabel('Email')

/** Primary email — display address + mailto href. */
export const email = { address: emailEntry.display, href: emailEntry.href }

/** Scheduling link — Cal.com booking page. */
export const SCHEDULING_URL = 'https://cal.com/nicjranum'

export const location = {
  city: 'London, UK',
  timezone: 'GMT · BST',
}

/** Rough turnaround, shown next to the email block so recruiters know what to expect. */
export const responseTime = 'Usually replies within a day'

export const channels: ContactChannel[] = [
  {
    label: 'LinkedIn',
    handle: 'in/nicholas-ranum',
    href: byLabel('LinkedIn').href,
    description: 'Full work history and professional background.',
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    handle: '@njranum',
    href: byLabel('GitHub').href,
    description: 'Source for this site and my other projects.',
    icon: 'github',
  },
  {
    label: 'Book a call',
    handle: 'cal.com/nicjranum',
    href: SCHEDULING_URL,
    description: 'Grab 30 minutes — recruiter screen or intro chat.',
    icon: 'calendar',
  },
]
