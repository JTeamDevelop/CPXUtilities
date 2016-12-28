function CPXPeople (seed){
  var P =this;
  
  this.id = seed;
  this.seed = seed;
  this.tiles = [];
  this.class = ['people'];
  
  this.RNG = new Chance(this.seed);
  
  this.name = CPXC.capitalize(this.RNG.word());
  this.rarity = CPX.gen.rarity(this.RNG);
  this.special = [];
  
  peoples = {
    human: function () { return 'human'; },
    humanoids: function  (r) { 
      var core = ['Dwarf','Elf','Gnome','Halfling'],
      common = ['Bugbear','Drow','Gnoll','Goblin','Hobgoblin','Kobold','Merman','Orc','Sahuagin'],
      uncommon = ['Azer','Centaur','Churr','Crab-folk','Duergar',
                 'Ettercap','Fungoid','Gargoyle','Margoyle','Grippli','Harpy',
                 'Minotaur','Mushroom-folk','Ophidian','Rat-folk','Salamander',
                 'Triton','Troglodyte','Mantis-folk','Formian'],
      type = '';
      
      if(r=='common') { 
        if(P.RNG.bool()) { type = P.RNG.pickone(core); }
        else { type = P.RNG.pickone(common); }
      }
      else { type = P.RNG.pickone(uncommon); }
      
      if(['Merman','Sahuagin','Crab-folk','Triton'].includes(type)) { P.special.push('water'); }
      if(['Gargoyle','Margoyle','Harpy'].includes(type)) { P.special.push('flight'); }
      if(['Dwarf','Gnome','Drow','Goblin','Kobold','Duergar','Minotaur','Formian'].includes(type)) { P.special.push('mountain'); }
      
      return type;
    },
    giants: function(r){
      var uncommon = ['Ettin','Ogre','Troll'];
      if(r=='uncommon') { 
        P.special.push('mountain');
        
        return P.RNG.pickone(uncommon); 
      }
      else if(r=='rare'){
        P.element = CPX.gen.element(1,P.RNG);
        P.special.push(CPX.elementType(P.element[0]));
        
        return P.RNG.weighted(['Giant','Ogre','Troll'],[50,25,25]);
      }
    },
    beastfolk: function () { 
      var form = CPX.SW.animalGen({RNG:P.RNG});
      if(form[1].includes('air')) { P.special.push('flight'); }
      if(form[1].includes('water')) { P.special.push('water'); }
      return form[0];
    },
    undead: function() {
      var form = ['ghost','ghoul','vampire','lich'];
      P.special.push('mountain');
      
      return P.RNG.pickone(form);
    },
    aberrant: function(r) {
      var rare = ['Aranea','Phase Spider','Doppelganger','Lamia','Naga','Illithid'],
      legendary = ['Beholder','Aboleth'],
      type ='';
      
      if(r=='rare'){ type = P.RNG.pickone(rare); }
      else { type = P.RNG.pickone(legendary); }
      
      if(['Aranea','Phase Spider','Naga'].includes(type)) { P.special.push('mountain'); }
      if(['Illithid','Beholder','Aboleth'].includes(type)) { P.special.push('water','mountain'); }
      
      return type;
    },
    outsider: function(r) {
      var rare = ['Couatl','Ki-rin','Marid','Dao','Djinni','Efreeti'],
      legendary = ['Aasimon','Archon','Eladrin','Guardinal','Slaad','Modron',"Tanar'ri",'Baatezu','Yugoloth'],
      type = '';
      
      if(r=='rare'){ type = P.RNG.pickone(rare); }
      else { type = P.RNG.pickone(legendary); }
      
      if(['Couatl','Ki-rin','Djinni'].includes(type)) { P.special.push('air'); }
      if(['Dao','Efreeti'].includes(type)) { P.special.push('mountain'); }
      if(type == 'Marid') { P.special.push('water'); }
      if(r!='rare') { P.special.push('water','air'); }
      
      return type;
    },
    elemental: function(r) {
      var n=1;
      
      if(r!='rare') { n =2; }

      P.element = CPX.gen.element(n,P.RNG);
      P.element.forEach(function(el) {
        P.special.push(CPX.elementType(el));  
      });    
      
      return P.element.join('-')+' elemental';
    },
    dragon: function(r) {
      var rare = ['drake','wyvern'],
      type = '', n=1;
      
      if(r=='rare') { 
        type = P.RNG.pickone(rare); 
      }
      else { 
        n = 2;
        type = 'dragon'; 
        if(r=='epic') { n=3; }
      }
      
      P.element = CPX.gen.element(n,P.RNG);
      P.element.forEach(function(el) {
        P.special.push(CPX.elementType(el));  
      });    
      
      return type;
    }
  }
  peopleRarity = {
    common: function() {
      return P.RNG.pickone([peoples.human,peoples.humanoids])('common');
    },
    uncommon: function () {
      function humanoids () { return peoples.humanoids('uncommon'); }
      function giants () { return peoples.giants('uncommon'); }
      function beastfolk () { return peoples.beastfolk()+'-folk'; }
      function lycanthrope () { return 'were'+peoples.beastfolk(); }
      function genasi () { 
        P.element = CPX.gen.element(1,P.RNG);
        P.element.forEach(function(el) {
          P.special.push(CPX.elementType(el));  
        });
        
        return peopleRarity.common() + ' genasi';
      }
          
      return P.RNG.pickone([beastfolk,genasi,lycanthrope,giants,humanoids])();
    },
    rare: function() {
      function undead(){ return peoples.undead('rare'); }
      function aberrant(){ return peoples.aberrant('rare'); }
      function giant(){ return peoples.giants('rare'); }
      function outsider(){ return peoples.outsider('rare'); }
      function elemental(){ return peoples.elemental('rare'); }
      function dragon(){ return peoples.dragon('rare'); }
      function construct(){ 
        var type = P.RNG.pickone(['golem','construct']);
        if(type == 'golem'){
          type = P.RNG.pickone('clay','iron','ice','stone','wax');
          type+= ' golem';
        }
        
        P.special.push('mountain');
        return type;        
      }
      function plant(){ 
        var type = P.RNG.pickone(['plant','fungus']);
        
        if(type=='plant') {
          if(P.RNG.bool()) { P.special.push('mountain'); }
          else { P.special.push('water'); }
        }
        else { P.special.push('mountain'); }
        
        return type+'-folk';
      }
       
      return P.RNG.pickone([undead,aberrant,giant,outsider,elemental,dragon,construct,plant])();
    },
    legendary: function () {
      function aberrant(){ return peoples.aberrant('legendary'); }
      function outsider(){ return peoples.outsider('legendary'); }
      function elemental(){ return peoples.elemental('legendary'); }
      function dragon(){ return peoples.dragon('legendary'); }
      function deity(){ 
        P.special.push('air','mountain','ice');
        return 'demigod'; 
      }
      
      return P.RNG.pickone([deity,dragon,aberrant,outsider,elemental])();
    },
    epic: function() {
      function outsider(){ return peoples.outsider('epic'); }
      function dragon(){ return peoples.dragon('epic'); }
      function deity(){ 
        P.special.push('air','mountain','ice');
        return 'deity';
      }
      
      return P.RNG.pickone([deity,dragon,outsider])();
    }
  }
  
  this.people = peopleRarity[this.rarity]();
  
  delete this.RNG;
}
CPXPeople.prototype.expandMultiply = function(){
  var mr = {
    common: 1,
    uncommon: 1.5,
    rare: 3,
    legendary: 6,
    epic: 10
  };
  
  return mr[this.rarity];
}
CPXPeople.prototype.tags = function(){
  var tag=[];
  if(objExists(this.elements)){
    this.elements.forEach(function(e) {
      tag.push('element ('+e+')');
    });
  }
  if(['flight','air'].findOne(this.special)){ tag.push('flying'); }
  if(this.special.includes('water')){tag.push('waterborn');}
  return tag;
}
CPXPeople.prototype.addTile = function(tile){
  //make sure doesn't exist already
  if(this.tileIDs().includes(tile.id)){ return; }
  //add if it doesn't exist
  this.tiles.push(tile); 
  //push to tile
  tile.addSpecial(this);
}
CPXPeople.prototype.tileIDs = function(){
  return this.tiles.map(function(el) { return el.id; });
}
/////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpxpeople', { 
  props:['wid','id'],
  template: '\
  <div class="content-minor center">\
    <strong>People: </strong>{{obj.name}} [{{obj.rarity}}, {{obj.people}}] \
    <span v-if="obj.tags().length>0">Tags: {{obj.tags().join(`, `)}}</span>\
  </div>\
  ',
  computed: {
    obj:function(){
      return CPXDB[this.wid].peoples[this.id]
    }
  }
})
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function CPXEmpire (seed,age){
  this.id = seed;
  this.seed = seed;
  this.class = ['empire'];
  this.ages=[age];
  this.events =['genesis'];
  this.capital = null;
  this.tiles = [];
  this.peoples = [];
  
  this.RNG = new Chance(this.seed);
  
  this.name = CPXC.capitalize(this.RNG.word());
  this.color = this.RNG.color({format: 'hex'});

  delete this.RNG;
}
CPXEmpire.prototype.expandMultiply = function(){
  var m=1;
  this.peoples.forEach(function(p) {
    if(p.expandMultiply()>m) { m = p.expandMultiply(); }
  });
  
  return m;
}
CPXEmpire.prototype.tileData = function(){
  var data = [];
  this.tiles.forEach(function(el) {
    data.push(el.coordinates);
  });
  return data;
}
CPXEmpire.prototype.removeTile = function(tile){
  if(this.tileIDs().includes(tile.id)){
    this.tiles.splice(this.tileIDs().indexOf(tile.id),1); 
    //remove from tile
    tile.removeSpecial(this);
  }
}
CPXEmpire.prototype.addTile = function(tile){
  //make sure doesn't exist already
  if(this.tileIDs().includes(tile.id)){ return; }
  //add if it doesn't exist
  this.tiles.push(tile); 
  //push to tile
  tile.addSpecial(this);
  //add people 
  this.peoples.forEach(function(ppl){
    ppl.addTile(tile);
  })
  //update people
  var E = this;
  tile.peoples().forEach(function(ppl) {
    E.addPeople(ppl);
  });
}
CPXEmpire.prototype.addPeople = function(people){
  //add if it doesn't exist
  if(!this.peopleIDs().includes(people.id)){
    this.peoples.push(people);
  }
}
CPXEmpire.prototype.peopleIDs = function(){
  return this.peoples.map(function(el) { return el.id; });
}
CPXEmpire.prototype.tileIDs = function(){
  return this.tiles.map(function(el) { return el.id; });
}
/////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpxempire', { 
  props:['wid','id'],
  template: '\
  <div class="content-minor center">\
    <strong>Empire: </strong>{{obj.name}}, \
    <em>People: </em><span v-for="ppl in obj.peoples">{{ppl.name}} [{{ppl.people}}] </span>\
  </div>\
  ',
  computed: {
    obj:function(){
      return CPXDB[this.wid].empires[this.id]
    }
  }
})
/////////////////////////////////////////////////////////////////////////////////
CPX.empireEvents = {
  start: function(map,age){ 
    var f='';
    //cycle through empires t determine if still remain
    for(var x in map.empires){
      if(['ruin','conversion'].findOne(map.empires[x].events)){continue;}
      //probability of things happening after the age
      f = map.RNG.weighted(age.events,age.eweight);
      CPX.empireEvents[f](map,map.empires[x],age.n);
    }
  },
  //the empire came to ruin
  ruin : function (map,E,age) { 
    E.events.push('ruin');
    //ruin 
    E.ruination = map.RNG.pickone(['disease','fammine','cival war','conquered','corruption']);
    E.ruins = [];
    for(var i=E.tiles.length-1;i>-1;i--){
      //50% chance of ruins remain
      if(map.RNG.bool() || E.tiles[i].id==E.capital.id) { E.ruins.push(E.tiles[i]); }
      //remove the empire
      E.removeTile(E.tiles[i]);
    }
  },
  //changes to a new empire
  conversion : function (map,E,age) {
    E.events.push('conversion');
    //empire id
    eid = map.RNG.string({length: 27, pool: base62});
    map.empires[eid] = new CPXEmpire(eid,age);
    map.empires[eid].capital = E.capital;
    
    for(var i=E.tiles.length-1;i>-1;i--){
      //add new empire
      map.empires[eid].addTile(E.tiles[i]);
      //remove the empire
      E.removeTile(E.tiles[i]);
    }
  },
  //two empires or maybe three, the first remains
  schism : function (map,E,age) {
    E.events.push('schism');
    //the empire remains
    E.ages.push(age);
    //new empires
    var n = map.RNG.pickone([1,1,2]), tile={}, newc=false;
    for(var i=0;i<n;i++){
      //empire id - new
      eid = map.RNG.string({length: 27, pool: base62});
      map.empires[eid] = new CPXEmpire(eid,age);
      //starting tile
      tile = map.RNG.pickone(E.tiles);
      //remove from old empre - add to new
      map.empires[eid].addTile(tile);
      map.empires[eid].capital = tile;
      //if it was old capital, need to pick new - wait until end
      if(tile.id == E.capital.id){ newc = true; }
    }
    //new capital
    if(newc){
      E.capital = map.RNG.pickone(E.tiles);
    }
  },
  //the empire gets smaller
  retract : function (map,E,age) {
    E.events.push('retractment');
    //the empire remains
    E.ages.push(age);
    //retractment amount
    var retractment = map.RNG.weighted([25,50,75],[20,60,20]);
    for(var i=E.tiles.length-1;i>-1;i--){
      //don't lose the capital
      if(E.tiles[i].id != E.capital.id){
        //lose tile based on retractment
        if(map.RNG.bool({likelihood:retractment})){
          E.removeTile(E.tiles[i]);
        }  
      }
    }
  },
  //the empire grows slowly
  growth : function (map,E,age) {
    E.events.push('growth');
    //the empire remains
    E.ages.push(age);
    //expand
    var n = map.RNG.natural({min:2,max:5});
    //loop to expand
    for(var i=0;i<n;i++){
      map.popExpand(E);
    }
  },
  //the empire experiences rapid growth
  expansion : function (map,E,age) {
    E.events.push('expansion');
    //the empire remains
    E.ages.push(age);
    //expand
    var n = map.RNG.natural({min:4,max:10});
    //loop to expand
    for(var i=0;i<n;i++){
      map.popExpand(E);
    }
  }
}
