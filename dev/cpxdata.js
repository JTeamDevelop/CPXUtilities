/* Version 1
  Added to main for Dragon & Unead generation
*/

/*Powers remaining
'Animal Control-terrain',
'Apport',
'Armor Up',
'Astral Travel',
'Bestow-power',
'Bio-Mutation',
'Body Swap',
'Clairvoyance',
'Control-element',
'Copy Appearance',
'Detect Supernatural',
'Dimensional Barrier',
'Dream Control',
'Duplication',
'Earth Control',
'Electrical Control',
'Electromagnetic Pulse',
'Emotion Projection',
'Force Field',
'Form Wall',
'Force Projection',
'Faster-Than-Light',
'Glamour',
'Good Luck',
'Growth',
'Holographic Projection',
'Hypnotic Voice',
'Ice Storm',
'Illusion',
'Jamming',
'Mind Scan',
'Mind Shield',
'Necromancy',
'Neutralize Power',
'Plant Animation',
'Magnetic Control',
'Power Theft',
'Portal',
'Power Weapon',
'Precognition',
'Psychic Weapon',
'Reanimation',
'Poison Gas',
'Retrocognition',
'Shrinking',
'Size',
'Sound Control',
'Stretching',
'Summon Outsider',
'Super Aquatic',
'Super Shooter',
'Super Jumping',
'Super Speed',
'Time Travel',
'Transmutation',
'Water Control',
'Wind Control',
'Veil',
'X-ray Vision'

*/

const HEXSITES = {
  all: ['empire','people','town','stronghold','lair','natural','ruin','resource','other'],
  empire:{class:['empire'],color:'white',fill:''},
  people:{class:['people'],color:'white',fill:'white'},
  town:{class:['town'],color:'black',fill:'black'},
  stronghold:{class:['stronghold'],color:'green',fill:'green'},
  ruin:{class:['ruin'],color:'grey',fill:'grey'},
  natural:{class:['natural'],color:'blue',fill:'blue'},
  resource:{class:['resource'],color:'yellow',fill:'yellow'},
  lair:{class:['lair'],color:'red',fill:'red'},
  other:{class:['ruin'],color:'orange',fill:'orange'}
} 

CPX.data.quickpowers = {
  fly : function (r) { return {id:'flight',rank:r} },
  curse : function (r) { return {id:'curse',rank:r} },
  armor : function (r) { return {id:'armor',rank:r} },
  MU : function (r,s) { return {id:'MU',rank:r,schools:s} },
  BW : function (r,e,a) { return {id:'ablast',rank:r,element:e,area:a} },
  undead : function () { return {id:'undead',rank:0} },
  blast : function (r,e) { return {id:'blast',rank:r,element:e} },
  aura : function (r,e) { return {id:'aura',rank:r,element:e} },
  regen : function (r) { return {id:'regen',rank:r} },
  immune : function (i) { return {id:'immune',rank:1,immunity:i} },
};
CPX.data.powertags = ['element','animal','bug','undead','ghost','dragon','fey',
  'earth','fire','air','water','sun','night','poison','disease','death','life',
  'armor','healing','mind','charm','luck','sneaky','magic','speed'];
CPX.data.powers = [
  {id:'blast',dmg:['1d10','4d6','6d6','8d6'],range:['near','near','far','sight'],
    tags: ['element'],
    input:['rank','element'],
    replace: ['dmg','range','element'],
    html: 'Blast (dmg) [range,element]'
  },
  {id:'ablast',dmg:['1d8','2d8','3d8','4d8'],
    tags: ['element','dragon'],
    input:['rank','area','element'],
    replace: ['dmg','area','element'],
    html: 'Area Blast (dmg) [area,near,element]'
  }, 
  {id:'armor',AAC:[15,17,19,21],DRval:[4,8,12,16],
    tags: ['animal','armor','dragon','earth'],
    input:['rank'],
    replace: ['AAC','DRval'],
    html: 'Armor [AAC] DR[DRval]'
  },
  {id:'aura',dmg:['1d6','2d6','3d6','4d6'],
    tags: ['element'],
    input:['rank','element'],
    replace: ['dmg','element'],
    html: 'Aura (dmg) [touch,element]'
  },
  {id:'bless',
    tags: ['magic','luck'],bonus:['1','2','2','2'],
    duration:['1d6 rounds','1d6 turns','1d6 hours','1d6 days'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['bonus','range','duration'],
    html: 'Bless (+bonus) [range,duration]'
  },
  {id:'curse',pen:['-1','-2','-2','-2'],
    tags: ['magic','undead','luck'],
    duration:['1d6 rounds','1d6 turns','1d6 hours','permanent'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['pen','svpen','range','duration'],
    html: 'Curse (pen) [svpenWIS save,range,duration]'
  },
  {id:'charm',
    tags: ['charm','mind'],
    duration:['1d6 rounds','1d6 turns','1d6 hours','permanent'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['svpen','range','duration'],
    html: 'Charm Person [svpenCHA save,range,duration]'
  },
  {id:'darkness',size:[15,30,90,300],
    tags: ['night','undead'],
    replace: ['size'],
    html: 'Darkness (sizeft radius)'
  },
  {id:'dazzle',sv:'DEX',svpen:true,
    tags: ['fire','sun','fey'],
    size:[5,10,30,100],
    range:['near','near','far','sight'],
    duration:['1d6 rounds','1d6 turns','1d6 hours','permanent'],
    input:['rank'],
    replace: ['size','svpen','range','duration'],
    html: 'Dazzle (sizeft radius) [svpenDEX save,range,duration]'
  },
  {id:'disease',
    tags: ['disease','undead'],
    range:['touch','touch','touch','near'],
    input:['rank'],
    replace: ['svpen','range'],
    html: 'Disease [svpenCON save,range]'
  },
  {id:'disintegrate',dmg:['1d8+4','2d8+8','3d8+12','4d8+16'],
    tags: ['death','undead'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['dmg','range'],
    html: 'Disintegrate (dmg) [range]'
  },
  {id:'deathsv',dmg:['1d6','2d6','3d6','4d6'],
    tags: ['death','undead'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['dmg','range'],
    html: 'Death (dmg) [CON save,range]'
  },
  {id:'flight',mv:[12,24,72,240],
    tags: ['air','animal','dragon'],
    input:['rank'],
    replace: ['mv'],
    html: 'Flight (mv)'
  },
  {id:'gasform',rank:1,
    tags: ['air'],
    html: 'Gaseous Form'
  },
  {id:'haste',nact:[0,1,2],
    tags: ['speed'],
    input:['rank'],
    replace: ['nact'],
    html: 'Haste (+nact Actions)'
  },
  {id:'heal',heal:['1d6','2d6','3d6','4d6'],
    tags: ['life','healing'],
    range:['touch','touch','close','near'],
    input:['rank'],
    replace: ['heal','range'],
    html: 'Healing (heal) [range]'
  },
  {id:'intangible',rank:1,
    tags: ['ghost','air','sun'],
    html: 'Intangible'
  },
  {id:'immune',rank:1,
    tags: ['element','armor'],
    input:['immunity'],
    replace: ['immunity'],
    html: 'Immune (immunity)'
  },
  {id:'immunewp',rank:1,
    tags: ['armor','undead'],
    html: 'Immune to non-magical weapons'
  },
  {id:'invis',extra:['','','5ft radius','20ft radius'],
    tags: ['sneaky'],
    input:['rank'],
    replace: ['extra'],
    html: 'Invisibility extra'
  },
  {id:'lvdrain',save:['+4 WIS save','+2 WIS save','WIS save','nosave'],
    tags: ['death','undead'],
    input:['rank'],
    replace: ['save'],
    html: 'Level Drain [save]'
  },
  {id:'lifedrain',dmg:['1d4','2d4','3d4','4d4'],
    tags: ['death','undead'],
    range:['touch','touch','close','near'],
    input:['rank'],
    replace: ['dmg','range'],
    html: 'Life Drain (dmg) [range]'
  },
  {id:'lifespt',rank:1,
    tags: ['life','armor'],
    html: 'Full Life Support'
  },
  {id:'liquid',rank:1,
    tags: ['water'],
    html: 'Liquid Form'
  },
  {id:'MU',
    tags: ['magic'],
    level:['','2nd level spells','4th level spells','9th level spells'],
    input:['rank','schools'],
    replace: ['level','schools'],
    html: 'Magic User (level) [schools]'
  },
  {id:'mindblast',dmg:['1d6','2d6','3d6','4d6'],
    tags: ['mind'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['dmg','range'],
    html: 'Mind Blast (dmg) [CHA Save,range]'
  },
  {id:'mindctl',
    tags: ['mind'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['range','svpen'],
    html: 'Mind Control [svpenCHA Save,range]'
  },
  {id:'poison',saveval:['','','','-2 '],
    tags: ['bug','poison'],
    dmg: ['1d6','2d6','death','death'],
    input:['rank'],
    replace: ['saveval','dmg'],
    html: 'Poison (dmg) [savevalCON save,touch]'
  },
  {id:'polymorph',sv:'CON',svpen:true,
    tags: ['magic','transmutation'],
    range:['touch','near','far','sight'],
    duration:['1d6 rounds','1d6 turns','1d6 hours','permanent'],
    input:['rank'],
    replace: ['svpen','range','duration'],
    html: 'Polymorph [svpenCON Save,range,duration]'
  },
  {id:'regen',heal:[0,1,3],
    tags: ['life','armor','healing'],
    input:['rank'],
    replace: ['heal'],
    html: 'Regeneration (heal hp/round)'
  },
  {id:'resist',save:[2,4],DRval:[4,8],
    tags: ['element','armor'],
    input:['rank','element'],
    replace: ['save','DRval','element'],
    html: 'Resist (element) +save DR[DRval]'
  },
  {id:'shapeshift',rank:1,
    tags: ['transmutation','sneaky'],
    html: 'Shapeshifter'
  },
  {id:'sleep',
    tags: ['mind','charm'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['svpen','range'],
    html: 'Sleep [svpenCHA save,range]'
  },
  {id:'stealmem',
    tags: ['mind'],
    duration:['1d4 rounds','1d4 turns','1d4 hours','permanent'],
    range:['touch','close','near','far'],
    input:['rank'],
    replace: ['duration','svpen','range'],
    html: 'Steal Memories [svpenWIS save,range,duration]'
  },
  {id:'stun',
    tags: ['bug','poison','lightning','ice'],
    duration:['1d4 rounds','1d4 turns','1d4 hours','permanent'],
    range:['touch','touch','touch','near'],
    input:['rank'],
    replace: ['duration','svpen','range'],
    html: 'Stun [svpenCON save,range,duration]'
  },
  {id:'summon',
    tags: ['summon'],
    nCL:[2,6,9,12],
    input:['rank'],
    replace: ['nCL'],
    html: 'Summon Creature (nCL CL)'
  },
  {id:'supperattr',
    tags: ['super'],
    mult:[1,2,3,4],
    input:['rank','attr'],
    replace: ['attr','mult'],
    html: 'Super attr (multX)'
  },
  {id:'strike',
    tags: ['might','animal','combat'],
    dmg:['1d10','4d6','6d6','8d6'],
    bonus:[0,1,3,5],
    input:['rank'],
    replace: ['dmg','bonus'],
    html: 'Strike (dmg) [+bonus to hit/dmg]'
  },
  {id:'swim',mv:[6,12,36],bonus:[0,2,4],
    tags: ['animal','swim','water'],
    input:['rank'],
    replace: ['mv'],
    html: 'Swimmer [Swim (mv)]'
  },
  {id:'TK',sv:'STR',svpen:true,
    tags: ['mind','force'],
    dmg:['1d6','3d6','5d6','7d6'],
    llb:['1500 lb','1.5 ton','15 ton','100 ton'],
    htlb:['150 lb','300 lb','1.5 ton','10 ton'],
    input:['rank'],
    replace: ['llb','htlb'],
    html: 'Telekinesis (Lift llb, Hold/Throw htlb)'
  },
  {id:'TP',
    tags: ['mind'],
    range:['far','10 miles','same world','galaxy sector'],
    input:['rank'],
    replace: ['range'],
    html: 'Telepathy [range]'
  },
  {id:'teleport',
    tags: ['speed','teleport'],
    range:['far','10 miles','same world','galaxy sector'],
    input:['rank'],
    replace: ['range'],
    html: 'Teleport [range]'
  },
  {id:'truesight',rank:1,
    tags: ['magic','sight'],
    html: 'True Sight'
  },
  {id:'wallcrl',rank:1,
    tags: [''],
    html: 'Wall Crawling'
  },
  {id:'weather',
    tags: ['air','storm'],
    size:['1 mile','10 mile','30 mile','100 mile'],
    input:['rank'],
    replace: ['size'],
    html: 'Weather Control [size radius]'
  },
  {id:'snare',
    tags: ['sneaky','combat'],
    range:['close','near','far','sight'],
    input:['rank'],
    replace: ['svpen','range'],
    html: 'Snare [svpenSTR save,range]'
  },
  {id:'undead',rank:0,
    tags: ['undead'],
    html: 'Undead'
  },
];
CPX.data.feats = [
  'Analytic Taste',
  'Chameleon',
  'Danger Sense',
  'Detect Supernatural',
  'Doesn’t Eat or Drink',
  'Doesn’t Sleep',
  'Extra Arms or Prehensile Tail',
  'Extra Legs',
  'Heightened Smell',
  'Heightened Hearing',
  'Immortality',
  'Micro-Vision',
  'Omni-Lingual',
  'Radar',
  'Radio',
  'Sensory Protection',
  'Sonar',
  'Super Vision',
  'Swinging',
  'Tiny',
  'Water Breathing '
];

CPX.data.aspect = [
  ["strength",'power','might'],
  ["trickery","dexterity",'alacrity','journeying'],
  ["time",'wealth','luck'],
  ["constitution",'endurance'],
  ["knowledge","intelligence",'artifice'],
  ["nature","wisdom",'beasts','fertility'],
  ["culture","charisma",'command'],
  ['bow','sword'],
  ['sorcery','force','fire'],
  ['sea','earth','sky','sun','night'],
  ['death','health'],
  ["war","lies","discord",'deception'],
  ["peace","truth","balance"],
  ["hate","envy"],
  ["love","admiration",'passion']
  ['telepathy','divination','telekinesis']
];
CPX.data.element = [
  ["air",'sky','cloud','wind','storm'],
  ["earth",'stone','mountain'],
  ["fire",'sun','desert','light'],
  ["water",'sea','storm'],
  ['ice','winter'],
  ['lightning','storm','cloud'],
  ['poison','disease'],
  ["life","death"],
  ['force','sorcery']
];
CPX.data.magic = ["divination","enchantment","evocation",'abjuration','conjuration',"illusion","necromancy",'transmutation',"summoning"];
CPX.data.traps = ["alarm",'ensnaring/paralyzing','pit','crushing','piercing/puncturing','chopping/slashing',
'confusing (maze, etc.)','gas (poison, etc.)','element','ambush','magic']
CPX.data.challenges = ['burglary', 'corruption', 'disorder', 'investigation', 'invention', 
  'labor', 'performance', 'persuasion', 'puzzle'];
CPX.data.rarity = ['common','uncommon','rare','legendary','epic'];
//the wealth of a...
CPX.data.wealth = [
  'middle class individual','wealthy professional','town','city','metropolis','state/provence','nation','large nation/multinational corp','national alliance','planet'
]

CPX.data.GBWords = ['alacrity','artifice','beasts','bow','command','death','deception','earth','endurance',
'fertility','fire','health','journeying','knowledge','luck','might','night','passion',
'sea','sky','sorcery','sun','sword','time','wealth'];
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.elementType = function (e){
  if(["air",'sky','cloud','wind','storm'].includes(e)){return 'air';}
  else if(["earth",'stone','mountain'].includes(e)){return 'earth';}
  else if(["fire",'sun','desert','light'].includes(e)){return 'fire';}
  else if(["water",'sea','storm'].includes(e)){return 'water';}
  else if(['ice','winter'].includes(e)){return 'ice';}
  else if(['lightning','storm','cloud'].includes(e)){return 'electricity';}
  else if(['poison','disease'].includes(e)){return 'disease';}
  else if(["life","death"].includes(e)){return e;}
  else if(['force','sorcery'].includes(e)){return e;}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.powerArray = function(tags){
  var PA=[];
  //if the tag is an array loop through each
  if(Array.isArray(tags)){
    tags.forEach(function(tag) {
      //concat the new filtered array 
      CPX.data.powers.forEach(function(p){
        if (p.tags.includes(tag)) { PA.push(p.id); }
      })   
    });
  }
  //if it isn't an array just filter the powers
  else{
    CPX.data.powers.forEach(function(p){
      if (p.tags.includes(tags)) { PA.push(p.id); }
    })
  }
  return PA;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.powerText = function(input){
  var P = CPX.data.powers.find(function(el){return el.id==input.id;}),
  txt = P.html;
  
  //if replace doens't exist set it to empty array
  if(!objExists(P.replace)){P.replace=[];}
  
  //replace in the text string
  P.replace.forEach(function(el) {
    if(el=='svpen'){
      var str = ['+2 ','','-2 ','-4 '][input.rank];
      txt = txt.replace(el,str);
    }
    //if the item is in the input use input
    else if(objExists(input[el])){ txt = txt.replace(el,input[el]); }
    //not a save, not an input, look to power
    else{
      //if an array, use the input rank
      if(Array.isArray(P[el])){
        txt = txt.replace(el,P[el][input.rank]);
      }
      //not an array, just a value
      else{ txt = txt.replace(el,P[el]); }
    }
  });
  return txt;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.rarity = function (RNG){
  RNG = typeof RNG === "undefined" ? CPXC : RNG;
  return RNG.weighted(['common','uncommon','rare','legendary','epic'],[60,30,7,0.8,0.2])
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.actor = function (type){
  return CPXC.pickone(CPX.data.actorCommon);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.aspect = function (n){
  var R = [], pick='';
  //until we get enough loop
  while (R.length<n){
    //select an element
    pick = CPXC.pickone(CPXC.pickone(CPX.data.aspect));
    //if element isn't in list push it
    if(!R.includes(pick)) { R.push(pick); }
  }
  return R;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.element = function (n,RNG){
  RNG = typeof RNG === "undefined" ? CPXC : RNG;
  var R = [], pick='';
  //until we get enough loop
  while (R.length<n){
    //select an element
    pick = CPXC.pickone(CPXC.pickone(CPX.data.element));
    //if element isn't in list push it
    if(!R.includes(pick)) { R.push(pick); }
  }
  return R;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.magic = function (n){
  var schools = [].concat(CPX.data.magic), R=[];
  //loop through n
  for(var i=0;i<n;i++){
    R.push(CPXC.pickone(schools));
    //remove it from selection
    schools.splice(schools.indexOf(R[i]),1);
  }
  return R;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.ally = function (RNG,CL) {
  RNG = typeof RNG === "undefined" ? CPXC : RNG;
  CL = typeof CL === "undefined" ? CL : 1;
  //rank
  var R = RNG.weighted([1,2,3,4,5],[1,0.3,0.075,0.02,0.005]),
  rarity = CPX.data.rarity[R-1],
  types = {
    1:['hireling'],
    2:['hireling','veteran'],
    3:['hireling','veteran','elite'],
    4:['veteran','elite'],
    5:['cosmic','elite']
  }
  A = {class:['ally'],R:R,text:RNG.pickone(types[R])};
  
  if(A.text=='veteran'){}
  else if(A.text=='elite'){}
  
  A.text+=' ('+rarity+')';
  
  return A;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.treasure = function (RNG) {
  RNG = typeof RNG === "undefined" ? CPXC : RNG;
  //rank
  var R = RNG.weighted([1,2,3,4,5],[1,0.3,0.075,0.02,0.005]),
  rarity = CPX.data.rarity[R-1],
  types = {
    1:['CPX','trinkets','tools','coins/gems/jewelry','supplies/trade goods'],
    2:['magic item','poisons/potions','CPX','coins/gems/jewelry','supplies/trade goods','weapons/armor','scroll'],
    3:['magic item','poisons/potions','CPX','coins/gems/jewelry','weapons/armor','scroll'],
    4:['magic item','artifact','coins/gems/jewelry','weapons/armor','book/scroll'],
    5:['magic item','artifact','coins/gems/jewelry','weapons/armor','book/scroll']
  }
  T = {class:['treasure'],R:R,text:RNG.pickone(types[R])};
  
  if(['trinkets','coins/gems/jewelry','supplies/trade goods'].includes(T.text)){
    var wealth = ' (the wealth of a ',
    wi = CPXC.pickone([0,1]) + (R-1)*2;
    wealth+=DATA.wealth[wi]+')';
    T.text+=wealth;
  }
  else {
    T.text+=' ('+rarity+')';  
  }
  
  return T;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.trap = function (RNG,TL) {
  RNG = typeof RNG === "undefined" ? CPXC : RNG;
  //difficulty
  var DC = RNG.weighted([1,2,3,4,5],[4,2,1,0.5,0.1]), DM=0,
  T = {class:['trap'],D:0,dmg:4,text:RNG.pickone(DATA.traps)};
  
  if(DC == 1){ 
    //if DC, increase difficulty by 0-2
    DM = RNG.weighted([0,1],[1,1]);
  }
  else {
    //if DC, increase difficulty randomly 
    DM = RNG.natural({min:1,max:DC});
  }
  T.D+=DM*2; 
  T.dmg+=(DC-DM)*2;
  
  if(objExists(CPX.gen[T.text])){
    T.text = T.text+' ('+CPX.gen[T.text](1)[0]+')';
  }
  
  if(T.text!='ambush'){
    T.text += ' [-'+T.D+'/'+TL+'d'+T.dmg+']'  
  }
  
  return T;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.challenge = function (RNG,CL) {
  RNG = typeof RNG === "undefined" ? CPXC : RNG;
  CL = typeof CL === "undefined" ? 1 : CL;
  //difficulty
  var DCbase = Math.floor(CL/4), 
  DCr = [1,2,3,4,5].slice(DCbase), DCp = [4,2,1,0.5,0.1].slice(DCbase), 
  DC = RNG.weighted(DCr,DCp),
  //type of challenge
  type = RNG.pickone(CPX.data.challenges),
  //object
  C={class:['challenge',type],D:0,S:1},
  DM=0;
  
  //if DC, increase difficulty by 2
  if(DC == 2){ C.D+=2; }
  else if(DC == 3){
    //if DC, increase difficulty by 2 or 4
    DM = RNG.weighted([1,2],[2,1]);
    C.D+=2*DM;
    //increase # of succeses
    C.S+=2-DM;
  }
  else if(DC == 4){
    //if DC, increase difficulty by 2-6
    DM = RNG.weighted([1,2,3],[1,1,1]);
    C.D+=2*DM;
    //increase # of succeses
    if(DM==1){C.S++;}
  }
  else if(DC == 5){
    //if DC, increase difficulty by 2-8
    DM = RNG.weighted([1,2,3,4],[1,1,1,1]);
    C.D+=2*DM;
    //increase # of succeses
    C.S++;
    //increase # of succeses more
    if(DM<3){C.S++;}
  }
  
  //set the text
  C.text = '[-'+C.D+'/'+C.S+']';
  
  return C;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.gen.fight = function(I){
  var r = CPXC.diceSum('3d6'), T=Number(I.T),
    E={class:['encounter'],HD:{m:0,e:0},text:''}; 
    
  if(r<5){
    E.HD.e = CPXC.diceSum('2d4')+T;
    E.text = 'Special foe ['+E.HD.e+' HD]'
  }
  else if(r<9) { 
    E.HD.m = CPXC.d4()+T; 
    E.text = 'Minions ['+E.HD.m+' HD]'
  }
  else if(r<13) { 
    E.HD.m = CPXC.diceSum('2d4')+T;
    E.text = 'Minions ['+E.HD.m+' HD]'
  }
  else if(r<16) { 
    E.HD.m = CPXC.diceSum('1d6')+T; 
    E.text = 'Minions ['+E.HD.m+' HD]'
    //guard beasts/allies
    if(CPXC.bool()){ 
      E.HD.m+= T; 
      E.text+= 'Minions ['+E.HD.m+' HD] & Beasts/Allies'
    }
  }
  else if(r<18) { 
    //minions
    E.HD.m = CPXC.diceSum('2d4'); 
    //elites
    E.HD.e = 2*T;
    E.text = 'Elites ['+E.HD.e+' HD] & Minions ['+E.HD.m+' HD]'
  }
  // LT/boss
  else {
    //boss plus
    E.HD.e = T+3;
    E.text = 'Lieutenant ['+E.HD.e+' HD]';
    //guard 
    if(CPXC.bool()){ 
      E.HD.m = CPXC.diceSum('3d6'); 
      E.text+= ' & Minions ['+E.HD.m+' HD]';
    }
  }
  
  E.text = 'Fight: '+E.text+'.';
  
  return E;
}
