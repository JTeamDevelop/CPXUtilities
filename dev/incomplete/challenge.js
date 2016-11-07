CPX.challenge = {};
CPX.challenge.treasure = function (unit,site,treasure) {
  var notice = CPX.unit.skillVal(unit,'Notice'),
  R = CPXC.rpg('2d6',{sum:true});
  
  function loot(){
    var gp = [260,390,780,1650,2400,3450,4650,6000,7800,10050,12750,16350,21000,27000,34800,45000,58500,75000,96000,123000,159000];
    var rank = site.parent[0].parent[0].level, ranki = RANKS.indexOf(rank),
    rlevel = CPXC.pickone([1,2,3,4,5]);
    rlevel+=5*ranki, treasure={};

    if(CPXC.bool()) { treasure=CPX.treasure.gear(gp[rlevel],'combat');}
    else { treasure=CPX.treasure.gear(gp[rlevel],'spellcaster');}
      
    site.parent[0].looted.push(site.id);
    CPX.mod.add(site.parent[0],['looted','addtoset',site.id]);
    var n = noty({layout:'center',type:'success',timeout: 3000,text: "You've found treasure! "+treasure.text});
    unit.coin+=treasure.T.coin;
    unit.inventory = unit.inventory.concat(treasure.T.items);
  }

  if(treasure.visible<1){
    if(R+notice >6){ loot(); }
  }
  else { loot(); }
}

CPX.challenge.hazard = function (unit,site,hazard) {
  var notice = CPX.unit.skillVal(unit,'Notice'),
  R = CPXC.rpg('2d6',{sum:true}), 
  rank = site.parent[0].parent[0].level, ranki = RANKS.indexOf(rank);
  
  function disarm () {
    site.parent[0].disarmed.push(site.id);
    CPX.mod.add(site.parent[0],['disarmed','addtoset',site.id]);
    var n = noty({layout:'center',type:'success',timeout: 1000,text: "You've found and disarmed a trap."});
  }
  function trigger () {
    var dmg = CPXC.d6()+(ranki*2);
    CPX.unit.change(unit,{'HP':-dmg});
    var n = noty({layout:'center',type:'error',timeout: 1000,text: "You've triggered a trap! You take "+dmg+" damage."});
    //now its disarmed...
    site.parent[0].disarmed.push(site.id);
    CPX.mod.add(site.parent[0],['disarmed','addtoset',site.id]);
  }
  
  if(R+notice > 6) {
    var burglary = CPX.unit.skillVal(unit,'Burglary'),
    crafts = CPX.unit.skillVal(unit,'Crafts'),
    bonus = crafts; 
    
    if(burglary>crafts) { bonus = burglary; }
    for(var i=0; i < ranki+1; i++) {
      R = CPXC.rpg('2d6',{sum:true});
      if(R+bonus < 7) { trigger(); return; }
    }
    disarm();
    return;
    
  }
  else { trigger(); return; }
}

CPX.challenge.lair = function (unit,site,lair) {
  var pop = objCopy(site.parent[0].parent[0].pop[lair.popid]),
  popmod = site.parent[0].parent[0].popmod[lair.popid],
  F = CPX.challenge.buildFight(pop);
  
  CPX.vue.fight.open({pop:pop,neutrals:[],foes:F,heroes:[CPXAU]},site);
}

CPX.challenge.buildFight = function (pop){
  var rank = 2*pop.rank+2, F=[], controllStunts = [], skills = {Fight:0,Athletics:0,Fortitude:0,Might:0,Will:0};
  foe = {
    name : pop.name,
    class: ['foe'],
    qty:1,
    rank: rank,
    skills: CPX.unit.minionSkills({skills:skills},rank),
    inventory:[
      {equipped:true, dmg:[rank-1],class:["weapon"]},
      {equipped: false, dmg:[rank-1,rank-1],class:["weapon","ranged"]},
      {equipped:true, armor:rank-1,class:["armor"]}
      ],
    special:[]   
  };
  
  var mtypes = {
    check : function (mfoe) {
      if(mfoe.inventory[2].armor<0) { mfoe.inventory[2].armor=0; }
      if(mfoe.skills.Fight<0) { mfoe.skills.Fight=0; }
      if(mfoe.skills.Fortitude<0) { mfoe.skills.Fortitude=0; }
    },
    blaster: function(mfoe) {
      mfoe.skills.Shoot = mfoe.rank;
      mfoe.inventory[2].armor-=2;
      mfoe.inventory[0].equipped=false;
      mfoe.inventory[1].equipped=true;
    },
    brute: function (mfoe) {
      mfoe.skills.Fortitude+=1+pop.rank;
      mfoe.skills.Might++;
    },
    contoller: function (mfoe) {
      mfoe.skills.Fight-=2;
      mfoe.special.push(CPXC.pickone(controllStunts));
    },
    soldier: function (mfoe) {
      mfoe.inventory[2].armor+=(1+pop.rank)*2;
    },
    skirmisher: function(mfoe) { 
      mfoe.skills.Fight++; 
      mfoe.inventory[0].dmg[0]++; 
    },
    stalker: function(mfoe) {
      mfoe.skills.Fortitude--;
      mfoe.inventory[2].armor-=1;
      mfoe.special.push('Hide','Backstab');
    }
  }

  function elite () {
    //["brute","blaster","skirmisher","soldier","stalker","controller"]
    var mfoe = objCopy(foe);
    mfoe.class.push('elite');
    mfoe.special = mfoe.special.concat(pop.special);
    //mfoe.nature = CPXC.pickone(SPECIALNATURE.nature);
    mfoe.nature = CPXC.pickone(["brute","blaster","skirmisher","soldier","stalker"]);
    mfoe.name+= mfoe.nature;
    mfoe.HP = 3;
    mfoe.maxHP = 3;

    if(CPXC.bool({likelihood:10})) { 
      mfoe.class.push("boss");  
      mfoe.rank+=2;
    }
    mfoe.skills = CPX.unit.minionSkills({skills:skills},mfoe.rank);

    mtypes[mfoe.nature](mfoe);
    mtypes.check(mfoe);

    F.push(mfoe);
  }
  function minion (){
    var mfoe = objCopy(foe), mrank = rank-1;
    mfoe.class.push('minion');
    mfoe.nature = CPXC.pickone(["brute","blaster","skirmisher","soldier"]);
    mfoe.name+= mfoe.nature;
    mfoe.HP = 1;
    mfoe.maxHP = 1;
    
    mfoe.rank=mrank;
    mfoe.dmg = [mrank,mrank];
    mfoe.skills = CPX.unit.minionSkills({skills:skills},mfoe.rank);

    mtypes[mfoe.nature](mfoe);
    mtypes.check(mfoe);
    F.push(mfoe);
  }
  function mob(){
    var mfoe = objCopy(foe);
    mfoe.class.push('mob');
    mfoe.name+= 'mob';
    mfoe.qty=6;
    mfoe.HP = 3;
    mfoe.maxHP = 3;
    F.push(mfoe);
  }

  //determine the nature of the encounter depending on the nappearing
  var DCB=CPXC.weighted([0,1,2,3],[10,20,50,20]);
  if(pop.nappearing == "horde") {
    E = [[[1,"mob"]],[[1,"mob"],['2d3',"rabble"]],[[1,"mob"],['1d3',"elite"]],[[1,"mob"],['2d3',"elite"]]][DCB]; 
  }
  else if(pop.nappearing == "group") { 
    E = [[['2d3',"rabble"]],[['2d3',"rabble"],['1d3',"elite"]],[['2d3',"elite"]],[['2d3',"rabble"],['2d3',"elite"]]][DCB]; 
  }
  else {
    totalHP = 2*(2+rank);
    foe.rank+=2;
    E = [[1,"elite"]]; 
  }  

  //setup the encounter by pushing foes to an array, either mobs or singles
  E.forEach(function(e){
    if(Number(e[0])==1) { eval(e[1])(); }
    else if (e[1]=="rabble") { for(var i=0;i<CPXC.diceSum(e[0]);i++) {minion();} }
    else { for(var i=0;i<CPXC.diceSum(e[0]);i++) {elite();} }
  }) 

  return F;
}