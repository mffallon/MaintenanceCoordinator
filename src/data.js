export const rescheduleOptions = [
  {
    id: 'rs-1', when: 'Sat, May 17 · 8:00 AM', dur: '2h',
    score: 'Best fit', tone: 'success',
    tech: 'Jake R.',
    reason: 'Lightest scheduled day · no Tier 1 conflicts · keeps original assignee.'
  },
  {
    id: 'rs-2', when: 'Sat, May 17 · 1:00 PM', dur: '2h',
    score: 'Good', tone: 'info',
    tech: 'Jake R.',
    reason: 'Same-day alternative · post-lunch slot opens after Unit 117 QA.'
  },
  {
    id: 'rs-3', when: 'Mon, May 19 · 9:00 AM', dur: '2h',
    score: 'Fallback', tone: 'default',
    tech: 'Diane K.',
    reason: 'Low-load Monday · cross-train Diane on F3 filter swap.'
  }
];

export const community = {
  name: 'Cedar Ridge Senior Living',
  shift: 'Day Shift · Fri, May 16',
  aiStatus: 'Coordinating'
};

export const readiness = [
  { label: 'Regulatory Comp.', value: 94, suffix: '%', tone: 'success', icon: 'verified' },
  { label: 'PM Comp.', value: 82, suffix: '%', tone: 'warning', icon: 'event_repeat' },
  { label: 'Total Task Comp.', value: 76, suffix: '%', tone: 'warning', icon: 'task_alt' },
  { label: 'Document Upload', value: 88, suffix: '%', tone: 'success', icon: 'description' },
  { label: 'Active Tasks', value: 47, suffix: '', tone: 'info', icon: 'assignment' },
  { label: 'WO > 30 Days', value: 6, suffix: '', tone: 'error', icon: 'schedule' },
  { label: 'Avg. WO Time', value: '2.4d', suffix: '', tone: 'info', icon: 'timer' },
  { label: 'Unit Turn Ready', value: 67, suffix: '%', tone: 'warning', icon: 'meeting_room' }
];

export const aiBanner = {
  title: 'Unit 214 turn is at risk',
  body: 'HVAC backlog and low ready-room inventory may impact tomorrow’s 10 AM move-in.',
  confidence: 'High confidence'
};

export const weather = {
  headline: 'Cold snap expected tonight · 22°F low',
  body: 'AI elevated boiler checks and freeze-risk inspections to Tier 1.'
};

export const tiers = [
  {
    id: 't1',
    label: 'Tier 1 · Life Safety / Continuity',
    tone: 'error',
    icon: 'crisis_alert',
    tasks: [
      {
        id: 'wo-1041',
        title: 'Fire panel trouble signal — West Wing',
        location: 'Bldg A · Panel 3',
        tech: 'Marco D.',
        eta: '45m',
        status: 'In progress',
        kpi: 'Life Safety',
        reason: 'Panel trouble flagged 11 min ago; survey window opens Monday.',
        reasoning: true
      },
      {
        id: 'wo-1038',
        title: 'Boiler #2 pre-freeze inspection',
        location: 'Mech Room B',
        tech: 'Jake R.',
        eta: '1h 15m',
        status: 'Queued',
        kpi: 'Operational Continuity',
        reason: 'Elevated by weather signal — overnight low 22°F.',
        reasoning: true
      }
    ]
  },
  {
    id: 't2',
    label: 'Tier 2 · Unit Turns / Move-In',
    tone: 'warning',
    icon: 'meeting_room',
    tasks: [
      {
        id: 'ut-214',
        title: 'Unit 214 HVAC recommission',
        location: 'Unit 214',
        tech: 'Reassign needed',
        eta: '3h',
        status: 'At risk',
        kpi: 'Move-In Readiness',
        reason: 'Move-in tomorrow 10 AM. Filter stock low; vendor backup recommended.',
        reasoning: true,
        needsReview: true
      },
      {
        id: 'ut-117',
        title: 'Unit 117 paint touch-up + walkthrough',
        location: 'Unit 117',
        tech: 'Sasha P.',
        eta: '90m',
        status: 'On track',
        kpi: 'Move-In Readiness',
        reason: 'Sequenced after HVAC clears; resident orientation 4 PM.',
        reasoning: true
      }
    ]
  },
  {
    id: 't3',
    label: 'Tier 3 · Survey / Inspection',
    tone: 'info',
    icon: 'fact_check',
    tasks: [
      {
        id: 'sv-22',
        title: 'Generator load-test documentation',
        location: 'Generator Yard',
        tech: 'Marco D.',
        eta: '30m',
        status: 'Doc pending',
        kpi: 'Regulatory Comp.',
        reason: 'Survey window opens in 9 days. Doc upload incomplete.',
        reasoning: true
      }
    ]
  },
  {
    id: 't4',
    label: 'Tier 4 · Recurring PM',
    tone: 'default',
    icon: 'event_repeat',
    tasks: [
      {
        id: 'pm-88',
        title: 'Quarterly filter replacement — Floor 3',
        location: 'Floor 3 · Common',
        tech: 'Jake R.',
        eta: '2h',
        status: 'Deferrable',
        kpi: 'PM Comp.',
        reason: 'Deferrable 24h — capacity reallocated to Unit 214.',
        reasoning: true
      }
    ]
  },
  {
    id: 't5',
    label: 'Tier 5 · Quick Wins',
    tone: 'success',
    icon: 'bolt',
    tasks: [
      {
        id: 'qw-3',
        title: 'Batch: 4 light fixtures · 2 cabinet hinges',
        location: 'Floor 2 · Various',
        tech: 'Diane K.',
        eta: '55m',
        status: 'Batched',
        kpi: 'Resident Sat.',
        reason: 'Co-located along Diane’s 2 PM route. Zero detour cost.',
        reasoning: true
      }
    ]
  }
];

export const mdSchedule = [
  {
    id: 'md-1', time: '8:00 AM', dur: '30m', kind: 'Standup',
    title: 'Morning huddle · Maintenance team',
    location: 'Shop floor', icon: 'groups', tone: 'info',
    note: 'AI pre-loaded today’s Tier-1 sequencing for review.'
  },
  {
    id: 'md-2', time: '9:15 AM', dur: '20m', kind: 'Approval',
    title: 'Approve vendor dispatch · Apex Mechanical',
    location: 'Unit 214 turn', icon: 'support_agent', tone: 'warning',
    note: 'AI recommended; awaiting your call. Move-in 10 AM tomorrow.'
  },
  {
    id: 'md-3', time: '10:30 AM', dur: '45m', kind: 'Walkthrough',
    title: 'Fire panel inspection · West Wing',
    location: 'Bldg A · Panel 3', icon: 'local_fire_department', tone: 'error',
    note: 'Marco D. on-site; confirm trouble-signal resolution.'
  },
  {
    id: 'md-4', time: '1:00 PM', dur: '30m', kind: 'Review',
    title: 'Survey readiness check-in · Regulatory',
    location: 'Office', icon: 'fact_check', tone: 'info',
    note: 'Doc uploads at 88% — 3 items outstanding.'
  },
  {
    id: 'md-5', time: '3:30 PM', dur: '20m', kind: 'Override review',
    title: 'Confirm learned rule · Move-in HVAC priority',
    location: 'Office', icon: 'model_training', tone: 'default',
    note: 'AI proposed: when move-in <24h, HVAC supersedes PM filter swap.'
  },
  {
    id: 'md-6', time: '4:30 PM', dur: '15m', kind: 'Sign-off',
    title: 'Day-end KPI sign-off',
    location: 'Office', icon: 'task_alt', tone: 'success',
    note: 'PM Comp. projected 84% by EOD (+2 pts).'
  }
];

export const team = [
  {
    id: 'tm-1', name: 'Marco D.', role: 'Lead Tech', shift: '7a–3p',
    capacity: 8, load: 7.5, status: 'On-site',
    tasks: [
      { time: '7:30 AM', dur: '15m', kind: 'Standup', title: 'Shift handoff w/ overnight tech',
        location: 'Shop floor', icon: 'groups', tone: 'info',
        note: 'No overnight events. Fire panel alert opened 11 min ago.' },
      { time: '8:00 AM', dur: '90m', kind: 'Tier 1', title: 'Fire panel trouble signal — West Wing',
        location: 'Bldg A · Panel 3', icon: 'local_fire_department', tone: 'error',
        note: 'Survey window opens Monday — AI elevated to Tier 1.' },
      { time: '10:30 AM', dur: '45m', kind: 'Walkthrough', title: 'Walk MD through fire panel resolution',
        location: 'Bldg A · Panel 3', icon: 'fact_check', tone: 'default',
        note: 'Confirm signal cleared; sign documentation.' },
      { time: '12:00 PM', dur: '30m', kind: 'Break', title: 'Lunch',
        location: 'Break room', icon: 'restaurant', tone: 'default', note: '' },
      { time: '1:30 PM', dur: '90m', kind: 'Tier 3', title: 'Generator load-test documentation',
        location: 'Generator yard', icon: 'description', tone: 'info',
        note: 'Doc upload outstanding — counts toward regulatory %.' }
    ]
  },
  {
    id: 'tm-2', name: 'Jake R.', role: 'HVAC Tech', shift: '7a–3p',
    capacity: 8, load: 9.5, status: 'Over capacity',
    tasks: [
      { time: '7:30 AM', dur: '30m', kind: 'Prep', title: 'Boiler #2 parts pull + warmup',
        location: 'Mech Room B', icon: 'build', tone: 'default', note: '' },
      { time: '8:00 AM', dur: '75m', kind: 'Tier 1', title: 'Boiler #2 pre-freeze inspection',
        location: 'Mech Room B', icon: 'ac_unit', tone: 'error',
        note: 'Elevated by overnight 22°F low.' },
      { time: '11:00 AM', dur: '3h', kind: 'Tier 2', title: 'Unit 214 HVAC recommission',
        location: 'Unit 214', icon: 'meeting_room', tone: 'warning',
        suggestion: {
          body: 'Reassign Unit 214 HVAC to Apex Mechanical and defer PM filter swap to Saturday AM.',
          primary: 'Accept',
          secondary: 'Reassign manually'
        } },
      { time: '2:30 PM', dur: '2h', kind: 'PM (deferrable)', title: 'Quarterly filter replacement — Floor 3',
        location: 'Floor 3 common', icon: 'event_repeat', tone: 'default',
        suggestion: {
          body: 'Move to a lower-load window to relieve today’s overload. PM Comp. drops 2 pts this week but recovers next.',
          primary: 'Reschedule',
          secondary: 'Keep on today',
          action: 'reschedule'
        } }
    ]
  },
  {
    id: 'tm-3', name: 'Sasha P.', role: 'Turn Specialist', shift: '8a–4p',
    capacity: 8, load: 6.5, status: 'On track',
    tasks: [
      { time: '8:30 AM', dur: '30m', kind: 'Prep', title: 'Stage paint + touch-up kit',
        location: 'Shop floor', icon: 'palette', tone: 'default', note: '' },
      { time: '10:00 AM', dur: '90m', kind: 'Tier 2', title: 'Unit 117 paint touch-up',
        location: 'Unit 117', icon: 'format_paint', tone: 'success',
        note: 'Sequenced after HVAC clears 117 corridor.' },
      { time: '1:00 PM', dur: '45m', kind: 'QA', title: 'Unit 117 final QA pass',
        location: 'Unit 117', icon: 'task_alt', tone: 'info', note: '' },
      { time: '4:00 PM', dur: '30m', kind: 'Resident', title: 'Move-in walkthrough · Unit 117',
        location: 'Unit 117', icon: 'tour', tone: 'info',
        note: 'Resident orientation; flag any concerns to MD.' }
    ]
  },
  {
    id: 'tm-4', name: 'Diane K.', role: 'General Maint.', shift: '9a–5p',
    capacity: 8, load: 5, status: 'Has capacity',
    tasks: [
      { time: '9:00 AM', dur: '60m', kind: 'Resident', title: 'Resident requests · morning batch (3)',
        location: 'Floor 1', icon: 'home_repair_service', tone: 'success',
        note: 'AI grouped along east-corridor route.' },
      { time: '2:00 PM', dur: '55m', kind: 'Quick wins', title: 'Batched: 4 fixtures · 2 cabinet hinges',
        location: 'Floor 2', icon: 'bolt', tone: 'success',
        note: 'Zero detour cost on Diane’s 2 PM route.' },
      { time: '3:15 PM', dur: '20m', kind: 'Resident', title: 'Apt 308 blinds replacement',
        location: 'Apt 308', icon: 'blinds', tone: 'default', note: '' }
    ]
  },
  {
    id: 'tm-5', name: 'Luis M.', role: 'Apprentice', shift: 'PTO',
    capacity: 0, load: 0, status: 'Out today',
    tasks: []
  }
];

export const reviews = [
  {
    id: 'rv-1',
    kind: 'Competing critical issues',
    icon: 'priority_high',
    summary:
      'Fire panel trouble and boiler pre-freeze inspection both hit Tier 1 within the same hour.',
    recommended: 'Hold Jake on Boiler #2; route Marco to fire panel first.',
    tradeoff: 'Pushes one Tier-4 PM to tomorrow morning.'
  },
  {
    id: 'rv-2',
    kind: 'Vendor recommendation',
    icon: 'support_agent',
    summary:
      'Unit 214 HVAC has 3 repeat failures in 90 days; in-house ETA risks the 10 AM move-in.',
    recommended: 'Dispatch Apex Mechanical (preferred vendor, 2-hr response).',
    tradeoff: '$640 vendor cost vs. delayed move-in + resident-sat hit.',
    vendor: true
  },
  {
    id: 'rv-3',
    kind: 'Staffing overload',
    icon: 'groups',
    summary:
      'Jake R. is sequenced for 9.5 hrs of work today (1.5 hrs over capacity).',
    recommended: 'Move PM filter replacement to Saturday AM.',
    tradeoff: 'PM completion % drops 2 pts this week.'
  }
];
