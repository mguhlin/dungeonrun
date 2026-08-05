export type SpecialLevelId = 1 | 2 | 3;

export interface Point { x:number; y:number }
export interface Rect extends Point { w:number; h:number }

export interface SpecialLevelPlan {
  id:SpecialLevelId;
  objectiveNoun:string;
  objectiveCount:number;
  objectiveVerb:string;
  playerStart:Point;
  moxieStart:Point;
  enemySpawns:Point[];
  walls:Rect[];
  hazards:Rect[];
  targets:Point[];
}

const border:Rect[] = [
  {x:900,y:18,w:1800,h:36},{x:900,y:1082,w:1800,h:36},
  {x:18,y:550,w:36,h:1100},{x:1782,y:550,w:36,h:1100}
];

export const SPECIAL_LEVELS:Record<SpecialLevelId,SpecialLevelPlan> = {
  1:{
    id:1,objectiveNoun:'LUMBER PILES',objectiveCount:3,objectiveVerb:'BREAK',
    playerStart:{x:135,y:930},moxieStart:{x:1535,y:165},
    enemySpawns:[{x:330,y:870},{x:610,y:900},{x:810,y:630},{x:1030,y:810},{x:1230,y:530},{x:1490,y:620},{x:1510,y:250}],
    walls:[...border,
      {x:310,y:780,w:500,h:34},{x:580,y:650,w:34,h:290},{x:810,y:510,w:490,h:34},
      {x:1070,y:690,w:34,h:395},{x:1300,y:380,w:500,h:34},{x:1450,y:760,w:520,h:34},
      {x:1510,y:95,w:390,h:30},{x:1690,y:220,w:30,h:280},{x:1510,y:345,w:390,h:30},
      // Split the holding-room west wall to leave a visible, player-width doorway to Moxie.
      {x:1330,y:125,w:30,h:30},{x:1330,y:270,w:30,h:120},
      {x:410,y:250,w:250,h:30},{x:760,y:185,w:30,h:250}],
    hazards:[{x:455,y:870,w:95,h:95},{x:880,y:625,w:95,h:95},{x:1225,y:465,w:95,h:95},{x:1430,y:880,w:95,h:95}],
    targets:[{x:390,y:650},{x:890,y:410},{x:1260,y:880}]
  },
  2:{
    id:2,objectiveNoun:'PUMPS',objectiveCount:3,objectiveVerb:'RESTORE',
    playerStart:{x:150,y:550},moxieStart:{x:105,y:615},
    enemySpawns:[{x:390,y:220},{x:510,y:850},{x:780,y:520},{x:1030,y:210},{x:1220,y:850},{x:1490,y:510},{x:1620,y:200},{x:1610,y:890}],
    walls:[...border,
      {x:430,y:355,w:34,h:640},{x:740,y:755,w:34,h:615},{x:1050,y:345,w:34,h:620},
      {x:1360,y:755,w:34,h:615},{x:1580,y:340,w:34,h:610},
      {x:275,y:720,w:275,h:30},{x:585,y:270,w:275,h:30},{x:895,y:810,w:275,h:30},
      {x:1205,y:270,w:275,h:30},{x:1505,y:805,w:275,h:30}],
    hazards:[{x:585,y:515,w:275,h:190},{x:895,y:230,w:275,h:190},{x:1205,y:590,w:275,h:220},{x:1505,y:500,w:275,h:190}],
    targets:[{x:260,y:205},{x:880,y:930},{x:1500,y:190}]
  },
  3:{
    id:3,objectiveNoun:'SAFETY SEALS',objectiveCount:3,objectiveVerb:'COLLECT',
    playerStart:{x:155,y:920},moxieStart:{x:105,y:970},
    enemySpawns:[{x:320,y:780},{x:530,y:840},{x:720,y:560},{x:910,y:220},{x:1120,y:550},{x:1370,y:830},{x:1580,y:560},{x:1500,y:190}],
    walls:[...border,
      {x:450,y:820,w:34,h:485},{x:450,y:195,w:34,h:315},{x:900,y:280,w:34,h:490},{x:900,y:930,w:34,h:270},
      {x:1350,y:820,w:34,h:485},{x:1350,y:195,w:34,h:315},
      {x:225,y:610,w:415,h:34},{x:675,y:420,w:415,h:34},{x:1125,y:680,w:415,h:34},{x:1575,y:420,w:415,h:34}],
    hazards:[{x:610,y:720,w:130,h:90},{x:800,y:160,w:130,h:90},{x:1060,y:830,w:130,h:90},{x:1510,y:560,w:130,h:90}],
    targets:[{x:250,y:220},{x:1120,y:500},{x:1580,y:900}]
  }
};

export function getSpecialLevel(id:number):SpecialLevelPlan|undefined {
  return id >= 1 && id <= 3 ? SPECIAL_LEVELS[id as SpecialLevelId] : undefined;
}
