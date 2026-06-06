# Connected Community Prototype — Briefing

A mobile-first React + MUI prototype demonstrating how an agentic AI maintenance coordinator earns trust over time with a senior-living Maintenance Director (MD). The prototype is built around a three-stage **Trust Maturity Model** and ships as an iPhone 17 (402×874) framed deploy on GitHub Pages.

Deployed at: `https://mffallon.github.io/MaintenanceCoordinator/`

---

## Trust Maturity Model — three levels

A segmented control in the status-bar row (`Day: 1 · 30 · 90`) flips the entire app's UX between three modes:

| Level | Label | MD posture | What the agent does |
|---|---|---|---|
| **Day 1** | Learning | "I am supervising operations." | Recommends and explains; reasoning shown inline. Routine work still flows but every decision is in the MD's hands. |
| **Day 30** | Calibrated | "The AI quietly coordinates routine work." | Routine PM, quick-win batching, and staffing balancing are auto-coordinated from learned rules. MD sees grouped state + exceptions. |
| **Day 90** | Predictive | "The AI protects readiness; I oversee health." | Forecasting active; only strategic risks, staffing insights, and operational health surface. Routine work is invisible unless drift is detected. |

The three-stage segmented control sits where the iPhone status-bar island would normally be.

---

## Audience and voice

**Audience**: Maintenance Directors, Maintenance Supervisors, Directors of Facilities, ES Leaders, Building Operations teams in senior living / healthcare.

**Voice principle**: Sound like an experienced maintenance supervisor — direct, calm, specific, useful. **Not** like a salesperson, consultant, marketer, or generic chatbot.

| Use | Avoid |
|---|---|
| Work order, PM, asset, vendor, lead time, life safety, downtime, root cause, compliance, survey | Transformation, innovation, synergy, optimization, empower, ecosystem, paradigm shift, revolutionary |
| "This part fits." "This is in stock." "Fix today." | "Let's explore opportunities." "This empowers your team." |
| `·` separators for compact fact strings ("Coordination calibrated · 30 days at Cedar Ridge") | Soft-language hedges ("quietly," "in the background" as a modifier where a fact would do) |

The agent's primary goal is to help the user **quickly solve operational problems** — not to demonstrate AI capability.

---

## Day 1 — Learning state

**Banner** sits on a light-purple section backdrop, flush against the top nav:
- Headline: *Learning Cedar Ridge operations*
- Sub: *Recommending today, learning as it goes.* + inline link *Adjust coordination settings*
- Day 1 · Learning chip
- 3 metric tiles, each tappable to a drawer:
  - **9 · Recommendations accepted · this week** → drawer lists all 9 with timestamp, action, AI reasoning, what was learned, per-row **Undo** (state-aware) and **Add context**
  - **2 · Overrides learned · so far** → drawer lists overrides; per-row **Ignore / Restore** + **Add context**
  - **4 · Patterns detected · early signals** → drawer lists 4 monitored patterns; per-row **Confirm pattern / Dismiss** + **Add context**

**Today screen flow**:
1. *Needs your approval* section (red icon)
   - Weather card
   - **Incoming WO card** (top): "New" pill + Medium priority chip + WO-1099 · 4 min ago
     - Title: *Toilet running continuously*
     - Location: *Bldg A · Floor 2 · Unit 209*
     - Body: *Wasting water and waking the resident. Fix today.*
     - **AI suggests** panel: tappable tech chip (**Sasha P.**) + capacity chips + rationale + ✓ Zero added travel + Confidence
     - Footer: **Approve** / **Override** / Add-context icon
     - Below the panel: full-width **Snooze** → dedicated SnoozeSheet (duration + optional reason)
   - **ReviewCards** for all reviews (Competing critical issues, Services Recommendation, Staffing overload, Predictive readiness risk)
     - Why / Tradeoff / Confidence shown **inline by default** on Day 1 (no More info collapse)
     - Staffing overload's secondary button is **View {tech}'s schedule** (opens TeamMemberSheet) instead of Override
2. *PM tradeoff* section — one deferrable PM with **Approve defer / Keep today**
3. *Outcomes* section (green check icon) — *What the AI handled in the background*
   - "Routine work coordinated" expandable rollup card

**Schedule tab**
- *My Day* — full priority-ordered timeline ("Your day · ordered by priority · top items first")
- *Team* — leading AI banner *"AI recommending assignments · still learning each tech's pace"* + per-tech cards (name + status chip / shift · items · planned hours)

**Work tab** — 4 segments: Work orders / Tasks / Unit turns / Services. No rollup at top. Snoozed WOs appear in their own bucket at the top of Work orders.

**KPIs tab** — *Early calibration signals · still learning the building.* (3 tiles: Recommendations accepted · Overrides learned · Patterns detected) + KPI Trajectory bars (Regulatory Comp., PM Comp., Total Task Comp., Document Upload, Unit Turn Ready).

---

## Day 30 — Calibrated state

**Banner**:
- Headline: *Coordination calibrated · 30 days at Cedar Ridge*
- Sub: *Routine PM, quick-win batching, and staffing balancing handled. Ready to widen what it covers?* + inline link *Review coordination settings*
- Day 30 · Calibrated chip
- 3 metric tiles (3-across):
  - **82% · Recommendation acceptance · last 30 days** → opens the Day-1 Accepted-Recommendations drawer
  - **11 · Learned coordination patterns · active rules** → opens the Coordination Patterns drawer (11 rules, each with **Ignore / Restore** + **Add context**, equal-width buttons)
  - **94% · PM tasks performed on time · last 30 days** (non-tappable)

**Today screen flow**:
1. *Exceptions requiring review* (above operational state) — weather + reviews. Each ReviewCard has **More info** collapse for Why / Tradeoff / Confidence (collapsed by default on Day 30/90).
2. *Today's state* (3 readiness summary rows, all tappable to detail drawers showing the underlying items)
   - *Routine PM coordination stabilized* (11 PMs · 9 completed · 2 in flight)
   - *Quick-win batching completed automatically* (5 bundled onto Diane's 2 PM route · 0 detours)
   - *Occupancy readiness protected* (Unit 214 · 92% ready · 0 blockers)
3. *Outcomes* — backlog readiness row (*WO backlog trending stable*, tappable to detail) + "Routine work coordinated" rollup

**Coordination Settings** drawer (opened from menu or banner sub-link):
- 30-Day Calibration Report header + stat tiles (each tappable to a sparkline / bar chart with date markers)
- **Recommended next step** panel (indigo bg):
  - Action: *Let the AI handle routine technician reassignment without sign-off.*
  - Because: 92% of reassignment recommendations were accepted · No critical reassignment overrides in 14 days
  - Buttons: **Allow** / **Not yet**
- *Patterns the AI learned about your building*

**Schedule tab**
- *My Day* — banner *"Your day · approvals and exceptions only"*; only Approval / Override review / Sign-off / Walkthrough items shown; "+N routine blocks coordinated" rollup
- *Team* — banner *"Team pre-balanced from 30 days of completion data"*; one focus line per technician

**Work tab** — same segments as Day 1. No rollup card at top.

**KPIs tab** — *Calibration depth and operational lift · last 30 days.* (Point-in-time tiles: 82% acceptance · 11 patterns · 94% PM on time + Trend subhead with date range and dated trend tiles)

---

## Day 90 — Predictive state

**Banner**:
- Headline: *Forecasting active · 90 days of pattern data*
- Sub: *PM, staffing, occupancy, and compliance trends are tracked. Forecasts surface when something needs your read.*
- Italic context note: *Based on 90 days of staffing, PM, occupancy, and work-order data.*
- Day 90 · Insights available chip
- 5 metric tiles in a 6-col grid:
  - Row 1 (3 across, tappable): **23 · Operational patterns learned** / **3 · Forecasted risks prevented this week** / **94% · Readiness stability maintained**
    - Patterns tile → Coordination Patterns drawer
    - Forecasted risks tile → drawer listing 3 averted risks (boiler freeze, Unit 214 move-in, Memory Care East HVAC block) — each with Risk-if-untreated callout, Action-taken callout, savings + confidence chips, **Add context**
  - Row 2 (2 across, non-tappable): **−18% · PM degradation risk** / **42 days · Backlog stabilized — consecutive**

**Today screen flow** (order):
1. **Staffing insight** section (psychology icon, indigo) — *One signal the AI couldn't decide on alone — everything else is handled*
   - The current insight: *Bruce W.'s completion times have slowed ~22% over 30 days.* AI staged 3 remediation paths (Operational rebalance / Training pairing / HR conversation) but won't act autonomously. Why / Tradeoff / Confidence collapsed behind More info.
2. **Strategic risk** — *One anomaly the AI thinks you should personally weigh* — predictive readiness risk card
3. **Operational health** (4 readiness summary rows, all tappable to detail)
4. **Outcomes** — "Routine work coordinated" rollup (+46 actions)

**Schedule tab**
- *My Day* — banner *"Your day · oversight only · routine handled"*; top 2 most strategic items only
- *Team* — banner *"Coverage balanced. AI is watching drift, not assigning work"*; high-level coverage statements with per-tech chip row

**Work tab** — same segments. No rollup at top.

**KPIs tab** — *Predictive readiness · last 90 days.* (5 AI Coordination KPI tiles, 4 point-in-time + 1 trend with date range)

---

## Cross-cutting features

### Unified Item Detail drawer
Tapping any row on the Work tab (work orders, tasks, unit turns, services) opens a single adaptive drawer with:
- Header: ID + kind + status chip + priority chip + title
- Detail card: Location, Assignee, ETA, Due, Cadence, Opened, Trade, SLA, Cost, Readiness % (only present fields show)
- Context note
- Tags chip row
- Asset History
- Activity timeline (AI sequencing entry + assignee actions, state-aware)
- Footer: Reschedule / Reassign / Add note + state-aware primary action

### Learned-pattern chip
Unit turn rows with `learned: true` and a `patternId` show a tappable "Learned pattern" chip. Tap opens a pattern-detail drawer mirroring the Day 1 patterns shape (timestamp + state pill + title + body + Why / "What the AI learned" / Confirm pattern / Dismiss).

### Add Context drawer
Used everywhere "Add context" is offered. Header + item summary card + multiline TextField + mic button that simulates dictation (~1.8s pulse, auto-inserts a sample transcription tuned to the metric type) + Cancel / Save context.

### Highlight + deep-link
When a Day 1 "Undo" drawer's *Open the source item* link is tapped:
- Resolves the underlying WO/TK/UT/SV across `tiers + backlog + predictiveWorkOrders / tasksList / unitTurns / services`
- Opens the unified Item Detail drawer with real data
- Falls back to tab/segment switch + amber-ring scroll-to-row highlight if no exact match

### Snooze flow
Tapping **Snooze** on the incoming WO opens a dedicated SnoozeSheet with:
- 2×2 duration buttons (1 hour / 2 hours / End of day / Tomorrow AM)
- 6 reason chips (Resident not home / Waiting on parts / Capacity opens later / Lower priority right now / Schedule conflict / Other reason)
- Skip-reason-and-just-snooze option
- On confirm: card disappears from approvals, appears in a new **Snoozed** bucket at the top of Work tab → Work orders

### AI activity (full page)
Reachable from the menu. Each activity card mirrors the Day 1 metric-card layout: timestamp + state pill + title + body + purple psychology "why" line + "What the AI did" panel with Add context + state-aware **Undo** footer (disabled when Completed/Monitoring).

---

## Three trust mechanisms in evidence

The prototype intentionally demonstrates two-to-three of the canonical agent-delegation trust mechanisms:

| Mechanism | Where it shows up |
|---|---|
| **Communicates what it's doing and why** | The "AI suggests" panel on the incoming WO; the "Why / Tradeoff / Confidence" on every ReviewCard (inline on Day 1, collapsed on Day 30/90); the purple "psychology" line on AI activity cards; the "What the AI learned" panel on Day 1 metric drawers; the Pattern Detail drawer for the Learned-pattern chip on unit turns. |
| **Operating constraints become visible** | Coordination Settings drawer surfaces every learned rule + per-rule Ignore/Restore + stats panel; the Day 30 *Recommended next step* invites the MD to widen what the AI handles without sign-off — but never expands scope autonomously; "Confidence" line on every recommendation; "Monitoring · N samples" state pill on patterns the AI is watching but won't act on. |
| **User can override or recover from error** | Approve / Override buttons on every ReviewCard; Undo flow on Day 1 metric drawers opens a confirmation drawer with full context, three actions (Decline-undo / Accept-again / Add context) plus a deep link to the source item; **Snooze** with reason capture so the AI learns *why* something was deferred; **Ignore rule** action on Coordination Patterns so the MD can suspend a learned rule without arguing with it. |

---

## Key data sources (`src/data.js`)

- `tiers` — 11 prioritized work items used in Day 1 dispatch plan
- `reviews` + `predictiveReviews` — escalations needing MD sign-off
- `incomingWorkOrder` — the fresh WO-1099 at the top of Day 1 approvals
- `day1Status` / `day30Status` / `day90Status` — banner content + metric tiles
- `day1MetricDetails` — drawer contents for the 3 Day 1 banner tiles (with state pills, undoable flags, route to source item)
- `coordinationPatterns` — 11 learned rules surfaced from the Day 30 banner / KPIs tile
- `forecastedRisksPrevented` — 3 averted risks surfaced from the Day 90 banner tile
- `day30Readiness` / `day90Health` — grouped readiness summaries with expanded detail (stats + items)
- `routineRollup` — counts behind the "Routine work coordinated" rollup card
- `team` + `teamFocus` + `day90Coverage` — Schedule Team view content
- `tasksList` / `backlog` / `predictiveWorkOrders` / `unitTurns` / `services` — Work tab content

---

## Latest deploy

Branch: `dispatch-polish-day1-30-90` (merged to `main`)
Last polish pass: copy tightened across banners, AI explainer lines, rollup labels, KPIs subs, Outcomes sub, snooze copy, Coordination Settings recommended-next-step — all moved away from personified "Connected Community is …" framing into maintenance-supervisor voice.
