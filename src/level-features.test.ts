import { describe, expect, it } from 'vitest';
import { getSpecialLevel, SPECIAL_LEVELS } from './level-features';

describe('level 1–3 feature plans', () => {
  it('provides authored plans only for the vertical slice', () => {
    expect(Object.keys(SPECIAL_LEVELS)).toEqual(['1','2','3']);
    expect(getSpecialLevel(1)?.objectiveNoun).toBe('LUMBER PILES');
    expect(getSpecialLevel(2)?.objectiveNoun).toBe('PUMPS');
    expect(getSpecialLevel(3)?.objectiveNoun).toBe('SAFETY SEALS');
    expect(getSpecialLevel(4)).toBeUndefined();
  });

  it.each([1,2,3] as const)('keeps level %s content inside the world', id => {
    const plan=SPECIAL_LEVELS[id];
    const points=[plan.playerStart,plan.moxieStart,...plan.enemySpawns,...plan.targets];
    expect(points.every(p=>p.x>36&&p.x<1764&&p.y>36&&p.y<1064)).toBe(true);
    expect(plan.targets).toHaveLength(plan.objectiveCount);
    expect(plan.enemySpawns.length).toBeGreaterThanOrEqual(7);
    expect(plan.hazards.length).toBeGreaterThanOrEqual(4);
  });

  it('uses distinct authored geometry for every level', () => {
    const signatures=Object.values(SPECIAL_LEVELS).map(plan=>JSON.stringify(plan.walls));
    expect(new Set(signatures).size).toBe(3);
  });
});
