const SKILLS = ["Athletics", "Burglary", "Contacts", "Crafts", "Deceive", "Drive", "Empathy", "Fight", "Fortitude", "Investigate",
  "Lore","Might", "Notice", "Provoke", "Rapport", "Resources", "Shoot", "Stealth", "Will"];
const COLORLIST = ['red','orange','yellow','green','blue','indigo'];
const COLORS = {
  red:{rgba:"rgba(255,0,0,1)", element:["stength","mighty","fire","sun","war","force","spirit"]},
  orange:{rgba:"rgba(255,165,0,1)",element:["constitution","subtle","earth","healing","night","fertility","animal"]},
  yellow:{rgba:"rgba(255,255,0,1)",element:["dexterity","quick","weather","lightning","time","travel","wealth"]},
  green:{rgba:"rgba(0,128,0,1)",element:["intelligence","clever","air","knowledge","artifice","magic","winter"]},
  blue:{rgba:"rgba(0,0,255,1)",element:["wisdom","wise","water","mind","righteousness","law","protection"]},
  indigo:{rgba:"rgba(75,0,130,1)",element:["charisma","bold","charm","community","glory","luck","nobility"]}
};
const LEVELS = [
  {XP:0,aspects:2,stunts:2,skills:[2]},
  {XP:30,aspects:3,stunts:3,skills:[3]},
  {XP:60,aspects:3,stunts:3,skills:[2,2]},
  {XP:90,aspects:4,stunts:4,skills:[4,2]},
  {XP:140,aspects:4,stunts:5,skills:[4,2,1]},
  {XP:190,aspects:5,stunts:5,skills:[4,3,2]},
  {XP:250,aspects:5,stunts:6,skills:[4,3,2,1]},
  {XP:310,aspects:6,stunts:7,skills:[4,4,3,1]},
  {XP:400,aspects:6,stunts:7,skills:[3,4,3,2,1]},
  {XP:490,aspects:7,stunts:8,skills:[3,4,4,2,2]},
  {XP:590,aspects:7,stunts:9,skills:[1,4,4,3,2,1]},
  {XP:690,aspects:8,stunts:9,skills:[0,2,4,4,3,2]},
  {XP:790,aspects:8,stunts:10,skills:[1,1,5,4,3,2,1]},
  {XP:900,aspects:9,stunts:10,skills:[1,1,1,5,4,3,2]},
  {XP:1020,aspects:9,stunts:11,skills:[0,1,2,5,4,3,2,1]}
]

ASPECTSALL = [];
for (var x in COLORS){
  ASPECTSALL = ASPECTSALL.concat(COLORS[x].element);
}
SKILLSCURRENT = SKILLS.concat([]);

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-core-stats','<input v-show="showname" class="form-control input-lg center" type="text" v-model="name" placeholder="NAME">' +
  '<div class="content container-fluid"><div class="row strong">' +
  '<div class="center col-xs-6">XP: {{XP}} Free: {{XPFree}} </div>' + 
  '<div class="center col-xs-6">Parry: {{parry}} Tough: {{tough}} </div></div>' +
  '<div class="row strong"><div class="center col-xs-6">AP: {{AP}} </div>' + 
  '<div class="center col-xs-6">Coin: {{coin}} </div></div></div>' );
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-aspect-select','<select class="form-control" v-model="selectaspects[n]" ><option v-for="a in allaspects"> {{a}} </option></select>' );
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-aspects','<h4 class="center">Aspects</h4>' +
  '<div class="center"><span class="aspect strong" v-for="aspect in aspects"> {{aspect | capitalize}} </span></div>' +
  '<template v-for="n in naspects"> <partial name="unit-aspect-select"></partial>'
  );
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-skills','<div class="skillList center"><h4>Skills</h4>' +
  '<div><span class="vcenter">Decrease </span><label class="switch">A<input type="checkbox" v-model="increase"><div class="slider round"></div></label>' +
  '<span class="vcenter"> Increase</span></div>' +
  '<div class="content"><div class="row" v-for="(idx, lv) in skilllevel"><div class="strong">{{skilllevel[idx] | capitalize}}</div>'+
  '<span class="skill" v-for="skill in skillbylevel[idx]" v-on:click="skillval(idx,skill)" >  {{skill}}  </span></div>' +
  '</div></div>');
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-inventory-drop','<button type="button" class="btn btn-default btn-sm" aria-label="Drop" v-on:click="itemDrop($index)">' + 
  '<span class="glyphicon glyphicon glyphicon-trash" aria-hidden="true"></span></button>');
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-inventory-equip','<input v-on:change="itemEquip(item)" type="checkbox" v-model="item.equipped">');
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-inventory','<div class="content"><table class="table table-striped">'+
  '<tr><td class="left">Item</td><td>#</td><td>Equip</td><td>Drop</td></tr>' +
  '<tr v-for="item in inventory"><td class="left">{{item.name}}</td><td>{{item.qty}}</td>'+
  '<td v-if="itemEquipShow(item)"><partial name="unit-inventory-equip"></partial></td><td v-else></td>'+
  '<td><partial name="unit-inventory-drop"></partial></td></tr></table></div>' );
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-recruits-dismiss','<button type="button" class="btn btn-default btn-sm" aria-label="Drop" v-on:click="recruitDismiss($index)">' + 
  '<span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-recruits-indep','<input type="checkbox" v-model="recruit.independent">');
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-recruits','<div class="content"><table class="table table-striped">'+
  '<tr><td class="left">Name</td><td>Rank</td><td>#</td><td>Indep</td><td>Dismiss</td></tr>' +
  '<tr v-for="recruit in recruits"><td class="left">{{recruit.name}}</td><td>{{recruit.rank}}</td><td>{{recruit.qty}}</td>'+
  '<td><partial name="unit-recruits-indep"></partial></td>'+
  '<td><partial name="unit-recruits-dismiss"></partial></td></tr></table></div>' );
/////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('unit-view', '{{{header}}}<div class="content"><partial name=unit-core-stats></partial>{{{options}}}' +
  '<div v-if="showstats"><partial name=unit-aspects></partial><partial name=unit-skills></partial></div>' +
  '<div class="center" v-if="showinventory"><partial name=unit-inventory></partial></div>' +
  '<div class="center" v-if="showrecruits"><partial name=unit-recruits></partial></div>' +
  '<div class="center"><button v-on:click="close" type="button" class="btn btn-info btn-lg">Close</button>' +
  '<button v-on:click="save" type="button" class="btn btn-info btn-lg">Save</button>' +
  '<button v-on:click="next" type="button" class="btn btn-info btn-lg">Next</button></div></div>');
/////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.vue.unit = new Vue({
  el: '#unitView',
  data: {
    show: false,
    showstats: false,
    showinventory: false,
    showrecruits: false,
    showname:false,
    increase: "true",
    selectaspects : {},
    allskills : SKILLS.concat([]),
    skilllevel: ['epic','legendary',"master",'expert','professional','trained','untrianed'],
    skillbylevel : [[],[],[],[],[],[],[]],
    ////////////
    _id: "",
    class: [],
    name: "",
    speed:0,
    HD: 0,
    HP : 0,
    maxHP : 0,
    XP:0,
    XPFree:0,
    AP:0,
    coin: 0,
    recruits: [],
    inventory: [],
    location : [],
    aspects : [],
    //skills - epic,legendary,master,expert,professional,trained,untrianed,liability
    skills : {},
    stunts : []
  },
  computed: {
    // a computed getter
    allaspects : function () { return ASPECTSALL; },
    level : function () {
      //determine level
      var li = 0;
      LEVELS.forEach(function(el,i){
        if(this.XP >= el.XP) { li = i; }
      })
      return li+1;
    },
    naspects : function () { 
      var lv=LEVELS[this.level];
      return lv.aspects - this.aspects.length - 1;
    },
    unit : function () { return CPXUNITS[this._id] },
    options: function () { 
      html='<div class="btn-group btn-group-justified" role="group">' +
      '<div class="btn-group" role="group"><button type="button" class="btn btn-default btn-unit-data" data-type="Stats">Stats</button></div>' +
      '<div class="btn-group" role="group"><button type="button" class="btn btn-default btn-unit-data" data-type="Inventory">Inventory</button></div>' +
      '<div class="btn-group" role="group"><button  type="button" class="btn btn-default btn-unit-data" data-type="Recruits">Recruits</button></div></div>';
      return html;
    },
    header: function () {
      var header = "<h3 class='header unit center' data-id="+this._id+">Hero Editor<div class='unitdata' data-id=name>"+this.name+"</div></h3>";
      return header;
    },
    parry : function () {
      var p = 3, fight = ((!objExists(this.skills.Fight)) ? 0 : this.skills.Fight);
      p+= ((fight<2) ? 1 : fight);
      return p;
    },
    tough : function () {
      var t=3+this.skills.Physique, armor={armor:0};
      if(this.class.includes('hero')){
        this.inventory.forEach(function (el){ if(el.equipped && el.class.includes('armor')) { armor = el; } })
      }
      return t+armor.armor+'('+armor.armor+')'
    }
  },
  // define methods under the `methods` object
  methods: {
    recruitDismiss: function (idx) {
      this.recruits.splice(idx, 1);
    },
    itemEquip: function (item) {
      var type = "";
      if(item.class.includes("weapon")) { type="weapon"; }
      else if (item.class.includes("armor")) {type="armor"; }
      this.inventory.forEach(function(el){
        if(el.class.includes(type)) {el.equipped = false; }
      });
      item.equipped=true;
    },
    itemDrop: function (idx) {
      this.inventory.splice(idx, 1);
    },
    itemEquipShow: function (item) {
      if(item.class.findOne(['weapon','armor','ring','wondrous','staff','wand'])) {return true;}
      return false;
    },
    showVue: function (unit) {
      //clear vue first
      this.close();
  
      for(var x in unit){
        if(Array.isArray(unit[x])){
          this[x] = this[x].concat(unit[x]); 
        }
        else {
          this[x] = unit[x];
        }
      }
      for (var x in unit.skills){
        this.skillbylevel[6-unit.skills[x]].push(x);
        this.allskills.$remove(x);
      }
      Vue.set(this.skillbylevel, 6, this.allskills);

      if(CPXAU.name=="") { this.showname = true; }
      this.showstats = true; 
      this.show = true;
    },
    save: function () {
      if(objExists(this.selectaspects[0])) {
        for(var x in this.selectaspects){
          this.aspects.push(this.selectaspects[x]);
        }
      }
      var unit = CPXUNITS[this._id], VU=this;
      if(this.class.includes("hero")) {
        for (var x in CPX.hero.model){
          if(Array.isArray(this[x])){
            unit[x] = VU[x].concat([]); 
          }
          else {
            unit[x] = VU[x];
          }
        }

        unit.skills = {};
        this.skillbylevel.forEach(function(el,idx){
          if(idx != 6) {
            el.forEach(function(s){
              unit.skills[s] = 6-idx
            })  
          }
        })
      }

      CPX.save.unit(unit);
      this.close();
    },
    close: function () {
      this.show = false;
      this.showstats = true;
      this.showname = false;
      this.showinventory= false;
      this.showrecruits= false;
      this.selectaspects = {};
      this.allskills = SKILLS.concat([]);
      this.skillbylevel = [[],[],[],[],[],[],[]];

      for (var x in CPX.hero.model){
        if(Array.isArray(this[x])) { this[x]=[]; }
        else { this[x]=CPX.hero.model[x]; }
      }
    },
    skillval : function (rank,skill) {
      var i=rank, rankcost=3, VU=this;

      if(this.increase && i>0) { i--; }
      else { i++; }
      if(i>6) { i=6; }

      function noXP () {
        var n = noty({layout:'center',type:'error',timeout: 700,text: 'Not Enough XP!'});
      }
      function moveSkill () {
        VU.skills[skill] = 6-i;
        VU.skillbylevel[i].push(skill);
        VU.skillbylevel[rank].$remove(skill);
        VU.skillbylevel[i].sort();
      }

      if(this.increase && this.XPFree>=rankcost) {
        this.XPFree-=rankcost;
        this.XP+=rankcost;
        moveSkill();
      }
      else if(this.increase && this.XPFree<rankcost){
        noXP();
      }
      else if(!this.increase) {
        this.XPFree+=rankcost;
        this.XP-=rankcost;
        moveSkill();
      }
    }
  }
})
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on('click',"button.btn-unit-data",function(e) {
  var type=$(this).attr("data-type");
  if(type=="Stats"){ 
      CPX.vue.unit.showstats=true;
      CPX.vue.unit.showrecruits=false;
      CPX.vue.unit.showinventory=false;
  }
  else if(type=="Inventory") { 
      CPX.vue.unit.showstats=false;
      CPX.vue.unit.showrecruits=false;
      CPX.vue.unit.showinventory=true;
  }
  else if(type=="Recruits") { 
      CPX.vue.unit.showstats=false;
      CPX.vue.unit.showrecruits=true;
      CPX.vue.unit.showinventory=false;
  }
  
}); 

