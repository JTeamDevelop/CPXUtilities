//version 0.1

CPX.data.DWCREATURES = {
  beast : [["land","air","water"],[7,3,2]],
  land: ["termite","tick","snail","slug","worm","ant","centipede","scorpion","snake","lizard",
         "rat","weasel","boar","dog","fox","wolf","cat","lion","panther","deer","horse","ox",
         "rhino","bear","gorilla","ape","mammoth","dinosaur"],
  air : ["mosquito","firefly","locust","dragonfly","moth","bee","wasp","chicken","duck","goose",
         "jay","parrot","gull","pelican","crane","raven","falcon","eagle","owl","condor","pteranodon"],
  water : ["jellyfish","clam","eel","frog","fish","crab","lobster","turtle","alligator","shark",
           "squid","octopus","whale"],
  humanoid: {
    common: [
      [['halfling'],['goblin','kobold'],['dwarf','gnome'],['orc','hobgoblin','gnoll'],
      ['half-elf','half-orc'],['elf']],
      [3,2,2,2,2,1]
    ],
    uncommon : [
      [['fey'],['catfolk','dogfolk'],['lizardfolk','merfolk','birdfolk'],['ogre','troll'],['cyclops','giant']],
      [1,2,3,1,3,2]
    ],
    hybrid : [
      [['centaur'],['werewolf','werebear'],['were'],['beast+1'],['beast+2']],
      [2,3,1,4,2]
    ]
  },
  monster : {
    unusual : [
      [['plant','fungus'],['undead','human'],['undead','humanoid'],['beast','beast'],['beast','ability'],['beast','feature']],
      [3,2,1,2,2,2]
    ],
    rare : [
      [['slime','ooze'],['creation'],['beast','odity'],['unnatural']],
      [3,3,3,3]
    ],
    legendary : [
      [['dragon'],['colossus'],['unusual','+huge'],['rare','+huge'],['beast','+huge'],['unudual','dragon'],['rare','dragon']],
      [1.5,1.5,3,3,1,1,1]
    ]
  },
  unnatural : [["undead", "planar", "divine"] , [8/12,3/12,1/12]],
  undead : [
    [["haunt","wisp"],["ghost",'spectre'],["banshee"],["wraith","wight"],["spirit lord",'spirit master'],["zombie","skeleton"]],
    [4,4,1,2,1,4]
  ],
  planar : [["imp", "lesser elemental", "lesser horror", "greater elemental", "greater horror", "elemental lord"],[3/12,3/12,3/12,1/12,1/12,1/12]],
  divine : [["agent", "champion", "army", "avatar"], [5/12,4/12,2/12,1/12]],
  monster : [["uncommon", "rare", "legendary"] , [7/12,3/12,2/12]],
  uncommon : [["plant","fungus",["*beast","*undead"],["*beast","*beast"],["*beast","+ability"],["*beast","+feature"]],[1,1,1,1,1,1]],
  rare : [["slime",["*beast","+construct"],["*beast","+element"],["*beast","*unnatural"]],[1,1,1,1]],
  legendary : [[["*dragon"], "colossus", ["#uncommon","+huge"], ["#rare","+huge"], ["*beast","*dragon"], ["#uncommon","*dragon"], ["#rare","*dragon"]], [1/8,1/8,1/4,1/4,1/12,1/12,1/12]],
}
CPX.data.DWSPECIAL = {
  ability : [
    ["bless","curse"],["entangle","snare"],["poison","disease"],["paralyze","petrify"],
    ["mimic","camouflage"],["seduce","hypnotize"],["dissolve","disintegrate"],["magic"],["drain life","drain magic"],
    ['immunity'],["control minds","read minds"],["rolltwice"]
  ],
  feature : [
    ['heavily armored'],['flying','winged'],["multiple heads","headless"],["many eyes","one eye"],
    ["many limbs","tail"],["tentacles"],["aspect"],["element"],["magic"],["oddity"],
    ['great strength'],['offense'],['defense'],['deftness'],['durability'],['trickery'],
    ['adaptation'],['divine favor'],["rolltwice"]
  ],
  tag : [
    "amorphous",'cautious',"construct","devious","intelligent","magical","organized",
    "planar","stealthy","terrifying","rolltwice"
  ],
  aspect : [
    ["strength",'power'],["trickery","dexterity"],["time","constitution"],["knowledge","intelligence"],
    ["nature","wisdom"],["culture","charisma"],["war","lies","discord"],["peace","truth","balance"],["hate","envy"],
    ["love","admiration"],["element"],["rolltwice"]
  ],
  oddity : [
    [['weird color','weird smell','weird sound'],['geometric'],['web','network','system'],['crystalline','glass-like'],
    ['fungal'],['gaseous','smokey'],['mirage','illusion'],['volcanic','explosive'],['magnetic','repellant'],
    ['devoid of life'],['unexpectedly alive'],['rolltwice']]
  ],
  element : ["air","earth","fire","water","life","death"],
  magic : ["divination","enchantment","evocation","illusion","necromancy","summoning"],
}

CPX.DW = {};
CPX.DW.creature = function (){
  var type = CPXC.weighted(['beast','human','humanoid','monster'],[4,2,2,4]);
  return CPX.DW[type];
}
CPX.DW.number = function (being){
  being.n = CPXC.weighted(["solitary", "group", "horde"],[4,5,3]);
  if(being.n == 'solitary'){
    being.HP = 12;
    being.dmg = [10,0];
  }
  else if(being.n == 'group'){
    being.HP = 6;
    being.dmg = [8,0];
  }
  else {
    being.HP = 3;
    being.dmg = [6,0];
  }
}
CPX.DW.size = function (being){
  being.size = CPXC.weighted(['tiny','small','standard','large','huge'],[1,2,6,2,1]);
  being.range = [];
  if(being.size == 'tiny'){
    being.dmg[1]-=2;
    being.range.push('hand');
  }
  else if(being.size == 'small'){
    being.range.push('close');
  }
  else if(being.size == 'standard'){
    being.range.push('close');
  }
  else if(being.size == 'large'){
    being.range.push('close','reach');
    being.HP +=4;
    being.dmg[1] += 1;
  }
  else if(being.size == 'huge'){
    being.range.push('reach');
    being.HP +=8;
    being.dmg[1] += 3;
  }
}
CPX.DW.beast = function (){
  var terrain = CPXC.weighted(CPX.data.DWCREATURES.beast[0],CPX.data.DWCREATURES.beast[1]);
  var beast = {
    name : CPXC.pickone(CPX.data.DWCREATURES[terrain]),
    special:[],
    notes:''
  }
  CPX.DW.number(beast);
  CPX.DW.size(beast);
  return beast;
}
CPX.DW.human = function (){
  var human = {
    name : "Human",
    special:[],
    notes:''
  }
  CPX.DW.number(human);
  human.size = 'standard';
  human.range = ['close'];
  return human;
}
CPX.DW.werefolk = function (){
  var were = CPX.DW.beast;
  were.name = 'Were-'+were.name;
  return were;
} 
CPX.DW.beastfolk = function (n){
  var beast = [CPX.DW.beast()];
  if(n==2){
    beast.push(CPX.DW.beast());
    beast = CPXC.shuffle(beast);
  }
  var folk = beast[0];
  if(n==2){
    folk.name = beast[0].name+'-'+beast[1].name
  }
  folk.name+= ' folk';
  return folk;
}
CPX.DW.humanoid = function (){
  var rarity = CPXC.weighted(['common','uncommon','hybrid'],[7,3,2]),
  type = CPXC.weighted(CPX.data.DWCREATURES.humanoid[rarity][0],CPX.data.DWCREATURES.humanoid[rarity][1]);
  type = CPXC.pickone(type);
  
  var H={special:[],notes:''};
  if(['were','beast+1','beast+2'].includes(type)){
    if(type=='were'){ H = CPX.DW.werefolk(); }
    else {
      if(type[6]=='1'){ H = CPX.DW.beastfolk(1); }
      else { H = CPX.DW.beastfolk(2); }
    }
  }
  else if(['halfling','goblin','kobold','dwarf','gnome'].includes(type)){
    H.name = type;
    CPX.DW.number(H);
    H.size = 'small';
    H.range = ['close'];
  }
  else if(['ogre','troll','cyclops','giant'].includes(type)){
    H.name = type;
    CPX.DW.number(H);
    H.size = 'large';
    H.range = ['close','reach'];
    H.HP +=4;
    H.dmg[1] += 1;
  }
  else if(type == 'fey'){
    H.name = type;
    CPX.DW.number(H);
    H.size = 'tiny';
    H.dmg[1]-=2;
    H.range = ['hand'];
  }
  else {
    H.name = type;
    CPX.DW.number(H);
    H.size = 'standard';
    H.range = ['close'];
  }
  
  return H;
}
CPX.DW.monster = function (rarity){
  if(typeof rarity === 'undefined'){
    rarity = CPXC.weighted(['unusual','rare','legendary'],[7,3,2]);  
  }
  
  var type = CPXC.weighted(CPX.data.DWCREATURES.monster[rarity][0],CPX.data.DWCREATURES.humanoid[rarity][1]);
  
  var M = {};
  if(['undead','unnatural'].includes(type[0])){
    return CPX.DW[type[0]](type);
  }
  else if(type[0] == 'beast') {
    M = CPX.DW.beast();
  }
  else if(type.includes('dragon')) {
    return CPX.DW.dragon(type);
  }
  else if(type.includes('+huge')) {}
  else if(type.includes('slime')) {}
  else if(type[0]=='colossus'){}
  else if(type[0]=='creation'){}
}
CPX.DW.undead = function (type){
  if(typeof type ===' undefined'){
    type = CPXC.weighted(['human','humanoid','beast'],[2,1,1]);
  }
  
  var U = CPX.DW[type],
  ut = CPXC.weighted(CPX.data.DWCREATURES.undead[0],CPX.data.DWCREATURES.undead[1]);
  
  U.name += CPXC.pickone(ut);
  CPX.DW.ability(U);
  return U;
}
CPX.DW.unnatural = function (type){}
CPX.DW.dragon = function (type){}
CPX.DW.special = function (being,type){
  var allspecial = ['ability','feature','tag','aspect','odity','element','magic'];
  
  function pick(at){
    var array = CPX.data.DWSPECIAL[at];
    var rta = array.slice(0,array.length-1);
    
    var p = CPXC.pickone(array);
    if(p.includes('rollrwice')){
      p = [CPXC.pickone(rta),CPXC.pickone(rta)];
    }
    else {p=[p];}
    
    if(['ability','feature','aspect','odity'].includes(at)){
      p.forEach(function(el,i) {
        p[i] = CPXC.pickone(el);
      }); 
    }
    
    return p;  
  }
  
  var r = pick(CPX.data.DWSPECIAL[type]);
  
  var final=[];
  r.forEach(function(el,i) {
    var p = '';
    if(allspecial.includes(el)){
      p = pick(el); 
      if(['element','magic','aspect'].includes(el)){
        p.forEach(function(sel) {
          final.push(el+' ('+sel+')');
        });
      }
    }
    else if(el=='immunity'){
      final.push(el +' ('+CPXC.pickone(CPX.data.DWSPECIAL.element)+')');
    }
    else {final.push(el);}
    
    if(el=='heavily armored'){being.armor+=2;}
    if(el=='great strength'){
      being.dmg[1]+=2;
      final.push('forceful');
    }
    if(el=='offense'){
      being.notes+='Use better of two damage rolls. ';
    }
    if(el=='defense'){being.armor+=1;}
    if(el=='deftness'){being.dmg[2]+=1;}
    if(el=='durability'){being.HP+=4;}
    if(el=='trickery'){
      final.push('stealthy');
      being.notes+='+1 tricky move. ';
    }
    if(el=='adaptation'){
      being.notes+='+1 special quality. ';
    }
    if(el=='divine favor'){
      r.push('magic');
    }
    if(el=='magic'){
      being.notes+='+1 spell move. ';
    }

  });
  
  being.special = being.special.concat(final);
}
