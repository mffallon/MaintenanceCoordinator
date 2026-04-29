import React from 'react';

/**
 * SurveyWindowIndicator
 *
 * Compact horizontal timeline showing how close a community is to its
 * next survey window. The window runs from month 9 to month 15 after
 * the last completed survey (month 0).
 *
 * States (driven by `monthsSinceLastSurvey`):
 *   - default  : community is more than 90 days (3 months) from window start
 *   - approach : within 90 days of window start  (months 6 ≤ m < 8)        → yellow
 *   - warning  : within 30 days of window start  (months 8 ≤ m < 9)        → orange
 *   - inWindow : inside the survey window         (months 9 ≤ m ≤ 15)      → pink
 *
 * If `monthsSinceLastSurvey` exceeds 15, the arrow is clamped to 15.
 */

export const VIEWBOX_X = -6;
export const VIEWBOX_WIDTH = 186;
export const VIEWBOX_HEIGHT = 44;
const TRACK_START = 2;
const TRACK_END = 172;
const TRACK_LENGTH = TRACK_END - TRACK_START; // 170
const BASELINE_Y = 20;
export const TOTAL_MONTHS = 15;
const LABEL_MONTHS = [0, 3, 6, 9, 12, 15];
// Major ticks: 9 and 15 are the meaningful window boundaries (tall);
// 0, 3, 6 are short — same height as minor ticks but rendered with major weight.
const MAJOR_TICK_MONTHS_TALL = [9, 15];
const MAJOR_TICK_MONTHS_SHORT = [0, 3, 6];

const COLORS = {
  track: '#B4B2A9',
  tickMajor: '#5F5E5A',
  arrowDefault: '#5F5E5A',
  arrowApproach: '#BA7517',
  arrowWarning: '#D85A30',
  arrowInWindow: '#D4537E',
  fillApproach: '#FAEEDA',
  fillWarning: '#FAECE7',
  fillInWindow: '#FBEAF0',
};

const MINOR_TICK_MONTHS = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14];

export function monthToX(month: number): number {
  return TRACK_START + (month / TOTAL_MONTHS) * TRACK_LENGTH;
}

export type SurveyWindowState = 'default' | 'approach' | 'warning' | 'inWindow';

export function resolveMonths({
  monthsSinceLastSurvey,
  lastSurveyDate,
}: {
  monthsSinceLastSurvey?: number;
  lastSurveyDate?: string | Date;
}): number {
  if (typeof monthsSinceLastSurvey === 'number' && !Number.isNaN(monthsSinceLastSurvey)) {
    return Math.max(0, monthsSinceLastSurvey);
  }
  if (lastSurveyDate) {
    const d = lastSurveyDate instanceof Date ? lastSurveyDate : new Date(lastSurveyDate);
    if (!Number.isNaN(d.getTime())) {
      const ms = new Date('2026-04-02').getTime() - d.getTime();
      const months = ms / (1000 * 60 * 60 * 24 * 30.4375);
      return Math.max(0, months);
    }
  }
  return 0;
}

export function resolveState(months: number): SurveyWindowState {
  if (months >= 9) return 'inWindow';
  if (months >= 8) return 'warning';
  if (months >= 6) return 'approach';
  return 'default';
}

interface SurveyWindowIndicatorProps {
  monthsSinceLastSurvey?: number;
  lastSurveyDate?: string | Date;
  maxWidth?: number;
  className?: string;
  ariaLabel?: string;
}

export default function SurveyWindowIndicator({
  monthsSinceLastSurvey,
  lastSurveyDate,
  maxWidth = 194,
  className,
  ariaLabel,
}: SurveyWindowIndicatorProps) {
  const rawMonths = resolveMonths({ monthsSinceLastSurvey, lastSurveyDate });
  const months = Math.min(rawMonths, TOTAL_MONTHS); // clamp to 15 for display
  const state = resolveState(months);

  const arrowColor = {
    default: COLORS.arrowDefault,
    approach: COLORS.arrowApproach,
    warning: COLORS.arrowWarning,
    inWindow: COLORS.arrowInWindow,
  }[state];

  let band: { x: number; width: number; fill: string } | null = null;
  if (state === 'approach') {
    band = { x: monthToX(6), width: monthToX(9) - monthToX(6), fill: COLORS.fillApproach };
  } else if (state === 'warning') {
    band = { x: monthToX(8), width: monthToX(9) - monthToX(8), fill: COLORS.fillWarning };
  } else if (state === 'inWindow') {
    band = { x: monthToX(9), width: monthToX(15) - monthToX(9), fill: COLORS.fillInWindow };
  }

  const arrowX = monthToX(months);
  const label =
    ariaLabel ??
    `Community is ${rawMonths.toFixed(1)} months past last survey. ${
      state === 'inWindow'
        ? 'Inside survey window.'
        : state === 'warning'
        ? 'Within 30 days of survey window.'
        : state === 'approach'
        ? 'Within 90 days of survey window.'
        : 'Outside survey window.'
    }`;

  return (
    <div className={className} style={{ width: '100%', maxWidth, lineHeight: 0 }}>
      <svg
        viewBox={`${VIEWBOX_X} 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        width="100%"
        role="img"
        aria-label={label}
        style={{ display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Highlight band */}
        {band && (
          <rect x={band.x} y={11} width={band.width} height={18} fill={band.fill} />
        )}

        {/* Baseline */}
        <line
          x1={TRACK_START} y1={20} x2={TRACK_END} y2={20}
          stroke={COLORS.track} strokeWidth={1}
        />

        {/* Minor ticks */}
        {MINOR_TICK_MONTHS.map((m) => (
          <line
            key={`minor-${m}`}
            x1={monthToX(m)} y1={17} x2={monthToX(m)} y2={23}
            stroke={COLORS.track} strokeWidth={1}
          />
        ))}

        {/* Major ticks — tall (9, 15: window boundaries) */}
        {MAJOR_TICK_MONTHS_TALL.map((m) => (
          <line
            key={`major-tall-${m}`}
            x1={monthToX(m)} y1={13} x2={monthToX(m)} y2={27}
            stroke={COLORS.tickMajor} strokeWidth={1.5}
          />
        ))}

        {/* Major ticks — short (0, 3, 6: pre-window milestones) */}
        {MAJOR_TICK_MONTHS_SHORT.map((m) => (
          <line
            key={`major-short-${m}`}
            x1={monthToX(m)} y1={17} x2={monthToX(m)} y2={23}
            stroke={COLORS.tickMajor} strokeWidth={1.5}
          />
        ))}

        {/* Dashed 12-month marker */}
        <line
          x1={monthToX(12)} y1={13} x2={monthToX(12)} y2={27}
          stroke={COLORS.tickMajor} strokeWidth={1.2}
          strokeDasharray="2,2"
        />

        {/* Arrow indicator — 12w × 9h triangle, tip on baseline */}
        <path
          d={`M ${arrowX} ${BASELINE_Y} L ${arrowX - 6} 11 L ${arrowX + 6} 11 Z`}
          fill={arrowColor}
        />

        {/* Month labels below the timeline */}
        <g fontFamily="inherit" fontSize="8" fill={COLORS.tickMajor} textAnchor="middle">
          {LABEL_MONTHS.map((m) => (
            <text key={`label-${m}`} x={monthToX(m)} y={38}>
              {m}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
