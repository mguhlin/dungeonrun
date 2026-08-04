import Phaser from 'phaser';
import './style.css';
import { HEROES, LEVELS } from './data';
import { clearSave, loadSave, newSave, writeSave } from './save';
import type { HeroDefinition, SaveGame } from './types';

const W=1280, H=720;
const C={ink:'#071112',paper:'#efe6ce',amber:'#e6ad52',teal:'#67b4ad',red:'#d15c4f',panel:0x10191b};

function button(scene:Phaser.Scene,x:number,y:number,w:number,h:number,label:string,onClick:()=>void,accent=0xe6ad52){
  const bg=scene.add.rectangle(x,y,w,h,0x172325,.94).setStrokeStyle(2,accent).setInteractive({useHandCursor:true});
  const text=scene.add.text(x,y,label,{fontFamily:'system-ui',fontSize:'21px',fontStyle:'bold',color:'#efe6ce'}).setOrigin(.5);
  bg.on('pointerover',()=>bg.setFillStyle(0x294044)).on('pointerout',()=>bg.setFillStyle(0x172325)).on('pointerdown',onClick);
  return scene.add.container(0,0,[bg,text]);
}

class BootScene extends Phaser.Scene {
  constructor(){super('boot')}
  preload(){
    this.load.image('keyart','assets/keyart.png');
    this.load.image('portrait-bud','assets/portrait-bud.png');
    this.load.image('portrait-erin','assets/portrait-erin.png');
    this.load.image('portrait-gin','assets/portrait-gin.png');
    this.load.image('enemy','assets/enemy-icon.png');
    this.load.image('boss','assets/boss-icon.png');
    this.load.image('moxie','assets/moxie-icon.png');
  }
  create(){
    const make=(key:string,color:number,shape:'circle'|'rect'='circle')=>{if(this.textures.exists(key))return;const g=this.make.graphics({x:0,y:0});g.fillStyle(color);shape==='circle'?g.fillCircle(24,24,20):g.fillRoundedRect(4,4,40,40,7);g.lineStyle(3,0xefe6ce,.75);shape==='circle'?g.strokeCircle(24,24,20):g.strokeRoundedRect(4,4,40,40,7);g.generateTexture(key,48,48);g.destroy();};
    make('bud',0xd47735); make('erin',0x4fa8a0); make('gin',0xb585c6); make('moxie',0xe8e4d9,'rect'); make('enemy',0xa8493f); make('boss',0xdebd59,'rect'); make('shot',0xf3d477); make('loot',0x68d6a1,'rect');
    this.scene.start('title');
  }
}

class TitleScene extends Phaser.Scene {
  constructor(){super('title')}
  create(){
    if(this.textures.exists('keyart')) this.add.image(W/2,H/2,'keyart').setDisplaySize(W,H).setAlpha(.62);
    else this.add.rectangle(W/2,H/2,W,H,0x102124);
    this.add.rectangle(W/2,H/2,W,H,0x071112,.35);
    this.add.text(68,54,'DUNGEON RUN',{fontFamily:'Impact, system-ui',fontSize:'70px',color:C.paper,stroke:'#071112',strokeThickness:9});
    this.add.text(73,132,'THE UNDERWORKS HAS AN OPEN POSITION.',{fontFamily:'monospace',fontSize:'18px',color:C.amber,letterSpacing:2});
    this.add.text(72,188,'The town is gone. The sky is gone.\nYour dog is still here. That will have to be enough.',{fontFamily:'Georgia,serif',fontSize:'27px',color:'#f2ead8',lineSpacing:10});
    const saves=[1,2,3].map(loadSave).filter(Boolean) as SaveGame[];
    button(this,160,555,210,56,'NEW RUN',()=>this.scene.start('select'));
    button(this,395,555,210,56,saves.length?'CONTINUE':'NO SAVES YET',()=>{if(saves[0])this.scene.start('game',{save:saves.sort((a,b)=>Date.parse(b.savedAt)-Date.parse(a.savedAt))[0]});},saves.length?0x67b4ad:0x576365);
    button(this,630,555,210,56,'FIELD GUIDE',()=>this.scene.start('guide'));
    button(this,865,555,210,56,'HOW TO PLAY',()=>this.showHelp());
    this.add.text(72,674,'Original story and game • Desktop + mobile landscape',{fontSize:'15px',color:'#b8c4bd'});
  }
  showHelp(){
    const shade=this.add.rectangle(W/2,H/2,W,H,0x030707,.88).setInteractive().setDepth(20);
    const panel=this.add.rectangle(W/2,H/2,780,500,0x132023).setStrokeStyle(2,0xe6ad52).setDepth(21);
    const copy=this.add.text(W/2-330,145,'HOW TO SURVIVE',{fontSize:'32px',fontStyle:'bold',color:C.amber}).setDepth(22);
    const body=this.add.text(W/2-330,205,'MOVE     WASD / arrow keys / left touch pad\nAIM      Pointer or automatic mobile targeting\nATTACK   Click, Space, or ATTACK button\nDODGE    Shift or DODGE button\nSKILL    E or SKILL button\nMOXIE    Q or DOG button\n\nClear each sector, defeat its boss, collect supplies,\nand reach the lift. Green rest terminals save progress.\nMoxie can fight, scout, and revive you once per sector.',{fontFamily:'monospace',fontSize:'20px',color:C.paper,lineSpacing:12}).setDepth(22);
    const close=button(this,W/2,575,220,50,'GOT IT',()=>[shade,panel,copy,body,close].forEach(o=>o.destroy()));close.setDepth(22);
  }
}

class GuideScene extends Phaser.Scene {
  page=0; rows:Phaser.GameObjects.GameObject[]=[];
  constructor(){super('guide')}
  create(){
    this.add.rectangle(W/2,H/2,W,H,0x091416);
    this.add.text(55,32,'THE LEDGER’S COMPLETELY REASSURING FIELD GUIDE',{fontSize:'30px',fontStyle:'bold',color:C.paper});
    this.add.text(56,72,'All twenty sectors, disclosed in advance because surprise is an administrative expense.',{fontFamily:'monospace',fontSize:'15px',color:C.amber});
    button(this,110,675,150,42,'← BACK',()=>this.scene.start('title'));
    button(this,980,675,130,42,'PREVIOUS',()=>{this.page=Math.max(0,this.page-1);this.renderPage();});
    button(this,1140,675,130,42,'NEXT',()=>{this.page=Math.min(3,this.page+1);this.renderPage();});
    this.renderPage();
  }
  renderPage(){
    this.rows.forEach(o=>o.destroy());this.rows=[];
    const slice=LEVELS.slice(this.page*5,this.page*5+5);
    slice.forEach((level,i)=>{
      const y=126+i*103;
      const panel=this.add.rectangle(W/2,y+40,1170,92,0x132124,.95).setStrokeStyle(1,level.bossColor,.8);
      const number=this.add.text(75,y,`${level.id.toString().padStart(2,'0')}`,{fontSize:'31px',fontStyle:'bold',color:C.amber});
      const title=this.add.text(135,y,`${level.title}  •  ${level.environment}`,{fontSize:'20px',fontStyle:'bold',color:C.paper});
      const detail=this.add.text(135,y+31,`CREATURES: ${level.enemyNames.join(' and ')}   |   BOSS: ${level.boss}\nPRESSURE: ${level.mechanic}   |   OBJECTIVE: ${level.objective}`,{fontFamily:'monospace',fontSize:'13px',color:'#bfcfca',lineSpacing:6,wordWrap:{width:1030}});
      this.rows.push(panel,number,title,detail);
    });
    const pageText=this.add.text(W/2,638,`SECTORS ${this.page*5+1}–${this.page*5+5} OF 20`,{fontFamily:'monospace',fontSize:'15px',color:C.amber}).setOrigin(.5);
    this.rows.push(pageText);
  }
}

class SelectScene extends Phaser.Scene {
  constructor(){super('select')}
  create(){
    this.add.rectangle(W/2,H/2,W,H,0x0b1517);
    this.add.text(W/2,44,'CHOOSE THE FOREMAN',{fontSize:'42px',fontStyle:'bold',color:C.paper}).setOrigin(.5);
    this.add.text(W/2,92,'Same hard-earned history. Different way through the dark.',{fontSize:'19px',color:'#a9bbb5'}).setOrigin(.5);
    HEROES.forEach((hero,i)=>this.card(hero,210+i*430,325));
    this.add.text(W/2,660,'Each run includes Moxie, a full-size standard poodle with excellent judgment.',{fontSize:'17px',color:C.amber}).setOrigin(.5);
  }
  card(hero:HeroDefinition,x:number,y:number){
    const panel=this.add.rectangle(x,y,360,470,0x142124).setStrokeStyle(3,hero.color).setInteractive({useHandCursor:true});
    this.add.circle(x,y-140,80,hero.color,.92).setStrokeStyle(4,0xefe6ce,.85);
    const portrait=this.add.image(x,y-140,`portrait-${hero.id}`).setDisplaySize(146,146);
    const maskShape=this.make.graphics({x:0,y:0});
    maskShape.fillStyle(0xffffff).fillCircle(x,y-140,72);
    portrait.setMask(maskShape.createGeometryMask());
    this.add.text(x,y-43,hero.name.toUpperCase(),{fontSize:'31px',fontStyle:'bold',color:C.paper}).setOrigin(.5);
    this.add.text(x,y-3,hero.title,{fontSize:'20px',color:'#e6ad52'}).setOrigin(.5);
    this.add.text(x-148,y+36,`MIGHT ${hero.stats.might}   GRIT ${hero.stats.grit}\nAGILITY ${hero.stats.agility}  AWARENESS ${hero.stats.awareness}\nINGENUITY ${hero.stats.ingenuity}  RESOLVE ${hero.stats.resolve}\n\n${hero.skill}\n${hero.skillDescription}`,{fontSize:'15px',color:'#cad4ce',wordWrap:{width:296},lineSpacing:5});
    panel.on('pointerover',()=>panel.setFillStyle(0x203337)).on('pointerout',()=>panel.setFillStyle(0x142124)).on('pointerdown',()=>this.choose(hero));
  }
  choose(hero:HeroDefinition){
    const free=[1,2,3].find(s=>!loadSave(s))??1;
    if(loadSave(free) && !confirm(`Save slot ${free} is occupied. Replace it?`)) return;
    clearSave(free); const save=newSave(hero.id,free); writeSave(save); this.scene.start('story',{save});
  }
}

class StoryScene extends Phaser.Scene {
  constructor(){super('story')}
  create(data:{save:SaveGame}){
    const hero=HEROES.find(h=>h.id===data.save.heroId)!;
    if(this.textures.exists('keyart'))this.add.image(W/2,H/2,'keyart').setDisplaySize(W,H).setAlpha(.38);
    this.add.rectangle(W/2,H/2,W,H,0x061011,.65);
    this.add.text(75,54,'SPLIT PINE, 2:13 A.M.',{fontFamily:'monospace',fontSize:'18px',color:C.amber});
    this.add.text(75,102,`${hero.name} knew three things.`,{fontFamily:'Georgia,serif',fontSize:'35px',color:C.paper});
    this.add.text(75,170,'The night shift had ended.\nThe entire sawmill was now underground.\nAnd Moxie was growling at the employee bathroom.',{fontFamily:'Georgia,serif',fontSize:'28px',color:'#e9e1cf',lineSpacing:15});
    this.add.rectangle(75,358,910,2,0xe6ad52,.7).setOrigin(0);
    this.add.text(75,390,'NEW EMPLOYEE DETECTED.',{fontFamily:'monospace',fontSize:'24px',color:'#ef826d'});
    this.add.text(75,434,'“Welcome to the Underworks,” said a voice from every dead speaker.\n“Your performance review begins now.”',{fontFamily:'Georgia,serif',fontSize:'25px',fontStyle:'italic',color:'#c9ddd7',lineSpacing:10});
    button(this,1080,634,270,58,'BEGIN LEVEL 1',()=>this.scene.start('game',{save:data.save}));
  }
}

type Enemy = Phaser.Physics.Arcade.Sprite & { hp:number; maxHp:number; speed:number; boss?:boolean; nextShot?:number };

class GameScene extends Phaser.Scene {
  save!:SaveGame; hero!:HeroDefinition; level=LEVELS[0]; player!:Phaser.Physics.Arcade.Sprite; moxie!:Phaser.Physics.Arcade.Sprite;
  enemies!:Phaser.Physics.Arcade.Group; shots!:Phaser.Physics.Arcade.Group; loot!:Phaser.Physics.Arcade.Group; walls!:Phaser.Physics.Arcade.StaticGroup;
  cursors!:Phaser.Types.Input.Keyboard.CursorKeys; keys!:Record<string,Phaser.Input.Keyboard.Key>; hp=100; maxHp=100; stamina=100; moxieHp=60; kills=0; required=0; bossSpawned=false; completed=false; lastAttack=0; lastSkill=0; nextMoxieAttack=0; revived=false;
  hpBar!:Phaser.GameObjects.Graphics; mini!:Phaser.GameObjects.Graphics; status!:Phaser.GameObjects.Text; objective!:Phaser.GameObjects.Text; touchMove={x:0,y:0}; touchAttack=false;
  wallRects:Array<{x:number;y:number;w:number;h:number}>=[];
  ledgerBox!:Phaser.GameObjects.Rectangle; ledgerText!:Phaser.GameObjects.Text; lowHealthCommented=false;
  ledgerLines=[
    'THE LEDGER: Running is encouraged. It improves the flavor of the panic.',
    'THE LEDGER: Your survival remains statistically inconvenient.',
    'THE LEDGER: Reminder: screaming is not an approved navigation tool.',
    'THE LEDGER: Moxie marked your position “obvious.”',
    'THE LEDGER: Those walls are structural. Your confidence is not.',
    'THE LEDGER: Excellent form. Terrible odds. Please continue.',
    'THE LEDGER: Breaks are unpaid. Existential crises count as breaks.',
    'THE LEDGER: Management noticed you are still alive. Policy review pending.'
  ];
  constructor(){super('game')}
  init(data:{save:SaveGame}){this.save=data.save;this.hero=HEROES.find(h=>h.id===this.save.heroId)!;this.level=LEVELS[this.save.level-1]??LEVELS[0];}
  create(){
    this.physics.world.setBounds(0,0,1800,1100); this.cameras.main.setBounds(0,0,1800,1100).setBackgroundColor(this.level.floorColor);
    this.buildDungeon();
    this.player=this.physics.add.sprite(160,550,`portrait-${this.hero.id}`).setDisplaySize(54,54).setDepth(5).setCollideWorldBounds(true);
    this.player.body!.setSize(38,38,true);
    this.moxie=this.physics.add.sprite(105,600,'moxie').setDisplaySize(48,48).setDepth(5).setCollideWorldBounds(true);
    this.moxie.body!.setSize(34,34,true);
    this.enemies=this.physics.add.group();this.shots=this.physics.add.group();this.loot=this.physics.add.group();
    this.maxHp=70+this.save.stats.grit*8;this.hp=this.maxHp;this.moxieHp=45+this.save.moxieBond*8;
    this.required=Math.min(6+this.level.id,14); for(let i=0;i<this.required;i++)this.spawnEnemy(false);
    this.physics.add.collider(this.player,this.walls);this.physics.add.collider(this.moxie,this.walls);this.physics.add.collider(this.enemies,this.walls);
    this.physics.add.overlap(this.player,this.enemies,(_,e)=>this.contact(e as Enemy));
    this.physics.add.overlap(this.shots,this.enemies,(s,e)=>this.hitEnemy(s as Phaser.Physics.Arcade.Sprite,e as Enemy));
    this.physics.add.overlap(this.player,this.loot,(_,l)=>this.collect(l as Phaser.Physics.Arcade.Sprite));
    this.physics.add.overlap(this.moxie,this.enemies,(_,e)=>this.moxieContact(e as Enemy));
    this.cameras.main.startFollow(this.player,true,.09,.09); this.cameras.main.setZoom(1);
    this.cursors=this.input.keyboard!.createCursorKeys();this.keys=this.input.keyboard!.addKeys('W,A,S,D,E,Q,SPACE,SHIFT') as Record<string,Phaser.Input.Keyboard.Key>;
    this.createHud(); this.createTouchControls(); this.showLevelCard();
    this.input.on('pointerdown',(p:Phaser.Input.Pointer,over:Phaser.GameObjects.GameObject[])=>{if(over.length===0&&p.x>W*.42)this.attack(p.worldX,p.worldY)});
    this.time.addEvent({delay:14000,loop:true,callback:()=>this.ledgerSay(Phaser.Utils.Array.GetRandom(this.ledgerLines))});
  }
  buildDungeon(){
    this.add.rectangle(900,550,1800,1100,this.level.floorColor);
    const grid=this.add.grid(900,550,1800,1100,64,64,0x000000,0,0xffffff,.035);grid.setDepth(0);
    this.walls=this.physics.add.staticGroup();this.wallRects=[];
    const add=(x:number,y:number,w:number,h:number)=>{this.wallRects.push({x,y,w,h});const r=this.add.rectangle(x,y,w,h,this.level.wallColor).setStrokeStyle(3,0x0a1112,.65);this.physics.add.existing(r,true);this.walls.add(r);};
    add(900,18,1800,36);add(900,1082,1800,36);add(18,550,36,1100);add(1782,550,36,1100);
    // A connected room-and-corridor plan. Each divider has staggered doorways,
    // producing recognizable chambers without sealing off the route to the boss.
    [450,900,1350].forEach((x,column)=>{
      const gaps=column%2===0?[[285,405],[690,815]]:[[185,305],[585,710],[900,1015]];
      let from=36;
      for(const [a,b] of gaps){if(a>from)add(x,(from+a)/2,34,a-from);from=b;}
      if(from<1064)add(x,(from+1064)/2,34,1064-from);
    });
    [340,720].forEach((y,row)=>{
      const gaps=row===0?[[190,320],[690,835],[1160,1300],[1580,1710]]:[[90,220],[520,670],[1030,1180],[1460,1610]];
      let from=36;
      for(const [a,b] of gaps){if(a>from)add((from+a)/2,y,a-from,34);from=b;}
      if(from<1764)add((from+1764)/2,y,1764-from,34);
    });
    const seed=this.level.id*7919;
    // Short cover walls make combat spaces tactical while preserving wide lanes.
    for(let i=0;i<18;i++){const x=210+((seed+i*263)%1370),y=115+((seed+i*397)%850),horizontal=i%3!==0;add(x,y,horizontal?105:28,horizontal?28:92);}
    for(let i=0;i<10;i++){const x=150+((seed+i*181)%1450),y=100+((seed+i*317)%850);this.add.circle(x,y,3,0xe6ad52,.35);}
    ['RESTROOM','KEEP OUT','LIFT →','BREAK ROOM'].forEach((label,i)=>this.add.text(245+i*405,310+(i%2)*410,label,{fontFamily:'monospace',fontSize:'13px',color:'#17130b',backgroundColor:'#d7b25c',padding:{x:8,y:4}}).setRotation(i%2?.02:-.025));
    this.add.text(70,80,`SECTOR ${this.level.id.toString().padStart(2,'0')} • ${this.level.environment.toUpperCase()}`,{fontFamily:'monospace',fontSize:'17px',color:'#e7c77e',backgroundColor:'#172224aa',padding:{x:10,y:6}});
  }
  randomOpen(){
    // Spawn near the center of one of the twelve chambers, away from dividers.
    const cols=[225,675,1125,1575],rows=[170,530,900];
    return {x:cols[Math.floor(Math.random()*cols.length)]+Phaser.Math.Between(-105,105),y:rows[Math.floor(Math.random()*rows.length)]+Phaser.Math.Between(-85,85)};
  }
  spawnEnemy(boss:boolean){const p=this.randomOpen();const e=this.enemies.create(p.x,p.y,boss?'boss':'enemy') as Enemy;e.setDisplaySize(boss?76:46,boss?76:46).setDepth(4);e.body!.setSize(boss?58:34,boss?58:34,true);e.boss=boss;e.maxHp=boss?160+this.level.id*38:24+this.level.id*5;e.hp=e.maxHp;e.speed=boss?55+this.level.id:62+this.level.id*2;}
  createHud(){
    this.add.rectangle(0,0,W,82,0x071112,.88).setOrigin(0).setScrollFactor(0).setDepth(20);
    this.add.text(24,14,`${this.hero.name.toUpperCase()}  •  RANK ${this.save.rank}`,{fontSize:'18px',fontStyle:'bold',color:C.paper}).setScrollFactor(0).setDepth(22);
    this.add.text(24,43,`${this.hero.skill}  [E]`,{fontSize:'13px',color:C.amber}).setScrollFactor(0).setDepth(22);
    this.hpBar=this.add.graphics().setScrollFactor(0).setDepth(22);
    this.objective=this.add.text(440,15,`LEVEL ${this.level.id}: ${this.level.title}\n${this.level.objective}`,{fontSize:'16px',color:'#d5ded9',align:'center'}).setOrigin(.5,0).setScrollFactor(0).setDepth(22);
    this.status=this.add.text(790,16,'',{fontFamily:'monospace',fontSize:'14px',color:'#d5ded9'}).setScrollFactor(0).setDepth(22);
    this.mini=this.add.graphics().setScrollFactor(0).setDepth(22);
    this.ledgerBox=this.add.rectangle(W/2,H-34,720,42,0x071112,.9).setStrokeStyle(1,0xe6ad52,.7).setScrollFactor(0).setDepth(24).setAlpha(0);
    this.ledgerText=this.add.text(W/2,H-34,'',{fontFamily:'monospace',fontSize:'14px',color:'#efd184',align:'center'}).setOrigin(.5).setScrollFactor(0).setDepth(25).setAlpha(0);
  }
  createTouchControls(){
    const touch=this.sys.game.device.input.touch;
    if(touch){
      const base=this.add.circle(110,H-108,72,0x0c1719,.55).setStrokeStyle(2,0x7e9691,.6).setScrollFactor(0).setDepth(30).setInteractive();
      const nub=this.add.circle(110,H-108,29,0x9bb4ae,.45).setScrollFactor(0).setDepth(31);
      const reset=()=>{this.touchMove={x:0,y:0};nub.setPosition(110,H-108)};
      base.on('pointermove',(p:Phaser.Input.Pointer)=>{if(!p.isDown)return;const v=new Phaser.Math.Vector2(p.x-110,p.y-(H-108));if(v.length()>58)v.setLength(58);nub.setPosition(110+v.x,H-108+v.y);this.touchMove={x:v.x/58,y:v.y/58};}).on('pointerup',reset).on('pointerout',reset);
    }
    const tbtn=(x:number,y:number,r:number,label:string,fn:()=>void)=>{const b=this.add.circle(x,y,r,0x162528,.65).setStrokeStyle(2,0xe6ad52,.8).setScrollFactor(0).setDepth(30).setInteractive();this.add.text(x,y,label,{fontSize:'12px',fontStyle:'bold',color:C.paper,align:'center'}).setOrigin(.5).setScrollFactor(0).setDepth(31);b.on('pointerdown',fn);};
    tbtn(W-92,H-112,50,'ATTACK',()=>this.mobileAttack());tbtn(W-205,H-78,39,'DODGE',()=>this.dodge());tbtn(W-194,H-177,39,'SKILL',()=>this.skill());tbtn(W-292,H-122,34,'DOG',()=>this.commandMoxie());
    if(!touch)this.add.text(W-430,91,'CLICK/SPACE: ATTACK  •  SHIFT: DODGE  •  E: SKILL  •  Q: MOXIE',{fontFamily:'monospace',fontSize:'11px',color:'#c7d2ce'}).setScrollFactor(0).setDepth(31);
  }
  showLevelCard(){
    this.physics.pause();const shade=this.add.rectangle(W/2,H/2,W,H,0x061011,.9).setScrollFactor(0).setDepth(50);
    const t=this.add.text(W/2,122,`LEVEL ${this.level.id}\n${this.level.title.toUpperCase()}`,{fontSize:'43px',fontStyle:'bold',color:C.paper,align:'center'}).setOrigin(.5).setScrollFactor(0).setDepth(51);
    const s=this.add.text(W/2,244,this.level.story,{fontFamily:'Georgia,serif',fontSize:'24px',color:'#d9d7c9',align:'center',wordWrap:{width:820},lineSpacing:10}).setOrigin(.5,0).setScrollFactor(0).setDepth(51);
    const m=this.add.text(W/2,410,`NEW PRESSURE: ${this.level.mechanic}\nOBJECTIVE: ${this.level.objective}`,{fontFamily:'monospace',fontSize:'18px',color:C.amber,align:'center'}).setOrigin(.5).setScrollFactor(0).setDepth(51);
    // Keep the modal action as direct scene objects. Interactive children inside
    // containers can lose their hit area after camera scrolling on some touch
    // browsers, which made the first sector appear locked.
    const goBg=this.add.rectangle(W/2,584,300,60,0x172325,.98)
      .setStrokeStyle(3,0xe6ad52).setScrollFactor(0).setDepth(53)
      .setInteractive({useHandCursor:true});
    const goText=this.add.text(W/2,584,'ENTER SECTOR',{fontSize:'22px',fontStyle:'bold',color:C.paper})
      .setOrigin(.5).setScrollFactor(0).setDepth(54);
    let entering=false;
    const enter=()=>{
      if(entering)return;
      entering=true;
      [shade,t,s,m,goBg,goText].forEach(o=>o.destroy());
      this.physics.resume();
      this.player.setVelocity(0);
      this.ledgerSay(`THE LEDGER: Welcome to Level ${this.level.id}. Your safety orientation has been waived.`);
    };
    goBg.on('pointerover',()=>goBg.setFillStyle(0x294044))
      .on('pointerout',()=>goBg.setFillStyle(0x172325))
      .on('pointerdown',enter);
    this.input.keyboard?.once('keydown-ENTER',enter);
  }
  update(time:number){
    if(this.completed)return;let x=0,y=0;if(this.cursors.left.isDown||this.keys.A.isDown)x--;if(this.cursors.right.isDown||this.keys.D.isDown)x++;if(this.cursors.up.isDown||this.keys.W.isDown)y--;if(this.cursors.down.isDown||this.keys.S.isDown)y++;x+=this.touchMove.x;y+=this.touchMove.y;const v=new Phaser.Math.Vector2(x,y);if(v.length()>0)v.normalize().scale(160+this.save.stats.agility*4);this.player.setVelocity(v.x,v.y);
    if(Phaser.Input.Keyboard.JustDown(this.keys.SPACE)){const p=this.input.activePointer;this.attack(p.worldX,p.worldY)}if(Phaser.Input.Keyboard.JustDown(this.keys.E))this.skill();if(Phaser.Input.Keyboard.JustDown(this.keys.Q))this.commandMoxie();if(Phaser.Input.Keyboard.JustDown(this.keys.SHIFT))this.dodge();
    this.updateEnemies(time);this.updateMoxie(time);this.drawHud();
  }
  updateEnemies(time:number){this.enemies.children.each(o=>{const e=o as Enemy;if(!e.active)return true;const d=Phaser.Math.Distance.Between(e.x,e.y,this.player.x,this.player.y);if(d<650)this.physics.moveToObject(e,this.player,e.speed);else e.setVelocity(0);if(e.boss&&d<420&&time>(e.nextShot??0)){e.nextShot=time+1600;this.hostileShot(e);}return true;});}
  hostileShot(e:Enemy){const angle=Phaser.Math.Angle.Between(e.x,e.y,this.player.x,this.player.y);for(let n=-1;n<=1;n++){const orb=this.physics.add.image(e.x,e.y,'shot').setTint(0xef685f).setScale(.45).setDepth(4);this.physics.velocityFromRotation(angle+n*.28,190,orb.body!.velocity);this.time.delayedCall(2400,()=>orb.destroy());this.physics.add.overlap(this.player,orb,()=>{orb.destroy();this.damage(12+this.level.id)});}}
  updateMoxie(time:number){if(this.moxieHp<=0){this.moxie.setAlpha(.25).setVelocity(0);return;}this.moxie.setAlpha(1);let target:Enemy|null=null,dist=260;this.enemies.children.each(o=>{const e=o as Enemy;const d=Phaser.Math.Distance.Between(this.moxie.x,this.moxie.y,e.x,e.y);if(d<dist){dist=d;target=e}return true;});if(target){this.physics.moveToObject(this.moxie,target,150);if(dist<58&&time>this.nextMoxieAttack){this.nextMoxieAttack=time+850;(target as Enemy).hp-=7+this.save.moxieBond*2;this.floatText((target as Enemy).x,(target as Enemy).y-30,'WOOF!',C.teal);if((target as Enemy).hp<=0)this.killEnemy(target as Enemy);}}else{const d=Phaser.Math.Distance.Between(this.moxie.x,this.moxie.y,this.player.x,this.player.y);if(d>95)this.physics.moveToObject(this.moxie,this.player,175);else this.moxie.setVelocity(0);}}
  attack(x:number,y:number){if(this.time.now<this.lastAttack+320)return;this.lastAttack=this.time.now;const a=Phaser.Math.Angle.Between(this.player.x,this.player.y,x,y);const s=this.shots.create(this.player.x,this.player.y,'shot') as Phaser.Physics.Arcade.Sprite;s.setScale(.35).setTint(this.hero.color).setDepth(6);this.physics.velocityFromRotation(a,430,s.body!.velocity);this.time.delayedCall(850,()=>s.destroy());}
  mobileAttack(){let target:Enemy|null=null,dist=9999;this.enemies.children.each(o=>{const e=o as Enemy;const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y);if(d<dist){dist=d;target=e}return true;});if(target)this.attack((target as Enemy).x,(target as Enemy).y);}
  hitEnemy(s:Phaser.Physics.Arcade.Sprite,e:Enemy){s.destroy();e.hp-=10+this.save.stats.might*.8;this.floatText(e.x,e.y-28,`-${Math.round(10+this.save.stats.might*.8)}`,'#f6d17c');e.setTintFill(0xffffff);this.time.delayedCall(70,()=>e.active&&e.clearTint());if(e.hp<=0)this.killEnemy(e);}
  killEnemy(e:Enemy){const boss=!!e.boss;const p={x:e.x,y:e.y};e.destroy();this.kills++;this.save.xp+=boss?150:12+this.level.id;if(Math.random()<.36||boss)this.loot.create(p.x,p.y,'loot').setScale(boss?1:.65);if(this.kills%4===0&&!boss)this.ledgerSay('THE LEDGER: Four hostiles removed. Custodial deducted cleanup from your pay.');if(!this.bossSpawned&&this.kills>=this.required){this.bossSpawned=true;this.spawnEnemy(true);this.announce(`BOSS INBOUND: ${this.level.boss.toUpperCase()}`);this.ledgerSay(`THE LEDGER: ${this.level.boss} would like a brief word about your performance.`);}if(boss)this.finishLevel();this.rankUp();}
  rankUp(){const needed=this.save.rank*100;if(this.save.xp>=needed){this.save.xp-=needed;this.save.rank++;this.save.statPoints++;this.maxHp+=6;this.hp=this.maxHp;this.announce(`RANK ${this.save.rank}! ATTRIBUTE POINT BANKED.`);}}
  contact(e:Enemy){if(!e.active||this.player.getData('hurt'))return;this.player.setData('hurt',true);this.damage((e.boss?18:7)+this.level.id*.8);const a=Phaser.Math.Angle.Between(e.x,e.y,this.player.x,this.player.y);this.player.setVelocity(Math.cos(a)*320,Math.sin(a)*320);this.time.delayedCall(650,()=>this.player.setData('hurt',false));}
  moxieContact(e:Enemy){if(!e.active||this.moxie.getData('hurt')||this.moxieHp<=0)return;this.moxie.setData('hurt',true);this.moxieHp-=e.boss?15:5;this.time.delayedCall(700,()=>this.moxie.setData('hurt',false));}
  damage(n:number){this.hp-=n;this.cameras.main.shake(100,.006);if(this.hp/this.maxHp<.28&&!this.lowHealthCommented){this.lowHealthCommented=true;this.ledgerSay('THE LEDGER: Health critical. Have you considered simply being harder to kill?');}if(this.hp<=0){if(!this.revived&&this.moxieHp>0){this.revived=true;this.hp=this.maxHp*.35;this.moxieHp=Math.max(1,this.moxieHp-20);this.announce('MOXIE REVIVED YOU. GOOD DOG. QUESTIONABLE BENEFITS PACKAGE.');this.ledgerSay('THE LEDGER: Your dog filed a complaint regarding team competency.');}else this.gameOver();}}
  dodge(){if(this.stamina<25)return;this.stamina-=25;const b=this.player.body!.velocity.clone();if(b.length()<10)b.set(1,0);b.normalize().scale(440);this.player.setVelocity(b.x,b.y);this.player.setData('hurt',true);if(Math.random()<.14)this.ledgerSay('THE LEDGER: A graceful dodge. Your paperwork remains stationary.');this.time.delayedCall(280,()=>this.player.setData('hurt',false));}
  skill(){if(this.time.now<this.lastSkill+5000)return;this.lastSkill=this.time.now;if(this.hero.id==='bud'){this.enemies.children.each(o=>{const e=o as Enemy;if(Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y)<150){e.hp-=35;e.setVelocity((e.x-this.player.x)*4,(e.y-this.player.y)*4);if(e.hp<=0)this.killEnemy(e);}return true;});this.cameras.main.shake(180,.01);}else if(this.hero.id==='erin'){const p=this.input.activePointer;const a=Phaser.Math.Angle.Between(this.player.x,this.player.y,p.worldX,p.worldY);this.player.setPosition(this.player.x+Math.cos(a)*180,this.player.y+Math.sin(a)*180);this.enemies.children.each(o=>{(o as Enemy).setTint(0x7be0d4);return true;});this.time.delayedCall(1800,()=>this.enemies.children.each(o=>{(o as Enemy).clearTint();return true;}));}else{const x=this.player.x,y=this.player.y;const marker=this.add.circle(x,y,20,0xc58ed6,.6);this.tweens.add({targets:marker,scale:3,alpha:0,duration:1100,onComplete:()=>{this.enemies.children.each(o=>{const e=o as Enemy;if(Phaser.Math.Distance.Between(x,y,e.x,e.y)<150){e.hp-=42;if(e.hp<=0)this.killEnemy(e);}return true;});marker.destroy();this.cameras.main.shake(220,.012);}});}}
  commandMoxie(){this.save.moxieBond=Math.min(10,this.save.moxieBond+.02);this.mobileAttack();this.announce('MOXIE: TARGET MARKED. TAIL STATUS: OPERATIONAL.');if(Math.random()<.3)this.ledgerSay('THE LEDGER: Moxie understood the assignment before you finished saying it.');}
  collect(l:Phaser.Physics.Arcade.Sprite){l.destroy();this.hp=Math.min(this.maxHp,this.hp+18);this.stamina=100;this.floatText(this.player.x,this.player.y-40,'SUPPLIES + HEALTH','#69d4a0');if(Math.random()<.35)this.ledgerSay('THE LEDGER: Loot acquired. Side effects include optimism and inventory management.');}
  finishLevel(){this.completed=true;this.player.setVelocity(0);this.save.achievements.push(`Cleared ${this.level.title}`);this.save.moxieBond=Math.min(10,this.save.moxieBond+.5);writeSave(this.save);this.time.delayedCall(600,()=>this.showRest());}
  showRest(){
    const shade=this.add.rectangle(W/2,H/2,W,H,0x061011,.94).setScrollFactor(0).setDepth(70);const title=this.add.text(W/2,80,'REST AREA • CHECKPOINT SAVED',{fontSize:'34px',fontStyle:'bold',color:C.amber}).setOrigin(.5).setScrollFactor(0).setDepth(71);
    const copy=this.add.text(W/2,145,`SECTOR CLEARED: ${this.level.title}\nBoss defeated: ${this.level.boss}\nRank ${this.save.rank} • XP ${this.save.xp}/${this.save.rank*100} • Moxie Bond ${this.save.moxieBond.toFixed(1)}\n\nThe bathroom is improbably clean. The mirror says:\n“Employees must wash hands before handling existential dread.”`,{fontFamily:'monospace',fontSize:'19px',color:C.paper,align:'center',lineSpacing:10}).setOrigin(.5,0).setScrollFactor(0).setDepth(71);
    const heal=button(this,W/2-210,490,310,52,'USE RESTROOM + HEAL',()=>{this.hp=this.maxHp;this.moxieHp=60+this.save.moxieBond*8;this.announce('HYGIENE BUFF ACQUIRED.');});heal.setScrollFactor(0).setDepth(72);
    const nextLabel=this.level.id<20?'DESCEND TO NEXT LEVEL':'CHOOSE AN ENDING';const next=button(this,W/2+210,490,310,52,nextLabel,()=>{if(this.level.id<20){this.save.level++;writeSave(this.save);this.scene.restart({save:this.save});}else this.showEnding([shade,title,copy,heal,next]);});next.setScrollFactor(0).setDepth(72);
    const menu=button(this,W/2,580,250,48,'SAVE AND QUIT',()=>this.scene.start('title'));menu.setScrollFactor(0).setDepth(72);
  }
  showEnding(old:Phaser.GameObjects.GameObject[]){old.forEach(o=>o.destroy());this.add.rectangle(W/2,H/2,W,H,0x071112,.97).setScrollFactor(0).setDepth(80);this.add.text(W/2,80,'THE UNDERWORKS OFFERS THREE EXITS',{fontSize:'35px',fontStyle:'bold',color:C.paper}).setOrigin(.5).setScrollFactor(0).setDepth(81);['ESCAPE — Take Moxie home and seal the door.','CONTROL — Become the foreman the machine fears.','DESTROY — Free every stolen memory, whatever it costs.'].forEach((s,i)=>{const b=button(this,W/2,230+i*115,650,65,s,()=>this.ending(s.split(' — ')[0]));b.setScrollFactor(0).setDepth(82);});}
  ending(choice:string){this.children.removeAll();this.add.rectangle(W/2,H/2,W,H,0x071112);this.add.text(W/2,170,choice,{fontSize:'72px',fontStyle:'bold',color:C.amber}).setOrigin(.5);this.add.text(W/2,285,choice==='ESCAPE'?'Morning returns to Split Pine. Moxie finds the first patch of sunlight.':choice==='CONTROL'?'The Ledger stutters as a new foreman signs in. The first new rule: dogs outrank machines.':'The dungeon opens like a clenched fist. Millions of stolen stories rush toward the sky.',{fontFamily:'Georgia,serif',fontSize:'28px',color:C.paper,align:'center',wordWrap:{width:780}}).setOrigin(.5);button(this,W/2,560,300,55,'RETURN TO TITLE',()=>this.scene.start('title'));}
  gameOver(){this.completed=true;this.physics.pause();const shade=this.add.rectangle(W/2,H/2,W,H,0x120708,.9).setScrollFactor(0).setDepth(90);const t=this.add.text(W/2,210,'PERFORMANCE REVIEW: INCONCLUSIVE',{fontSize:'34px',fontStyle:'bold',color:'#ef826d'}).setOrigin(.5).setScrollFactor(0).setDepth(91);const b=button(this,W/2,355,300,58,'RETRY CHECKPOINT',()=>this.scene.restart({save:this.save}));b.setScrollFactor(0).setDepth(92);const q=button(this,W/2,440,300,50,'SAVE AND QUIT',()=>this.scene.start('title'));q.setScrollFactor(0).setDepth(92);}
  announce(msg:string){this.status.setText(msg);this.time.delayedCall(2600,()=>this.status.setText(''));}
  ledgerSay(msg:string){if(!this.ledgerText?.active)return;this.tweens.killTweensOf([this.ledgerBox,this.ledgerText]);this.ledgerText.setText(msg).setAlpha(1);this.ledgerBox.setAlpha(1);this.time.delayedCall(4300,()=>{if(!this.ledgerText?.active)return;this.tweens.add({targets:[this.ledgerBox,this.ledgerText],alpha:0,duration:500});});}
  floatText(x:number,y:number,msg:string,color:string){const t=this.add.text(x,y,msg,{fontSize:'14px',fontStyle:'bold',color}).setOrigin(.5).setDepth(10);this.tweens.add({targets:t,y:y-35,alpha:0,duration:700,onComplete:()=>t.destroy()});}
  drawHud(){this.stamina=Math.min(100,this.stamina+.12);this.hpBar.clear();this.hpBar.fillStyle(0x263334).fillRect(180,17,210,14);this.hpBar.fillStyle(0xc85249).fillRect(180,17,210*Math.max(0,this.hp/this.maxHp),14);this.hpBar.fillStyle(0x3e7973).fillRect(180,41,210*this.stamina/100,8);this.hpBar.fillStyle(0xe8e4d9).fillRect(180,57,210*Math.max(0,this.moxieHp/(60+this.save.moxieBond*8)),7);this.status.setText(this.status.text||`HOSTILES ${Math.max(0,this.required-this.kills)} • ${this.bossSpawned?'BOSS ACTIVE':'BOSS LOCKED'}`);this.mini.clear();this.mini.fillStyle(0x071112,.8).fillRect(W-172,8,160,66);this.mini.lineStyle(1,0x8da09a).strokeRect(W-172,8,160,66);this.mini.fillStyle(0x64716e,.72);this.wallRects.forEach(r=>this.mini.fillRect(W-172+(r.x-r.w/2)/1800*160,8+(r.y-r.h/2)/1100*66,Math.max(1,r.w/1800*160),Math.max(1,r.h/1100*66)));this.mini.fillStyle(0x67b4ad).fillCircle(W-172+this.player.x/1800*160,8+this.player.y/1100*66,3);this.mini.fillStyle(0xe8e4d9).fillCircle(W-172+this.moxie.x/1800*160,8+this.moxie.y/1100*66,2);this.mini.fillStyle(0xd15c4f);this.enemies.children.each(o=>{const e=o as Enemy;this.mini.fillCircle(W-172+e.x/1800*160,8+e.y/1100*66,e.boss?3:1);return true;});}
}

new Phaser.Game({type:Phaser.AUTO,parent:'game',width:W,height:H,backgroundColor:'#081011',pixelArt:false,physics:{default:'arcade',arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[BootScene,TitleScene,GuideScene,SelectScene,StoryScene,GameScene]});
