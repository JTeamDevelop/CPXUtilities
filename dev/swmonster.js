/* Version 0.5
  Core funcitonality for selecting monsters from the DB and saving them as new
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.data.SWMonsters = {
  saves: [18,17,16,14,13,12,11,9,8,6,5,4,3],
  xp: [5,10,15,30,60,120,240,400,600,800,1100,1400,1700,2000,2300,2600,2900],
  xpbonus: 300,
  mods: {
    0: [
      'Undead (subject to banishment but immune to sleep, charm, hold)',
      '-2 Attack bonus'
    ],
    1 : [
      '4+ attacks per round (minimum d6 or saving throw each)',
      'AC 0 [19] or better',
      'Automatic damage after hit',
      'Breath weapon 25 points max or below',
      'Disease',
      'Flies', 
      'Breathes water',
      'Greater than human intelligence',
      'Immune to blunt/piercing weapons',
      'Half damage from blunt/piercing weapons',
      'Immune',
      'Immune to non-magic weapons',
      'Magic resistance 50% or below',
      'Massive attack for 20+ hps',
      'Paralysis', 
      'Swallows whole',
      'Immobilizes enemies',
      'Regenerates',
      'Uses multiple spells level 2 or lower',
      'Poison (Nonlethal)',
      '+2 Attack bonus',
    ],
    2: [
      'Breath Weapon 26 points max or more',
      'Drains level with save',
      'Magic resistance higher than 50%',
      'Petrifaction', 
      'Poison', 
      'Death magic',
      'Uses a spell-like power level 3 equivalent or above',
      'Uses multiple spells level 3 or above'
      
    ],
    3: [
      'Drains level with no save',
      'Uses multiple spells level 5 or above'
    ],
    bw: ['1d6','1d8','1d10','2d6','2d8','3d6','2d10','3d8','4d6'],
    bw2 : ['5d6','4d8','3d10','6d6']
  },
  CR: {
    A : [],
    B : [],
    C : [],
    1 : []
  },
  Animals : ['Gorilla','Baboon','Bears','Boars','Frogs','Lions','great cat','Lizards',
    'Snakes','Wolf','great dog'],
  Bugs : ['Ant','Beetle','Centipede','Scorpion','Spiders'],
  Dragon : [['Basilisk'],['Black Dragon','1d4'],['Black Dragon','2d4'],['Black Dragon','1d8'],['Blue Dragon','1d4'],
    ['Blue Dragon','2d4'],['Blue Dragon','1d8'],['Cockatrice'],['Green Dragon','1d4'],['Green Dragon','2d4'],
    ['Green Dragon','1d8'],['Hydra'],['Red Dragon','1d4'],['Red Dragon','2d4'],['Red Dragon','1d8'],['Wyvern']],
  'Flying' :['Chimerae','Djinni','efreet','Gargoyles','Griffons','Harpies','Hippogriffs','Manticores',
    'Normal Birds (flock)','Ogre Mage','Pegasi','Rocs','Stirges','Giant bat','Wyverns'],
  'Monsters' : ['Behir','Rhemoraz','Bulette'],
  'Aberrant' : ['Roper','Orb of Eyes','Aboleth'],
  'Humankind':['Adventurers','Bandits','Berserkers','Brigands','Caravan','Cavemen','Dwarves','Elves','Patrol',
    'Pilgrims','Priests of Chaos','Wizard'],
  'Chimerae': ['Cockatrice','Chimerae','Medusa','Minotaur','Owlbear','Purple Worm','Treant','Werebear','Wereboar',
    'Weretiger','Werewolve','Griffons','Harpies','Hippogriffs','Manticores'],
  'Were': ['Werebear','Wereboar','Weretiger','Werewolve'],
  'Swimming':['Crocodile, giant', 'Dragon Turtle', 'Fish, giant','Leeches, giant','Mermen','Nixie',
    'Octopus, giant','Sea Monster','Naga, water','Sea Serpent','Squid, giant'],
  'Undead':['Ghouls','Mummies','Skeletons','Spectres','Vampires','Wights','Wraiths','Zombies'],
  Humanoids: ['Kobolds','Goblins','Orcs','Bugbears','Gargoyles','Lizardmen','Hobgoblins','Gnolls','Ogres','Trolls'],
  'Giant-kin' : ['Ogres','Trolls','Giant, Hill','Giant, Cloud','Giant, Fire','Giant, Stone','Giant, Storm','Giant, Frost']
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
    <div class="strong">Nature: {{obj.type | capitalize}}</div>\
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
    <div class="input-group">\
       <span class="input-group-addon strong">Special</span>\
       <input class="form-control center" type="text" v-model="obj.special">\
    </div>\
    <c-pnc-osm-short v-bind:obj="obj"></c-pnc-osm-short>\
  </div>\
  ',
  data: function() {
    return {
    }
  },
  computed: {
    DAC : function(){
      return 9-(Number(this.obj.AAC)-10);
    },
    XP : function(){
      return CPX.SW.XPcalc(this.obj.CL);
    }
  },
  methods:{
  }
})

