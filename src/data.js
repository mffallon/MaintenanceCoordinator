export const rescheduleOptions = [
  {
    id: 'rs-1', when: 'Sat, May 17 · 8:00 AM', dur: '2h',
    score: 'Best fit', tone: 'success',
    tech: 'Jacob B.',
    reason: 'Lightest scheduled day · no Critical conflicts · keeps original assignee.'
  },
  {
    id: 'rs-2', when: 'Sat, May 17 · 1:00 PM', dur: '2h',
    score: 'Good', tone: 'info',
    tech: 'Jacob B.',
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
  body: 'HVAC backlog + low ready-room stock threatens tomorrow’s 10 AM move-in — lost first-month revenue and a family escalation if it slips.',
  confidence: 'High confidence'
};

export const weather = {
  headline: 'Cold snap expected tonight · 22°F low',
  body: 'AI raised boiler + freeze-risk inspections to Critical — a freeze burst means resident heat loss and a major emergency repair bill.'
};

export const tiers = [
  {
    id: 't1',
    label: 'Critical · Life Safety / Continuity',
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
        reason: 'Flagged 11 min ago. Open trouble signal = citable life-safety deficiency; state survey window opens Monday.',
        reasoning: true
      },
      {
        id: 'wo-1038',
        title: 'Boiler #2 pre-freeze inspection',
        location: 'Mech Room B',
        tech: 'Jacob B.',
        eta: '1h 15m',
        status: 'Queued',
        kpi: 'Operational Continuity',
        reason: 'Elevated by weather signal — 22°F overnight low. A freeze burst risks resident heat loss + a major repair bill.',
        elevated: true,
        reasoning: true
      }
    ]
  },
  {
    id: 't2',
    label: 'High · Move-In & Overdue Compliance',
    tone: 'warning',
    icon: 'priority_high',
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
        id: 'tk-1',
        title: 'Test operation of doors and locks',
        location: 'Doors, Locks, Gates & Alarms',
        tech: 'Bruce Wayne',
        eta: '45m',
        status: 'Overdue',
        kpi: 'Regulatory Comp.',
        reason: 'Overdue weekly regulatory check — bumped to High and slotted today; survey exposure grows daily.',
        elevated: true,
        reasoning: true
      },
      {
        id: 'tk-2',
        title: 'Generator visual inspection + logbook entry',
        location: 'Emergency Power Generators',
        tech: 'Sasha P.',
        eta: '1h',
        status: 'Overdue',
        kpi: 'Regulatory Comp.',
        reason: 'Overdue weekly exercise; logbook gap. AI assigned Sasha (capacity today).',
        elevated: true,
        reasoning: true
      },
      {
        id: 'tk-3',
        title: 'Test and log hot water temperatures',
        location: 'Water Temperature Checks',
        tech: 'Diane K.',
        eta: '30m',
        status: 'Overdue',
        kpi: 'Regulatory Comp.',
        reason: 'Overdue weekly Legionella-risk log. AI assigned Diane (capacity today).',
        elevated: true,
        reasoning: true
      },
      {
        id: 'tk-4',
        title: 'Check temperatures in freezers and refrigerators',
        location: 'Refrigerator/Freezer Combos',
        tech: 'Diane K.',
        eta: '20m',
        status: 'Overdue',
        kpi: 'Regulatory Comp.',
        reason: 'Overdue daily food-safety log. Batched onto Diane’s afternoon route.',
        elevated: true,
        reasoning: true
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
    label: 'Medium · Survey / Inspection',
    tone: 'info',
    icon: 'fact_check',
    tasks: [
      {
        id: 'tk-6',
        title: 'Fire extinguisher monthly visual inspection',
        location: 'Fire Extinguishers',
        tech: 'Marco D.',
        eta: '1h 30m',
        status: 'Open',
        kpi: 'Regulatory Comp.',
        reason: 'Monthly regulatory inspection due May 22 — batched with Marco’s rounds.',
        reasoning: true
      }
    ]
  },
  {
    id: 't4',
    label: 'Low · Recurring PM',
    tone: 'default',
    icon: 'event_repeat',
    tasks: [
      {
        id: 'tk-7',
        title: 'Replace air handler filters — common areas',
        location: 'HVAC · Common',
        tech: 'Jacob B.',
        eta: '2h',
        status: 'Deferrable',
        kpi: 'PM Comp.',
        reason: 'Monthly PM due May 23 — deferrable; capacity reallocated to Unit 214.',
        reasoning: true
      }
    ]
  },
  {
    id: 't5',
    label: 'Routine · Quick Wins',
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
    id: 'md-lunch', time: '12:00 PM', dur: '30m', kind: 'Break',
    title: 'Lunch',
    location: 'Break room', icon: 'restaurant', tone: 'default', note: ''
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
    id: 'tm-1', name: 'Marco D.', role: 'Lead Tech', shift: '8a–5p',
    capacity: 8, load: 7.5, status: 'On-site',
    tasks: [
      { time: '8:00 AM', dur: '90m', kind: 'Critical', title: 'Fire panel trouble signal — West Wing',
        location: 'Bldg A · Panel 3', icon: 'local_fire_department', tone: 'error',
        note: 'Survey window opens Monday — AI elevated to Critical.' },
      { time: '9:30 AM', dur: '45m', kind: 'PM', title: 'Mechanical room gauge & belt round',
        location: 'Mech Room A', icon: 'speed', tone: 'default', note: '' },
      { time: '10:30 AM', dur: '45m', kind: 'Walkthrough', title: 'Walk you through fire panel resolution',
        location: 'Bldg A · Panel 3', icon: 'fact_check', tone: 'default',
        note: 'Confirm signal cleared; sign documentation.' },
      { time: '11:15 AM', dur: '45m', kind: 'Life Safety', title: 'Emergency lighting spot check — East Wing',
        location: 'Bldg B', icon: 'emergency', tone: 'default', note: '' },
      { time: '12:00 PM', dur: '30m', kind: 'Break', title: 'Lunch',
        location: 'Break room', icon: 'restaurant', tone: 'default', note: '' },
      { time: '12:30 PM', dur: '30m', kind: 'Prep', title: 'Work-order triage + parts staging',
        location: 'Shop floor', icon: 'inventory_2', tone: 'default',
        note: 'AI pre-sorted today’s queue by priority.' },
      { time: '1:30 PM', dur: '90m', kind: 'Medium', title: 'Generator load-test documentation',
        location: 'Generator yard', icon: 'description', tone: 'info',
        note: 'Doc upload outstanding — counts toward regulatory %.' },
      { time: '3:00 PM', dur: '1h 30m', kind: 'PM', title: 'Rooftop RTU quarterly PM',
        location: 'Roof · RTU-3', icon: 'hvac', tone: 'default', note: '' }
    ]
  },
  {
    id: 'tm-2', name: 'Jacob B.', role: 'HVAC Tech', shift: '8a–5p',
    capacity: 8, load: 9.5, status: 'Over capacity',
    tasks: [
      { time: '7:30 AM', dur: '30m', kind: 'Prep', title: 'Boiler #2 parts pull + warmup',
        location: 'Mech Room B', icon: 'build', tone: 'default', note: '' },
      { time: '8:00 AM', dur: '75m', kind: 'Critical', title: 'Boiler #2 pre-freeze inspection',
        location: 'Mech Room B', icon: 'ac_unit', tone: 'error',
        note: 'Elevated by overnight 22°F low.' },
      { time: '11:00 AM', dur: '3h', kind: 'High', title: 'Unit 214 HVAC recommission',
        location: 'Unit 214', icon: 'meeting_room', tone: 'warning',
        suggestion: {
          body: 'Reassign Unit 214 HVAC to Apex Mechanical and defer PM filter swap to Saturday AM.',
          primary: 'Accept',
          secondary: 'Reassign manually'
        } },
      { time: '12:00 PM', dur: '30m', kind: 'Break', title: 'Lunch',
        location: 'Break room', icon: 'restaurant', tone: 'default', note: '' },
      { time: '2:30 PM', dur: '2h', kind: 'PM (deferrable)', title: 'Quarterly filter replacement — Floor 3',
        location: 'Floor 3 common', icon: 'event_repeat', tone: 'default',
        suggestion: {
          body: 'Move to a lower-load window to relieve today’s overload. No PM Comp. impact if completed by month-end (May 31).',
          primary: 'Reschedule',
          secondary: 'Keep on today',
          action: 'reschedule'
        } },
      { time: '1:00 PM', dur: '1h 30m', kind: 'High', title: 'RTU-4 compressor fault diagnosis',
        location: 'Roof · RTU-4', icon: 'hvac', tone: 'warning',
        note: 'Resident comfort complaints on Floor 4.' },
      { time: '3:00 PM', dur: '1h 30m', kind: 'PM', title: 'Cooling tower water-treatment check',
        location: 'Roof · Cooling tower', icon: 'water_drop', tone: 'default', note: '' }
    ]
  },
  {
    id: 'tm-3', name: 'Sasha P.', role: 'Turn Specialist', shift: '8a–5p',
    capacity: 8, load: 7.5, status: 'On track',
    tasks: [
      { time: '8:30 AM', dur: '30m', kind: 'Prep', title: 'Stage paint + touch-up kit',
        location: 'Shop floor', icon: 'palette', tone: 'default', note: '' },
      { time: '9:00 AM', dur: '1h', kind: 'Turn', title: 'Unit 119 turn — punch list',
        location: 'Unit 119', icon: 'meeting_room', tone: 'default', note: '' },
      { time: '10:00 AM', dur: '90m', kind: 'High', title: 'Unit 117 paint touch-up',
        location: 'Unit 117', icon: 'format_paint', tone: 'success',
        note: 'Sequenced after HVAC clears 117 corridor.' },
      { time: '11:30 AM', dur: '30m', kind: 'Prep', title: 'Stage materials · Unit 121 turn',
        location: 'Unit 121', icon: 'inventory_2', tone: 'default', note: '' },
      { time: '12:00 PM', dur: '30m', kind: 'Break', title: 'Lunch',
        location: 'Break room', icon: 'restaurant', tone: 'default', note: '' },
      { time: '12:30 PM', dur: '30m', kind: 'Resident', title: 'Resident request · Apt 204 door adjust',
        location: 'Apt 204', icon: 'home_repair_service', tone: 'default', note: '' },
      { time: '1:00 PM', dur: '45m', kind: 'QA', title: 'Unit 117 final QA pass',
        location: 'Unit 117', icon: 'task_alt', tone: 'info', note: '' },
      { time: '2:00 PM', dur: '1h', kind: 'High', title: 'Generator visual inspection + logbook',
        location: 'Emergency Power Generators', icon: 'electrical_services', tone: 'warning',
        note: 'AI slotted — overdue weekly regulatory; you had capacity today.' },
      { time: '3:00 PM', dur: '45m', kind: 'Turn', title: 'Unit 121 paint + caulk',
        location: 'Unit 121', icon: 'format_paint', tone: 'default', note: '' },
      { time: '4:00 PM', dur: '30m', kind: 'Resident', title: 'Move-in walkthrough · Unit 117',
        location: 'Unit 117', icon: 'tour', tone: 'info',
        note: 'Resident orientation; flag any concerns to you.' },
      { time: '4:30 PM', dur: '30m', kind: 'QA', title: 'Turn QA photos — upload to TELS',
        location: 'Office', icon: 'photo_camera', tone: 'default', note: '' }
    ]
  },
  {
    id: 'tm-4', name: 'Diane K.', role: 'General Maint.', shift: '8a–5p',
    capacity: 8, load: 5.8, status: 'Has capacity',
    tasks: [
      { time: '8:00 AM', dur: '45m', kind: 'PM', title: 'AM facility walk — common areas',
        location: 'Floors 1–3', icon: 'directions_walk', tone: 'default', note: '' },
      { time: '9:00 AM', dur: '60m', kind: 'Resident', title: 'Resident requests · morning batch (3)',
        location: 'Floor 1', icon: 'home_repair_service', tone: 'success',
        note: 'AI grouped along east-corridor route.' },
      { time: '10:00 AM', dur: '1h', kind: 'Resident', title: 'Resident requests · Floor 2 batch (4)',
        location: 'Floor 2', icon: 'home_repair_service', tone: 'default',
        note: 'AI grouped to minimize travel.' },
      { time: '11:00 AM', dur: '30m', kind: 'High', title: 'Test & log hot water temperatures',
        location: 'Water Temperature Checks', icon: 'thermostat', tone: 'warning',
        note: 'AI slotted — overdue weekly regulatory log.' },
      { time: '11:30 AM', dur: '30m', kind: 'Prep', title: 'Restock janitorial / PM cart',
        location: 'Supply room', icon: 'inventory_2', tone: 'default', note: '' },
      { time: '12:00 PM', dur: '30m', kind: 'Break', title: 'Lunch',
        location: 'Break room', icon: 'restaurant', tone: 'default', note: '' },
      { time: '1:00 PM', dur: '20m', kind: 'High', title: 'Check freezer / refrigerator temps',
        location: 'Refrigerator/Freezer Combos', icon: 'kitchen', tone: 'warning',
        note: 'AI batched — overdue daily food-safety log.' },
      { time: '1:20 PM', dur: '40m', kind: 'PM', title: 'Inspect bed rails — Wing B',
        location: 'Wing B', icon: 'bed', tone: 'default', note: '' },
      { time: '2:00 PM', dur: '55m', kind: 'Quick wins', title: 'Batched: 4 fixtures · 2 cabinet hinges',
        location: 'Floor 2', icon: 'bolt', tone: 'success',
        note: 'Zero detour cost on Diane’s 2 PM route.' },
      { time: '3:15 PM', dur: '20m', kind: 'Resident', title: 'Apt 308 blinds replacement',
        location: 'Apt 308', icon: 'blinds', tone: 'default', note: '' },
      { time: '3:35 PM', dur: '1h', kind: 'PM', title: 'Replace ceiling tiles · Corridor C',
        location: 'Corridor C', icon: 'grid_view', tone: 'default', note: '' },
      { time: '4:40 PM', dur: '20m', kind: 'Logs', title: 'Daily maintenance log close-out',
        location: 'Office', icon: 'task_alt', tone: 'default', note: '' }
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
      'Fire panel trouble and boiler pre-freeze inspection both hit Critical within the same hour.',
    recommended: 'Hold Jacob B. on Boiler #2; route Marco to fire panel first.',
    why: 'Fire panel is a life-safety system with a state survey window opening Monday — an open trouble signal is a citable deficiency. The boiler has an 8-hr thermal buffer before the overnight low hits.',
    tradeoff: 'Defers one Low PM to tomorrow AM — no PM Comp. or survey impact (due May 31).',
    confidence: 'High · life-safety rule, 4 similar calls upheld this quarter'
  },
  {
    id: 'rv-2',
    kind: 'Services Recommendation',
    icon: 'support_agent',
    summary:
      'Unit 214 HVAC has 3 repeat failures in 90 days; in-house ETA risks the 10 AM move-in.',
    recommended: 'Dispatch Apex Mechanical (preferred vendor, 2-hr response).',
    why: 'Asset history shows 3 repeat HVAC failures in 90 days — a pattern in-house repair hasn’t resolved. Apex is the preferred vendor with a 2-hr SLA, the only path that protects the 10 AM move-in.',
    tradeoff: '$640 vendor spend vs. a missed move-in: lost first-month revenue, family escalation, and a unit not survey-ready.',
    confidence: 'High · within approved vendor budget; repeat-failure threshold met',
    vendor: true
  },
  {
    id: 'rv-3',
    kind: 'Staffing overload',
    icon: 'groups',
    summary:
      'Jacob B. is sequenced 1.5 hrs over capacity — that’s unplanned overtime cost and burnout risk if left as-is.',
    confidence: 'High · capacity math from today’s assigned durations',
    recommendations: [
      {
        label: 'Recommended',
        body: 'Reassign Floor 3 filter PM to Diane K. — has 2.2 hrs open today.',
        why: 'Diane has the most open time on the team and is already routed through Floor 3, so the reassignment adds zero travel and keeps the PM on schedule.',
        tradeoff: 'Avoids 1.5 hrs OT; PM stays on today. Diane cross-trains on the AHU. No KPI impact.'
      },
      {
        label: 'Alternative',
        body: 'Move PM filter replacement to Saturday AM.',
        why: 'It’s a deferrable PM with no compliance deadline this week — the lowest-risk item to move when everyone is at capacity.',
        tradeoff: 'Avoids OT today; no PM Comp. impact unless it slips past month-end (May 31).'
      }
    ]
  }
];

export const tasksList = [
  {
    id: 'tk-1',
    category: 'Doors, Locks, Gates & Alarms',
    title: 'Test operation of doors and locks.',
    status: 'skipped',
    due: 'Due last week',
    cadence: 'Weekly',
    eta: '45m',
    assignee: 'Bruce Wayne',
    note: 'Logbook entry pending.',
    tags: ['Regulatory', 'Logs', 'Maintenance']
  },
  {
    id: 'tk-2',
    category: 'Emergency Power Generators',
    title: 'Visual inspection or exercise generator (with no load), perform routine checks, create entry in logbook.',
    status: 'overdue',
    due: 'Due last week',
    cadence: 'Weekly',
    eta: '1h',
    assignee: 'Sasha P.',
    note: null,
    tags: ['Regulatory', 'Logs', 'Maintenance']
  },
  {
    id: 'tk-3',
    category: 'Water Temperature Checks',
    title: 'Test and log the hot water temperatures.',
    status: 'skipped',
    due: 'Due last week',
    cadence: 'Weekly',
    eta: '30m',
    assignee: 'Diane K.',
    note: 'Logbook entry pending.',
    tags: ['Regulatory', 'Logs', 'Maintenance']
  },
  {
    id: 'tk-4',
    category: 'Refrigerator/Freezer Combos',
    title: 'Check temperatures in freezers and refrigerators.',
    status: 'skipped',
    due: 'Due last week',
    cadence: 'Daily',
    eta: '20m',
    assignee: 'Diane K.',
    note: 'Logbook entry pending.',
    tags: ['Logs', 'Maintenance']
  },
  {
    id: 'tk-5',
    category: 'Emergency Power Generators',
    title: 'Visual inspection or exercise generator (with no load), perform routine checks, create entry in logbook.',
    status: 'open',
    due: 'Due Fri, May 16',
    cadence: 'Weekly',
    eta: '1h',
    assignee: null,
    note: null,
    tags: ['Regulatory', 'Logs', 'Maintenance']
  },
  {
    id: 'tk-6',
    category: 'Fire Extinguishers',
    title: 'Monthly visual inspection — verify charge, access, and tag.',
    status: 'open',
    due: 'Due Thu, May 22',
    cadence: 'Monthly',
    eta: '1h 30m',
    assignee: 'Marco D.',
    note: null,
    tags: ['Regulatory', 'Logs']
  },
  {
    id: 'tk-7',
    category: 'HVAC',
    title: 'Replace air handler filters — common areas.',
    status: 'open',
    due: 'Due Fri, May 23',
    cadence: 'Monthly',
    eta: '2h',
    assignee: 'Jacob B.',
    note: null,
    tags: ['Maintenance']
  },
  {
    id: 'tk-8',
    category: 'Doors, Locks, Gates & Alarms',
    title: 'Test operation of doors and locks.',
    status: 'completed',
    due: 'Completed Wed, May 14',
    cadence: 'Weekly',
    eta: '45m',
    assignee: 'Bruce Wayne',
    note: null,
    tags: ['Regulatory', 'Logs', 'Maintenance']
  },
  {
    id: 'tk-9',
    category: 'Water Temperature Checks',
    title: 'Test and log the hot water temperatures.',
    status: 'completed',
    due: 'Completed Wed, May 14',
    cadence: 'Weekly',
    eta: '30m',
    assignee: 'Marco D.',
    note: null,
    tags: ['Regulatory', 'Logs', 'Maintenance']
  },
  {
    id: 'tk-10',
    category: 'Refrigerator/Freezer Combos',
    title: 'Check temperatures in freezers and refrigerators.',
    status: 'completed',
    due: 'Completed Thu, May 15',
    cadence: 'Daily',
    eta: '20m',
    assignee: 'Diane K.',
    note: null,
    tags: ['Logs', 'Maintenance']
  },

  { id: 'tk-11', category: 'Ansul', title: 'Have Fire Suppression System inspected by outside contractor',
    status: 'open', due: 'Due May 30', cadence: 'Monthly', eta: '2h',
    assignee: null, note: null, tags: ['Regulatory', 'Requires Doc', 'Maintenance'] },
  { id: 'tk-12', category: 'Detectors', title: 'Change batteries in battery-operated smoke detectors',
    status: 'open', due: 'Due May 28', cadence: 'Monthly', eta: '1h 30m',
    assignee: null, note: null, tags: ['Regulatory', 'Maintenance'] },
  { id: 'tk-13', category: 'Emergency Preparedness Drills', title: 'Conduct elopement drill (Missing Resident Drill)',
    status: 'skipped', due: 'Due last month', cadence: 'Monthly', eta: '45m',
    assignee: null, note: 'Documentation outstanding.', tags: ['Regulatory', 'Requires Doc', 'Logs', 'Maintenance'] },
  { id: 'tk-14', category: 'Emergency & Exit Lighting', title: 'Check illumination of exit lighting and exit signs.',
    status: 'open', due: 'Due May 27', cadence: 'Monthly', eta: '30m',
    assignee: 'Bruce Wayne', note: null, tags: ['Regulatory', 'Logs', 'Maintenance'] },
  { id: 'tk-15', category: 'Equipment', title: 'Patient-Care Related Electrical Equipment Testing and Maintenance',
    status: 'skipped', due: 'Due last month', cadence: 'Monthly', eta: '2h',
    assignee: null, note: 'Logbook entry pending.', tags: ['Regulatory', 'Requires Doc', 'Maintenance'] },
  { id: 'tk-16', category: 'Fire Drills', title: 'Perform a fire drill during 1st shift — upload signature sheet to TELS',
    status: 'open', due: 'Due May 29', cadence: 'Monthly', eta: '30m',
    assignee: null, note: null, tags: ['Regulatory', 'Requires Doc', 'Logs', 'Maintenance'] },
  { id: 'tk-17', category: 'Fire Sprinkler System', title: 'Semi-annual contractor testing',
    status: 'skipped', due: 'Due last month', cadence: 'Monthly', eta: '3h',
    assignee: null, note: 'Contractor schedule + doc upload pending.', tags: ['Regulatory', 'Requires Doc', 'Maintenance'] },
  { id: 'tk-18', category: 'Nurse Call Systems', title: 'Conduct a test of the nurse call system.',
    status: 'overdue', due: 'Due last month', cadence: 'Monthly', eta: '1h',
    assignee: null, note: 'Critical — life-safety overdue.', tags: ['Regulatory', 'Logs', 'Maintenance'] },
  { id: 'tk-19', category: 'Beds — Electric', title: 'Inspect bed rails',
    status: 'open', due: 'Due May 26', cadence: 'Monthly', eta: '45m',
    assignee: null, note: null, tags: ['Maintenance'] },
  { id: 'tk-20', category: 'Facility Safety', title: 'Quarterly facility safety walkthrough',
    status: 'skipped', due: 'Due last month', cadence: 'Quarterly', eta: '1h 30m',
    assignee: null, note: 'Documentation outstanding.', tags: ['Requires Doc', 'Maintenance'] },
  { id: 'tk-21', category: 'Exhaust Fans', title: 'Inspect exhaust fans for proper operation and clean if necessary',
    status: 'open', due: 'Due May 28', cadence: 'Monthly', eta: '1h',
    assignee: null, note: null, tags: ['Maintenance'] },
  { id: 'tk-22', category: 'Fire Extinguishers', title: 'Check and initial fire extinguishers',
    status: 'completed', due: 'Completed Tue, May 13', cadence: 'Monthly', eta: '1h',
    assignee: 'Marco D.', note: null, tags: ['Regulatory', 'Maintenance'] },
  { id: 'tk-23', category: 'Emergency & Exit Lighting', title: 'Check illumination of exit lighting and exit signs.',
    status: 'completed', due: 'Completed Mon, May 12', cadence: 'Monthly', eta: '30m',
    assignee: 'Bruce Wayne', note: null, tags: ['Regulatory', 'Logs', 'Maintenance'] },
  { id: 'tk-24', category: 'Exhaust Fans', title: 'Inspect exhaust fans for proper operation and clean if necessary',
    status: 'completed', due: 'Completed Wed, May 14', cadence: 'Monthly', eta: '1h',
    assignee: 'Diane K.', note: null, tags: ['Maintenance'] },
  { id: 'tk-25', category: 'HVAC (RTU)', title: 'Clean / change air filter and verify unit operation',
    status: 'completed', due: 'Completed Thu, May 15', cadence: 'Monthly', eta: '1h 30m',
    assignee: 'Bruce Wayne', note: null, tags: ['Maintenance'] }
];

// Last 24h of autonomous AI scheduling/prioritization decisions, newest first.
// status: 'in-progress' | 'queued' | 'completed' — non-completed can still be
// modified by the Maintenance Director (reschedule / reassign / snooze).
export const aiActivity = [
  {
    id: 'ai-1', ago: '11 min ago', clock: '7:49 AM', action: 'Elevated', tone: 'error',
    title: 'Fire panel trouble signal — West Wing',
    detail: 'Raised to Critical — survey window opens Monday; 8-hr resolution target.',
    assignee: 'Marco D.', when: 'This morning',
    target: 'Bldg A · Panel 3', status: 'in-progress'
  },
  {
    id: 'ai-2', ago: '34 min ago', clock: '7:26 AM', action: 'Elevated', tone: 'error',
    title: 'Boiler #2 pre-freeze inspection',
    detail: 'Elevated by weather signal — overnight low 22°F forecast.',
    assignee: 'Jacob B.', when: 'This morning',
    target: 'Mech Room B', status: 'queued'
  },
  {
    id: 'ai-3', ago: '1 hr ago', clock: '7:02 AM', action: 'Assigned', tone: 'warning',
    title: 'Generator visual inspection + logbook',
    detail: 'Overdue weekly check — assigned to Sasha P. (had capacity today).',
    assignee: 'Sasha P.', when: 'This afternoon',
    target: 'Emergency Power Generators', status: 'queued'
  },
  {
    id: 'ai-4', ago: '1 hr ago', clock: '6:58 AM', action: 'Prioritized', tone: 'warning',
    title: 'Unit 214 HVAC recommission',
    detail: 'Bumped to High — move-in 10 AM tomorrow; vendor backup recommended.',
    assignee: 'Unassigned', when: 'This morning',
    target: 'Unit 214', status: 'in-progress'
  },
  {
    id: 'ai-5', ago: '2 hrs ago', clock: '6:05 AM', action: 'Batched', tone: 'default',
    title: '4 overdue food-safety & water logs',
    detail: 'Grouped onto Diane K.’s afternoon route to minimize travel.',
    assignee: 'Diane K.', when: 'This afternoon',
    target: 'Floors 1–3', status: 'queued'
  },
  {
    id: 'ai-6', ago: '3 hrs ago', clock: '5:14 AM', action: 'Rescheduled', tone: 'default',
    title: 'Quarterly filter replacement — Floor 3',
    detail: 'Deferred to relieve Jacob’s overload — no PM Comp. impact before May 31.',
    assignee: 'Jacob B.', when: 'Sat AM',
    target: 'Floor 3 common', status: 'queued'
  },
  {
    id: 'ai-7', ago: '6 hrs ago', clock: '2:30 AM', action: 'Sequenced', tone: 'info',
    title: 'Tomorrow’s critical path pre-loaded',
    detail: 'Ordered 31 work orders by risk and capacity for your review.',
    assignee: 'Whole team', when: 'Today',
    target: 'All buildings', status: 'completed'
  },
  {
    id: 'ai-8', ago: '9 hrs ago', clock: '11:48 PM', action: 'Assigned', tone: 'default',
    title: 'Emergency lighting spot check — East Wing',
    detail: 'Routed to Marco D. on his Bldg B pass — zero added travel.',
    assignee: 'Marco D.', when: 'This morning',
    target: 'Bldg B', status: 'completed'
  },
  {
    id: 'ai-9', ago: '14 hrs ago', clock: '6:20 PM', action: 'Snoozed', tone: 'default',
    title: 'Corridor C ceiling-tile replacement',
    detail: 'Low-risk cosmetic PM — held 24h while crew cleared move-in load.',
    assignee: 'Diane K.', when: 'Tomorrow AM',
    target: 'Corridor C', status: 'queued'
  },
  {
    id: 'ai-10', ago: '19 hrs ago', clock: '1:05 PM', action: 'Dispatched', tone: 'warning',
    title: 'Apex Mechanical — Unit 214 vendor hold',
    detail: 'Pre-staged vendor request pending your approval (3 repeat failures/90d).',
    assignee: 'Apex Mechanical', when: 'Tomorrow AM',
    target: 'Unit 214', status: 'in-progress'
  },
  {
    id: 'ai-11', ago: '23 hrs ago', clock: '9:12 AM', action: 'Auto-closed', tone: 'success',
    title: 'Fire extinguisher monthly initials',
    detail: 'AI confirmed logbook upload to TELS and closed the task.',
    assignee: 'Marco D.', when: 'Yesterday AM',
    target: 'All floors', status: 'completed'
  }
];

// Day 30 — Trust Maturity. The AI is calibrated to this building's patterns;
// MD shifts from inspecting every call to monitoring exceptions.
export const calibration = {
  headline: 'AI is calibrated to Cedar Ridge operations',
  sub: 'Tuned to your building’s patterns over the last 30 days',
  acceptance: 82,
  // 30-day window: Apr 16 → May 16, 2025. series = weekly-ish samples.
  rangeStart: 'Apr 16',
  rangeEnd: 'May 16',
  stats: [
    {
      icon: 'thumb_up', label: 'Recommendations accepted', value: '82%', trend: '+11 pts', tone: 'success',
      unit: '%', start: 71, current: 82,
      detail: 'Share of AI recommendations you approved without changes.',
      series: [71, 72, 74, 73, 76, 78, 80, 81, 82],
      days: [1,2,0,1,2,1,2,0,2,3,1,2,2,1,3,2,3,2,1,3,2,3,3,2,3,3,2,3,3,3]
    },
    {
      icon: 'model_training', label: 'Override rules learned', value: '6', trend: 'this month', tone: 'info',
      unit: '', start: 0, current: 6,
      detail: 'Override patterns the AI generalized into reusable rules.',
      series: [0, 0, 1, 2, 2, 3, 4, 5, 6],
      days: [0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,3,0,0,0,0,3,0,0,0,3]
    },
    {
      icon: 'history_toggle_off', label: 'WO aging reduced', value: '14%', trend: 'vs. Day 1', tone: 'success',
      unit: '%', start: 0, current: 14,
      detail: 'Reduction in average work-order age vs. the Day 1 baseline.',
      series: [0, 2, 3, 5, 7, 9, 11, 13, 14],
      days: [0,1,0,1,1,2,1,1,2,1,2,2,1,2,2,2,2,3,2,2,3,2,3,2,3,3,2,3,3,3]
    },
    {
      icon: 'meeting_room', label: 'Unit-turn readiness', value: '+9%', trend: '67% → 76%', tone: 'success',
      unit: '%', start: 67, current: 76,
      detail: 'Percent of units inspection-ready on the target date.',
      series: [67, 68, 68, 70, 71, 73, 74, 75, 76],
      days: [1,1,2,1,1,2,1,2,1,2,2,1,2,2,2,1,2,2,3,2,2,3,2,3,2,3,3,2,3,3]
    },
    {
      icon: 'event_repeat', label: 'PM completion trend', value: '82 → 88%', trend: 'projected EOM', tone: 'success',
      unit: '%', start: 82, current: 88,
      detail: 'Preventive-maintenance completion, projected to end of month.',
      series: [82, 82, 83, 84, 85, 85, 86, 87, 88],
      days: [2,3,2,3,2,3,3,2,3,3,2,3,3,3,2,3,3,3,2,3,3,3,3,2,3,3,3,3,3,3]
    },
    {
      icon: 'pattern', label: 'Repeat-issue patterns', value: '3 found', trend: 'HVAC · Memory Care East', tone: 'warning',
      unit: '', start: 0, current: 3,
      detail: 'Recurring asset-failure clusters surfaced for vendor review.',
      series: [0, 0, 1, 1, 1, 2, 2, 3, 3],
      days: [0,0,0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,3,0,0,0,2,0,0,3,0,0,2,0,3]
    }
  ],
  patterns: [
    'Recurring HVAC faults detected in Memory Care East — vendor review suggested.',
    'Move-in HVAC consistently supersedes PM filter swaps — rule learned.',
    'Quick-win batching on afternoon routes cuts travel ~18%.'
  ]
};

// Day 30 — AI has already rebalanced the team from learned history.
// keyed by team member id.
export const day30TeamNotes = {
  'tm-1': 'Held on life-safety rounds — fastest fire-panel resolution history.',
  'tm-2': 'Protected for HVAC issues ahead of tonight’s cold-snap risk.',
  'tm-3': 'Assigned Unit 214 — faster unit-turn completion than team avg.',
  'tm-4': 'Quick wins batched after PM block — lowest detour cost.',
  'tm-5': 'Out (PTO) — load auto-redistributed across team.'
};
