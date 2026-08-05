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

  it('keeps a traversable route from the level 1 start to Moxie', () => {
    const plan=SPECIAL_LEVELS[1];
    const step=10, clearance=20;
    const key=(x:number,y:number)=>`${x},${y}`;
    const blocked=(x:number,y:number)=>plan.walls.some(w =>
      x >= w.x-w.w/2-clearance && x <= w.x+w.w/2+clearance &&
      y >= w.y-w.h/2-clearance && y <= w.y+w.h/2+clearance
    );
    const snap=(n:number)=>Math.round(n/step)*step;
    const start={x:snap(plan.playerStart.x),y:snap(plan.playerStart.y)};
    const goal={x:snap(plan.moxieStart.x),y:snap(plan.moxieStart.y)};
    const queue=[start], visited=new Set([key(start.x,start.y)]);
    for(let i=0;i<queue.length;i++){
      const p=queue[i];
      for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){
        const x=p.x+dx,y=p.y+dy,k=key(x,y);
        if(x<clearance||x>1800-clearance||y<clearance||y>1100-clearance||blocked(x,y)||visited.has(k))continue;
        visited.add(k);queue.push({x,y});
      }
    }
    expect(visited.has(key(goal.x,goal.y))).toBe(true);
  });
});
