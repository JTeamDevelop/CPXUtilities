DISCOVERY = {
  ufeature: [["arcane","planar","divine"],[0.75,1/6,1/12]],
  arcane : [["residue","blight","mutation","enchantment","soure","store"],[1/6,1/4,1/6,1/4,1/12,1/12]],  //Alignment, Magic Type
  planar : [["warp","gate","rift","outpost"],[1/3,1/3,1/6,1/6]], //Alignment, Element
  divine : [["mark","cursed site","hallowed site","watched site","presence"],[1/4,1/4,1/4,1/6,1/12]],  //Alignment, Aspect
  nfeature : [["lair","obstacle","terrain change","water feature","landmark","resource"],[1/6,1/6,1/4,1/6,1/6,1/12]],
  lair : [["burrow","cave","arie","hive","ruins"],[1/4,1/3,1/6,1/12,1/6]],   //Creature responsible, Visibility
  obstacle : [["difficult ground","cliff/crevasse","ravine","oddity"],[5/12,1/4,1/6,1/6]],
  "terrain change" : [["another terrain","pit/hole/crevasse/cave","altitude change","canyon","peak/rise"],[1/3,1/6,1/6,1/6,1/6]],
  "water feature" : [["spring","waterfall/geyser","brook","lake","river","sea"],[1/12,1/12,1/3,1/6,1/6,1/6]],
  landmark : [["water-based","plant-based","earth-based","oddity"],[1/4,1/4,1/3,1/6]],
  resource : [["game/fruit/vegetable","herb/spice/dye source","timber/stone","ore","precious metal/gems"],[1/3,1/6,1/6,1/6,1/12]], //Size, Visibility
  evidence: [["tracks","remains","cache"],[1/2,1/3,1/6]],
  tracks : [["faint","definite","multiple","signs of violence","trail of blood"],[1/4,1/4,1/6,1/6,1/6]],  //Age, Creature responsible
  remains : [["bones","corpse","site of violence","refuse","lost carge","tools/armor/weapons"],[1/3,1/4,1/6,1/12,1/12,1/12]],  //Age, Visibility
  cache : [["trinkets/coins","tools/weapons/armor","map","food/supplies","treasure"],[1/4,1/6,1/6,1/6,1/4]],
  creature: [["nasty"],[1]],
  nasty : [["creature"],[1]],
  structure : [["enigmatic","infrastructure","dwelling","religious","steading","ruin"],[1/12,1/6,1/12,1/6,1/6,1/3]],
  enigmatic : [["earthworks","megalith","statue/idol/totem","oddity"],[1/3,1/3,1/4,1/12]],  //Age (1d8+4), Size (1d8+4),Visibility
  infrastructure : [["track/path","road","bridge/ford","mine/quarry","aqueduct/canal/portal"],[1/3,1/3,1/6,1/12,1/12]],  //Creature responsible (1d4+4)
  dwelling : [["campsite","hovel/hut","farm","inn/roadhouse","tower/keep/estate"],[1/4,1/4,1/6,1/6,1/6]],  //Creature responsible (1d4+4)
  religious : [["grave marker/barrow","graveyard/necropolis","tomb/crypt","shrine","temple/retreat","great temple"],[1/6,1/6,1/6,1/4,1/6,1/12]],  //Creature responsible (1d4+4),Alignment, Aspect
  steading : [["steading"],[1]],
  ruin : [["Infrastructure (1d6+6)","Dwelling (1d8+4)","Burial/Religious(1d8+4)","Steading (1d10+2)","Dungeon (pp60-61)"],[1/6,1/6,1/6,1/6,1/3]] //Creature responsible (1d4+4),Age (1d8+4), Ruination,Visibility
}

CPX.explore = function (RNG,site,opts) {
  var nature = 'ruin', map=site.parent[0], lair=false;
  if(map.class.includes('site')) { nature ='site'; }
  else if(map.class.includes('lair')) { nature ='lair'; }
  else if(map.class.includes('hideout')) { nature ='hideout'; }
  
  var i = site.special.findIndex(function(el){ return el.class[0]=='lair'; })
  if(i>-1){ lair = true; }

  opts = typeof opts === "undefined" ? {} : opts;
  var TP = opts.T = typeof opts.T === "undefined" ? 30 : opts.T;
  var HP = opts.H = typeof opts.H === "undefined" ? 30 : opts.H;

  var R='';

  function empty() {}
  function treasure() { 
    R+='T'; 
    site.special.push({class:['treasure'],visible:1});
    site.class.push('treasure');
  }
  function secretTreasure() { 
    R+='S'; 
    site.special.push({class:['treasure'],visible:0});
    site.class.push('treasure');
  }
  function hazard () { 
    R+='H'; 
    site.special.push({class:['hazard'],visible:0});
    site.class.push('hazard');
  }
  function feature () { 
    site.special.push({class:['feature'],visible:1});
    site.class.push('feature');
  }

  if (nature == "overland") {
    var ex = ["C","C","C","C","C","C","CI","CI","UI","UI","UI","UI"];
    var R=RNG.pickone(ex);
    
    if (R.includes("I")) {
      R = CPX.discovery(RNG);
    }
  }
  else if (nature =="ruin" || nature =="lair") {
    var tP = [7,2,1], hP = [9,1], fP = [8,2];
    //mod treasure probability
    if(lair) { tP = [4,2,4]; }
    RNG.weighted([empty,secretTreasure,treasure],tP)();
    //mod hazard probability
    if(!lair) {
      if(R.includes("S") || R.includes("T")) { hP= [3,7] }
    }
    RNG.weighted([empty,hazard],hP)();
    //mod feature probability
    if(R.length==0) { fP = [6,4]; }
    RNG.weighted([empty,feature],fP)();
  }

}
CPX.discovery = function (RNG) {
/*
  Landmark
  CPCX.weighted(["spring","waterfall/geyser","brook","lake","river","sea"],[1/12,1/12,1/3,1/6,1/6,1/6])
  CPCX.weighted(["ancient tree","giant flowers","giant tree","petrified forest"],[1/4,1/4,1/4,1/4])
  CPCX.weighted(["peake","butte","crater"],[1/3,1/3,1/3])
*/

  //first get the type of discovery
  var da = RNG.weighted(["ufeature","nfeature","evidence","creature","structure"],[1/12,1/4,1/6,1/6,1/3]),
  //next the subtype
  db = RNG.weighted(DISCOVERY[da][0],DISCOVERY[da][1]),
  //finally the actual discovery
  dc = RNG.weighted(DISCOVERY[db][0],DISCOVERY[db][1]);

  return dc;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.discovery.object = function (result) {
  var structures = ["enigmatic","infrastructure","religious"],
  gates= ["warp","gate","rift"],
  obj = {};

  if(result[0]=="landmark"){
    obj.type = "site";
    obj.subtype = "landmark";
    obj.nature = result[1];
    obj.visible = true;
  }
  if(result[0]=="arcane"){
    obj.type = "site";
    obj.subtype = "arcane";
    obj.nature = result[1];
    obj.visible = false;
  }
  if(result[0]=="divine"){
    obj.type = "site";
    obj.subtype = "divine";
    obj.nature = result[1];
    obj.visible = false;
  }
  else if (result[0]=="resource") {
    obj.type = "site";
    obj.subtype = "resource";
    obj.resource = result[1];
    obj.visible = true;
  }
  else if (result[0]=="lair") {
    obj.type = "lair";
    obj.subtype = result[1];
    obj.visible = true;
  }
  else if (result[0]=="ruin") {
    obj.type = "ruin";
    obj.subtype = result[1];
    obj.visible = true;
  }
  else if (result[0]=="steading") {
    obj.type = "pop";
    obj.visible = true;
  }
  else if (result[0]=="dwelling") {
    obj.type = "pop";
    obj.subtype = result[1];
    obj.visible = true;
  }
  else if (result[0]=="cache") {
    obj.type = "cache";
    obj.subtype = result[1];
    obj.visible = false;
  }
  else if (result[0]=="tracks" || result[0]=="remains") {
    obj.type = "signs";
    obj.subtype = result[1];
    obj.visible = false;
  }
  else if(structures.includes(result[0])){
    obj.type = "site";
    obj.subtype = result[1];
    obj.visible = true;
  }

  if(gates.includes(result[1])){
    obj.type = "site";
    obj.subtype = "gate";
    obj.nature = result[1];
    obj.visible = true;
  }
  else if (result[1]=="outpost") {
    obj.type = "pop";
    obj.subtype = "planar outpost";
    obj.visible = false;
  }

  return obj;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//["standard","secret","resource","huntingground","feature","difficult"]
CPX.discovery.secret = function (seed) {
  var R=[], temp = {
    RNG : new Chance(seed.join(""))
  }
  var D = {
    ufeature: [["arcane","planar","divine"],[0.75,1/6,1/12]],
    arcane : [["residue","blight","mutation","enchantment","soure","store"],[1/6,1/4,1/6,1/4,1/12,1/12]],  //Alignment, Magic Type
    planar : [["warp","gate","rift","outpost"],[1/3,1/3,1/6,1/6]], //Alignment, Element
    divine : [["mark","cursed site","hallowed site","watched site","presence"],[1/4,1/4,1/4,1/6,1/12]],  //Alignment, Aspect
    nfeature : [["lair","resource"],[1/3,2/3]],
    lair : [["burrow","cave","arie","hive","ruins"],[1/4,1/3,1/6,1/12,1/6]],   //Creature responsible, Visibility
    resource : [["game/fruit/vegetable","herb/spice/dye source","timber/stone","ore","precious metal/gems"],[1/3,1/6,1/6,1/6,1/12]], //Size, Visibility
    evidence: [["cache"],[1]],
    cache : [["trinkets/coins","tools/weapons/armor","map","food/supplies","treasure"],[1/4,1/6,1/6,1/6,1/4]],
    structure : [["enigmatic","infrastructure","dwelling","religious","steading","ruin"],[1/12,1/6,1/12,1/6,1/6,1/3]],
    enigmatic : [["earthworks","megalith","statue/idol/totem","oddity"],[1/3,1/3,1/4,1/12]],  //Age (1d8+4), Size (1d8+4),Visibility
    infrastructure : [["track/path","road","bridge/ford","mine/quarry","aqueduct/canal/portal"],[1/3,1/3,1/6,1/12,1/12]],  //Creature responsible (1d4+4)
    dwelling : [["campsite","hovel/hut","farm","inn/roadhouse","tower/keep/estate"],[1/4,1/4,1/6,1/6,1/6]],  //Creature responsible (1d4+4)
    religious : [["grave marker/barrow","graveyard/necropolis","tomb/crypt","shrine","temple/retreat","great temple"],[1/6,1/6,1/6,1/4,1/6,1/12]],  //Creature responsible (1d4+4),Alignment, Aspect
    steading : [["steading"],[1]],
    ruin : [["Infrastructure (1d6+6)","Dwelling (1d8+4)","Burial/Religious(1d8+4)","Steading (1d10+2)","Dungeon (pp60-61)"],[1/6,1/6,1/6,1/6,1/3]] //Creature responsible (1d4+4),Age (1d8+4), Ruination,Visibility
  }

  //first get the type of discovery
  var da = temp.RNG.pickone(["ufeature","nfeature","evidence","structure"]),
  //next step
  db = temp.RNG.weighted(D[da][0],D[da][1]),
  //actual discovery
  dc = temp.RNG.weighted(D[db][0],D[db][1]);
  R.push(db);
  R.push(dc);

  temp.RNG = null;
  delete temp.RNG;
  //build the object
  temp = CPX.discovery.object(R);
  temp.visible = false;

  return temp;
}
CPX.discovery.resource = function (seed) {
  var R=[], temp = {
    RNG : new Chance(seed.join(""))
  }
  //first get the type of discovery
  var da = temp.RNG.weighted(["arcane","resource"],[1/6,5/6]),
  //finally the actual discovery
  db = temp.RNG.weighted(DISCOVERY[da][0],DISCOVERY[da][1]);
  R.push(da);
  R.push(db);

  temp.RNG = null;
  delete temp.RNG;
  //build the object
  temp = CPX.discovery.object(R);

  return temp;
}
CPX.discovery.huntingground = function (seed) {
  var R=[], temp = {
    RNG : new Chance(seed.join(""))
  }
  var D = {
    planar : [["rift","outpost","presence"],[1/3,1/3,1/6,1/6]], //Alignment, Element
    lair : [["burrow","cave","arie","hive","ruins"],[1/4,1/3,1/6,1/12,1/6]],   //Creature responsible, Visibility
    tracks : [["faint","definite","multiple","signs of violence","trail of blood"],[1/4,1/4,1/6,1/6,1/6]],  //Age, Creature responsible
    remains : [["bones","corpse","site of violence","refuse"],[1/4,1/4,1/4,1/4]],  //Age, Visibility
    cache : [["trinkets/coins","tools/weapons/armor","lost cargo"],[1/3,1/3,1/3]]
  }

  //first get the type of discovery
  var da = temp.RNG.weighted(["planar","lair","tracks","remains","cache"],[1/12,3/12,4/12,3/12,1/12]),
  //finally the actual discovery
  db = temp.RNG.weighted(D[da][0],D[da][1]);
  R.push(da);
  R.push(db);

  temp.RNG = null;
  delete temp.RNG;
  //build the object
  temp = CPX.discovery.object(R);

  return temp;
}
CPX.discovery.feature = function (seed) {
  var R=[], temp = {
    RNG : new Chance(seed.join(""))
  }
  var D = {
    ufeature: [["arcane","planar","divine"],[0.75,1/6,1/12]],
    arcane : [["residue","blight","mutation","enchantment","soure","store"],[1/6,1/4,1/6,1/4,1/12,1/12]],  //Alignment, Magic Type
    planar : [["warp","gate","rift","outpost"],[1/3,1/3,1/6,1/6]], //Alignment, Element
    divine : [["mark","cursed site","hallowed site","watched site","presence"],[1/4,1/4,1/4,1/6,1/12]],  //Alignment, Aspect
    nfeature : [["landmark"],[1]],
    landmark : [["water-based","plant-based","earth-based","oddity"],[1/4,1/4,1/3,1/6]],
    structure : [["enigmatic","infrastructure","dwelling","religious","ruin"],[1/6,1/6,1/6,1/6,1/3]],
    enigmatic : [["earthworks","megalith","statue/idol/totem","oddity"],[1/3,1/3,1/4,1/12]],  //Age (1d8+4), Size (1d8+4),Visibility
    infrastructure : [["track/path","road","bridge/ford","mine/quarry","aqueduct/canal/portal"],[1/3,1/3,1/6,1/12,1/12]],  //Creature responsible (1d4+4)
    dwelling : [["inn/roadhouse","tower/keep/estate"],[1/2,1/2]],  //Creature responsible (1d4+4)
    religious : [["grave marker/barrow","graveyard/necropolis","tomb/crypt","shrine","temple/retreat","great temple"],[1/6,1/6,1/6,1/4,1/6,1/12]],  //Creature responsible (1d4+4),Alignment, Aspect
    ruin : [["Infrastructure (1d6+6)","Dwelling (1d8+4)","Burial/Religious(1d8+4)","Steading (1d10+2)","Dungeon (pp60-61)"],[1/6,1/6,1/6,1/6,1/3]] //Creature responsible (1d4+4),Age (1d8+4), Ruination,Visibility
  }

  //first get the type of discovery
  var da = temp.RNG.weighted(["ufeature","nfeature","structure"],[1/4,5/12,1/3]),
  //next step
  db = temp.RNG.weighted(D[da][0],D[da][1]),
  //actual discovery
  dc = temp.RNG.weighted(D[db][0],D[db][1]);
  R.push(db);
  R.push(dc);

  temp.RNG = null;
  delete temp.RNG;
  //build the object
  temp = CPX.discovery.object(R);

  return temp;
}
