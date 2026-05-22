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
        recommend: 'AI recommends immediate scheduling — an open fire-panel trouble signal is a citable life-safety deficiency ahead of Monday’s survey window.',
        confidence: 'High · life-safety rule',
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
        recommend: 'AI recommends immediate scheduling due to tonight’s freeze risk and prior seasonal boiler issues.',
        confidence: 'High · weather risk detected',
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
        recommend: 'AI recommends prioritizing this above routine PM — tomorrow’s move-in may be impacted and ready-room inventory is low.',
        confidence: 'Medium · learning unit-turn patterns',
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
        recommend: 'AI recommends slotting this today — it’s an overdue weekly regulatory check and survey exposure grows daily.',
        confidence: 'Medium · learning your compliance cadence',
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
        recommend: 'AI recommends assigning Sasha — she has capacity today and this overdue weekly exercise has a logbook gap.',
        confidence: 'Medium · learning technician availability',
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
        recommend: 'AI recommends Diane for this overdue Legionella-risk log — she has open capacity this afternoon.',
        confidence: 'Medium · learning technician availability',
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
        reason: 'Overdue daily food-safety log. Bundled onto Diane’s afternoon route.',
        recommend: 'AI recommends bundling this onto Diane’s afternoon route — it’s an overdue daily food-safety log.',
        confidence: 'Medium · learning route efficiency',
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
        recommend: 'AI recommends sequencing this after HVAC clears the corridor; resident orientation is at 4 PM.',
        confidence: 'Medium · learning unit-turn timing',
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
        recommend: 'AI recommends bundling this with Marco’s rounds — the monthly inspection is due May 22.',
        confidence: 'Medium · learning your monthly cadence',
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
        recommend: 'AI recommends deferring this monthly PM — capacity is better spent on the at-risk Unit 214 turn.',
        confidence: 'Low · awaiting MD preference on PM tradeoffs',
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
        title: 'Bundled: 4 light fixtures · 2 cabinet hinges',
        location: 'Floor 2 · Various',
        tech: 'Diane K.',
        eta: '55m',
        status: 'Bundled',
        kpi: 'Resident Sat.',
        reason: 'Co-located along Diane’s 2 PM route. Zero detour cost.',
        recommend: 'AI recommends bundling this in the AM only if no higher-priority items remain.',
        confidence: 'Low · awaiting MD preference',
        reasoning: true
      }
    ]
  }
];

// Unassigned / backlog work orders — lower-criticality or awaiting parts.
// Not on today's dispatch board; held for planning and spare capacity.
export const backlog = [
  {
    id: 'wo-1052', title: 'Replace worn carpet transition strip — 2F corridor',
    category: 'Flooring', location: 'Floor 2 · Corridor B', priority: 'Low',
    status: 'Unassigned', assignee: null, eta: '30m', opened: 'May 6',
    reason: 'Cosmetic trip-edge in a low-traffic span; below today’s capacity cut.'
  },
  {
    id: 'wo-1053', title: 'Patch & repaint drywall scuff — Activity Room',
    category: 'Drywall / Paint', location: 'Activity Room', priority: 'Low',
    status: 'Unassigned', assignee: null, eta: '45m', opened: 'May 9',
    reason: 'Cosmetic only; deferred behind this week’s move-in turns.'
  },
  {
    id: 'wo-1054', title: 'Replace parking-lot pole light fixture head',
    category: 'Exterior Lighting', location: 'North Lot · Pole 4', priority: 'Medium',
    status: 'Awaiting parts', assignee: null, eta: '1h 30m', opened: 'Apr 28',
    reason: 'LED fixture head on order — vendor ETA May 22. Pole stays dark at night until then.'
  },
  {
    id: 'wo-1055', title: 'Repair walk-in cooler door gasket — Kitchen',
    category: 'Refrigeration', location: 'Kitchen · Walk-in cooler', priority: 'Medium',
    status: 'Awaiting parts', assignee: null, eta: '1h', opened: 'May 2',
    reason: 'Gasket backordered — ETA May 20. Temps holding; monitored daily in the interim.'
  },
  {
    id: 'wo-1056', title: 'Re-caulk resident bathtubs — Units 203 & 207',
    category: 'Plumbing', location: 'Units 203, 207', priority: 'Low',
    status: 'Unassigned', assignee: null, eta: '1h', opened: 'May 11',
    reason: 'Preventive moisture seal; not urgent — pooled for a low-load day.'
  },
  {
    id: 'wo-1057', title: 'Replace bathroom exhaust fan motor — Unit 142',
    category: 'HVAC', location: 'Unit 142', priority: 'Medium',
    status: 'Awaiting parts', assignee: null, eta: '45m', opened: 'May 5',
    reason: 'Replacement motor on order — ETA May 23. Fan noisy but still operational.'
  },
  {
    id: 'wo-1058', title: 'Realign automatic entry-door sensor — Main Lobby',
    category: 'Doors & Access', location: 'Main Lobby', priority: 'Medium',
    status: 'Unassigned', assignee: null, eta: '40m', opened: 'May 13',
    reason: 'Door re-cycles intermittently; not a safety stop. Awaiting crew capacity.'
  },
  {
    id: 'wo-1059', title: 'Replace cracked window pane — Sunroom',
    category: 'Glazing', location: 'Sunroom', priority: 'Low',
    status: 'Awaiting parts', assignee: null, eta: '1h', opened: 'Apr 30',
    reason: 'Tempered pane on order — ETA May 24. Crack is stable and taped.'
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
      { time: '2:00 PM', dur: '55m', kind: 'Quick wins', title: 'Bundled: 4 fixtures · 2 cabinet hinges',
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
    id: 'ai-12', ago: '5 min ago', clock: '8:15 AM', action: 'Forecasted', tone: 'warning',
    title: 'HVAC emergency workload risk detected',
    detail: 'AI identified a PM degradation pattern tied to repeat emergency calls in Memory Care East.',
    assignee: 'Maria S.', when: 'Tomorrow morning',
    target: 'Memory Care East', status: 'monitoring'
  },
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
    id: 'ai-5', ago: '2 hrs ago', clock: '6:05 AM', action: 'Bundled', tone: 'default',
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

// Day 1 — "Learning your building." AI assists with recommendations;
// the MD stays in control. Banner + early calibration signals.
export const day1Status = {
  headline: 'Learning Cedar Ridge operations',
  sub: 'AI is recommending priorities while it learns technician patterns, unit-turn timing, and PM tradeoffs.',
  metrics: [
    { key: 'accepted', label: 'Recommendations accepted', value: '9', sub: 'this week' },
    { key: 'overrides', label: 'Overrides learned', value: '2', sub: 'so far' },
    { key: 'patterns', label: 'Patterns detected', value: '3', sub: 'early signals' }
  ]
};

// Detailed history behind each Day 1 metric tile — populates the drawer
// when the MD taps a tile. Each item is independently respondable.
export const day1MetricDetails = {
  accepted: {
    title: 'Recommendations accepted',
    sub: '9 AI recommendations you approved this week — the AI is calibrating to your decisions.',
    icon: 'thumb_up_alt',
    color: '#16A34A',
    items: [
      {
        id: 'ac-1', when: 'Today · 7:12 AM',
        title: 'Route Marco D. to fire panel first',
        body: 'You approved routing Marco to the West Wing fire-panel trouble signal ahead of his Bldg B sweep.',
        why: 'Life-safety priority — survey window opens Monday.',
        outcome: 'AI will keep this routing pattern for life-safety alerts.'
      },
      {
        id: 'ac-2', when: 'Today · 6:58 AM',
        title: 'Bundle 4 overdue logs onto Diane K.\'s route',
        body: 'You approved batching food-safety and water-temp logs onto her afternoon walk.',
        why: 'Zero added travel — same floor coverage.',
        outcome: 'AI will keep batching small log tasks onto existing routes.'
      },
      {
        id: 'ac-3', when: 'Yesterday · 4:18 PM',
        title: 'Defer Floor 3 filter PM to Saturday',
        body: 'You approved moving the deferrable PM to relieve Jacob B.\'s overload.',
        why: 'No compliance deadline before May 31.',
        outcome: 'AI will offer Saturday slots when PM is the lowest-risk deferral.'
      },
      {
        id: 'ac-4', when: 'Yesterday · 11:02 AM',
        title: 'Pre-stage Apex Mechanical for Unit 214',
        body: 'You approved a vendor hold ahead of tomorrow\'s 10 AM move-in.',
        why: '3 repeat HVAC failures in 90 days — in-house ETA at risk.',
        outcome: 'AI will pre-stage Apex when repeat-failure threshold is met.'
      },
      {
        id: 'ac-5', when: 'Wed · 2:45 PM',
        title: 'Assign generator inspection to Sasha P.',
        body: 'You accepted Sasha as the substitute after Bruce\'s capacity was tight.',
        why: 'Sasha had the most open time today.',
        outcome: 'AI will weight Sasha higher when Bruce is overloaded.'
      },
      {
        id: 'ac-6', when: 'Tue · 9:30 AM',
        title: 'Snooze ceiling-tile replacement 24 hrs',
        body: 'You accepted holding a low-risk cosmetic PM while move-in load cleared.',
        why: 'No safety or compliance impact.',
        outcome: 'AI will offer to snooze cosmetic PMs during move-in spikes.'
      },
      {
        id: 'ac-7', when: 'Mon · 8:05 AM',
        title: 'Sequence tomorrow\'s critical path',
        body: 'You approved the AI\'s ordering of 31 work orders by risk and capacity.',
        why: 'Aligned with last week\'s overrides on regulatory items.',
        outcome: 'AI will continue producing morning sequences for your review.'
      },
      {
        id: 'ac-8', when: 'Mon · 7:48 AM',
        title: 'Auto-close fire extinguisher initials',
        body: 'You confirmed AI closing the task after TELS logbook upload.',
        why: 'Logbook entry already on file.',
        outcome: 'AI will auto-close routine logbook-confirmed tasks.'
      },
      {
        id: 'ac-9', when: 'Sun · 3:40 PM',
        title: 'Route Diane K. through Floor 1-3 quick-wins',
        body: 'You accepted bundling 4 light-fixture / hinge fixes onto her route.',
        why: 'Co-located along her existing 2 PM path.',
        outcome: 'AI will continue bundling quick-wins along active routes.'
      }
    ]
  },
  overrides: {
    title: 'Overrides learned',
    sub: '2 times you went a different direction than the AI suggested — it\'s incorporating your reasoning.',
    icon: 'undo',
    color: '#B45309',
    items: [
      {
        id: 'ov-1', when: 'Wed · 10:22 AM',
        title: 'You overrode: "Assign Bruce W. to Unit 117 paint touch-up"',
        body: 'You routed it to Sasha P. instead, noting Bruce is preferred for life-safety walkthroughs.',
        why: 'Your override taught the AI to reserve Bruce for life-safety tasks.',
        outcome: 'AI now ranks Bruce lower for cosmetic unit-turn work.'
      },
      {
        id: 'ov-2', when: 'Mon · 1:55 PM',
        title: 'You overrode: "Defer Boiler #2 inspection to Tuesday"',
        body: 'You kept it on Monday, citing the overnight cold-snap forecast.',
        why: 'Override taught the AI to weight weather signals on seasonal mechanical PMs.',
        outcome: 'AI now elevates seasonal mechanical PMs when overnight lows drop below 28°F.'
      }
    ]
  },
  patterns: {
    title: 'Patterns detected',
    sub: '3 early signals the AI is watching — none yet confident enough to act on without you.',
    icon: 'sensors',
    color: '#4338CA',
    items: [
      {
        id: 'pt-1', when: 'Detected 4 days ago',
        title: 'Luis R. completes unit turns ~18% faster during occupancy spikes',
        body: 'Across 6 unit turns in the last 14 days, Luis outpaced the team average when move-in volume was high.',
        why: 'Sample size is small — the AI wants more examples before suggesting reassignments.',
        outcome: 'Confirm the pattern to let AI suggest Luis for time-sensitive turns.'
      },
      {
        id: 'pt-2', when: 'Detected 6 days ago',
        title: 'HVAC work orders cluster in Memory Care East after deferred PM',
        body: '4 HVAC work orders in 60 days followed deferred filter PMs in that wing.',
        why: 'AI is monitoring whether this is a real pattern or coincidence.',
        outcome: 'Confirm to let AI surface a PM-protection recommendation for Memory Care East.'
      },
      {
        id: 'pt-3', when: 'Detected 9 days ago',
        title: 'PM tasks slip when move-in volume exceeds 4/week',
        body: 'PM completion drops ~12% during weeks with 4+ move-ins; AI is tracking the correlation.',
        why: 'Still calibrating — needs another move-in cycle for confidence.',
        outcome: 'Confirm to let AI auto-defer low-risk PMs during high-occupancy weeks.'
      }
    ]
  }
};

// Day 1 learning signals — early, low-confidence observations.
export const learningSignals = [
  {
    id: 'ls-1', icon: 'bolt', title: 'Luis may be faster on unit turns',
    body: 'Early data suggests faster turn times — more examples needed before the AI relies on it.'
  },
  {
    id: 'ls-2', icon: 'hvac', title: 'Repeat HVAC issues in Memory Care East',
    body: '3 HVAC work orders logged there this month — monitoring whether it’s a real pattern.'
  },
  {
    id: 'ls-3', icon: 'event_repeat', title: 'PM tasks deferred during occupancy spikes',
    body: 'PM work appears to slip when move-in volume is high — learning your preference.'
  }
];

// Day 30 — "Operationally Calibrated." The AI has learned the building's
// rhythms; the MD now manages exceptions, not every task.
export const day30Status = {
  headline: 'Connected Community is operationally calibrated to Cedar Ridge',
  sub: 'Connected Community has successfully coordinated routine staffing, PM balancing, and readiness operations over the last 30 days.',
  metrics: [
    { value: '82%', label: 'Recommendation acceptance' },
    { value: '11', label: 'Learned coordination patterns' },
    { value: '−14%', label: 'WO aging' },
    { value: '+9%', label: 'Unit-turn readiness' }
  ],
  capabilities: [
    'Routine PM coordination active',
    'Quick-win batching coordinated routinely',
    'Staffing balancing calibrated'
  ],
  nextStep: {
    action: 'Allow Connected Community to coordinate routine technician reassignment automatically.',
    because: [
      '92% of reassignment recommendations were accepted',
      'No critical reassignment overrides in the last 14 days'
    ]
  }
};

// Day 90 — "Predictive Operations Mode." The AI quietly protects readiness;
// the MD oversees flow and is alerted only to meaningful anomalies.
export const day90Status = {
  headline: 'Connected Community is beginning to anticipate operational readiness risks.',
  sub: 'Connected Community has developed enough operational context to begin surfacing predictive readiness insights across staffing, maintenance, and compliance operations.',
  context: 'These insights are based on 90 days of staffing, maintenance, occupancy, and PM coordination patterns.',
  metrics: [
    { value: '94%', label: 'Readiness stability maintained' },
    { value: '23', label: 'Operational patterns learned' },
    { value: '3', label: 'Forecasted risks prevented this week' },
    { value: '−18%', label: 'PM degradation risk' },
    { value: '42 days', label: 'Backlog stabilized — consecutive', wide: true }
  ],
  capabilities: [
    'Predictive PM insights available',
    'Forecast-informed staffing balancing',
    'Seasonal readiness forecasting',
    'Operational drift monitoring enabled'
  ],
  outlook: [
    { id: 'ok-1', icon: 'event_repeat', body: 'PM completion projected stable through next week.' },
    { id: 'ok-2', icon: 'hvac', body: 'HVAC emergency workload risk may be elevated in Memory Care East.' },
    { id: 'ok-3', icon: 'meeting_room', body: 'Occupancy readiness likely to tighten Friday afternoon.' },
    { id: 'ok-4', icon: 'storefront', body: 'Vendor escalation may be worth considering within 72 hours if WO backlog continues to grow.' }
  ]
};

// Day 90 predictive insight surfaces — subtle, anomaly-driven intelligence.
export const predictiveInsights = [
  {
    id: 'pi-1', label: 'Historical Pattern Applied', icon: 'pattern',
    body: 'Repeated PM deferrals historically correlate with winter HVAC emergency spikes.'
  },
  {
    id: 'pi-2', label: 'Forecast Confidence High', icon: 'verified',
    body: 'Current staffing allocation likely sustainable through Friday.'
  },
  {
    id: 'pi-3', label: 'Operational Drift Detected', icon: 'trending_down',
    body: 'Memory Care East continues showing elevated repeat-failure acceleration.'
  },
  {
    id: 'pi-4', label: 'Preventative Coordination Active', icon: 'shield',
    body: 'Unit-turn readiness projected stable despite occupancy increase.'
  }
];

// ===================================================================
// Predictive intelligence layer (updated operational datasets).
// Surfaced subtly at Day 30 and as the lead experience at Day 90.
// ===================================================================

// Forecast / learned-pattern work orders the AI generated proactively.
export const predictiveWorkOrders = [
  {
    id: 'wo-1091', source: 'Predictive Engine', kind: 'PM degradation risk',
    title: 'Memory Care East HVAC degradation trend',
    category: 'Predictive Maintenance', location: 'Memory Care East',
    priority: 'Medium', status: 'Monitor', assignee: 'Maria S.', eta: '2h', kpi: 'PM Comp.',
    reason: 'AI detected 4 HVAC work orders in 60 days after repeated PM deferrals. Forecasted emergency-WO risk within 2 weeks.'
  },
  {
    id: 'wo-1092', source: 'Operational Forecast', kind: 'Seasonal readiness',
    title: 'Freeze-risk boiler circulation checks',
    category: 'Seasonal Preparedness', location: 'Mechanical Rooms A–C',
    priority: 'High', status: 'Queued', assignee: 'Jacob B.', eta: '90m', kpi: 'Operational Readiness',
    reason: 'AI elevated seasonal readiness work — overnight temperatures forecast below 20°F.'
  },
  {
    id: 'wo-1093', source: 'Learned Pattern', kind: 'Learned pattern',
    title: 'Unit turn reassignment — staffing optimization',
    category: 'Move-In Readiness', location: 'Unit 318',
    priority: 'High', status: 'Auto-coordinated', assignee: 'Luis R.', eta: '2h 30m', kpi: 'Turn Time',
    reason: 'Luis historically completes unit turns 18% faster than team average during occupancy spikes.'
  }
];

// Predictive / seasonal tasks (new statuses: at-risk, monitor).
export const predictiveTasks = [
  {
    id: 'tk-26', category: 'Boiler Systems',
    title: 'Verify freeze-protection valves and circulation pumps.',
    status: 'at-risk', due: 'Due tonight', cadence: 'Seasonal', eta: '1h', assignee: 'Jacob B.',
    note: 'AI elevated — overnight freeze warning and prior winter failures.',
    tags: ['Weather', 'Seasonal', 'Predictive']
  },
  {
    id: 'tk-27', category: 'HVAC',
    title: 'Review recurring HVAC repairs in Memory Care East.',
    status: 'monitor', due: 'Due this week', cadence: 'Monthly', eta: '2h', assignee: 'Maria S.',
    note: 'AI identified a recurring emergency-WO pattern after repeated PM deferrals.',
    tags: ['Predictive', 'Repeat Failures', 'PM Risk']
  }
];

// Predictive readiness recommendation — an exception at Day 30 / Day 90.
export const predictiveReviews = [
  {
    id: 'rv-4', kind: 'Predictive readiness risk', icon: 'online_prediction',
    summary: 'PM completion trend indicates a likely HVAC emergency workload increase within 14 days.',
    recommended: 'Protect the HVAC PM block Wednesday morning; defer low-impact quick wins.',
    why: 'Historical PM deferrals correlate with emergency-WO spikes during temperature swings.',
    tradeoff: '2 low-priority hallway tasks delayed until Friday.',
    confidence: 'Medium-high · based on historical winter workload patterns',
    predictive: true
  }
];

// Operational forecast cards — predictive operational intelligence (Day 90 lead).
export const forecasts = [
  {
    id: 'fc-1', kind: 'PM degradation risk', icon: 'trending_down', tone: 'warning',
    title: 'HVAC emergency workload likely to rise',
    body: 'Repeated HVAC PM deferrals may increase emergency-WO volume in Memory Care East.',
    window: 'Next 14 days', confidence: 'Medium-high', metric: '+~22% emergency WOs'
  },
  {
    id: 'fc-2', kind: 'Seasonal readiness', icon: 'ac_unit', tone: 'error',
    title: 'Freeze-risk preparedness below seasonal target',
    body: 'Overnight lows forecast below 20°F — boiler circulation checks elevated to protect resident heat.',
    window: 'Tonight', confidence: 'High', metric: '3 mech rooms flagged'
  },
  {
    id: 'fc-3', kind: 'Staffing forecast', icon: 'groups', tone: 'warning',
    title: 'PM completion likely to dip below KPI by Friday',
    body: 'Current staffing pressure trends PM completion under the 80% threshold by end of week.',
    window: 'By Friday', confidence: 'Medium', metric: 'PM Comp. → 78%'
  },
  {
    id: 'fc-4', kind: 'Backlog forecast', icon: 'inventory', tone: 'info',
    title: 'Work-order backlog approaching target ceiling',
    body: 'Backlog growth suggests the open-WO target may be exceeded by Thursday without triage.',
    window: 'By Thursday', confidence: 'Medium', metric: '47 → ~58 open'
  }
];

// Unit turns — move-in readiness work, tracked separately from WOs/tasks.
export const unitTurns = [
  {
    id: 'turn-214', unit: 'Unit 214', area: 'Bldg A · Floor 2',
    moveIn: 'Move-in tomorrow · 10:00 AM', status: 'At risk', readiness: 55,
    assignee: 'Reassign needed', eta: '3h remaining',
    note: 'HVAC recommission is blocking readiness; vendor backup recommended.'
  },
  {
    id: 'turn-117', unit: 'Unit 117', area: 'Bldg A · Floor 1',
    moveIn: 'Move-in today · 4:00 PM', status: 'On track', readiness: 85,
    assignee: 'Sasha P.', eta: '90m remaining',
    note: 'Paint touch-up + resident walkthrough; sequenced after HVAC clears the corridor.'
  },
  {
    id: 'turn-318', unit: 'Unit 318', area: 'Bldg B · Floor 3',
    moveIn: 'Move-in tomorrow · 2:00 PM', status: 'On track', readiness: 70,
    assignee: 'Luis R.', eta: '2h 30m remaining', learned: true,
    note: 'AI auto-coordinated — Luis turns units 18% faster during occupancy spikes.'
  },
  {
    id: 'turn-119', unit: 'Unit 119', area: 'Bldg A · Floor 1',
    moveIn: 'Move-in Fri, May 23', status: 'In progress', readiness: 60,
    assignee: 'Sasha P.', eta: '1h remaining',
    note: 'Punch-list walkthrough underway.'
  },
  {
    id: 'turn-121', unit: 'Unit 121', area: 'Bldg A · Floor 1',
    moveIn: 'Move-in Sat, May 24', status: 'Scheduled', readiness: 25,
    assignee: 'Sasha P.', eta: 'Staging',
    note: 'Materials staged; paint + caulk scheduled Saturday.'
  },
  {
    id: 'turn-204', unit: 'Unit 204', area: 'Bldg A · Floor 2',
    moveIn: 'Completed Wed, May 14', status: 'Ready', readiness: 100,
    assignee: 'Sasha P.', eta: 'Turn complete',
    note: 'QA photos uploaded to TELS.'
  },
  {
    id: 'turn-110', unit: 'Unit 110', area: 'Bldg A · Floor 1',
    moveIn: 'Completed Mon, May 12', status: 'Ready', readiness: 100,
    assignee: 'Diane K.', eta: 'Turn complete',
    note: 'Resident moved in; no punch items.'
  }
];

// Services — jobs outsourced to outside service providers / contractors.
export const services = [
  {
    id: 'sv-1', vendor: 'Apex Mechanical', trade: 'HVAC',
    title: 'Unit 214 HVAC recommission',
    location: 'Unit 214', status: 'Pending approval',
    window: 'Today · 2-hr response', cost: '$640', sla: '2-hr SLA',
    contact: 'dispatch@apexmech.com',
    note: 'AI-recommended vendor dispatch — protects tomorrow’s 10 AM move-in. Awaiting your approval.'
  },
  {
    id: 'sv-2', vendor: 'Summit Elevator Co.', trade: 'Elevator',
    title: 'Recurring elevator door-fault diagnosis',
    location: 'Bldg B · Elevator 2', status: 'Awaiting quote',
    window: 'Quote requested May 13', cost: 'Est. $1,200–1,800', sla: 'Next-day',
    contact: 'service@summitelevator.com',
    note: 'AI flagged a repeat fault pattern (3 service calls in 60 days) — vendor review suggested.'
  },
  {
    id: 'sv-3', vendor: 'SafeGuard Fire Systems', trade: 'Fire / Life Safety',
    title: 'Ansul fire-suppression system inspection',
    location: 'Kitchen hood system', status: 'Scheduled',
    window: 'Fri, May 30 · 9:00 AM', cost: 'Contract', sla: 'Monthly contract',
    contact: 'scheduling@safeguardfire.com',
    note: 'Regulatory contractor inspection; certificate uploads to TELS.'
  },
  {
    id: 'sv-4', vendor: 'SafeGuard Fire Systems', trade: 'Fire / Life Safety',
    title: 'Fire sprinkler semi-annual contractor test',
    location: 'Whole facility', status: 'Scheduled',
    window: 'Tue, May 27 · 8:00 AM', cost: 'Contract', sla: 'Semi-annual contract',
    contact: 'scheduling@safeguardfire.com',
    note: 'Regulatory — overdue; contractor confirmed. Requires document upload.'
  },
  {
    id: 'sv-5', vendor: 'Cummins Power', trade: 'Generator',
    title: 'Annual generator load-bank test',
    location: 'Emergency Power Generators', status: 'On site',
    window: 'Today · arrived 8:10 AM', cost: '$890', sla: 'Annual contract',
    contact: 'fieldservice@cummins.com',
    note: 'Technician on site; Marco D. escorting for the regulatory logbook entry.'
  },
  {
    id: 'sv-6', vendor: 'Orkin', trade: 'Pest Control',
    title: 'Quarterly pest-control service',
    location: 'All buildings', status: 'Completed',
    window: 'Completed Mon, May 12', cost: 'Contract', sla: 'Quarterly contract',
    contact: 'commercial@orkin.com',
    note: 'Service report filed; no pest activity flagged.'
  }
];

// Learned building patterns — historical operational intelligence.
export const learnedPatterns = [
  {
    id: 'lp-1', icon: 'hvac', title: 'Recurring HVAC failures — Memory Care East',
    body: '4 HVAC work orders in 60 days cluster after deferred PM. Vendor review suggested.'
  },
  {
    id: 'lp-2', icon: 'ac_unit', title: 'Boiler PM delays precede winter emergencies',
    body: 'Deferred boiler PM historically correlates with cold-snap emergency work orders.'
  },
  {
    id: 'lp-3', icon: 'bolt', title: 'Luis turns units 18% faster during occupancy spikes',
    body: 'Unit-turn history shows Luis R. outpaces the team average when move-in volume is high.'
  }
];

// ─────────────────────────────────────────────────────────────────────
// Calm-mode data — operational readiness framing (replaces task lists)
// ─────────────────────────────────────────────────────────────────────

// Day 1 — max 3 grouped operational priorities (NOT raw work orders).
export const operationalPriorities = [
  {
    id: 'op-1', icon: 'meeting_room', tone: 'warning',
    title: 'Unit 214 HVAC is impacting move-in readiness',
    body: '10 AM move-in tomorrow — in-house ETA is at risk after 3 repeat failures in 90 days.',
    impact: 'Move-in readiness',
    action: 'Dispatch Apex Mechanical',
    approveLabel: 'Approve dispatch'
  },
  {
    id: 'op-2', icon: 'ac_unit', tone: 'error',
    title: 'Boiler freeze-prep recommended before overnight cold snap',
    body: 'Overnight low forecast 22°F. A burst freeze risks resident heat loss and a major repair bill.',
    impact: 'Operational continuity',
    action: 'Hold Jacob on Boiler #2, route Marco to fire panel',
    approveLabel: 'Approve sequence'
  },
  {
    id: 'op-3', icon: 'event_repeat', tone: 'info',
    title: 'PM completion risk emerging from staffing strain',
    body: 'A few PM tasks may slip this week if today’s load isn’t rebalanced before tomorrow.',
    impact: 'PM compliance',
    action: 'Reassign Floor 3 filter PM to Diane',
    approveLabel: 'Approve plan'
  }
];

// Day 1 — single staffing conflict, single PM tradeoff, single learning signal.
export const day1StaffingConflict = {
  id: 'sc-1', icon: 'group',
  who: 'Jacob B.',
  title: 'Jacob is sequenced 1.5 hrs over capacity today',
  body: 'Unplanned overtime cost and burnout risk if left as-is. Diane has 2.2 hrs open on the same floor.',
  hint: 'AI suggests reassigning the Floor 3 filter PM to Diane.'
};

export const day1PmTradeoff = {
  id: 'pm-1', icon: 'event_repeat',
  title: 'Floor 3 filter replacement — deferrable PM',
  body: 'No compliance deadline before May 31. Lowest-risk item to move when today is at capacity.',
  hint: 'AI suggests moving to Saturday AM.'
};

// Day 1 — pick the single most relevant learning signal (the rest collapse).
export const day1LearningHighlight = {
  id: 'ls-1', icon: 'model_training',
  title: 'Luis may be faster on unit turns during move-in spikes',
  body: 'Early pattern from 6 unit turns — still calibrating before suggesting reassignments.'
};

// Counts shown in the "Routine coordinated" rollup card (varies by mode).
export const routineRollup = {
  day1: {
    headline: 'Routine work coordinated quietly in the background',
    items: [
      { label: 'routine work orders coordinated', count: 17 },
      { label: 'PM tasks scheduled automatically', count: 8 },
      { label: 'quick-wins bundled onto existing routes', count: 4 }
    ]
  },
  day30: {
    headline: 'Routine operations coordinated automatically',
    items: [
      { label: 'work orders sequenced and assigned', count: 24 },
      { label: 'PM tasks scheduled and routed', count: 11 },
      { label: 'staffing reassignments resolved from learned rules', count: 6 },
      { label: 'quick-wins batched onto existing routes', count: 5 }
    ]
  },
  day90: {
    headline: 'Routine operations protected automatically',
    items: [
      { label: 'work orders, PM, and quick-wins coordinated', count: 46 },
      { label: 'staffing reassignments resolved automatically', count: 12 },
      { label: 'vendor escalations sequenced ahead of risk', count: 3 }
    ]
  }
};

// Day 30 — 4 grouped readiness summaries (replaces task stacks).
export const day30Readiness = [
  {
    id: 'r-pm', icon: 'event_repeat', tone: 'success',
    title: 'Routine PM coordination stabilized',
    body: '11 PM tasks scheduled, routed, and tracked without intervention this week.'
  },
  {
    id: 'r-batch', icon: 'inventory_2', tone: 'success',
    title: 'Quick-win batching completed automatically',
    body: '5 minor work orders bundled onto existing technician routes — zero added travel.'
  },
  {
    id: 'r-occ', icon: 'meeting_room', tone: 'success',
    title: 'Occupancy readiness protected',
    body: 'Tomorrow’s 10 AM move-in is sequenced; vendor backup pre-staged for Unit 214.'
  },
  {
    id: 'r-backlog', icon: 'trending_flat', tone: 'info',
    title: 'WO backlog trending stable',
    body: 'Backlog held steady at 8 items for 14 days; no aged items past 60 days.'
  }
];

// Day 90 — operational health dashboard (replaces task surfaces entirely).
export const day90Health = [
  {
    id: 'h-stable', icon: 'check_circle', tone: 'success',
    title: 'Readiness stable through Friday',
    body: 'PM, occupancy, and compliance signals are within historical norms.'
  },
  {
    id: 'h-hvac', icon: 'hvac', tone: 'warning',
    title: 'Emergency HVAC workload risk increasing in Memory Care East',
    body: 'PM degradation pattern detected — 14-day risk window opening.'
  },
  {
    id: 'h-vendor', icon: 'support_agent', tone: 'warning',
    title: 'Vendor escalation may be needed within 72 hours',
    body: 'Apex Mechanical SLA at threshold after 3 repeat failures on Unit 214.'
  },
  {
    id: 'h-pm', icon: 'trending_down', tone: 'success',
    title: 'PM degradation risk reduced after staffing rebalance',
    body: 'Cross-training and load balancing dropped projected risk by 18%.'
  }
];

// Day 30 — single-line "focus" per technician (replaces per-task drilldown).
export const teamFocus = {
  'tm-1': { focus: 'Life-safety rounds', state: 'On track', tone: 'success' },
  'tm-2': { focus: 'HVAC risk protection', state: 'Protected', tone: 'success' },
  'tm-3': { focus: 'Unit-turn readiness', state: 'Stable', tone: 'success' },
  'tm-4': { focus: 'PM coordination block', state: 'Balanced', tone: 'success' },
  'tm-5': { focus: 'Out (PTO) — load redistributed', state: 'Covered', tone: 'info' }
};

// Day 90 — high-level operational coverage statements (replaces team grid).
export const day90Coverage = [
  { id: 'cv-1', icon: 'hvac', title: 'HVAC coverage protected', tone: 'success' },
  { id: 'cv-2', icon: 'meeting_room', title: 'Unit-turn staffing stable', tone: 'success' },
  { id: 'cv-3', icon: 'event_repeat', title: 'PM coordination balanced', tone: 'success' },
  { id: 'cv-4', icon: 'group', title: 'Staffing strain low across the team', tone: 'success' }
];

// Day 90 — strategic risks the MD should personally weigh (max 1 surfaced).
export const strategicRisks = [
  {
    id: 'sr-1', icon: 'online_prediction',
    label: 'Predictive risk',
    title: 'HVAC emergency workload may exceed capacity in Memory Care East',
    body: 'Forecast confidence: medium-high. Recommended action: protect HVAC PM block Wednesday.',
    horizon: 'Next 14 days'
  }
];
