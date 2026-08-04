import { HEROES } from './data';
import type { HeroId, SaveGame } from './types';

const key = (slot:number) => `dungeon-run.save.v1.${slot}`;
export function newSave(heroId:HeroId, slot=1):SaveGame {
  const hero = HEROES.find(h=>h.id===heroId)!;
  return {version:1,slot,heroId,level:1,xp:0,rank:1,statPoints:0,stats:{...hero.stats},inventory:['Foreman’s Hook','Field Dressing'],achievements:[],moxieBond:1,savedAt:new Date().toISOString()};
}
export function loadSave(slot:number):SaveGame|null {
  try { const raw=localStorage.getItem(key(slot)); if(!raw)return null; const parsed=JSON.parse(raw) as SaveGame; return parsed.version===1?parsed:null; } catch { return null; }
}
export function writeSave(save:SaveGame):void { save.savedAt=new Date().toISOString(); localStorage.setItem(key(save.slot),JSON.stringify(save)); }
export function clearSave(slot:number):void { localStorage.removeItem(key(slot)); }
