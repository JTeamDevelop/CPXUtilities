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
CPX.data.quickpowers = {
  fly : function (r) { return {id:'flight',rank:r} },
  curse : function (r) { return {id:'curse',rank:r} },
  armor : function (r) { return {id:'armor',rank:r} },
  MU : function (r,s) { return {id:'MU',rank:r,schools:s} },
  BW : function (r,e,a) { return {id:'ablast',rank:r,element:e,area:a} },
  undead : function () { return {id:'undead',rank:0} },
};
CPX.data.powertags = ['element','animal','bug','undead','ghost','dragon','fey',
  'earth','fire','air','water','sun','night','poison','disease','death','life',
  'armor','healing','mind','charm','luck','sneaky','magic','speed'];
CPX.data.powers = [
  {id:'blast',dmg:['2d6','4d6','6d6','8d6'],range:['near','near','far','sight'],
    tags: ['element'],
    input:['rank','element'],
    replace: ['dmg','range','element'],
    html: 'Blast (dmg) [rng,element]'
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
    replace: ['save','DRval'],
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
    tags: ['bug'],
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
CPX.data.GBWords = ['alacrity','artifice','beasts','bow','command','death','deception','earth','endurance',
'fertility','fire','health','journeying','knowledge','luck','might','night','passion',
'sea','sky','sorcery','sun','sword','time','wealth'];

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
CPX.gen.element = function (n){
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