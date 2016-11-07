///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('fight-view', '<div><h3 class="header center">{{header}}</h3></div>' +
    '<div class="content"><div>{{content}}</div>'+
    '<h3 class="center">Heroes</h3><div class="heroes">'+
    '<div v-for="h in heroes" track-by="$index">'+
    '<button class="btn btn-info btn-block btn-lg top-pad {{highlight(`h`,$index)}} {{istarget($index)}}" v-on:click="heroSelect($index)">{{h.name}} {{heroinfo($index)}}</button>'+
    '<div class="center heroFightActions" v-show="showAction == $index">'+
    '<button class="btn btn-info" v-for="act in actions[$index]" v-on:click="action(act)">{{act | capitalize}}</button>'+
    '<div>{{notes}}</div></div></div>' + 
    '</div><h3 class="center">Foes</h3><div>'+
    '<button class="btn btn-info btn-block btn-lg {{highlight(`f`,$index)}}" v-for="foe in foes" track-by="$index" v-if="foe.HP>0" v-on:click="foeSelect($index)">{{foe.name}} {{{hpstatus($index)}}}</button>'+
    '</div><div class="top-pad"><partial name="notify-close"></div></div>');
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.vue.fight = new Vue({
  el: '#fightView',
  data: {
    id: "",
    show: false,
    showClose: true,
    closeText:'Flee!',
    showAction:-1,
    header:'',
    content:'',
    notes:'',
    inMelee:[],
    pops:{},
    initiative:[],
    currentInit:0,
    foes: [],
    targets: [],
    targeting:-1,
    neutrals: [],
    heroes: [],
    actions:[],
    currentAction:'',
    support:[],
  },
  computed : {
    init: function(){ return this.initiative[this.currentInit]; }
  },
  methods : {
    action: function (type) {
      var unit = this.heroes[this.showAction];
      this.currentAction = type;
      
      if(['fight','shoot'].includes(type)) { this.notes = 'Now select a foe to attack.'; }
      else if(['defend','support'].includes(type)) { 
        this.notes = 'Select a friendly unit to '+type+'.'; 
      }
      else if (type=='wait') {
        if(this.currentInit+1==this.initiative.length) {
          var n = noty({layout:'center',type:'warning',timeout: 1000,text: "They cannot wait - they are the last to act."});  
        }
        else {
          this.initiative.splice(this.currentInit,1);
          this.initiative.push(['h',this.showAction]);    
          this.checkAction();  
        }
      }
    },
    foeSelect: function(idx){
      if(this.currentAction=='fight'){
        CPX.fight.inMelee(this.showAction,idx);
        CPX.fight.attack(this.heroes[this.showAction],this.foes[idx]);
        this.currentInit++;
        this.checkAction(); 
      }
    },
    foeAttack: function(idx){
      var foe = this.foes[idx];
      this.targeting = this.targets[idx];
      if(foe.nature == 'blaster' || foe.special.includes('blast')) { 
        //CPX.fight.shoot(foe,this.heroes[this.targeting]); 
      }
      else if (foe.nature == 'controller') { 
        //CPX.fight.inflict(foe,this.heroes[this.targeting]); 
      }
      else { CPX.fight.attack(foe,this.heroes[this.targeting]); }
    },
    heroSelect: function(idx){
      if(['defend','support'].includes(this.currentAction)){
        this.support[idx].push([this.currentAction,this.showAction]);
        this.currentInit++;
        this.checkAction(); 
      }
    },
    checkAction: function () {
      var VU=this;
      this.currentAction = '';
      this.notes = '';
      if(this.currentInit>=this.initiative.length) {
        this.support = [];
        this.currentInit=0;
      }

      if(this.init[0]=='h') { 
        this.targeting = -1;
        this.showAction = this.init[1]; 
      }
      else {
        this.showAction = -1;
        //check if still alive
        if(this.foes[VU.init[1]].HP>0) {
          this.foeAttack(VU.init[1]);  
        }
        setTimeout(function(){ 
          VU.currentInit++;
          VU.checkAction();
        }, 2000);
      }
    },
    heroinfo : function(idx) {
      var text = '';
      return text;
    },
    istarget: function(idx){
      if(this.targeting==idx) { return 'unit-target'; }
      return '';
    },
    highlight: function(type,idx){
      if(this.init[0]==type && this.init[1]==idx) { return 'unit-highlight'; }
      return '';
    },
    hpstatus : function(idx){
      var hp = this.foes[idx].maxHP/this.foes[idx].HP, status='';
      if(hp>0.66){status = 'full';}
      else if(hp>0.33){status = 'mid';}
      else {status = 'low';}
      return '<div class="HP hp-'+status+'"></div>';
    },
    close : function(){
      this.show = false;
      this.foes = [];
      this.heroes= [];
    },
    open: function(forces,site){
      this.heroes = [];
      var VU=this, i=0;
      this.header='Fight';
      this.foes = forces.foes.concat([]);
      this.neutrals = forces.neutrals.concat([]);

      forces.heroes.forEach(function(el,idx){
        VU.showAction[i] = false;
        VU.heroes.push(el);
        VU.actions[i] = CPX.unit.actions('fight',el);
        VU.support[i] = [];

        el.recruits.forEach(function(r){
          if(!r.independent) {
            if(r.class.includes('combatant') || r.special.includes('combatant')){
              i++;
              VU.heroes.push(r);
              VU.actions[i] = CPX.unit.actions('fight',r);
              VU.support[i] = [];
            }
          }
        })
        i++;
      })

      //set initial targets
      this.foes.forEach(function(el,idx){
        VU.targets[idx] = CPXC.natural({min:0,max:VU.heroes.length-1});
      });

      this.foes.forEach(function(el,idx){ VU.initiative.push(['f',idx]); })
      this.neutrals.forEach(function(el,idx){ VU.initiative.push(['n',idx]); })
      this.heroes.forEach(function(el,idx){ VU.initiative.push(['h',idx]); })
      this.initiative = CPXC.shuffle(this.initiative);
      this.currentInit = 0;
       
      this.show = true;
      this.checkAction();
    }
  }            
})

CPX.fight = {}
CPX.fight.support = function (hidx){
  var VU = CPX.vue.fight, support = false, defenders=[],
  hsupport = VU.support[hidx];

  hsupport.forEach(function(el){
    if(el[0]=='support') { support = true; }
    else if(el[0]=='defend') { defenders.push(VU.heroes[el[1]]); }
  })
  return {support:support,defenders:defenders};
}
CPX.fight.applyHeroDamage = function (hero,defenders,dmg){
  var armor = 0;
  //if defenders select a random one
  if(defenders.length>0) {
    var unit = CPXC.pickone(defenders);
    armor = CPX.unit.armorVal(unit);
    if(dmg>armor) { CPX.unit.change(unit,{'HP':-(dmg-armor)}); }
  }
  else { 
    armor = CPX.unit.armorVal(hero);
    if(dmg>armor) { CPX.unit.change(hero,{'HP':-(dmg-armor)}); }
  }
}
CPX.fight.applyFoeDamage = function (foe,dmg){
  var VU = CPX.vue.fight;
  if(dmg>foe.armor) { foe.HP-= (dmg-foe.armor); }
  if(foe.HP < 0){
    var remainder = -foe.HP, i=0, newfoe={};
    foe.HP = 0;
    //loop through looking for minions to soak damage
    VU.foes.forEach(function(el){
      if(el.class.includes('minion') && el.HP>0){
        if(remainder>el.armor) {
          remainder-=el.armor;
          if(remainder>el.HP) { el.HP = 0; remainder-=el.HP }
          else { el.HP-= remainder; remainder = 0;}
        }
      }
    })
  }
}
CPX.fight.inflict = function (foe,hero){
  var VU = CPX.vue.fight,
  lore = CPX.unit.skillVal(foe,'Lore'),
  stunt = {};
  
  foe.special.forEach(function(el) {
    if(objExistes(STUNTS[el])) {
      if(objExistes(STUNTS[el].condition)) { stunt = STUNTS[el]; }
    }  
  });
  
  var defense = CPX.unit.skillVal(foe,stunt.defense),
  R = CPXC.dF(), T=R+defense-lore;
  
  //suffer condition
  if(T<0){
    unit.condition.push([stunt.condition,1]);
    //TODO - select new target
  }
}
CPX.fight.shoot = function (attacker,target){
  var VU = CPX.vue.fight,
  shoot = CPX.unit.skillVal(attacker,'Shoot'),
  athletics = CPX.unit.skillVal(target,'Athletics'),
  R = CPXC.dF(), T=0, support={};
  
  if(attacker.class.includes('foe')){
    T=R+athletics-shoot;
    
    //unit damage
    if(T<0){
      support = CPX.fight.support(VU.targeting);
      CPX.fight.applyHeroDamage(target,support.defenders,attacker.dmg);
    }
  }
  else {
    var herodmg = CPX.unit.damageVal(hero);
    support = CPX.fight.support(VU.showAction);
    T=R+shoot-athletics;
    if(support.support) {herodmg++;}
    
    if(T<0){
      //TODO use ammo 
    }
    else if (T<2) {  
      //damage and TODO use ammo
      CPX.fight.applyFoeDamage(target,herodmg);
    }
    //just damage
    else if (T<4) { CPX.fight.applyFoeDamage(target,herodmg); }
    else { CPX.fight.applyFoeDamage(target,herodmg+1); }
  }
}
CPX.fight.inMelee = function (hidx,fidx) {
  var VU = CPX.vue.fight, inMelee= VU.inMelee, hid='h'+hidx, fid='f'+fidx, fmid=-1, hmid=-1, n=0;
  if(inMelee.length<0){
    inMelee.push([hid,fid]);
    n=1;
  }
  else {
    inMelee.forEach(function(el,idx){
      if(el.includes(fid)){ fmid = idx; }
      if(el.includes(hid)){ 
        hmid = idx; 
        inMelee[idx].slice(inMelee[idx].indexOf(hid),1);
      }
    })
    if(fmid==-1) { 
      inMelee.push([hid,fid]);   
      n = 1;
    }
    else {
      inMelee[fmid].push(hid);
      inMelee[fmid].forEach(function(cel){
        if(cel[0]=='h') { n++; }
      })
    }
  }
  return n;
}
CPX.fight.attack = function (attacker,defender) {
  var VU = CPX.vue.fight,
  fight = CPX.unit.skillVal(attacker,'Fight'),
  parry = CPX.unit.parry(defender),
  //-1 to adjust for 0 index 
  R = CPXC.diceEx(DIERANKS[fight-1]);

  //damage done
  if(R>parry) {
    var dmg =  CPX.unit.damage(attacker),
    armor = CPX.unit.armor(defender);
    
    //increase damage due to good roll
    if(R>parry+4) {dmg.push('1d6');}
    //damage roll, and Total after subtracting Fort and armor
    var DR = CPXC.diceEx(dmg), T=DR-(armor.f+armor.arm);
    //if total greater than 0 damage is done
    if(T > 0) {
      //damage is 1 plus one for every 4 over
      var d = 1+Math.floor(T/4);
      if(defender.class.includes('foe')) { defender.HP-=d; }
      else { CPX.unit.change(defender,{HP:-d}); }
    }
  }
}