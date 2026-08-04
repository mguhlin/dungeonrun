import { describe, expect, it } from 'vitest';
import { HEROES, LEVELS } from './data';

describe('campaign data', () => {
  it('defines three distinct selectable heroes', () => {
    expect(HEROES.map(h => h.id)).toEqual(['bud', 'erin', 'gin']);
    expect(new Set(HEROES.map(h => h.skill)).size).toBe(3);
  });

  it('defines a complete escalating twenty-level campaign', () => {
    expect(LEVELS).toHaveLength(20);
    expect(LEVELS.map(l => l.id)).toEqual(Array.from({length:20},(_,i)=>i+1));
    expect(LEVELS.every(l => l.story && l.objective && l.boss && l.enemyNames.length >= 2)).toBe(true);
  });

  it('keeps every boss and title unique', () => {
    expect(new Set(LEVELS.map(l => l.title)).size).toBe(20);
    expect(new Set(LEVELS.map(l => l.boss)).size).toBe(20);
  });
});
