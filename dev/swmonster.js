/* Version 1.0
  Core funcitonality for selecting monsters from the DB and saving them as new
  Added random generation for Dragons and Undead
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.data.SWMonsters = {
  saves: [18,17,16,14,13,12,11,9,8,6,5,4,3],
  xp: [5,10,15,30,60,120,240,400,600,800,1100,1400,1700,2000,2300,2600,2900],
  xpbonus: 300,
  physicalfeatures : [
    ['heavily armored'],['flying','winged'],["multiple heads","headless"],["many eyes","one eye"],
    ["many limbs","tail"],["tentacles"],["oddity"]
  ],
  elementatk : ['air','earth','fire','light','water','ice','lightning','poison','disease','life','death','telepathy'],
  element : CPX.data.element,
  magic : CPX.data.magic,
  animal : [["land","air","water"],[7,3,2]],
  land: ["snake","lizard","rat","weasel","boar","dog","fox","wolf","cat","lion","panther","deer","horse","ox",
         "rhino","bear","gorilla","ape","mammoth","dinosaur"],
  air : ["chicken","duck","goose","jay","parrot","gull","pelican","crane","raven","falcon","eagle","owl","condor","pteranodon"],
  water : ["jellyfish","clam","eel","frog","fish","crab","lobster","turtle","alligator","shark",
           "squid","octopus","whale"],
  bug : [["bugland","bugair"],[2,1]],
  bugland : ["termite","tick","snail","slug","worm","ant","centipede","scorpion"],
  bugair : ["mosquito","firefly","locust","dragonfly","moth","bee","wasp",'praying mantis'],
  beast: ['Ankheg','Basilisk','Behir','Blink Dog','Bog Creeper','Bulette','Bunyip','Carrion Creeper',
    'Catoblepas','Cave Fisher','Chimera','Cockatrice','Darkmantle','Decapus','Dwelver','Fetch','Flail Snail',
    'Froghemoth','Gibbering Mouther','Gloomwing','Gorgon','Gorilla Bear','Grick','Griffon',
    'Grue','Hell Hound','Hippocampus','Hippogriff','Hydra','Kraken','Leucrota',
    'Manticore','Mimic','Nightmare','Nightshade','Ogrillon','Otyugh','Owlbear','Pegasus',
    'Peryton','Piercer','Purple Worm','Razor Wings','Remorhaz','Roc',
    'Rust Monster','Sea Monster','Sea Serpent','Shadow Mastiff','Shambling Mound',
    'Shocker Lizard','Giant Phase Spider','Stirge','Tendriculos','Unicorn',
    'Winter Wolf','Worg','Wyvern','Yeti'],
  construct: ['animated object','Clay Golem','Flesh Golem','Ice Golem','Iron Golem',
    'Stone Golem','Stone Guardian Golem','Wax Golem','Iron Cobra'],
  fey: ['Boggart','Brownie','Dryad','Gremlin','Grimm','Korred','Nixie','Nymph','Pixie','Satyr','Will-o-the-wisp'],
  fiend: ['Hag','Daemon','Demon','Devil','Imp','Mephit'],
  'giant-kin': ['Athatch','Ettin','Cave Giant','Cloud Giant','Fire Giant','Frost Giant',
    'Hill Giant','Sand Giant','Sea Giant','Stone Giant','Storm Giant','Volcano Giant',
    'Wood Giant','Ogre','Swamp Ogre','Ogre Mage','Ogren','Titan','Troll'],
  plant: ['Assassin Vine','Black Pudding','Violet Fungus','Gas Spore','Gelatinous Cube',
    'Green Slime','Grey Ooze','Brown Mold',"Yellow Mold",'Ochre Jelly','Crystal Ooze','Shrieker'],
  unnatural: ['Aboleth','Aranea','Beast of Chaos','Cloaker','Cerebral Stalker',
    'Disenchanter','Eye of the Deep','Giant Phase Spider','Doppelganger','Roper','Xorn','Retriever',
    'Couatl','Ki-rin','Guardian Naga','Spirit Naga','Water Naga','Vargouille','Lamia','Lammasu'],
  lycanthrope: ['Werebear','Wereboar','Wererat','Weretiger','Wereweasel','Werewolf'],
  humanoid: ['Azer','Bugbear','Centaur','Churr','Crabman','Drider','Drow','Duergar',
    'Dwarf','Elf','Ettercap','Fungoid','Gargoyle','Margoyle','Gnoll','Goblin','Grippli',
    'Half-Ogre','Harpy','Hobgoblin','Jackalwere','Kobold','Medusa','Merman','Minotaur',
    'Mongrelman','Mushroom-Men','Ophidian','Orc','Rakshasa','Ratling','Sahuagin',
    'Salamander','Sorcerer Ox','Triton','Troglodyte']
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.monsterGen = function (opts) {
  //['animal','bug','beast','chimerae','human','humanoid','beastfolk',
  //  'giant-kin','unnatural','undead','fey','construct','fiend','elemental','dragon']
  var CLspan = {min:Number(opts.CL.min),max:Number(opts.CL.max)},
  CL = CPXC.natural(CLspan),
  M = CPX.SW[opts.type](CL);
  
  M.seed = opts.seed;
  M._id = opts.seed.join('');
  M.type = M.class.join(', ');
  
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//basic monster object
CPX.SW.MInit = function (opts) {
  var M={name:'',class:[],n:'solitary',size:'standard',move:'12',AL:'N',HD:1,CL:1,save:17,notes:'',special:'',mods:[]};
  M.AAC = CPXC.weighted([11,13,15,17],[1,5,5,1]);
  M.attacks = 'Strike ('+CPX.SW.attackGen(opts.CL,1)+')';
  
  for(var x in opts){
    M[x] = opts[x];
  }
  return M;
} 
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.number = function (){
  return CPXC.weighted(["solitary", "group", "horde"],[4,5,3]);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.size = function (CL){
  var size = CPXC.weighted(['tiny','small','standard'],[1,2,6]);  
  if(CL>5){
    size = CPXC.weighted(['tiny','small','standard','large','huge'],[1,2,6,2,1]);  
  }
  else if(CL>2){
    size = CPXC.weighted(['tiny','small','standard','large'],[1,2,6,2]);  
  }
  return size;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.animalGen = function(opts){
  opts = typeof opts === "undefined" ? {} : opts;
  var weight = typeof opts.weight === "undefined" ? 25 : opts.weight,
  n = typeof opts.n === "undefined" ? 1 : opts.n;
  
  var SWM = CPX.data.SWMonsters, terrain='', R = [], air=false; 
  for(var i=0; i<n; i++){
    //bug
    if(weight>0 && CPXC.bool({likeliehood:weight})){
      terrain = CPXC.weighted(SWM.bug[0],SWM.bug[1]);  
      R.push(CPXC.pickone(SWM[terrain]));
    }
    //animal
    else {
      terrain = CPXC.weighted(SWM.animal[0],SWM.animal[1]);
      R.push(CPXC.pickone(SWM[terrain]));
    }
    if(terrain.includes('air')){air=true;}
  }
  return [R,air];
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.attackGen = function(CL,n,str){
  //relative attack strength
  str = typeof str === "undefined" ? CPXC.natural({min:0,max:2}) : str;
  
  var dice = [
    ['1d3','1d4','1d6'],
    ['1d6','1d8','1d10'],
    ['1d10','2d6','2d8-1'],
    ['2d8','3d6','2d10']
  ],
  rank = Math.floor(CL/5)+1, R = [];
  //max rank is 3
  if(rank == 4){rank = 3;}
  
  if(n==1){
    R[0] = dice[rank][str];
  }
  else if(n==2){
    if(str==0){  
      rank--; str = 2;
    }
    else {str--;}
    R[0] = dice[rank][str];
  }
  else if (n==3){
    if(str==0){  
      rank--; str = 2;
    }
    else {str--;}
    R[1] = dice[rank][str];
    if(rank==0){R[0] = dice[rank][0];}
    else{
      R[0] = dice[rank-1][str];
    }
  }
  else if (n==4){
    if(rank==3){rank == 2;}
    R[1] = dice[rank][str];
    R[0] = dice[rank-1][str];
    if(rank==1){
      R[0] = dice[rank][str];
    }
  }
  
  return R;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.modCheck = function (M,list){
  var mod = {};
  //loop through the list and find the mod that applies based on CL
  list.forEach(function(el) {
    if(M.CL>el.CL){ mod = el; }
  });
  //apply mods
  if(objExists(mod.modset)){ M.mods = mod.modset; }
  //push mods
  if(objExists(mod.modpush)){ M.mods = M.mods.concat(mod.modpush); }
  //pick mods
  if(objExists(mod.modpickn)){
    var mid = -1;
    for(var i=0;i<mod.modpickn;i++){
      //pick a random mod
      mid = CPXC.natural({min:0,max:mod.modpick.length-1});
      //push pick
      if(Array.isArray(mod.modpick[mid])){ M.mods = M.mods.concat(mod.modpick[mid]); } 
      else { M.mods.push(mod.modpick[mid]); } 
      //remove pick
      mod.modpick.splice(mid,1);
    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.dragon = function(CL){
  var nature = CPXC.pickone(['classic','elemental','beast']),
  PA = CPX.powerArray(['element','dragon']),
  QP = CPX.data.quickpowers,
  A = CPXC.pickone(['cone','line','cloud']),
  //init with basic dragon params
  M = CPX.SW.MInit({
    CL : CL,
    size : 'large',
    move : '9',
    class : ['dragon'],
    HD: CL,
    mods: [QP.fly(0),QP.armor(0)],
    element: CPX.gen.element(1),
    magic : CPX.gen.magic(2),
    attacks : CPX.SW.attackGen(CL,3)
  }),
  E = M.element, S = M.magic;

  //classic colors
  if(nature == 'classic'){ M.name = 'dragon' }
  //elemental
  else if (nature == 'elemental'){
    M.name = M.element + ' dragon';
  }
  //beast dragon 
  else {
    //animal hybrid
    var animal = CPX.SW.animalGen();
    //they are a dragon
    M.name = animal[0][0] + ' dragon';
  }
   
  //apply mods based on CL, greater than comparison
  CPX.SW.modCheck(M,[
    {CL:3,modset:[QP.fly(0),QP.armor(0),QP.BW(1,E,A)]},
    {CL:6,modset:[],modpickn:1,modpick:[
      [QP.BW(1,E,A),QP.MU(1,S),QP.armor(1),QP.fly(0)],
      [QP.BW(2,E,A),QP.armor(1),QP.fly(0)],
      [QP.fly(1),QP.armor(1),QP.BW(1,E,A)]]},
    {CL:9,modset:[QP.fly(1)],modpickn:1,modpick:[
      [QP.BW(2,E,A),QP.armor(1)],
      [QP.BW(1,E,A),QP.MU(1,S),QP.armor(1)],
      [QP.BW(1,E,A),QP.armor(2)]]}
  ]);
  
  //bigger is better
  if(M.HD>5){ M.size = 'huge'; }
  
  //attacks
  M.attacks = '2 claws ('+M.attacks[0]+'), bite ('+M.attacks[1]+')';
  
  //Run mods 
  CPX.SW.modFinal(M);

  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.undead = function(CL){
  //pick from classics
  var undead = ['Allip','Demiurge','Ghast','Ghoul','Haunt','Necrophidius','Shadow',
  'Skeleton','Spectre','Wight','Sea-Wight','Wraith','Zombie'];
  if(CL>3){ undead.push('Mohrg','Mummy','Vampire','Banshee','Ghost'); }
  if(CL>7){ undead.push('Lich'); }
  if(CL>10){ undead.push('Demi-Lich','Dracolich'); }
  //init with basic undead params
  var M = CPX.SW.MInit({
    name : CPXC.pickone(undead),
    CL : CL,
    class : ['undead'],
    HD: CL
  }),
  //pick mods
  UP = CPX.powerArray(['undead','combat']),
  QP = CPX.data.quickpowers;
  //remove undead from the UP
  UP.splice(UP.indexOf('undead'),1);
  //if a lich - get some magic
  if(/lich/i.test(M.name)){
    M.magic = ['necromancy'].concat(CPX.gen.magic(1));  
    CPX.SW.modCheck(M,[
      {CL:0,modset:[QP.undead(),QP.MU(2,M.magic),{id:CPXC.pickone(UP),rank:1}]},
      {CL:13,modset:[QP.undead(),QP.armor(1),QP.MU(3,M.magic),{id:CPXC.pickone(UP),rank:1}]},
    ]);  
  }
  else{
    //apply mods based on CL, greater than comparison
    CPX.SW.modCheck(M,[
      {CL:0,modset:[QP.undead()]},
      {CL:3,modset:[QP.undead(),{id:CPXC.pickone(UP),rank:1}]},
      {CL:6,modset:[QP.undead()],modpickn:1,modpick:[
        {id:CPXC.pickone(UP),rank:1},
        [{id:CPXC.pickone(UP),rank:1},{id:CPXC.pickone(UP),rank:1}],
        {id:CPXC.pickone(UP),rank:2}]
      },
      {CL:9,modset:[QP.undead(),QP.armor(1)],modpickn:1,modpick:[
        {id:CPXC.pickone(UP),rank:1},
        [{id:CPXC.pickone(UP),rank:1},{id:CPXC.pickone(UP),rank:1}],
        {id:CPXC.pickone(UP),rank:2}]
      }
    ]);  
  }
  //if ghostly add ghost powers
  if(['Haunt','Shadow','Spectre','Banshee','Ghost'].includes(M.name)) {
    M.mods.push(QP.fly(0));
    if(CPXC.bool()) {M.mods.push({id:'intangible',rank:1});}
  }
  //50/50 two strikes instead of one
  if(CPXC.bool()){
    M.attacks = '2 strike ('+CPX.SW.attackGen(CL,2)+')';
  }
  //Run mods 
  CPX.SW.modFinal(M);
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.fiend = function(){
  //use beastfolk as a base
  var M = CPX.SW.beastfolk();
  //they are a fiend
  M.class = ['fiend'];
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.elemental = function(CL){
  //init with basic elemental params
  var M = CPX.SW.MInit({
    CL : CL,
    class : ['elemental'],
    HD: CL,
    element: CPX.gen.element(1)
  })
  
  //pick the form
  var form = CPXC.pickone(['human','humanoid','animal','bug','chimerae']);
  if(['human','humanoid'].includes(form)) { M.notes = 'Humanoid'; }
  else{
    if(['animal','bug'].includes(form)){
      form = CPX.SW.animalGen({weight:50});
      M.notes = form[0]+' like';
    }
    else {
      form = CPX.SW.animalGen({n:2});  
      M.notes = form[0].join('-')+' like';
    }
  }

  //name
  M.name = M.element + ' elemental';
  //attacks
  var natk = CPXC.natural({min:1,max:2}),
  atk = CPX.SW.attackGen(CL,natk);
  if(natk==1){
    M.attacks = 'Slam ('+atk[0]+')';  
  }
  else {
    M.attacks = '2 slams ('+atk[0]+')';  
  }
  
  //Run mods 
  CPX.SW.modFinal(M);
  
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.construct = function(CL){
  //init with basic construct params
  var M = CPX.SW.MInit({
    CL : CL,
    move : '9',
    class : ['construct'],
    size: CPX.SW.size(CL),
    HD: CL
  })
  
  //pick the form
  var form = CPXC.pickone(['human','humanoid','animal','bug','chimerae']);
  if(['human','humanoid'].includes(form)) { M.notes = 'Humanoid'; }
  else{
    if(['animal','bug'].includes(form)){
      form = CPX.SW.animalGen({weight:50});
      M.notes = form[0]+' like';
    }
    else {
      form = CPX.SW.animalGen({n:2});  
      M.notes = form[0].join('-')+' like';
    }
  }
  
  var materials = ['iron','stone','wax','bone','wood','ice'];
  //name
  M.name = CPXC.pickone(materials) + ' golem';
  //attacks
  var natk = CPXC.natural({min:1,max:2}),
  atk = CPX.SW.attackGen(CL,natk);
  if(natk==1){
    M.attacks = 'Slam ('+atk[0]+')';  
  }
  else {
    M.attacks = '2 slams ('+atk[0]+')';  
  }
  
  //Run mods 
  CPX.SW.modFinal(M);
  
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW['giant-kin'] = function(){
  var M = {
    special:[],
    notes:''
  }
  //pick from classics
  if(CPXC.bool()){
    M.name = CPXC.pickone(CPX.data.SWMonsters['giant-kin']);
  }
  //build a new base
  else{
    var e = CPXC.pickone(CPX.data.SWMonsters.element);
    e = CPXC.pickone(e);
    M.name = e + ' giant';
  }
  //they are giant kin
  M.class= ['giant-kin'];
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.beastfolk = function(CL){
  //init with basic elemental params
  var M = CPX.SW.MInit({
    CL : CL,
    class : ['humanoid'],
    HD: CL,
    size : CPX.SW.size(CL),
    n: CPX.SW.number()
  })
  //select animals more than bugs
  var animal = CPX.SW.animalGen({weight:25});
  //set the name
  M.name=animal[0][0]+'-folk'

  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.humanoid = function(){
  var M = {
    name : CPXC.pickone(CPX.data.SWMonsters.humanoid),
    class: ['humanoid'],
    special:[],
    notes:'',
    prof: '',
    HD : CPXC.natural({min:1,max:2})
  }
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.human = function(){
  var M = {
    name : "Human",
    class: ['human'],
    special:[],
    notes:'',
    prof: '',
    size: 'standard',
    HD:1
  }
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.animal = function(CL){
  var animal = CPX.SW.animalGen({weight:0});
  //init with basic elemental params
  var M = CPX.SW.MInit({
    CL : CL,
    class : ['animal'],
    HD: CL,
    size : CPX.SW.size(CL),
    n: CPX.SW.number(),
    name: animal[0][0]
  })
  return M;  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.bug = function(){
  var SWM = CPX.data.SWMonsters;
  var M = {
    name : CPXC.pickone(SWM.bug),
    class: ['animal'],
    special:[],
    notes:''
  }
  CPX.SW.basicMonster(M);
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.beast = function (){
  var M={};
  //pick from classics
  if(CPXC.bool()){
    M = {
      name : CPXC.pickone(CPX.data.SWMonsters.beast),
      special:[],
      notes:''
    }
  }
  //build a new base
  else {
    //base creature
    if(CPXC.bool()){
      M = CPX.SW.chimerae(2);
    }
    else { 
      //select type
      type = CPXC.pickone(['animal','bug']);
      //push to array
      M = CPX.SW[type]();
    }  
  }
  
  M.class=['beast'];
  //set the basic nature
  CPX.SW.basicMonster(M);
  return M;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SW.chimerae = function (n){
  n = typeof n === 'undefined' ? CPXC.natural({min:2,max:3}) : n;
  //pick the number of beasts to mash together
  var C=[], type='';
  //make the mashup
  for(var i=0;i<n;i++){
    //select animals more than bugs
    type = CPXC.weighted(['animal','bug'],[2,1]);
    //push to array
    C.push(CPX.SW[type]());
  }
  //the moster is based on the first
  var M = C[0];
  //develop the name as a mashup
  if(C.length==2){
    M.name += '-'+C[1].name;
  }
  else{
    M.name += '-'+C[1].name+'-'+C[2].name;
  }
  //give it a physical feature
  var feature =  CPXC.pickone(CPX.data.SWMonsters.physicalfeatures);
  feature = CPXC.pickone(feature);
  if(feature =='oddity'){
    feature = CPX.DW.special('oddity').join(', ');
  }
  //put the feature in the notes
  M.notes = feature;
  //basic monster info
  CPX.SW.basicMonster(M);
  return M;
}
CPX.SW.unnatural = function(){
  ['Chull','Orb of Eyes','Mind Lord']
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//update stats based on mods
CPX.SW.modFinal = function(M){
  var mod={}, count0=0;
  
  M.mods.forEach(function(el,i) {
    //find the mod that matches id
    mod = CPX.data.powers.find(function(p){return p.id==el.id;});
    //get the text
    M.mods[i] = [el,CPX.powerText(el)];
    //adjust the HD accodingly
    M.HD -= el.rank;
    //count the rank 0 powers
    if(el.rank==0){count0++;}
    
    if(el.id == 'armor'){
      M.AAC = mod.AAC[el.rank];
    }
  });
  
  //reduce HD by 1 for every 3 rank 0 powers
  if(count0>3){ 
    var n = Math.floor(count0/3); 
    M.HD-=n; 
    count0 -= n*3;
  }
  if(count0>0 && count0%3 == 2){ M.HD--; }
  
  var HDsv = M.HD;
  if(M.HD < 0){ HDsv = 0; }
  //now set the save 
  if(M.HD>12){
    M.save = 3;
  }
  else {
    M.save = DATA.SWMonsters.saves[HDsv];
  }
  
  if(M.HD<1){
    //can't go lower
    if(M.HD<-1){M.HD=-1;}
    //set the HD
    var lowHD = ['1d6 hp','1d4 hp'];
    M.HD = lowHD[Math.abs(M.HD)];
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//main find function for SW monster DB
CPX.SW.mdbFind = function (query) {
  //return a promise because the search takes time
  return new Promise(function(resolve,reject){
    
    CPX.SW.monsterdb.find(query, function (err, docs) {
      resolve(docs);
    })
    
  })
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Basic XP calc for OSR/SW
CPX.SW.XPcalc = function (CL){
  if(CL == 'A'){
    return CPX.data.SWMonsters.xp[0];  
  }
  else if (CL == 'B'){
    return CPX.data.SWMonsters.xp[1];  
  }
  else {
    CL = Number(CL);
    if (CL < 16) {
      return CPX.data.SWMonsters.xp[CL+1];  
    }
    else {
      var lb = (CL - 15)*CPX.data.SWMonsters.xpbonus;
      return CPX.data.SWMonsters.xp[16] + lb;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-osm-short', { 
props: ['obj'],
template: '\
  <div class="content-minor"> <strong>{{obj.name | capitalize}}</strong> \
    <div>HD: {{obj.HD}}; AC {{DAC}} [{{obj.AAC}}]; Atk {{obj.attacks}}; Move {{obj.move}};\
     Save: {{obj.save}}; AL: {{obj.AL}}; CL/XP {{obj.CL}}/{{XP}}; Special: {{obj.special}}\
    </div>\
  </div>\
  ',
  computed: {
    DAC : function(){
      return 9-(Number(this.obj.AAC)-10);
    },
    XP : function(){
      return CPX.SW.XPcalc(this.obj.CL);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-OSM', { 
  props: ['obj'],
  template: '\
  <div class="content-minor">\
    <input class="form-control input-lg center" type="text" v-model="obj.name" placeholder="NAME">\
    <textarea class="form-control" type="textarea" v-model="obj.notes" placeholder="ADD NOTES"></textarea>\
    <div class="strong">Nature: {{nature | capitalize}}</div>\
    <div class="input-group" v-if="obj.n.length>0">\
       <span class="input-group-addon strong"># Appearing</span>\
       <select v-model="obj.n" class="form-control">\
         <option v-for="nid in n" v-bind:value="nid">{{nid}}</option>\
       </select>\
       <span class="input-group-addon strong">Size</span>\
       <select v-model="obj.size" class="form-control">\
         <option v-for="s in sizes" v-bind:value="s">{{s}}</option>\
       </select>\
    </div>\
    <div class="input-group">\
       <span class="input-group-addon strong">Alignment</span>\
       <input class="form-control center" type="text" v-model="obj.AL">\
       <span class="input-group-addon strong">CL</span>\
       <input class="form-control center" type="number" v-model="obj.CL">\
       <span class="input-group-addon strong">XP</span>\
       <span class="input-group-addon">{{XP}}</span>\
    </div>\
    <div class="input-group">\
       <span class="input-group-addon strong">HD</span>\
       <input class="form-control center" type="text" v-model="obj.HD">\
       <span class="input-group-addon strong">AAC</span>\
       <input class="form-control center" type="number" v-model="obj.AAC">\
       <span class="input-group-addon strong">DAC</span>\
       <span class="input-group-addon">{{DAC}}</span>\
    </div>\
    <div class="input-group">\
       <span class="input-group-addon strong">Move</span>\
       <input class="form-control center" type="text" v-model="obj.move">\
       <span class="input-group-addon strong">Save</span>\
       <input class="form-control center" type="number" v-model="obj.save">\
    </div>\
    <div class="input-group">\
       <span class="input-group-addon strong">Attacks</span>\
       <input class="form-control center" type="text" v-model="obj.attacks">\
    </div>\
    <div class="input-group" v-if="obj.special.length>0">\
       <span class="input-group-addon strong">Special</span>\
       <input class="form-control center" type="text" v-model="obj.special">\
    </div>\
    <div class="center" v-if="obj.mods.length>0">\
      <div class="header strong center">Mods \
        <button v-on:click="addmod" type="button" class="btn btn-xs">\
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>\
        </button>\
      </div>\
      <div class="input-group" v-for="item in obj.mods">\
        <input class="form-control center" type="text" v-model="item[1]">\
        <span class="input-group-btn">\
          <button v-on:click="remove($index)" type="button" class="btn">\
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
          </button>\
        </span>\
      </div>\
    </div>\
    <c-pnc-osm-short v-bind:obj="obj"></c-pnc-osm-short>\
  </div>\
  ',
  data: function() {
    return {
      sizes : ['tiny','small','standard','large','huge'],
      n : ['solitary','group','horde'],
    }
  },
  computed: {
    nature : function() {
      var A = [this.obj.type];
      if(objExists(this.obj.aspect)){ A = A.concat(this.obj.aspect); }
      if(objExists(this.obj.element)){ A = A.concat(this.obj.element); }
      if(objExists(this.obj.magic)){ A = A.concat(this.obj.magic); }
      
      return A.join(', ');
    },
    DAC : function(){
      return 9-(Number(this.obj.AAC)-10);
    },
    XP : function(){
      return CPX.SW.XPcalc(this.obj.CL);
    }
  },
  methods:{
    addmod: function (){
      this.obj.special.push('NEW');
    },
    remove : function(idx){
      this.obj.mods.splice(idx,1);      
    }
  }
})

/*
<select class="form-control center" v-for="omod in obj.mods" v-model="omod[1]">\
  <option v-for="mod in modlist" v-bind:value="mod[1]">{{mod[2]}}</option>\
</select>\
*/

