/* Version 1.0
 Added to main
*/

CPX.data.DWCREATURES = {
  beast : [["land","air","water"],[7,3,2]],
  land: ["termite","tick","snail","slug","worm","ant","centipede","scorpion","snake","lizard",
         "rat","weasel","boar","dog","fox","wolf","cat","lion","panther","deer","horse","ox",
         "rhino","bear","gorilla","ape","mammoth","dinosaur"],
  air : ["mosquito","firefly","locust","dragonfly","moth","bee","wasp","chicken","duck","goose",
         "jay","parrot","gull","pelican","crane","raven","falcon","eagle","owl","condor","pteranodon"],
  water : ["jellyfish","clam","eel","frog","fish","crab","lobster","turtle","alligator","shark",
           "squid","octopus","whale"],
  professions: ['Adventurer','Bandit','Berserker','Brigand','Merchant','Caveman','Guard',
  'Pilgrim','Priest','Wizard','Ranger','Mercenary'],
  humanoid: {
    common: [
      [['halfling'],['goblin','kobold'],['dwarf','gnome'],['orc','hobgoblin','gnoll'],
      ['half-elf','half-orc'],['elf']],
      [3,2,2,2,2,1]
    ],
    uncommon : [
      [['fey'],['catfolk','dogfolk'],['lizardfolk','merfolk','birdfolk'],['ogre','troll'],['cyclops','giant']],
      [1,2,3,3,2]
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
      [['slime','ooze'],['creation'],['beast','oddity'],['unnatural']],
      [3,3,3,3]
    ],
    legendary : [
      [['dragon'],['colossus'],['unusual','+huge'],['rare','+huge'],['dragon','beast'],['dragon','unusual'],['dragon','rare']],
      [1.5,1.5,3,3,1,1,1]
    ]
  },
  undead : [
    [["haunt","wisp"],["ghost",'spectre'],["banshee"],["wraith","wight"],["spirit lord",'spirit master'],["zombie","skeleton"]],
    [4,4,1,2,1,4]
  ],
  planar : [
    ["imp", "lesser elemental", "lesser horror", "greater elemental", "greater horror", "elemental lord"],
    [3,3,3,1,1,1]
  ],
  divine : [
    ["agent", "champion", "army", "avatar"], 
    [5,4,2,1]
  ]
}
CPX.data.DWSPECIAL = {
  ability : [
    ["bless","curse"],["entangle","snare"],["poison","disease"],["paralyze","petrify"],
    ["mimic","camouflage"],["seduce","hypnotize"],["dissolve","disintegrate"],["magic"],["drain life","drain magic"],
    ['immunity'],["control minds","read minds"]
  ],
  feature : [
    ['heavily armored'],['flying','winged'],["multiple heads","headless"],["many eyes","one eye"],
    ["many limbs","tail"],["tentacles"],["aspect"],["element"],["magic"],["oddity"],
    ['great strength'],['offense'],['defense'],['deftness'],['durability'],['trickery'],
    ['adaptation'],['divine favor']
  ],
  tag : [
    "amorphous",'cautious',"construct","devious","intelligent","magical","organized",
    "planar","stealthy","terrifying"
  ],
  aspect : CPX.data.aspect.concat(["element"]),
  oddity : [
    ['weird color','weird smell','weird sound'],['geometric'],['web','network','system'],['crystalline','glass-like'],
    ['fungal'],['gaseous','smokey'],['mirage','illusion'],['volcanic','explosive'],['magnetic','repellant'],
    ['devoid of life'],['unexpectedly alive']
  ],
  element : ["air","earth","fire","water","life","death"],
  magic : ["divination","enchantment","evocation","illusion","necromancy","summoning"],
}

CPX.DW.number = function (being,nid){
  if(typeof nid ==='undefined'){
    being.n = CPXC.weighted(["solitary", "group", "horde"],[4,5,3]); 
  }
  else {being.n=nid;} 
   
  if(being.n == 'solitary'){
    being.HP = 12;
    being.dmg = {d:10,b:0,p:0};
  }
  else if(being.n == 'group'){
    being.HP = 6;
    being.dmg = {d:8,b:0,p:0};
  }
  else {
    being.HP = 3;
    being.dmg = {d:6,b:0,p:0};
  }
}
CPX.DW.size = function (being,size){
  if(typeof size ==='undefined'){
    being.size = CPXC.weighted(['tiny','small','standard','large','huge'],[1,2,6,2,1]);  
  }
  else {being.size=size;} 
  
  if(being.size == 'tiny'){
    being.dmg.b-=2;
    being.range = 'hand';
  }
  else if(being.size == 'small'){
    being.range = 'close';
  }
  else if(being.size == 'standard'){
    being.range = 'close';
  }
  else if(being.size == 'large'){
    being.range = 'close, reach';
    being.HP +=4;
    being.dmg.b += 1;
  }
  else if(being.size == 'huge'){
    being.range = 'reach';
    being.HP +=8;
    being.dmg.b += 3;
  }
}
CPX.DW.beast = function (){
  var terrain = CPXC.weighted(CPX.data.DWCREATURES.beast[0],CPX.data.DWCREATURES.beast[1]);
  var beast = {
    name : CPXC.pickone(CPX.data.DWCREATURES[terrain]),
    class: ['beast'],
    special:[],
    notes:''
  }
  CPX.DW.number(beast);
  CPX.DW.size(beast);
  beast.armor = CPXC.weighted([0,1,2,3],[1,5,5,1]);
  return beast;
}
CPX.DW.human = function (){
  var prof = CPXC.pickone(CPX.data.DWCREATURES.professions);
  var human = {
    name : "Human " + prof,
    class: ['human'],
    special:[],
    notes:''
  }
  
  if (['Priest','Wizard'].includes(prof)){
    human.special = CPX.DW.special('magic');
  }
  
  CPX.DW.number(human);
  CPX.DW.size(human,'standard');
  human.armor = CPXC.weighted([0,1,2,3],[1,5,5,1]);
  
  return human;
}
CPX.DW.werefolk = function (){
  var were = CPX.DW.beast();
  were.name = 'Were-'+were.name;
  were.class.push('were','humanoid');
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
  folk.class.push('humanoid');
  return folk;
}
CPX.DW.humanoid = function (){
  var rarity = CPXC.weighted(['common','uncommon','hybrid'],[7,3,2]),
  type = CPXC.weighted(CPX.data.DWCREATURES.humanoid[rarity][0],CPX.data.DWCREATURES.humanoid[rarity][1]);
  type = CPXC.pickone(type);
  
  var H={special:[],notes:'',class:['humanoid']};
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
    CPX.DW.size(H,'small');
  }
  else if(['ogre','troll','cyclops','giant'].includes(type)){
    H.class.push('giant-kin');
    H.name = type;
    CPX.DW.number(H);
    CPX.DW.size(H,'large');
  }
  else if(type == 'fey'){
    H.class.push('fey');
    H.name = type;
    CPX.DW.number(H);
    CPX.DW.size(H,'tiny');
  }
  else {
    H.name = type;
    CPX.DW.number(H);
    CPX.DW.size(H,'standard');
  }
  
  H.armor = CPXC.weighted([0,1,2,3],[1,5,5,1]);
  CPX.DW.specialMod(H);
  return H;
}
CPX.DW.monster = function (rarity){
  if(typeof rarity === 'undefined'){
    rarity = CPXC.weighted(['unusual','rare','legendary'],[7,3,2]);  
  }
  
  var type = CPXC.weighted(CPX.data.DWCREATURES.monster[rarity][0],CPX.data.DWCREATURES.monster[rarity][1]);
  
  var M = {};
  if(['undead','unnatural'].includes(type[0])){
    M= CPX.DW[type[0]]();
  }
  else if(type[0] == 'beast') {
    M = CPX.DW.mosterBeast(type);
  }
  else if(type.includes('dragon')) {
    M = CPX.DW.dragon(type);
  }
  else if(type.includes('+huge')) {
    M = CPX.DW.monster(type[0]);
    CPX.DW.number(M,M.n);
    CPX.DW.size(M,'huge');
  }
  else if(type.includes('plant')) {
    M = {
      name: CPXC.pickone(type),
      special:CPX.DW.special('oddity'),
      notes:''
    }
    M.class = [M.name];
    CPX.DW.number(M);
    CPX.DW.size(M);
    M.armor = CPXC.weighted([0,1,2,3],[1,5,5,1]);
    CPX.DW.specialMod(M);
  }
  else if(type.includes('slime')) {
    M = {
      name: CPXC.pickone(type),
      special:['amorphous'],
      notes:''
    }
    M.class = [M.name];
    CPX.DW.number(M);
    CPX.DW.size(M);
    M.armor = CPXC.weighted([1,2,3,4],[1,5,5,1]);
    CPX.DW.specialMod(M);
  }
  else if(type[0]=='colossus'){
    M = CPX.DW.colossus();
  }
  else if(type[0]=='creation'){
    M = CPX.DW.creation();
  }
  
  return M;
}
CPX.DW.mosterBeast = function (type){
  var M= CPX.DW.beast();
  if(type[1]=='+huge'){
    M = CPX.DW.beast();
    CPX.DW.number(M,M.n);
    CPX.DW.size(M,'huge');
  }
  else if(type[1]=='beast'){
    var b2 = CPX.DW.beast();
    M.name += '-'+b2.name;
    M.special = M.special.concat(
      CPX.DW.special('feature')
    )
  }
  else {
    M.special = M.special.concat(
      CPX.DW.special(type[1])
    )
  }
  CPX.DW.specialMod(M);
  return M;
}
CPX.DW.chimerae = function (){
  return CPX.DW.mosterBeast(['beast','beast']); 
}
CPX.DW.colossus = function (){
  var ct = CPXC.weighted(['human','beast','humanoid'],[3,3,2]);
  var M = CPX.DW[ct]();
  M.name+= ' colossus'
  M.class.push('colossus');
  CPX.DW.number(M,'solitary');
  M.HP = 'X';
  M.dmg[0]=12;
  M.range = ['far'];
  M.armor = 'X';
  
  M.special = M.special.concat(
    CPX.DW.special('ability'),
    CPX.DW.special('aspect'),
    CPX.DW.special('element'),
    CPX.DW.special('feature')
  );
  CPX.DW.specialMod(M);
  return M;
}
CPX.DW.creation = function (){
  var ct = CPXC.weighted(['human','beast','humanoid'],[3,3,2]);
  var M = CPX.DW[ct]();
  M.name+= ' construct'
  M.class = ['construct'];
  CPX.DW.number(M);
  CPX.DW.size(M);
  M.special.push('construct');
  M.special = M.special.concat(
    CPX.DW.special('ability'),
    CPX.DW.special('feature')
  )
  M.armor = CPXC.weighted([1,2,3,4],[1,5,5,1]);
  CPX.DW.specialMod(M);
  return M;
}
CPX.DW.undead = function (type){
  if(typeof type ==='undefined'){
    type = CPXC.weighted(['human','humanoid','beast'],[2,1,1]);
  }
  
  var U = CPX.DW[type](),
  ut = CPXC.weighted(CPX.data.DWCREATURES.undead[0],CPX.data.DWCREATURES.undead[1]);
  
  U.name += " "+CPXC.pickone(ut);
  U.class.push('undead');
  U.special = U.special.concat(CPX.DW.special('ability'));
  U.armor = CPXC.weighted([1,2,3,4],[1,5,5,1]);
  
  CPX.DW.specialMod(U);
  return U;
}
CPX.DW.unnatural = function (type){
  if(typeof type ==='undefined'){
    type = CPXC.weighted(["undead", "planar", "divine"] , [8,3,1]);
  }
  
  var U = {
    special:[],
    class:[],
    notes:''
  }
  if(type=='undead'){
    U = CPX.DW.undead();
    U.special = U.special.concat(CPX.DW.special('feature'));
  }
  else {
    U.name = CPXC.weighted(CPX.data.DWCREATURES[type][0],CPX.data.DWCREATURES[type][1]);
    if(type == 'divine'){
      U.name= 'divine '+ U.name;
      U.class.push('divine');
      U.special = U.special.concat(
        CPX.DW.special('ability'),
        CPX.DW.special('aspect'),
        CPX.DW.special('element'),
        CPX.DW.special('feature'),
        CPX.DW.special('tag')
      );
    }
    else {
      U.class.push('planar');
      U.special = U.special.concat(
        CPX.DW.special('ability'),
        CPX.DW.special('element'),
        CPX.DW.special('feature'),
        CPX.DW.special('tag')
      );
    }
    
    CPX.DW.number(U);
    if(U.name.includes('army')){
      CPX.DW.number(U,'horde');
    }
    
    CPX.DW.size(U);
    if(U.name.includes('imp')){
      CPX.DW.number(U,U.n);
      CPX.DW.size(U,'tiny');
    }
    
    U.armor = CPXC.weighted([2,3,4,5],[1,5,5,1]);
  }

  CPX.DW.specialMod(U);
  return U;
}
CPX.DW.dragon = function (type){
  var D = {
    name : "Dragon",
    class:[],
    special:[],
    notes:''
  }
  
  if(type.length>1){
    if(['unusual','rare'].includes(type[1])){
      D = CPX.DW.monster(type[1]);
      D.name += ' dragon';
    }
    else {
      D = CPX.DW[type[1]]();
      D.name+= ' dragon';
    }
  }
  else {
    D.special = D.special.concat(
      CPX.DW.special('ability'),
      CPX.DW.special('feature')
    );
  }
  
  D.class.push('dragon');
  D.armor = CPXC.weighted([2,3,4,5],[1,5,5,1]);
  
  CPX.DW.number(D,'solitary');
  CPX.DW.size(D,'huge');
  
  D.special = D.special.concat(
    CPX.DW.special('element'),
    CPX.DW.special('magic')
  );
  
  CPX.DW.specialMod(D);
  return D;
}
CPX.DW.specialMod = function (being){
  being.special.forEach(function(el) {
    if(el=='heavily armored'){being.armor+=2;}
    if(el=='great strength'){
      being.dmg.b+=2;
      being.special.push('forceful');
    }
    if(el=='offense'){
      being.notes+='Use better of two damage rolls. ';
    }
    if(el=='defense'){being.armor+=1;}
    if(el=='deftness'){being.dmg[2]+=1;}
    if(el=='durability'){being.HP+=4;}
    if(el=='trickery'){
      being.special.push('stealthy');
      being.notes+='+1 tricky move. ';
    }
    if(el=='adaptation'){
      being.notes+='+1 special quality. ';
    }
    if(el=='divine favor'){
      being.special = being.special.concat(CPX.DW.special('magic'));
    }
    if(el.includes('magic')){
      being.notes+='+1 spell move. ';
    }
    if(el.includes('element')){
      being.notes+='+1 elemental move. ';
    }
  });
}
CPX.DW.special = function (type){
  var r2 = ['ability','feature','tag','aspect','oddity'];
  var allspecial = ['ability','feature','tag','aspect','oddity','element','magic'];
  
  var array = CPX.data.DWSPECIAL[type];
  var r = [CPXC.pickone(array)];
  if(r2.includes(type) && CPXC.bool({likelihood:100/12})) {
    r.push(CPXC.pickone(array));
  }
  
  r.forEach(function(el,i) {
    if(['ability','feature','aspect','oddity'].includes(type)){
      el = CPXC.pickone(el);
      r[i] = el;
    }
    
    //recursive
    if(allspecial.includes(el)){
      var sub = CPX.DW.special(el);
      r.splice(i,1);
      r = r.concat(sub);
    }
    
    if(['element','magic','aspect'].includes(type)) {
      r[i] = type+' ('+el+')';
    }
    else if(el=='immunity'){
      r[i] = el +' ('+CPXC.pickone(CPX.data.DWSPECIAL.element)+')';
    }
  });
  
  return r;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.DW.creature = function (){
  var type = CPXC.weighted(['beast','human','humanoid','monster'],[4,2,2,4]);
  return CPX.DW[type]();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.DW.beingGen = function (opts){ 
  var C = {}
  if(opts.type == 'dragon'){
    C = CPX.DW[opts.type](CPXC.pickone([['dragon'],['dragon','beast'],['dragon','unusual'],['dragon','rare']])); 
  }
  else {
    C = CPX.DW[opts.type]();
  }
  
  C.seed = opts.seed;
  C._id = C.seed.join('');
  return C;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-dwb-short', { 
props: ['obj'],
template: '\
  <div class="content-minor"> <strong>{{obj.name | capitalize}}</strong> \
    <div><strong>#: </strong>{{obj.n}}, <strong>Sz: </strong>{{obj.size}}, <span v-if="obj.special.length>0"><strong>Tags: </strong>\
      {{obj.special.join(`, `)}},</span> <strong>HP:</strong> {{obj.HP}}, <strong>Armor:</strong> {{obj.armor}}, \
      <strong>DMG:</strong> 1d{{obj.dmg.d}}<span v-if="obj.dmg.b>0">+{{obj.dmg.b}}</span>\
      <span v-if="obj.dmg.p>0"> Piercing {{obj.dmg.p}}</span> <strong>Rng: </strong>{{obj.range}}\
    </div>\
  </div>\
  '
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-DWB', { 
  props: ['obj'],
  template: '\
  <div class="content-minor">\
    <c-pnc-generic v-bind:obj="obj" hname="Tags"></c-pnc-generic>\
    <div class="input-group">\
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
       <span class="input-group-addon strong">HP</span>\
       <input class="form-control center" type="text" v-model="obj.HP">\
       <span class="input-group-addon strong">Armor</span>\
       <input class="form-control center" type="text" v-model="obj.armor">\
    </div>\
    <div class="content-minor">\
      <div class="header strong center">Damage</div>\
      <div class="input-group">\
        <span class="input-group-addon strong">Die</span>\
        <select v-model="obj.dmg.d" class="form-control">\
          <option v-for="d in dice" v-bind:value="d">1d{{d}}</option>\
        </select>\
        <span class="input-group-addon strong">+</span>\
        <input class="form-control" type="text" v-model="obj.dmg.b">\
      </div>\
      <div class="input-group">\
        <span class="input-group-addon strong">Piercing</span>\
        <input class="form-control center" type="number" v-model="obj.dmg.p">\
        <span class="input-group-addon strong">Range</span>\
        <input class="form-control center" type="text" v-model="obj.range">\
      </div>\
    </div>\
    <c-pnc-dwb-short v-bind:obj="obj"></c-pnc-dwb-short>\
  </div>\
  ',
  data: function() {
    return {
      sizes : ['tiny','small','standard','large','huge'],
      n : ['solitary','group','horde'],
      dice: [2,4,6,8,10,12]
    }
  },
  computed: {
  },
  methods:{
    addtag: function (){
      this.obj.special.push('NEW');
    },
    remove : function(idx){
      this.obj.special.splice(idx,1);      
    }
  }
})
