export type HeroId = 'bud' | 'erin' | 'gin';
export interface Stats { might:number; grit:number; agility:number; awareness:number; ingenuity:number; resolve:number }
export interface HeroDefinition { id:HeroId; name:string; title:string; color:number; stats:Stats; skill:string; skillDescription:string; voice:string }
export interface LevelDefinition { id:number; title:string; environment:string; story:string; objective:string; mechanic:string; boss:string; bossColor:number; enemyNames:string[]; floorColor:number; wallColor:number }
export interface SaveGame { version:1; slot:number; heroId:HeroId; level:number; xp:number; rank:number; statPoints:number; stats:Stats; inventory:string[]; achievements:string[]; moxieBond:number; savedAt:string }
