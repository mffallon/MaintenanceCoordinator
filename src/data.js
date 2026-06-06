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
  body: 'HVAC backlog and low ready-room stock threaten tomorrow’s 10 AM move-in. First-month revenue and a family escalation are on the line if it slips.',
  confidence: 'High confidence'
};

export const weather = {
  headline: 'Cold snap expected tonight · 22°F low',
  body: 'I raised boiler and freeze-risk inspections to Critical for tonight.',
  undoHeadline: "Here's what changes if I undo it",
  undoImpact: "Boiler and freeze-risk inspections drop back to routine — they'd wait for the normal rotation instead of going out tonight. If the 22°F low lands, frozen-pipe risk won't be covered."
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
        recommend: 'I’d handle this today — an open fire-panel signal counts as a citable deficiency, and the survey window opens Monday.',
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
        recommend: 'I’d schedule this now — tonight’s freeze risk plus prior seasonal boiler trouble.',
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
        recommend: 'I’d put this above routine PM — tomorrow’s move-in is exposed and ready-room stock is low.',
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
        recommend: 'I’d slot this in today — it’s an overdue weekly regulatory check, and exposure grows each day.',
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
        recommend: 'I’d put this on Sasha — she has capacity today, and the weekly logbook has a gap.',
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
        recommend: 'I’d give this to Diane — she has open capacity this afternoon, and the Legionella-risk log is overdue.',
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
        recommend: 'I’d bundle this onto Diane’s afternoon route — it’s an overdue daily food-safety log and there’s no detour cost.',
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
        recommend: 'I’d run this after HVAC clears the corridor — resident orientation is at 4 PM.',
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
        recommend: 'I’d bundle this with Marco’s rounds — the monthly inspection is due May 22.',
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
        recommend: 'I’d defer this monthly PM — the capacity is better spent on the at-risk Unit 214 turn.',
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
        recommend: 'I’d only bundle this in the AM if no higher-priority items remain.',
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
    note: 'I flagged this — waiting on your call. Move-in 10 AM tomorrow.'
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
    id: 'md-5', time: '3:30 PM', dur: '20m', kind: 'Modify review',
    title: 'Confirm learned rule · Move-in HVAC priority',
    location: 'Office', icon: 'model_training', tone: 'default',
    note: 'I’m proposing a rule: when move-in is <24h, HVAC takes priority over PM filter swap.'
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
    id: 'tm-md', name: 'Mike F.', role: 'Maintenance Director', shift: '8a–5p',
    capacity: 8, load: 2.2, status: 'Has capacity',
    tasks: mdSchedule
  },
  {
    id: 'tm-1', name: 'Marco D.', role: 'Lead Tech', shift: '8a–5p',
    capacity: 8, load: 7.5, status: 'On-site',
    tasks: [
      { time: '8:00 AM', dur: '90m', kind: 'Critical', title: 'Fire panel trouble signal — West Wing',
        location: 'Bldg A · Panel 3', icon: 'local_fire_department', tone: 'error',
        note: 'Survey window opens Monday — I bumped this to Critical.' },
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
        note: 'I slotted this in — overdue weekly regulatory, and you had capacity today.' },
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
        note: 'I bundled these on the east-corridor route to save the trip.' },
      { time: '10:00 AM', dur: '1h', kind: 'Resident', title: 'Resident requests · Floor 2 batch (4)',
        location: 'Floor 2', icon: 'home_repair_service', tone: 'default',
        note: 'I grouped these to keep Diane on one floor.' },
      { time: '11:00 AM', dur: '30m', kind: 'High', title: 'Test & log hot water temperatures',
        location: 'Water Temperature Checks', icon: 'thermostat', tone: 'warning',
        note: 'I slotted this in — overdue weekly regulatory log.' },
      { time: '11:30 AM', dur: '30m', kind: 'Prep', title: 'Restock janitorial / PM cart',
        location: 'Supply room', icon: 'inventory_2', tone: 'default', note: '' },
      { time: '12:00 PM', dur: '30m', kind: 'Break', title: 'Lunch',
        location: 'Break room', icon: 'restaurant', tone: 'default', note: '' },
      { time: '1:00 PM', dur: '20m', kind: 'High', title: 'Check freezer / refrigerator temps',
        location: 'Refrigerator/Freezer Combos', icon: 'kitchen', tone: 'warning',
        note: 'I batched these — overdue daily food-safety log.' },
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
    kind: 'Competing critical priorities',
    icon: 'priority_high',
    summary: '3 Tier 1 priorities — can’t do all today.',
    priorities: [
      { id: 'p-214', tier: 'T1', icon: 'hvac', label: 'Unit 214 HVAC failure · move-in 10 AM tomorrow', plan: 'Send to Apex Mechanical (service provider)', relatedId: 'ut-214' },
      { id: 'p-boiler', tier: 'T1', icon: 'thermostat', label: 'Boiler #2 down in an occupied wing · resident comfort now', plan: 'Hand to a general tech · ~2 hr resolution', relatedId: 'wo-1038' },
      { id: 'p-pm', tier: 'T1', icon: 'event_repeat', label: 'Overdue PM compliance · due inside the survey window', plan: 'Defer to second shift', relatedId: 'tk-2' }
    ],
    // Operational domains touched by these conflicts. Rendered as
    // outlined tag chips so the MD can see the breadth of impact at a
    // glance (inspired by the "Domains" row pattern).
    domains: ['Life safety', 'Resident comfort', 'Move-in readiness', 'Survey readiness'],
    recommended: 'Awaiting your sign-off before dispatching the service provider and reassigning the in-house tech.',
    assignments: [
      { icon: 'support_agent', primary: 'Service Provider → Unit 214 HVAC', secondary: 'Move-in 10 AM tomorrow · the in-house team cannot complete the repair in time' },
      { icon: 'thermostat', primary: 'General tech → Boiler #2', secondary: 'Resident-comfort issue · ~2 hr resolution' },
      { icon: 'event_repeat', primary: 'Overdue PM compliance → second shift', secondary: 'Stays inside the survey window' }
    ],
    why: 'Move-in is tomorrow — Unit 214 HVAC has to go to a vendor or it slips. Boiler is resident comfort, not life-safety, but can’t wait. PM compliance has the most slack today.',
    tradeoff: 'Move-in protected. Boiler restored in ~2 hrs. PM slips to second shift — still inside the survey window.',
    confidence: 'High'
  },
  {
    id: 'rv-2',
    kind: 'Services Recommendation',
    icon: 'support_agent',
    summary:
      'Unit 214 HVAC has 3 repeat failures in 90 days; in-house ETA risks the 10 AM move-in.',
    recommended: 'Dispatch Apex Mechanical (preferred vendor, 2-hr response).',
    why: 'Asset history shows 3 repeat HVAC failures in 90 days, a pattern in-house repair hasn’t resolved. Apex is the preferred vendor with a 2-hr SLA, the only path that protects the 10 AM move-in.',
    tradeoff: '$640 vendor spend vs. a missed move-in: lost first-month revenue, family escalation, and a unit not survey-ready.',
    confidence: 'High · within approved vendor budget; repeat-failure threshold met',
    vendor: true
  },
  {
    id: 'rv-3',
    kind: 'Staffing overload',
    icon: 'groups',
    summary:
      'Jacob B. is sequenced 1.5 hrs over capacity. That’s unplanned overtime cost and burnout risk if left as-is.',
    confidence: 'High · capacity math from today’s assigned durations',
    recommendations: [
      {
        label: 'Recommended',
        body: 'Reassign Floor 3 filter PM to Diane K. She has 2.2 hrs open today.',
        why: 'Diane has the most open time on the team and is already routed through Floor 3, so the reassignment adds zero travel and keeps the PM on schedule.',
        tradeoff: 'Avoids 1.5 hrs OT; PM stays on today. Diane cross-trains on the AHU. No KPI impact.'
      },
      {
        label: 'Alternative',
        body: 'Move PM filter replacement to Saturday AM.',
        why: 'It’s a deferrable PM with no compliance deadline this week, the lowest-risk item to move when everyone is at capacity.',
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
      icon: 'model_training', label: 'Modify rules learned', value: '6', trend: 'this month', tone: 'info',
      unit: '', start: 0, current: 6,
      detail: 'Override patterns the AI generalized into reusable rules.',
      series: [0, 0, 1, 2, 2, 3, 4, 5, 6],
      days: [0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,3,0,0,0,0,3,0,0,0,3]
    },
    {
      icon: 'history_toggle_off', label: 'WO aging reduced', value: '14%', trend: 'vs. Day 3', tone: 'success',
      unit: '%', start: 0, current: 14,
      detail: 'Reduction in average work-order age vs. the Day 3 baseline.',
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
  headline: 'We’re off to a good start!',
  sub: 'Three days in — here’s what we’re building. I’ll keep learning your community as we go.',
  metrics: [
    { key: 'accepted', label: 'Recommendations accepted', value: '9', sub: 'this week' },
    { key: 'overrides', label: 'Modifications learned', value: '2', sub: 'so far' },
    { key: 'patterns', label: 'Patterns detected', value: '4', sub: 'early signals' }
  ]
};

// Detailed history behind each Day 1 metric tile — populates the drawer
// when the MD taps a tile. Each item is independently respondable.
export const day1MetricDetails = {
  accepted: {
    title: 'Accepted History',
    sub: '9 recommendations you and I shipped this week.',
    icon: 'thumb_up_alt',
    color: '#16A34A',
    items: [
      {
        id: 'ac-1', when: 'Today · 7:12 AM',
        title: 'Route Marco D. to fire panel first',
        state: 'In progress', stateTone: 'info', undoable: true,
        body: 'You approved routing Marco to the West Wing fire-panel trouble signal ahead of his Bldg B sweep.',
        why: 'Life-safety priority — survey window opens Monday.',
        outcome: 'Keeping this routing pattern for life-safety alerts.',
        target: 'WO-1041 · Fire panel trouble signal — West Wing',
        route: { tab: 2, seg: 'orders', highlight: 'wo-1041' }
      },
      {
        id: 'ac-2', when: 'Today · 6:58 AM',
        title: 'Bundle 4 overdue logs onto Diane K.\'s route',
        state: 'Scheduled', stateTone: 'default', undoable: true,
        body: 'You approved batching food-safety and water-temp logs onto her afternoon walk.',
        why: 'Zero added travel — same floor coverage.',
        outcome: 'Batching small log tasks onto existing routes going forward.',
        target: 'TK-4 · Food-safety & water-temp logs — Floors 1–3',
        route: { tab: 2, seg: 'tasks', highlight: 'tk-4' }
      },
      {
        id: 'ac-3', when: 'Yesterday · 4:18 PM',
        title: 'Defer Floor 3 filter PM to Saturday',
        state: 'Scheduled', stateTone: 'default', undoable: true,
        body: 'You approved moving the deferrable PM to relieve Jacob B.\'s overload.',
        why: 'No compliance deadline before May 31.',
        outcome: 'Offering Saturday slots when PM is the lowest-risk deferral.',
        target: 'TK-7 · Replace air handler filters — Floor 3',
        route: { tab: 2, seg: 'tasks', highlight: 'tk-7' }
      },
      {
        id: 'ac-4', when: 'Yesterday · 11:02 AM',
        title: 'Pre-stage Apex Mechanical for Unit 214',
        state: 'Awaiting vendor', stateTone: 'warning', undoable: true,
        body: 'You approved a vendor hold ahead of tomorrow\'s 10 AM move-in.',
        why: '3 repeat HVAC failures in 90 days — in-house ETA at risk.',
        outcome: 'Pre-staging Apex when repeat-failure thresholds are met.',
        target: 'UT-214 · Unit 214 HVAC recommission',
        route: { tab: 2, seg: 'turns', highlight: 'turn-214' }
      },
      {
        id: 'ac-5', when: 'Wed · 2:45 PM',
        title: 'Assign generator inspection to Sasha P.',
        state: 'Completed', stateTone: 'success', undoable: false,
        body: 'You accepted Sasha as the substitute after Bruce\'s capacity was tight.',
        why: 'Sasha had the most open time today.',
        outcome: 'Weighting Sasha higher when Bruce is overloaded.'
      },
      {
        id: 'ac-6', when: 'Tue · 9:30 AM',
        title: 'Snooze ceiling-tile replacement 24 hrs',
        state: 'On hold', stateTone: 'default', undoable: true,
        body: 'You accepted holding a low-risk cosmetic PM while move-in load cleared.',
        why: 'No safety or compliance impact.',
        outcome: 'Offering to snooze cosmetic PMs during move-in spikes.',
        target: 'WO-1052 · Carpet transition strip — 2F corridor',
        route: { tab: 2, seg: 'orders', highlight: 'wo-1052' }
      },
      {
        id: 'ac-7', when: 'Mon · 8:05 AM',
        title: 'Sequence tomorrow\'s critical path',
        state: 'Completed', stateTone: 'success', undoable: false,
        body: 'You approved the AI\'s ordering of 31 work orders by risk and capacity.',
        why: 'Aligned with last week\'s overrides on regulatory items.',
        outcome: 'Producing morning sequences for your review each day.'
      },
      {
        id: 'ac-8', when: 'Mon · 7:48 AM',
        title: 'Auto-close fire extinguisher initials',
        state: 'Closed', stateTone: 'success', undoable: false,
        body: 'You confirmed AI closing the task after TELS logbook upload.',
        why: 'Logbook entry already on file.',
        outcome: 'Auto-closing routine logbook-confirmed tasks.'
      },
      {
        id: 'ac-9', when: 'Sun · 3:40 PM',
        title: 'Route Diane K. through Floor 1-3 quick-wins',
        state: 'Completed', stateTone: 'success', undoable: false,
        body: 'You accepted bundling 4 light-fixture / hinge fixes onto her route.',
        why: 'Co-located along her existing 2 PM path.',
        outcome: 'Bundling quick-wins along active routes.'
      }
    ]
  },
  overrides: {
    title: 'Review Overrides Learned',
    sub: '2 overrides the AI is learning from.',
    icon: 'undo',
    color: '#B45309',
    items: [
      {
        id: 'ov-1', when: 'Wed · 10:22 AM',
        title: 'You overrode: "Assign Bruce W. to Unit 117 paint touch-up"',
        state: 'Active rule', stateTone: 'success',
        body: 'You routed it to Sasha P. instead, noting Bruce is preferred for life-safety walkthroughs.',
        why: 'Your override taught the AI to reserve Bruce for life-safety tasks.',
        outcome: 'Bruce now ranks lower for cosmetic unit-turn work.'
      },
      {
        id: 'ov-2', when: 'Mon · 1:55 PM',
        title: 'You overrode: "Defer Boiler #2 inspection to Tuesday"',
        state: 'Active rule', stateTone: 'success',
        body: 'You kept it on Monday, citing the overnight cold-snap forecast.',
        why: 'Override taught the AI to weight weather signals on seasonal mechanical PMs.',
        outcome: 'Seasonal mechanical PMs now elevate when overnight lows drop below 28°F.'
      }
    ]
  },
  patterns: {
    title: 'Review Patterns Detected',
    sub: '4 early signals the AI is watching.',
    icon: 'sensors',
    color: '#4338CA',
    items: [
      {
        id: 'pt-3', when: 'Updated 9 days ago',
        title: 'PM tasks slip when move-in volume exceeds 4/week',
        state: 'Monitoring · 2 cycles', stateTone: 'info',
        body: 'PM completion drops ~12% during weeks with 4+ move-ins; AI is tracking the correlation.',
        why: 'Still calibrating — needs another move-in cycle for confidence.',
        outcome: 'Confirm to auto-defer low-risk PMs during high-occupancy weeks.'
      },
      {
        id: 'pt-2', when: 'Updated 6 days ago',
        title: 'HVAC work orders cluster in Memory Care East after deferred PM',
        state: 'Monitoring · 4 samples', stateTone: 'info',
        body: '4 HVAC work orders in 60 days followed deferred filter PMs in that wing.',
        why: 'AI is monitoring whether this is a real pattern or coincidence.',
        outcome: 'Confirm to surface a PM-protection recommendation for Memory Care East.'
      },
      {
        id: 'pt-1', when: 'Updated 4 days ago',
        title: 'Luis R. completes unit turns ~18% faster during occupancy spikes',
        state: 'Monitoring · 6 samples', stateTone: 'info',
        body: 'Across 6 unit turns in the last 14 days, Luis outpaced the team average when move-in volume was high.',
        why: 'Sample size is small — the AI wants more examples before suggesting reassignments.',
        outcome: 'Confirm to surface Luis for time-sensitive turns.'
      },
      {
        id: 'pt-4', when: 'Updated 2 days ago',
        title: 'Luis may be faster on unit turns during move-in spikes',
        state: 'Monitoring · 6 turns', stateTone: 'info',
        body: 'Early pattern from 6 unit turns — Luis is trending ahead of the team average during high-volume weeks.',
        why: 'Sample size is small — still calibrating before suggesting reassignments.',
        outcome: 'Confirm to consider Luis as the default for time-sensitive turns.'
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
  headline: 'We’ve found our rhythm',
  sub: 'Routine PM, quick-win batching, and staffing balancing handled. Ready to widen what it covers?',
  metrics: [
    { key: 'acceptance', value: '82%', label: 'Recommendation acceptance', sub: 'last 30 days' },
    { key: 'patterns', value: '11', label: 'Learned patterns', sub: 'active rules' },
    { value: '94%', label: 'PM tasks performed on time', sub: 'last 30 days' }
  ],
  capabilities: [
    'Routine PM coordination active',
    'Quick-win batching coordinated routinely',
    'Staffing balancing calibrated'
  ],
  nextStep: {
    action: 'Let the AI handle routine technician reassignment without sign-off.',
    because: [
      '92% of reassignment recommendations were accepted',
      'No critical reassignment overrides in the last 14 days'
    ]
  }
};

// Day 90 — "Predictive Operations Mode." The AI quietly protects readiness;
// the MD oversees flow and is alerted only to meaningful anomalies.
export const day90Status = {
  headline: 'We’re staying ahead',
  sub: 'PM, staffing, occupancy, and compliance trends are tracked. Forecasts surface when something needs your read.',
  context: 'Based on 90 days of staffing, PM, occupancy, and work-order data.',
  metrics: [
    { key: 'patterns', value: '23', label: 'Operational patterns learned' },
    { key: 'risks', value: '3', label: 'Forecasted risks prevented this week' },
    { key: 'stability', value: '94%', label: 'Readiness stability maintained' },
    { value: '−18%', label: 'PM degradation risk', wide: true },
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
    reason: 'I elevated seasonal readiness work — overnight temperatures are forecast below 20°F.'
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
    note: 'I elevated this — overnight freeze warning and prior winter failures.',
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
    id: 'rv-4', kind: 'Technician pattern · needs your read', icon: 'psychology_alt',
    summary: 'Bruce W.\'s completion times have slowed ~22% over the last 30 days — but the pattern is ambiguous.',
    recommended: 'Hold autonomous rebalancing for Bruce. Three remediation paths are staged behind your judgment.',
    why: 'AI ran three causal hypotheses against the data and can\'t separate them with confidence: (1) physical fatigue (slower starts, faster on familiar assets), (2) route saturation (Bruce is the most-used tech for life-safety this quarter), (3) unfamiliar asset mix (3 new chiller variants added in April). Each has a different remediation path, and one is a conversation only you can have.',
    tradeoff: 'Holding rebalancing means Bruce stays at current load this week. No compliance impact — life-safety tasks are still completing on time, just slower.',
    confidence: 'Medium · the trend is real, but the cause attribution is genuinely uncertain',
    predictive: true,
    options: [
      'Operational · rebalance Bruce\'s route this week and watch',
      'Training · pair Bruce with Sasha on new chiller variants',
      'HR · have the conversation (no autonomous action)'
    ]
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
    assignee: 'Luis R.', eta: '2h 30m remaining', learned: true, patternId: 'pt-4',
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
    note: 'I flagged a repeat fault pattern (3 service calls in 60 days) — worth a vendor review.'
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

// A freshly-received work order surfaced at the top of Day 1 approvals.
// The AI proposes an assignment based on today's remaining capacity.
export const incomingWorkOrder = {
  id: 'wo-1099',
  receivedAgo: '4 min ago',
  priority: 'Medium',
  category: 'Plumbing',
  icon: 'water_drop',
  title: 'Toilet running continuously',
  location: 'Bldg A · Floor 2 · Unit 209',
  body: 'Wasting water and waking the resident. Fix today.',
  suggestion: {
    tech: 'Sasha P.',
    open: '2.4 hrs open',
    eta: 'ETA 25 min',
    rationale: 'Sasha has the most open capacity today and is already on Floor 2 (Unit 117 paint touch-up).',
    travel: 'Zero added travel'
  },
  confidence: 'High · capacity math from today\'s assignments'
};

// Day 1 — max 3 grouped operational priorities (NOT raw work orders).
export const operationalPriorities = [
  {
    id: 'op-1', icon: 'meeting_room', tone: 'warning',
    title: 'Unit 214 HVAC is impacting move-in readiness',
    body: '10 AM move-in tomorrow. In-house ETA is at risk after 3 repeat failures in 90 days.',
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
  hint: 'I’d reassign the Floor 3 filter PM to Diane.'
};

export const day1PmTradeoff = {
  id: 'pm-1', icon: 'event_repeat',
  badge: 'Deferrable PM',
  title: 'Floor 3 filter replacement',
  body: 'No compliance deadline before May 31. Lowest-risk item to move when today is at capacity.',
  hint: 'I’d move this to Saturday AM.'
};

// Day 1 — pick the single most relevant learning signal (the rest collapse).
export const day1LearningHighlight = {
  id: 'ls-1', icon: 'model_training',
  title: 'Luis may be faster on unit turns during move-in spikes',
  body: 'Early pattern from 6 unit turns. Still calibrating before suggesting reassignments.'
};

// Counts shown in the "Routine coordinated" rollup card (varies by mode).
export const routineRollup = {
  day1: {
    headline: 'Routine work coordinated',
    items: [
      { label: 'work orders sequenced', count: 17 },
      { label: 'PMs scheduled', count: 8 },
      { label: 'quick-wins bundled onto existing routes', count: 4 }
    ]
  },
  day30: {
    headline: 'Routine work coordinated',
    items: [
      { label: 'work orders sequenced and assigned', count: 24 },
      { label: 'PMs scheduled and routed', count: 11 },
      { label: 'staffing reassignments resolved by learned rules', count: 6 },
      { label: 'quick-wins batched onto existing routes', count: 5 }
    ]
  },
  day90: {
    headline: 'Routine work coordinated',
    items: [
      { label: 'work orders, PMs, and quick-wins coordinated', count: 46 },
      { label: 'staffing reassignments resolved by rules', count: 12 },
      { label: 'vendor escalations queued ahead of failure', count: 3 }
    ]
  }
};

// Day 30 — 4 grouped readiness summaries (replaces task stacks).
export const day30Readiness = [
  {
    id: 'r-pm', icon: 'event_repeat', tone: 'success',
    title: 'Routine PM coordination stabilized',
    body: '11 PM tasks scheduled, routed, and tracked without intervention this week.',
    details: {
      summary: 'How the AI coordinated PM work this week',
      stats: [
        { value: '11', label: 'scheduled' },
        { value: '9', label: 'completed' },
        { value: '2', label: 'in flight' }
      ],
      items: [
        { primary: 'Air handler filter PM · Floor 2', secondary: 'Bruce W. · Wed 9:00 AM', state: 'Completed' },
        { primary: 'Boiler quarterly inspection · Mech Room A', secondary: 'Jacob B. · Thu 10:00 AM', state: 'Completed' },
        { primary: 'Generator weekly exercise', secondary: 'Sasha P. · Fri 8:00 AM', state: 'Completed' },
        { primary: 'Smoke detector battery test · Floor 1', secondary: 'Bruce W. · Fri 2:00 PM', state: 'Scheduled' },
        { primary: 'Hot water temp logs', secondary: 'Diane K. · Sat 11:00 AM', state: 'Scheduled' }
      ],
      rollup: '+6 more routed without intervention'
    }
  },
  {
    id: 'r-batch', icon: 'inventory_2', tone: 'success',
    title: 'Quick-win batching completed automatically',
    body: '5 minor work orders bundled onto existing technician routes — zero added travel.',
    details: {
      summary: 'Bundled onto Diane K.\'s 2 PM Floor 1–3 route',
      stats: [
        { value: '5', label: 'bundled' },
        { value: '55m', label: 'route time' },
        { value: '0', label: 'detours' }
      ],
      items: [
        { primary: 'Light fixture replacement · 2F-204', secondary: 'Diane K. · 2:00 PM', state: 'Completed' },
        { primary: 'Cabinet hinge tighten · 2F-212', secondary: 'Diane K. · 2:15 PM', state: 'Completed' },
        { primary: 'Door stop reinstall · 1F-118', secondary: 'Diane K. · 2:30 PM', state: 'Completed' },
        { primary: 'Faucet aerator clean · 3F-308', secondary: 'Diane K. · 2:45 PM', state: 'In progress' },
        { primary: 'Caulk re-seal · 1F-120', secondary: 'Diane K. · 3:00 PM', state: 'Scheduled' }
      ]
    }
  },
  {
    id: 'r-occ', icon: 'meeting_room', tone: 'success',
    title: 'Occupancy readiness protected',
    body: 'Tomorrow’s 10 AM move-in is sequenced; vendor backup pre-staged for Unit 214.',
    details: {
      summary: 'Unit 214 — move-in 10:00 AM tomorrow',
      stats: [
        { value: '92%', label: 'ready' },
        { value: '2', label: 'open items' },
        { value: '0', label: 'blockers' }
      ],
      items: [
        { primary: 'HVAC recommission', secondary: 'Apex Mechanical · vendor SLA 2 hr', state: 'In progress' },
        { primary: 'Paint touch-up', secondary: 'Sasha P. · 11:00 AM today', state: 'Completed' },
        { primary: 'Deep clean', secondary: 'Housekeeping · 1:00 PM today', state: 'Completed' },
        { primary: 'Welcome packet & key fob', secondary: 'Front desk', state: 'Ready' },
        { primary: 'Resident orientation', secondary: 'Mike F. · 4:00 PM tomorrow', state: 'Scheduled' }
      ]
    }
  },
  {
    id: 'r-backlog', icon: 'trending_flat', tone: 'info',
    title: 'WO backlog trending stable',
    body: 'Backlog held steady at 8 items for 14 days; no aged items past 60 days.',
    details: {
      summary: 'Backlog composition — last 14 days',
      stats: [
        { value: '8', label: 'in backlog' },
        { value: '18d', label: 'oldest' },
        { value: '−1', label: 'vs. last wk' }
      ],
      items: [
        { primary: 'Carpet transition strip · 2F corridor', secondary: 'Low · 30m · opened May 6', state: 'Cosmetic' },
        { primary: 'Drywall scuff repaint · Activity Room', secondary: 'Low · 45m · opened May 9', state: 'Cosmetic' },
        { primary: 'Parking pole light · North Lot', secondary: 'Medium · vendor ETA May 22', state: 'Awaiting parts' },
        { primary: 'Walk-in cooler gasket · Kitchen', secondary: 'Medium · vendor ETA May 20', state: 'Awaiting parts' },
        { primary: 'Bath caulking · Units 203 & 207', secondary: 'Low · 1h · opened May 11', state: 'Preventive' }
      ],
      rollup: '+3 more lower-priority items'
    }
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

// Day 90 — 3 forecasted risks the AI prevented this week.
// Tappable on the KPIs / banner tile "Forecasted risks prevented this week".
export const forecastedRisksPrevented = [
  {
    id: 'fp-1', when: 'Prevented Tue · May 20',
    title: 'Boiler #2 freeze burst risk averted',
    body: 'AI staged the seasonal freeze-protection PM 48 hrs ahead of the overnight low after weather forecast crossed the 28°F learned threshold.',
    risk: 'Resident heat loss + ~$18k emergency repair if circulation lines burst.',
    action: 'Seasonal PM completed by Jacob B. before the cold snap.',
    saved: 'Est. $18k avoided',
    confidence: 'High · matched the learned cold-snap pattern'
  },
  {
    id: 'fp-2', when: 'Prevented Mon · May 19',
    title: 'Unit 214 move-in delay averted',
    body: 'AI pre-staged Apex Mechanical 16 hrs before the 10 AM move-in after the repeat-failure threshold tripped.',
    risk: 'Lost first-month revenue + family escalation if HVAC didn\'t clear in time.',
    action: 'Vendor approved on the morning queue; arrived 9:05 AM with parts.',
    saved: 'Move-in protected',
    confidence: 'High · 3rd repeat failure in 90d'
  },
  {
    id: 'fp-3', when: 'Prevented Sun · May 18',
    title: 'Memory Care East HVAC emergency block held',
    body: 'AI protected Wednesday\'s HVAC PM block after detecting the degradation pattern in Memory Care East.',
    risk: '~22% projected emergency-WO spike during temperature swings.',
    action: 'PM block stayed on the schedule; 2 low-impact quick-wins shifted to Friday.',
    saved: 'Est. 6 emergency calls avoided',
    confidence: 'Medium-high · matches historical winter pattern'
  }
];

// Day 30 — active coordination rules the AI applies routinely.
// Tappable on the KPIs tile "Learned coordination patterns".
export const coordinationPatterns = [
  {
    id: 'cp-1', title: 'Pre-stage Apex Mechanical on repeat HVAC failures',
    body: 'When an HVAC asset hits 3+ failures in 90 days, the AI pre-stages an Apex Mechanical vendor request for your approval.',
    learnedOn: 'Learned Apr 14', state: 'Active', applied: 4, acceptance: 100
  },
  {
    id: 'cp-2', title: 'Reserve Marco D. for life-safety responses',
    body: 'Fire-panel and exit-light issues route to Marco first during the survey window.',
    learnedOn: 'Learned Apr 18', state: 'Active', applied: 6, acceptance: 100
  },
  {
    id: 'cp-3', title: 'Batch quick-wins onto Diane K.\'s afternoon route',
    body: 'Co-located light/hinge/seal fixes bundle onto Diane\'s 2 PM walk — zero added travel.',
    learnedOn: 'Learned Apr 20', state: 'Active', applied: 11, acceptance: 92
  },
  {
    id: 'cp-4', title: 'Sequence move-in HVAC ahead of cosmetic turns',
    body: 'When a move-in is <24h out, HVAC supersedes paint and cosmetic PMs.',
    learnedOn: 'Learned Apr 22', state: 'Active', applied: 5, acceptance: 100
  },
  {
    id: 'cp-5', title: 'Elevate seasonal mechanical PMs below 28°F',
    body: 'Overnight lows under 28°F bump boiler and freeze-risk PMs to Critical.',
    learnedOn: 'Learned Apr 24', state: 'Active', applied: 3, acceptance: 100
  },
  {
    id: 'cp-6', title: 'Offer Saturday PM slots when today is at capacity',
    body: 'Deferrable PMs slide to Saturday AM when the team is sequenced over capacity.',
    learnedOn: 'Learned Apr 27', state: 'Active', applied: 8, acceptance: 88
  },
  {
    id: 'cp-7', title: 'Weight Sasha P. higher when Bruce W. is overloaded',
    body: 'Generator and mechanical work routes to Sasha when Bruce\'s shift is +1h over.',
    learnedOn: 'Learned May 2', state: 'Active', applied: 7, acceptance: 100
  },
  {
    id: 'cp-8', title: 'Auto-close TELS-confirmed logbook tasks',
    body: 'Routine fire-extinguisher and water-temp logs close automatically once TELS confirms upload.',
    learnedOn: 'Learned May 5', state: 'Active', applied: 14, acceptance: 100
  },
  {
    id: 'cp-9', title: 'Batch food-safety logs onto Floor 1–3 routes',
    body: 'Refrigerator/freezer log tasks bundle onto whoever is already routed through those floors.',
    learnedOn: 'Learned May 8', state: 'Active', applied: 9, acceptance: 100
  },
  {
    id: 'cp-10', title: 'Reserve Bruce W. for life-safety walkthroughs',
    body: 'Cosmetic unit-turn paint touch-ups route to Sasha or Luis instead — keep Bruce on safety rounds.',
    learnedOn: 'Learned May 11', state: 'Paused', applied: 3, acceptance: 67,
    pausedReason: 'Awaiting your sign-off after recent override.'
  },
  {
    id: 'cp-11', title: 'Snooze cosmetic PMs during move-in spikes',
    body: 'Low-risk ceiling-tile and drywall touch-ups hold 24h when 3+ move-ins land in the same day.',
    learnedOn: 'Learned May 14', state: 'Active', applied: 4, acceptance: 100
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

// Error-mode payload: the scheduling agent is unreachable. Used by the
// Error (sickDay) dispatch surface to brief the MD on when service went
// down, what the team looked like at that moment, what came in during
// the outage, and what's at risk while routing is paused.
export const agentOutageEvent = {
  startedAt: '7:42 AM',
  ago: '38 min ago',
  status: 'Reconnecting · last attempt 6 sec ago',
  // Typical disruptions for this service last about 2 hours from onset.
  etaRestore: '9:45 AM',
  etaIn: '~1 hr 25 min',
  etaRange: 'Disruptions typically last ~2 hr',
  title: 'Scheduling agent unreachable',
  detail: 'Connected Community can’t reach the scheduling agent. Routing, batching, and capacity balancing are paused until service is restored. Manual scheduling required for new and re-routed work.',
  // Snapshot of the team at the moment routing stopped.
  teamStateAtOutage: {
    techsOnShift: 4,
    techsOverCap: 1,
    plannedHours: 31.2,
    inProgress: 3,
    summary: 'Marco on fire panel · Jacob over by 1.5h · Sasha staging Unit 119 turn'
  },
  // Risks accumulating while the agent is down.
  risks: [
    { id: 'r-1', icon: 'meeting_room', label: 'Unit 214 move-in tomorrow 10 AM', sub: 'HVAC repair status unknown' },
    { id: 'r-2', icon: 'ac_unit', label: 'Boiler #2 freeze inspection', sub: 'Due before tonight’s 22°F low' },
    { id: 'r-3', icon: 'event_repeat', label: 'Weekly regulatory log gaps', sub: 'Compliance window narrowing each hour' }
  ],
  // Work orders that arrived during the outage and weren’t auto-routed.
  unscheduledWorkOrders: [
    {
      id: 'uo-1', title: 'Emergency door alarm tripped · East wing',
      category: 'Life Safety', priority: 'Critical', tier: 'T1',
      receivedAt: '8:19 AM', location: 'East wing exit',
      icon: 'door_front', tone: 'error',
      body: 'Door propped open · resident wandering risk until secured.'
    },
    {
      id: 'uo-2', title: 'Refrigerator unit warming · Memory Care kitchen',
      category: 'HVAC', priority: 'High', tier: 'T2',
      receivedAt: '7:58 AM', location: 'Memory Care · Kitchen',
      icon: 'kitchen', tone: 'warning',
      body: 'Reading 48°F · resident meals at risk if not addressed by lunch.'
    },
    {
      id: 'uo-3', title: 'Resident reports tub won’t drain · Apt 308',
      category: 'Plumbing', priority: 'Medium', tier: 'T3',
      receivedAt: '8:11 AM', location: 'Apt 308',
      icon: 'water_drop', tone: 'info',
      body: 'Standing water · resident waiting on bath. No leak reported.'
    },
    {
      id: 'uo-4', title: 'Hallway light fixture flickering · Floor 2',
      category: 'Electrical', priority: 'Low', tier: 'T4',
      receivedAt: '8:14 AM', location: 'Floor 2 corridor',
      icon: 'lightbulb', tone: 'default',
      body: 'Intermittent · not at an egress location.'
    }
  ]
};

// Live-event payload used by the sickDay mode. A scheduling agent picks
// up Sasha's absence and proposes a 3-day rebalance: critical work stays
// today and gets distributed across the team; everything else flows into
// Sunday and Monday.
export const sickDayEvent = {
  id: 'sd-1',
  who: 'Sasha P.',
  reason: 'Called in sick',
  reportedAt: '6:42 AM',
  // Streamed during the "thinking" phase. Each step takes ~700ms.
  agentSteps: [
    { id: 's1', label: 'Pulling Sasha’s shift', detail: '11 items · 7.5h across Sat' },
    { id: 's2', label: 'Tagging critical work', detail: '5 items must stay today' },
    { id: 's3', label: 'Checking Marco’s capacity', detail: '+0.8h open after fire panel walkthrough' },
    { id: 's4', label: 'Checking Diane’s capacity', detail: 'Floor 2 already on her route' },
    { id: 's5', label: 'Checking Jacob’s Sunday', detail: '6.5h open · ideal for turn work' },
    { id: 's6', label: 'Sequencing Unit 117 handoff', detail: 'Touch-up → QA → walkthrough' },
    { id: 's7', label: 'Flagging compliance risk', detail: 'Generator inspection inside survey window' },
    { id: 's8', label: 'Drafting changes', detail: '10 reassignments across Sat–Mon' }
  ],
  // Headline numbers shown on the review card and at the top of the drawer.
  summary: {
    totalChanges: 10,
    staysToday: 5,
    bumpsSun: 4,
    bumpsMon: 1
  },
  // Per-day proposed changes. Each change carries the original task plus
  // the AI's "after" assignment, so the review drawer can render a
  // before/after diff per row and tap-through to the work order detail.
  changes: [
    // ── Today (Sat, May 16) — must stay today ─────────────────────────
    {
      id: 'sd-c1', day: 'Today · Sat, May 16', dayKey: 'today',
      before: { tech: 'Sasha P.', time: '2:00 PM', dur: '1h' },
      after:  { tech: 'Diane K.', time: '2:00 PM', dur: '1h' },
      task: { title: 'Generator visual inspection + logbook', location: 'Emergency Power Generators', kind: 'High', tone: 'warning' },
      reason: 'Inside the survey window · Diane already routed for regulatory logs'
    },
    {
      id: 'sd-c2', day: 'Today · Sat, May 16', dayKey: 'today',
      before: { tech: 'Sasha P.', time: '10:00 AM', dur: '1h 30m' },
      after:  { tech: 'Marco D.', time: '11:30 AM', dur: '1h 30m' },
      task: { title: 'Unit 117 paint touch-up', location: 'Unit 117', kind: 'High', tone: 'success' },
      reason: 'Marco has open time after the fire panel walkthrough · Unit 117 move-in ties this to today'
    },
    {
      id: 'sd-c3', day: 'Today · Sat, May 16', dayKey: 'today',
      before: { tech: 'Sasha P.', time: '1:00 PM', dur: '45m' },
      after:  { tech: 'Marco D.', time: '1:00 PM', dur: '45m' },
      task: { title: 'Unit 117 final QA pass', location: 'Unit 117', kind: 'QA', tone: 'info' },
      reason: 'Sequenced after Marco’s touch-up · keeps the 117 handoff intact'
    },
    {
      id: 'sd-c4', day: 'Today · Sat, May 16', dayKey: 'today',
      before: { tech: 'Sasha P.', time: '4:00 PM', dur: '30m' },
      after:  { tech: 'Marco D.', time: '4:00 PM', dur: '30m' },
      task: { title: 'Move-in walkthrough · Unit 117', location: 'Unit 117', kind: 'Resident', tone: 'info' },
      reason: 'Resident orientation · same tech owns the full Unit 117 sequence'
    },
    {
      id: 'sd-c5', day: 'Today · Sat, May 16', dayKey: 'today',
      before: { tech: 'Sasha P.', time: '12:30 PM', dur: '30m' },
      after:  { tech: 'Diane K.', time: '12:45 PM', dur: '30m' },
      task: { title: 'Apt 204 door adjust', location: 'Apt 204', kind: 'Resident', tone: 'default' },
      reason: 'Diane’s afternoon route already passes Floor 2'
    },

    // ── Sun (May 17) — turn work pulled forward to keep Mon clean ─────
    {
      id: 'sd-c6', day: 'Sun, May 17', dayKey: 'sun',
      before: { tech: 'Sasha P.', time: 'Sat · 8:30 AM', dur: '30m' },
      after:  { tech: 'Jacob B.', time: 'Sun · 8:30 AM', dur: '30m' },
      task: { title: 'Stage paint + touch-up kit', location: 'Shop floor', kind: 'Prep', tone: 'default' },
      reason: 'Batched with Jacob’s Sunday turn-day setup'
    },
    {
      id: 'sd-c7', day: 'Sun, May 17', dayKey: 'sun',
      before: { tech: 'Sasha P.', time: 'Sat · 9:00 AM', dur: '1h' },
      after:  { tech: 'Jacob B.', time: 'Sun · 9:00 AM', dur: '1h' },
      task: { title: 'Unit 119 turn · punch list', location: 'Unit 119', kind: 'Turn', tone: 'default' },
      reason: 'Sunday turn slot · Jacob is the next-best fit for turn work'
    },
    {
      id: 'sd-c8', day: 'Sun, May 17', dayKey: 'sun',
      before: { tech: 'Sasha P.', time: 'Sat · 11:30 AM', dur: '30m' },
      after:  { tech: 'Jacob B.', time: 'Sun · 10:30 AM', dur: '30m' },
      task: { title: 'Stage materials · Unit 121 turn', location: 'Unit 121', kind: 'Prep', tone: 'default' },
      reason: 'Setup for the Unit 121 turn that follows'
    },
    {
      id: 'sd-c9', day: 'Sun, May 17', dayKey: 'sun',
      before: { tech: 'Sasha P.', time: 'Sat · 3:00 PM', dur: '45m' },
      after:  { tech: 'Jacob B.', time: 'Sun · 11:00 AM', dur: '45m' },
      task: { title: 'Unit 121 paint + caulk', location: 'Unit 121', kind: 'Turn', tone: 'default' },
      reason: 'Pulled forward to keep Jacob’s Sunday compact'
    },

    // ── Mon (May 18) — cleanup task lands when Sasha is expected back ─
    {
      id: 'sd-c10', day: 'Mon, May 18', dayKey: 'mon',
      before: { tech: 'Sasha P.', time: 'Sat · 4:30 PM', dur: '30m' },
      after:  { tech: 'Sasha P.', time: 'Mon · 8:00 AM', dur: '30m' },
      task: { title: 'Turn QA photos · upload to TELS', location: 'Office', kind: 'QA', tone: 'default' },
      reason: 'Holds for Sasha when she’s back · admin task with no compliance window'
    }
  ]
};

// ──────────────────────────────────────────────────────────────────
// Operational Knowledge — what Connected Community has observed,
// learned, and validated about the building and its people.
// ──────────────────────────────────────────────────────────────────

// B. Team Intelligence — per-tech observations the MD can review,
// refine, and pause. Keyed by `team.id`.
export const teamIntelligence = {
  'tm-1': {  // Marco D.
    confidence: 'High',
    observed: [
      'Strong fire-panel and life-safety systems experience — leads ' +
        'most regulatory documentation work.',
      'Performs best on dayshift with planned compliance work.',
      'Frequently selected by the MD to lead survey-window prep.'
    ],
    usedFor: ['Critical / life-safety routing', 'Compliance documentation', 'Mentoring routing'],
    skills: ['Life Safety', 'HVAC', 'Compliance'],
    strengths: ['High quality', 'Strong documentation', 'Resident communication'],
    workStyle: ['Performs well under pressure', 'Strong with planned work'],
    constraints: ['Best on dayshift'],
    notes: [
      { id: 'n-1', author: 'Mike F.', when: '12 days ago', body: 'Marco prefers to handle the survey paperwork himself — keep him on it.' }
    ]
  },
  'tm-2': {  // Jacob B.
    confidence: 'High',
    observed: [
      'Specialized HVAC + boiler troubleshooting; resolves repeat faults faster than team avg.',
      'Tends to run hot — frequently over capacity on freeze-risk days.',
      'Cooling-tower and rooftop systems are his strongest assets.'
    ],
    usedFor: ['HVAC routing', 'Boiler escalation', 'Freeze-prep coordination'],
    skills: ['HVAC', 'Boilers', 'Rooftop systems'],
    strengths: ['Fast completion', 'Strong with reactive work'],
    workStyle: ['Performs well under pressure', 'Better with reactive work'],
    constraints: ['Requires vendor support on chillers', 'Avoid after-hours assignments'],
    notes: []
  },
  'tm-3': {  // Sasha P.
    confidence: 'High',
    observed: [
      'Completes unit turns 18% faster than team average during occupancy pressure.',
      'Performs best when assigned consecutive unit-turn blocks.',
      'Frequently selected by the MD during move-in readiness situations.'
    ],
    usedFor: ['Unit turn staffing', 'Occupancy readiness', 'Move-in coordination'],
    skills: ['Unit Turns', 'Painting', 'Punch-list work'],
    strengths: ['Fast completion', 'Strong with planned work'],
    workStyle: ['Prefers uninterrupted work blocks', 'Strong with planned work'],
    constraints: ['Limited availability during back-to-back move-ins'],
    notes: [
      { id: 'n-2', author: 'Mike F.', when: '5 days ago', body: 'Only assign Sasha consecutive turns when occupancy pressure is high.' }
    ]
  },
  'tm-4': {  // Diane K.
    confidence: 'Medium',
    observed: [
      'Strong on resident-facing work; bundles quick wins efficiently along routes.',
      'Best with regulatory log-keeping (water temps, food-safety).',
      'Tends to absorb stretch capacity when the team is over.'
    ],
    usedFor: ['Quick-win batching', 'Regulatory log routing', 'Resident requests'],
    skills: ['General Maintenance', 'Plumbing', 'Compliance'],
    strengths: ['Strong documentation', 'Resident communication'],
    workStyle: ['Better with reactive work'],
    constraints: [],
    notes: []
  },
  'tm-5': {  // Luis M.
    confidence: 'Low',
    observed: [
      'New apprentice — early signs of strength on Memory Care layouts.',
      'Still calibrating around routine PM cadence and unit-turn pace.'
    ],
    usedFor: ['Shadowing routing', 'Memory Care familiarization'],
    skills: ['Memory Care areas'],
    strengths: [],
    workStyle: ['Strong with planned work'],
    constraints: ['Avoid after-hours assignments', 'Requires senior pairing on critical work'],
    notes: []
  }
};

// C. Building Intelligence — what the AI has observed about the
// physical plant and its operational rhythms.
export const buildingIntelligence = [
  {
    id: 'bi-1',
    icon: 'ac_unit',
    title: 'Memory Care East HVAC failures increasing',
    body: 'Three HVAC service calls in the last 90 days vs. one in the prior 90. Pattern correlates with a single rooftop unit.',
    confidence: 'Medium',
    influence: 'Used in vendor-escalation timing and freeze-prep coordination.'
  },
  {
    id: 'bi-2',
    icon: 'event_repeat',
    title: 'Boiler PM delays correlate with winter emergency work orders',
    body: 'Quarterly PM slip during Nov–Feb has been followed by an emergency call ~3 weeks later in 2 of the last 3 winters.',
    confidence: 'Medium',
    influence: 'Used to protect winter PM blocks from being deferred.'
  },
  {
    id: 'bi-3',
    icon: 'meeting_room',
    title: 'Occupancy spikes increase PM deferrals',
    body: 'PM completion drops ~8% on weeks with three or more move-ins.',
    confidence: 'Medium',
    influence: 'Used to pre-shift PM cadence around scheduled move-ins.'
  },
  {
    id: 'bi-4',
    icon: 'fact_check',
    title: 'Survey readiness drops when staffing utilization exceeds 90%',
    body: 'Regulatory log gaps appear in 4 of the last 5 weeks where team utilization sustained above 90%.',
    confidence: 'High',
    influence: 'Used to flag staffing risk to readiness score.'
  }
];

// D. Observed Patterns — low-confidence signals Connected Community is
// still gathering context on.
export const observedPatterns = [
  {
    id: 'op-1',
    icon: 'engineering',
    title: 'Possible technician specialization · Luis on Memory Care',
    body: 'Two consecutive Memory Care turn completions came in below average time. Continuing to monitor.',
    confidence: 'Low'
  },
  {
    id: 'op-2',
    icon: 'group',
    title: 'Emerging staffing trend · Friday afternoon overflow',
    body: 'Last three Fridays the team has finished 1.5–2 hours over capacity. Cause unclear.',
    confidence: 'Low'
  },
  {
    id: 'op-3',
    icon: 'plumbing',
    title: 'Potential repeat asset issue · Apt 308 plumbing',
    body: 'Two non-overlapping resident requests for the same fixture in 6 weeks.',
    confidence: 'Low'
  }
];

// F. Trusted Operational Knowledge — high-confidence, validated
// knowledge being used in coordination decisions.
export const trustedKnowledge = [
  {
    id: 'tk-1',
    icon: 'verified',
    title: 'Marco leads regulatory documentation',
    body: 'Validated across 14 consecutive survey-window weeks. Used to anchor compliance routing.',
    confidence: 'High',
    weight: 'Strong influence'
  },
  {
    id: 'tk-2',
    icon: 'verified',
    title: 'Sasha + consecutive turns under occupancy pressure',
    body: 'Validated across 9 move-in spikes since calibration. Bundled into the unit-turn coordination rule.',
    confidence: 'High',
    weight: 'Strong influence'
  },
  {
    id: 'tk-3',
    icon: 'verified',
    title: 'Boiler PMs are not deferrable below 28°F forecast',
    body: 'Building-specific operational rule. Confirmed by the MD twice; auto-applied since.',
    confidence: 'High',
    weight: 'Strong influence'
  }
];

// Existing Sun/Mon shifts for techs receiving Sasha's reassigned work.
// Used by the Mark-out review's per-tech card so the MD can see the rest
// of the receiving tech's day, not just the items being added in.
export const teamForecast = {
  sun: {
    // Jacob B. — weekend on-call coverage; HVAC + boiler routine.
    'tm-2': [
      { time: '8:00 AM', dur: '1h', kind: 'PM', title: 'Boiler #2 weekly walkdown', location: 'Mech Room B', icon: 'thermostat', tone: 'default' },
      { time: '9:30 AM', dur: '1h 30m', kind: 'High', title: 'RTU-4 vibration follow-up', location: 'Roof · RTU-4', icon: 'hvac', tone: 'warning', note: 'Resident comfort complaints continued overnight.' },
      { time: '12:00 PM', dur: '30m', kind: 'Break', title: 'Lunch', location: 'Break room', icon: 'restaurant', tone: 'default' },
      { time: '1:00 PM', dur: '1h', kind: 'PM', title: 'Cooling tower water-treatment log', location: 'Roof · Cooling tower', icon: 'water_drop', tone: 'default' },
      { time: '2:30 PM', dur: '1h', kind: 'Walkthrough', title: 'Boiler room round', location: 'Mech Room B', icon: 'fact_check', tone: 'default' },
      { time: '4:00 PM', dur: '45m', kind: 'Prep', title: 'Weekend on-call handoff log', location: 'Office', icon: 'task_alt', tone: 'default' }
    ]
  },
  mon: {
    // Sasha P. — returning Monday after the Saturday absence. Full turn day.
    'tm-3': [
      { time: '8:30 AM', dur: '1h', kind: 'Turn', title: 'Unit 124 turn · punch list', location: 'Unit 124', icon: 'meeting_room', tone: 'default' },
      { time: '9:30 AM', dur: '1h 30m', kind: 'High', title: 'Unit 125 paint touch-up', location: 'Unit 125', icon: 'format_paint', tone: 'warning' },
      { time: '11:00 AM', dur: '30m', kind: 'Resident', title: 'Floor 1 work-order check-ins', location: 'Floor 1', icon: 'home_repair_service', tone: 'default' },
      { time: '12:00 PM', dur: '30m', kind: 'Break', title: 'Lunch', location: 'Break room', icon: 'restaurant', tone: 'default' },
      { time: '12:30 PM', dur: '45m', kind: 'QA', title: 'Unit 125 final QA pass', location: 'Unit 125', icon: 'task_alt', tone: 'info' },
      { time: '1:15 PM', dur: '45m', kind: 'Resident', title: 'Apt 312 fixture replace', location: 'Apt 312', icon: 'home_repair_service', tone: 'default' },
      { time: '2:00 PM', dur: '45m', kind: 'Prep', title: 'Stage materials · next move-in batch', location: 'Shop floor', icon: 'inventory_2', tone: 'default' },
      { time: '2:45 PM', dur: '1h 15m', kind: 'Turn', title: 'Unit 127 punch list', location: 'Unit 127', icon: 'meeting_room', tone: 'default' }
    ]
  }
};
