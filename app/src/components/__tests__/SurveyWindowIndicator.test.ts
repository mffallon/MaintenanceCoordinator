import { describe, it, expect } from 'vitest';
import { resolveState, resolveMonths } from '../SurveyWindowIndicator';

describe('resolveState', () => {
  it('returns default below 6 months', () => {
    expect(resolveState(0)).toBe('default');
    expect(resolveState(5.99)).toBe('default');
  });

  it('returns approach at exactly 6 months', () => {
    expect(resolveState(6)).toBe('approach');
    expect(resolveState(7.99)).toBe('approach');
  });

  it('returns warning at exactly 8 months', () => {
    expect(resolveState(8)).toBe('warning');
    expect(resolveState(8.99)).toBe('warning');
  });

  it('returns inWindow at exactly 9 months', () => {
    expect(resolveState(9)).toBe('inWindow');
    expect(resolveState(15)).toBe('inWindow');
  });

  it('returns inWindow past 15 months (arrow clamped separately)', () => {
    expect(resolveState(16)).toBe('inWindow');
    expect(resolveState(100)).toBe('inWindow');
  });
});

describe('resolveMonths — numeric input', () => {
  it('returns the value directly', () => {
    expect(resolveMonths({ monthsSinceLastSurvey: 7.5 })).toBe(7.5);
  });

  it('clamps negative values to 0', () => {
    expect(resolveMonths({ monthsSinceLastSurvey: -1 })).toBe(0);
  });

  it('passes through values above 15 unchanged (clamping is the component job)', () => {
    expect(resolveMonths({ monthsSinceLastSurvey: 16.5 })).toBe(16.5);
  });

  it('ignores NaN and falls through to lastSurveyDate fallback (returning 0 if no date)', () => {
    expect(resolveMonths({ monthsSinceLastSurvey: NaN })).toBe(0);
  });
});

describe('resolveMonths — lastSurveyDate fallback', () => {
  it('returns 0 when no inputs provided', () => {
    expect(resolveMonths({})).toBe(0);
  });

  it('returns a positive number for a past ISO date', () => {
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    const result = resolveMonths({ lastSurveyDate: oneYearAgo });
    // ~12 months, allow ±1 for timing
    expect(result).toBeGreaterThan(11);
    expect(result).toBeLessThan(13);
  });

  it('accepts a Date object', () => {
    const sixMonthsAgo = new Date(Date.now() - 6 * 30.4375 * 24 * 60 * 60 * 1000);
    const result = resolveMonths({ lastSurveyDate: sixMonthsAgo });
    expect(result).toBeGreaterThan(5.5);
    expect(result).toBeLessThan(6.5);
  });

  it('returns 0 for an invalid date string', () => {
    expect(resolveMonths({ lastSurveyDate: 'not-a-date' })).toBe(0);
  });
});

describe('arrow clamping at 15 months', () => {
  it('component clamps display months to 15 but state still resolves from raw value', () => {
    // resolveMonths returns the raw value; the component does Math.min(rawMonths, 15)
    const raw = resolveMonths({ monthsSinceLastSurvey: 18 });
    expect(raw).toBe(18);
    // state of 18 months is still inWindow (arrow is clamped to end of track visually)
    expect(resolveState(raw)).toBe('inWindow');
  });
});
