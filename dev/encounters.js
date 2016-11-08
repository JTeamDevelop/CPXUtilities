var CREATURES = {
  creature : [["beast","monster"],[1,1]],
  beast : [["land","air","water"],[7/12,3/12,2/12]],
  land: ["termite","tick","snail","slug","worm","ant","centipede","scorpion","snake","lizard",
         "rat","weasel","boar","dog","fox","wolf","cat","lion","panther","deer","horse","ox",
         "rhino","bear","gorilla","ape","mammoth","dinosaur"],
  air : ["mosquito","firefly","locust","dragonfly","moth","bee","wasp","chicken","duck","goose",
         "jay","parrot","gull","pelican","crane","raven","falcon","eagle","owl","condor","pteranodon"],
  water : ["jellyfish","clam","eel","frog","fish","crab","lobster","turtle","alligator","shark",
           "squid","octopus","whale"],
  unnatural : [["undead", "planar", "divine"] , [8/12,3/12,1/12]],
  undead : [["haunt","wisp","ghost","banshee","wraith","wight","spirit lord","skeleton"],[1,1,1,1,1,1,1,1]],
  planar : [["imp", "lesser elemental", "lesser horror", "greater elemental", "greater horror", "elemental lord"],[3/12,3/12,3/12,1/12,1/12,1/12]],
  divine : [["agent", "champion", "army", "avatar"], [5/12,4/12,2/12,1/12]],
  monster : [["uncommon", "rare", "legendary"] , [7/12,3/12,2/12]],
  uncommon : [["plant","fungus",["*beast","*undead"],["*beast","*beast"],["*beast","+ability"],["*beast","+feature"]],[1,1,1,1,1,1]],
  rare : [["slime",["*beast","+construct"],["*beast","+element"],["*beast","*unnatural"]],[1,1,1,1]],
  legendary : [[["*dragon"], "colossus", ["#uncommon","+huge"], ["#rare","+huge"], ["*beast","*dragon"], ["#uncommon","*dragon"], ["#rare","*dragon"]], [1/8,1/8,1/4,1/4,1/12,1/12,1/12]],
}
var SPECIALNATURE = {
  nature : ["brute","blaster","skirmisher","soldier","stalker","controller"],
  ability : ["bless","curse","entangle","poison","disease","paralyze","petrify","mimic",
  "camouflage","hypnotize","dissolve","disintegrate","ignores armor", "ranged","flying",
  "armored","slicing","great strength","master combatant","deft","drain life","drain magic",
  "immunity","control minds","piercing","*magic","rolltwice"],
  aspect : ["strength","trickery","dexterity","time","constitution","knowledge","intelligence",
  "nature","wisdom","culture","charisma","war","lies","discord","peace","truth","balance","hate","envy",
  "love","admiration","*element","rolltwice"],
  element : ["air","earth","fire","water","life","death"],
  feature : ["vicious","multiple heads","headless","many eyes","one eye","many limbs","tail",
  "tentacles","*aspect","*element","*magic","*oddity", "rolltwice"],
  magic : ["divination","enchantment","evocation","illusion","necromancy","summoning"],
  nappearing : ["solitary", "group", "horde"],
  size : ['tiny','small','standard','large','huge'],
  tag : ["amorphous","construct","devious","intelligent","magical","organized",
  "planar","stealthy","terrifying","rolltwice"],
  oddity : ["particle swarm","geometric","chaotic","crystalline","fungal",
  "gaseous","smoke","illusionary"]
}
var COLORDESCRIPTORS = [
  "Inferno","Flame","Blaze","Pyre","Desert","War","Strife","Ravage","Crimson","Scarlet","Ruby",
  "Dire","Thorny","Proto","Storm","Lightning","Wind","Gale","Emerald","Moss","Malachite","Veridian",
  "Azure","Cobalt","Sapphire","Devious","Night","Shadow","Fear","Ice","Snow","Blizzard",
  "Stone","Cunning","Crystal","Rock","Crag","Doom","Death","Ruin","Null","Amber","Gold","Citrine",
  "Aurulent","Iron","Law","Protection","Void","Righteousness","Strong","Pale","Ashen",
  "Ghost","Silver","Alabaster","Ivory","Ghastly","Hoary","Pallid"
];
var MINIONS = {
  "brute":{skills:{Physique:0,Fight:-1},class:["foe"]},
  "blaster":{skills:{Shoot:0,Athletics:-1},class:["foe"]},
  "skirmisher":{skills:{Athletics:0,Fight:-1},class:["foe"]},
  "soldier":{skills:{Fight:0,Physique:-1},class:["foe"]},
  "stalker":{skills:{Athletics:0,Fight:-1},class:["foe"]},
  "controller":{skills:{Will:0},class:["foe"]},
  //minoins for hire
  "Laborer":{id:"Laborer",cost:1,skills:{Craft:1},special:[],class:["basic","general"],inventory:["tools","Club"]},
  "Soldier":{id:"Soldier",cost:1,skills:{Fight:1,Might:0,Fortitude:0},special:[],class:["basic","general","combatant"],inventory:["Longsword","Leather Armor"]},
  "Scout":{id:"Scout",cost:1,skills:{Notice:1,Fight:-1},special:[],class:["basic","general"],inventory:["Dagger","Leather Armor"]},
  "Diplomat":{id:"Diplomat",cost:1,skills:{Rapport:1,Investigate:0,Will:0},special:[],class:["basic","special"],inventory:["Staff"]}
}

CPX.encounter = function (RNG,opts) {
  var opts = typeof opts === "undefined" ? {} : opts;
  var terrain = typeof opts.terrain === "undefined" ? -1 : opts.terrain;
  var rank = RNG.weighted(["common", "uncommon", "rare", "legendary"], [10,4,0.8,0.2]); 
  
  if(objExists(opts.rank)) { rank = opts.rank; }
  if(terrain==-1) { terrain = RNG.natural({min:0,max:6}); }

  var ea = RNG.pickone(["beast","people","monster"]), e={};
  if(ea == "beast") { e=CPX.creature.beastEnhanced(RNG,terrain,rank); }
  else if(ea == "people") { e=CPX.people(RNG,{terrain:terrain,rank:rank}); }
  else { e=CPX.creature(RNG,{terrain:terrain,rank:rank}); }

  return e;
}
CPX.creature = function (RNG,opts) {
  var opts = typeof opts === "undefined" ? {} : opts;
  var terrain = typeof opts.terrain === "undefined" ? -1 : opts.terrain;
  var rank = RNG.weighted(["common", "uncommon", "rare", "legendary"], [10,4,0.8,0.2]); 
  
  if(objExists(opts.rank)) { rank = opts.rank; }
  if(terrain==-1) { terrain = RNG.natural({min:0,max:6}); }
  
  var creature = {};
  if(rank == "common"){ creature = CPX.creature.beast(RNG,terrain,rank); }
  else if(rank == "uncommon"){ creature = CPX.creature.monster(RNG,terrain,"uncommon"); }
  else if(rank == "rare"){ creature = CPX.creature.monster(RNG,terrain,"rare"); }
  else if(rank == "legendary"){ creature = CPX.creature.monster(RNG,terrain,"legendary"); }

  return creature;
}
CPX.creature.standard = function (RNG,creature){
  creature.text = RNG.pickone(COLORDESCRIPTORS);
  creature.name = creature.text+' ';
  creature.name+= creature.creature.join(' ');

  creature.scale = 0;
  if(creature.special.includes('tiny')) {
    creature.scale--;
  }
  else if(creature.special.includes('huge')) {
    creature.scale++;
  }
  else {
    var scale = RNG.weighted(SPECIALNATURE.size,[1,2,6,2,1]);
    if(scale == 'tiny') { creature.scale--; }
    else if (scale == 'huge') { creature.scale++; }
    if(scale!='standard') {creature.special.push(scale); }
  }
  
  if(creature.name.includes('colossus')){
    creature.scale+=2;
    creature.special.push('colossal');
  }

  creature.nappearing = RNG.weighted(SPECIALNATURE.nappearing,[0.3,0.5,0.2]);
  creature.nature = RNG.pickone(SPECIALNATURE.nature);
  
  //reduce duplicates
  creature.class = creature.class.unique();
  creature.special = creature.special.unique();
}
CPX.creature.constructor = function (nature,RNG,strtest,terrain,rank) {
  var R = {special:[],class:[]}, OBJ={}, etext ="", temp = "";
  R[nature] = [];
  
  if(nature == "creature") { OBJ = CREATURES; }
  else if (nature == "people") { OBJ = PEOPLES; }

  function subConstructor (sub) {
    var dtemp = {};
    //load the sub-result
    dtemp = CPX.creature.constructor(nature,RNG,sub,terrain,rank);
    R[nature] = R[nature].concat(dtemp[nature]);
    R.special = R.special.concat(dtemp.special);
    R.class = R.class.concat(dtemp.class);
  }
  
  //direct array in the people
  if(objExists(OBJ[strtest])){
    //single array
    temp = RNG.pickone(OBJ[strtest]);
    subConstructor(temp);
  }
  else if (strtest[0] == "#") {
    etext = strtest.slice(1);
    //double array is a weighted function 
    temp = RNG.weighted(OBJ[etext][0],OBJ[etext][1]);
    //it gets tricky if the result is another array - we have to run the constructor function
    if(Array.isArray(temp)) {
      //run the sub-constructor function to check for specials
      temp.forEach(function(el) { subConstructor(el) });
    }
    //otherwise just push the result
    else { 
      R = CPX.creature.constructor(nature,RNG,temp,terrain,rank);
    }
  }
  //this is a people generator function
  else if (strtest[0] == "*") {
    etext = strtest.slice(1);
    //gerate the people
    R = CPX[nature][etext](RNG,terrain,rank);
  }
  //this is a special generator function
  else if (strtest[0] == "+") {
    etext = strtest.slice(1);
    //if it is in special nature use the function
    if(objExists(SPECIALNATURE[etext])) { 
      R.special = CPX.creature.special(RNG,etext); 
    }
    //otherwise just push the special
    else { R.special.push(etext)  }
  }
  //nothing special, just push it to the array
  else { R[nature].push(strtest); }
  return R;
}
CPX.creature.special = function (RNG,type) {
  var r = [];

  function roll (array) {
    return RNG.pickone(array);
  } 

  r.push(roll(SPECIALNATURE[type]));

  if(r.includes("rolltwice")) {
    var newarray = SPECIALNATURE[type].slice(0,-1); 
    r.length = 0;
    r.push(roll(newarray));
    r.push(roll(newarray));
  }

  r.forEach(function(el,i){
    var st = ['aspect','element','magic'];
    if(el[0] == "*"){
      var newtype = el.slice(1);
      r[i] = roll(SPECIALNATURE[newtype]);
      
      if(st.includes(newtype)) { r[i] = CPXC.capitalize(newtype)+' ('+r[i]+')'; }
    }
    else {
      if(st.includes(type)) { r[i] = CPXC.capitalize(type)+' ('+el+')'; }
    }
  });

  return r;
}
//beast
CPX.creature.beastEnhanced = function (RNG,terrain,rank) {
  var beast = CPX.creature.beast(RNG,terrain,rank);

  var special = [], ns = {common:0,uncommon:1,rare:3,legendary:6},
  stypes = ['element','feature','tag','ability'];

  for(var i=0;i<ns[rank];i++) {
    special = special.concat(CPX.creature.special(RNG,RNG.pickone(stypes)));
  }

  beast.special = special;
  return beast;
}
CPX.creature.beast = function (RNG,terrain,rank) {
  var P = CREATURES.beast[1];
  if(terrain == 0) { P = [3/12,1/12,7/12]; }

  var ba = RNG.weighted(CREATURES.beast[0],P),
  bb = RNG.pickone(CREATURES[ba]);

  var creature = {creature : [bb], class:['creature','beast'], rank: rank, special : [] };
  CPX.creature.standard(RNG,creature);
  return creature;
}
//monster
CPX.creature.monster = function (RNG,terrain,rank) {
  if(!objExists(rank)) {
    rank = RNG.weighted(CREATURES.monster[0],CREATURES.monster[1]);
  }
  mb = RNG.weighted(CREATURES[rank][0],CREATURES[rank][1]);

  var creature = {creature:[],class:['creature','monster'],special:[]}, temp={};

  if(Array.isArray(mb)){
    mb.forEach(function(el) {
      temp = CPX.creature.constructor("creature",RNG,el,terrain,rank);
      creature.creature = creature.creature.concat(temp.creature);
      creature.special = creature.special.concat(temp.special);
      creature.class = creature.class.concat(temp.class);
    });
  }
  else { creature = CPX.creature.constructor("creature",RNG,mb,terrain,rank); }

  creature.rank = rank;
  CPX.creature.standard(RNG,creature);
  return creature;
}
CPX.creature.dragon = function (RNG,terrain,rank) {
  var special = CPX.creature.special(RNG,"ability");
  special = special.concat(
    CPX.creature.special(RNG,"element"),
    CPX.creature.special(RNG,"feature"),
    CPX.creature.special(RNG,"tag")
    );

  var creature = {creature : ["dragon"], class:['dragon'], special : special};
  return creature;
}
//unnatural
CPX.creature.unnatural = function (RNG,terrain,rank) {
  var ua = RNG.weighted(CREATURES.unnatural[0],CREATURES.unnatural[1]);
  return CPX.creature[ua](RNG);
}
//Undead
CPX.creature.undead = function (RNG,terrain,rank) {
  var ua = RNG.weighted(CREATURES.undead[0],CREATURES.undead[1]);
  var special = CPX.creature.special(RNG,"ability");
  special.push('undead');
  //Ability, Activity, Alignment, Disposition
  
  var creature = {creature : [ua], class:['undead'], special : special };
  return creature;
}
//Planar
CPX.creature.planar = function (RNG,terrain,rank) {
  var ua = RNG.weighted(CREATURES.planar[0],CREATURES.planar[1]);
  //Ability, Element, Feature, Tag, Activity, Alignment, Disposition, 
  var special = CPX.creature.special(RNG,"ability");
  special = special.concat(
    CPX.creature.special(RNG,"element"),
    CPX.creature.special(RNG,"feature"),
    CPX.creature.special(RNG,"tag")
    ); 

  var creature = {creature : [ua],class:['planar'],special : special };
  return creature;
}
//divine
CPX.creature.divine = function (RNG,terrain,rank) {
  var ua = RNG.weighted(CREATURES.divine[0],CREATURES.divine[1]);
  //Aspect, Ability, Element, Feature, Tag, Activity, Alignment, Disposition, 
  var special = CPX.creature.special(RNG,"aspect");
  special = special.concat(
    CPX.creature.special(RNG,"ability"),
    CPX.creature.special(RNG,"element"),
    CPX.creature.special(RNG,"feature"),
    CPX.creature.special(RNG,"tag")
    ); 

  var creature = {creature : [ua],class:['divine'],special : special };
  return creature;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var PEOPLES = {
  human : ["Human"],
  demi : ["Elf","Dwarf"],
  smallfolk : ["Gnome","Halfling","Kobold"],
  monstrous : ["Nightelf","Orc","Goblin","Hobgoblin","Ogre","Troll","Gnoll", "Minotaur","Lizard-people",
    "Snake-people","Dog-people","Cat-people","Mantis-people","Naga"],
  hybrid : ["Ape","Badger","Bat","Bear","Beetle","Boar","Cat","Cetnipede","Deer","Dog","Eagle","Elephant",
    "Frog","Goat","Horse","Lion","Mantis","Owl","Panther","Rat","Raven","Rhinoceros","Scorpion","Snake",
    "Spider","Tiger","Vulture","Wasp","Weasel","Wolf","Crab","Crocodile","Octopus","Shark","Eel"],
  uncommonraces : ["Plant-people","Fungus-people"],
  rareraces : ["*elemental","*giant"],
  common : [["human","demi","smallfolk","monstrous"],[0.5,0.25,0.1,0.15]],
  uncommon : [["uncommonraces","hybrid",["#common","+element"]], [1,2,2]],
  rare : [["rareraces",["#common","+construct"],['hybrid',"uncommonraces"],["hybrid","hybrid"],
    ["hybrid","+element"],["#common","+ability","+element","+aspect"]], [1,1,1,1,1,1]],
  legendary : [["*dragon",['#rare',"+element","+ability","+aspect"]],[1,2]],
}

CPX.professions = function (RNG,profarray) {
  profarray = typeof profarray === "undefined" ? [] : profarray;
  var type = ["Mystic Knights","Knights","Wizards","Priests","Monks"];
  return RNG.pickone(type.concat(profarray));
}
CPX.people = function (RNG,opts) {
  var opts = typeof opts === "undefined" ? {} : opts;
  var terrain = typeof opts.terrain === "undefined" ? -1 : opts.terrain;
  var rank = RNG.weighted(["common", "uncommon", "rare", "legendary"], [10,4,0.8,0.2]); 
  
  if(objExists(opts.rank)) { rank = opts.rank; }
  if(terrain==-1) { terrain = RNG.natural({min:0,max:6}); }

  var pa = RNG.weighted(PEOPLES[rank][0],PEOPLES[rank][1]),
  people = {people:[],special:[]}, temp={};

  if(Array.isArray(pa)){
    pa.forEach(function(el) {
      temp = CPX.creature.constructor("people",RNG,el,terrain,rank);
      people.people = people.people.concat(temp.people);
      people.special = people.special.concat(temp.special);
    });
  }
  else { people = CPX.creature.constructor("people",RNG,pa,terrain,rank); }

  people.text = RNG.pickone(COLORDESCRIPTORS);
  if(pa.includes('hybrid')) {
    people.name = CPXC.capitalize(people.people.join('-')) + ' people';
  }
  else {
    people.name = CPXC.capitalize(people.people.join(' '));
  }

  people.class = ['people'];
  
  people.scale = 0;
  if(people.special.includes('tiny')) {
    people.scale--;
  }
  else if(people.special.includes('huge')) {
    people.scale++;
  }
  else {
    var scale = RNG.weighted(SPECIALNATURE.size,[1,2,6,2,1]);
    if(scale == 'tiny') { people.scale--; }
    else if (scale == 'huge') { people.scale++; }
    if(scale!='standard') {people.special.push(scale); }
  }
  
  people.rank = rank;
  people.nappearing = RNG.weighted(SPECIALNATURE.nappearing,[0.3,0.5,0.2]);
  people.nature = RNG.pickone(SPECIALNATURE.nature);
  
  //reduce duplicates
  people.class = people.class.unique();
  people.special = people.special.unique();

  return people;
}
CPX.people.elemental = function(RNG) {
  var special = CPX.creature.special(RNG,"element");
  special = special.concat(
    CPX.creature.special(RNG,"ability"),
    CPX.creature.special(RNG,"tag")
    ); 

  return {
    people : ["elemental"],
    special : special
  }
}
CPX.people.giant = function(RNG) {
  var special = CPX.creature.special(RNG,"element");
  special.push("huge");

  return {
    people : ["giant"],
    special : special
  }
}
CPX.people.dragon = function (RNG,terrain,rank) {
  var special = CPX.creature.special(RNG,"ability");
  special = special.concat(
    CPX.creature.special(RNG,"element"),
    CPX.creature.special(RNG,"feature"),
    CPX.creature.special(RNG,"tag")
    );

  return {
    people : ["dragon"],
    special : special
  } 
}
