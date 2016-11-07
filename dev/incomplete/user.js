///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.vue.AU = new Vue({
  el: '#title',
  data: {
    ready:false,
    _id: "",
    name: "",
    HP : 0,
    maxHP: 0,
    XP:0,
    XPFree: 0, 
    AP:0,
    coin: 0,
    location:[]
  },
  computed:{
    AUdata: function() {
      var realmName = '<h2 class="center header">'+CPXDB[this.location[0]].name+'</h2>';
      var unitdata = '<h3 class="center header">'+this.name+" HP "+this.HP+" AP "+Math.floor(this.AP)+'</h3>';
      return realmName+unitdata;
    }
  },
  methods: {
    showVue: function(unit) {
      for (var x in CPX.hero.model){
        if(objExists(this[x])){
          if(x=="location") {this[x] = unit[x].concat([]); }
          else {this[x] = unit[x]; }
        }
      }
      this.ready = true;
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.user.addRealm = function (realmid) {
  if(!objExists(USER[realmid])) {
    USER[realmid] = {};

    CPX.save.user();
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit = function (opts) {
  var uobj = {
    class : ["unit"]
  }
}
CPX.unit.array = function () {
  var A = [];
  for(var x in CPXUNITS){
    A.push(CPXUNITS[x]);
  }
  return A;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.actions = function (type,unit) {
  var actions = [];
  if(type=="fight"){
    if(unit.class.includes('hero')){
      var weapon = unit.inventory.find(function (el){ return el.equipped && el.class.includes('weapon'); })
      if(objExists(weapon)) {
        if(weapon.class.includes('ranged')){actions.push("shoot"); }  
        actions.push("fight");
      }
    }
    else if (unit.class.includes('minion')){
      actions.push("fight");
      if(unit.special.includes('Shoot')) { actions.push('Shoot'); }  
    }
    actions.push('defend','wait');
  }
  return actions;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.move = function (unit,to) {
  //update the unit location
  unit.location = to.concat([]);
  CPX.save.unit(unit);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.minionSkills = function (base,rank) {
  var skills = {};
  for (var x in base.skills){
    skills[x] = base.skills[x]+rank;
    if(skills[x]<0) { skills[x] = 0}
  }
  return skills;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.buy = function (unit,cost,type) {
  //reduce coin
  unit.coin-=cost;

  var item={};
  if(type=="store"){
    for(var x in CPXTEMP.store){
      if(CPXTEMP.store[x].qty>0){
        if(objExists(GEAR[CPXTEMP.store[x].id])){
          item = objCopy(GEAR[CPXTEMP.store[x].id]);
          item.template=item.id;
          item.name=item.id;
          delete item.id;

          item.qty = CPXTEMP.store[x].qty;
          item.equipped = false;
          unit.inventory.push(item);    
        }
      }
    }
  }
  else if(type="recruit"){
    //new recruits
    for(var x in CPXTEMP.recruit){
      CPX.unit.addRecruit(unit,CPXTEMP.recruit[x]);
    }
  }
  CPX.save.unit(unit);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.addRecruit = function (unit,recruit){
  //only if qty is greater than 0
  if(recruit.qty>0){
    //if the recruit exists in the minions list
    if(objExists(MINIONS[recruit.id])){
      //copy the object to mod
      var item = objCopy(MINIONS[recruit.id]);
      //set the template & name equals the id, remove id
      item.template=item.id;
      item.name=item.id;
      item.id = '';
      //set skills
      item.rank = recruit.rank;
      item.skills = CPX.unit.minionSkills(MINIONS[recruit.id],recruit.rank);
      //add minion class
      item.class.push('minion');
      //set HP - 1 for a minion
      item.maxHP = 1;
      item.HP = 1;
      //initially not independent from hero. No conditions     
      item.independent = false;
      item.conditions = [];
      //set the quantity - total qty will be pushed to the array
      item.qty = 1;
      for(var i=0;i<recruit.qty;i++) { unit.recruits.push(item); }     
    }
    CPX.save.unit(unit);
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.refreshAP = function (unit){
  if(unit.AP<30) { unit.AP+=30; }
  unit.recruits.forEach(function(el){
    if(el.independent) { 
      if(el.AP<30) {el.AP+=30; }
    }  
  })
  CPX.save.unit(unit);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.fullHP = function (unit){
  unit.HP=unit.maxHP;
  CPX.save.unit(unit);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.newHD = function (unit){
  var nmax = 6+CPXC.rpg((unit.HD-1)+'d6', {sum: true})+unit.HD*CPX.unit.skillVal(unit,'Physique');
  if(nmax > unit.maxHP) { unit.maxHP = nmax; }
  return
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.moveSpeed = function (unit){
  var speed = unit.speed;
  //find the slowest speed of the party
  unit.recruits.forEach(function(el){
    if(!el.independent){}
  });
  return speed;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//changes is an object full of keys to modify
CPX.unit.change = function (unit,changes){
  for (var x in changes){
    unit[x] += changes[x];  
    if(unit.HP<0) {
      //kill hero
    }
  }
  //only save heroes;
  if(unit.class.includes('hero')) { CPX.save.unit(unit); }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.damage = function (unit){
  var might = (objExists(unit.skills.Might)) ? unit.skills.Might-1 : 0;

  var d=[], weapon={dmg:['1d4'],class:[]};
  if(unit.class.findOne(['hero','foe'])){
    unit.inventory.forEach(function (el){ if(el.equipped && el.class.includes('weapon')) { weapon = objCopy(el); } })

    if(unit.class.includes('foe')){
      var fdmg = [];
      weapon.dmg.forEach(function(el){
        fdmg = fdmg.concat(DIERANKS[el]);
      })
      weapon.dmg = fdmg; 
    }
  }
  //if minion calculate differently
  else if (unit.class.includes('minion')){
    unit.inventory.forEach(function(el){
      if(objExists(GEAR[el])) {
        if(GEAR[el].class.includes('weapon')) { weapon=GEAR[el]; }
      }    
    })  
  }

  if(weapon.class.includes('ranged')) { d = weapon.dmg; }
  else { d = [].concat(DIERANKS[might],weapon.dmg); }
  
  return d;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.parry = function (unit){
  var fight = (objExists(unit.skills.Fight)) ? unit.skills.Fight : 1;
  var p = 3+fight;

  return p;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.dodge = function (unit){
  var athletics = (objExists(unit.skills.Athletics)) ? unit.skills.Athletics : 1;
  var a = 3+athletics;

  return a;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.armor = function (unit){
  var fort = (objExists(unit.skills.Fortitude)) ? unit.skills.Fortitude : 1;

  var f=3+fort, armor={armor:0};
  if(unit.class.findOne(['hero','foe'])){
    unit.inventory.forEach(function (el){ if(el.equipped && el.class.includes('armor')) { armor = el; } })
  }
  //if minion calculate differently
  else if (unit.class.includes('minion')){
    unit.inventory.forEach(function(el){
      if(objExists(GEAR[el])) {
        if(GEAR[el].class.includes('armor')) { armor = GEAR[el]; }
      }
    })  
  }
  return {f:f,arm:armor.armor};
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.unit.skillVal = function (unit,skill){
  var v=0, fight = CPX.vue.fight.show;

  function recruitBonus(){
    unit.recruits.forEach(function(el){
      //if the recruit has the skill - the unit gets a bonus
      if(objExists(el.skills[skill])) {  
        //if the recruit rank is greater than the hero's use the minions'
        if(el.skills[skill]>=v) { v=el.skills[skill]+1; }
        //otherwise increas the hero value by one
        else { v++; }
      }
    })
  }

  //skills - go backwards for vue use - epic,legendary,master,expert,professional,trained,untrianed,liability
  if(objExists(unit.skills[skill])) { v= unit.skills[skill]; }
  //if foe check for qty
  if (unit.class.includes('foe')){
    if(unit.qty>1) { 
      if(unit.qty >4) {v+=4;}
      else {v+=unit.qty;}
    }
  }
  //check if there are recruits to support the unit
  if (!fight) { recruitBonus(); }
  
  return v;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hero = function (opts) {
  var hero = objCopy(CPX.hero.model);
  hero._id = CPXC.guid();
  hero.class = ["hero","unit"];
  hero.skills = {Athletics:1,Lore:1,Physique:1,Will:1};
  hero.HP = 3;
  hero.maxHP = 3;
  hero.XP = -50;
  hero.XPFree = 50;
  hero.AP = 30;
  hero.coin = 50;
  hero.speed=30;

  CPXUNITS[hero._id] = hero;
  CPX.save.unit(hero);
  return CPXUNITS[hero._id];
}
CPX.hero.model = {
  _id: "",
  class: [],
  name: "",
  speed:0,
  HP : 0,
  maxHP : 0,
  XP:0,
  XPFree:0,
  AP:0,
  coin: 0,
  conditions:[],
  recruits: [],
  inventory: [],
  location : [],
  aspects : [],
  skills : {},
  stunts : []
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.optionList = function (list) {
  var R = "";
  list.forEach(function (L) {
    R+=CPX.option(L);
  });
  return R;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.clearAllData = function (event) {
  var content = '<div data-role="header"><h1>Destroy All Data</h1></div>';
  content += "<div class=content>This will delete all the data! You will have to start over. Are you sure?</div>";

  var buttons = [
    {text:"Yes",id:"destroyAll",classes:["red"],style:"inline"},
    {text:"No",classes:["green","closeDialog"],data:[["id","confirm"]],style:"inline"}
  ]
  content += '<div class=center>'+CPX.optionList(buttons)+'</div>';

  $("#confirm").html(content);
  $("#confirm").enhanceWithin();
  $( "#confirm" ).popup();
  $( "#confirm" ).popup("open",{positionTo: "window"} );

  $('#destroyAll').on('click',function() {
    localStorage.clear();
    $( "#confirm" ).popup( "destroy" );
  });

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

