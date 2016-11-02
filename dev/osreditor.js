var OSR = {};
OSR.hero = {
  _id:'',
  name:'',
  notes:'',
  XP:0,
  HP:0,
  coin:'',
  attributes: {
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0
  }, 
  inventory : []
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//calculates all of the bonues for the attributes
OSR.allbonus = function(attributes){
  return {
    str: OSR.bonus(attributes.Strength),
    dex: OSR.bonus(attributes.Dexterity),
    con: OSR.bonus(attributes.Constitution),
    int: OSR.bonus(attributes.Intelligence),
    wis: OSR.bonus(attributes.Wisdom),
    cha: OSR.bonus(attributes.Charisma),
  } 
},
//standard bonus calculation based upon attribute val
OSR.bonus = function(val){
  if(val<4) { return -3; }
  else if (val<6) { return -2; } 
  else if (val<9) { return -1; } 
  else if (val<13) { return 0; } 
  else if (val<16) { return 1; } 
  else if (val<18) { return 2; } 
  else { return 3; } 
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-osr-abilities', { 
  props:['list','attributes'],
  template: '\
  <div class="row strong">\
  <div class="center col-xs-4" v-for="item in list">\
  <div>{{item}}</div><div><input class="center input-slim" type="number" min="3" max="18" v-model="attributes[item]"> ({{bonus(attributes[item])}})</div>\
  </div>\
  ',
  methods: {
    //calculates all of the bonues for the attributes
    allbonus: function(){
      return OSR.allbonus(this.attributes)
    },
    //standard bonus calculation based upon attribute val
    bonus: function(val){
      return OSR.bonus(val);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-osr', { 
  template: '\
  <div>\
  <h2 class="center">OSR Character Editor</h2>\
  <c-menubar id="GBC" v-bind:show="showmenu"></c-menubar>\
  <c-loadselect id="GBC" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
  <div class="content"><input class="form-control input-lg center" type="text" v-model="hero.name" placeholder="NAME"></div>\
  <div class="content container-fluid">\
  <div class="row strong">\
  <div class="center col-xs-6">XP: <input class="center input-mid" type="number" min="0" v-model="hero.XP"></div>\
  <div class="center col-xs-6">Level: {{level}}</div>\
  </div>\
  <div class="row strong">\
  <h4 class="center bar-bottom">Status</h4>\
  <div class="center col-xs-4">HP ({{maxhp}}) <div><input class="center input-slim" type="number" min="0" v-model="hero.HP"></div></div>\
  </div>\
  <h4 class="center bar-bottom">Attributes</h4>\
  <c-osr-abilities v-bind:list="lineone" v-bind:attributes="hero.attributes"></c-osr-abilities>\
  <c-osr-abilities v-bind:list="linetwo" v-bind:attributes="hero.attributes"></c-osr-abilities>\
  </div>\
  <h4 class="center bar-bottom">Inventory <button v-on:click="toggleadd(`inventory`)" type="button" class="btn btn-xs">Add Item</button></h4>\
  <div class="center content-minor box" v-for="item in hero.inventory"> {{item}}\
  <button v-on:click="remove(`inventory`,$index)" type="button" class="close"><span aria-hidden="true">&times;</span></button></div>\
  <input class="form-control input center" v-show="showlist.inventory" type="text" v-on:keyup.enter="add(`inventory`)" v-model="newitem" placeholder="ITEM">\
  </div>\
  ',
  data: function () {
    return {
      vid: 'OSR',
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {
        load:false,
        inventory:false
      },
      hero: {},
      allgens: {},
      lineone: ['Strength','Dexterity','Constitution'],
      linetwo: ['Intelligence','Wisdom','Charisma'],
      newitem:''
    }
  },
  //called when created
  created: function () {
    CPX.vue.page.onCreated(this);
  },
  beforeDestroy: function () {
    CPX.vue.page.onBeforeDestroy(this);
  },
  methods: {
    //toggle function for displaying select boxes and input fields
    toggleadd : function (what) {
      this.showlist[what] = !this.showlist[what];
    },
    //the function to add select box and input form data to the hero
    add: function (what) {
      if(what == 'inventory') { 
        this.hero.inventory.push(this.newitem);
        this.newitem = '';
      }
    },
    //remove items from arrays
    remove: function (what,idx) {
      this.hero[what].splice(idx,1);
    },
    save: function () {
      CPXSAVE.setItem(this.hero._id,this.hero).then(function(){});
      if(!objExists(this.allgens[this.hero._id])){
        Vue.set(this.allgens, this.hero._id, this.hero.name);
      }
    },
    load: function (H) {
      this.hero = H;
    },
    new : function () { 
      this.hero={};
      this.generate();
    },
    generate: function () {
      this.hero = objCopy(OSR.hero);
      this.hero._id = 'GBC-'+CPXC.string({length: 21, pool: base62}); 
      //randomly assigns values to attributes
      var vals = CPXC.shuffle([16,14,13,13,10,8]), i=0;
      for (var x in this.hero.attributes) {
        this.hero.attributes[x] = vals[i];
        i++; 
      }
      //calculates the hit points
      this.hero.HP = 8+OSR.allbonus(this.hero.attributes).con;
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.hero={};
      this.allgens = [];
    }
  }
})

Vue.partial('hero-editor', 
'<c-menubar id="heroEditor"></c-menubar>'+
//Load hero 
'<div class="scrolling"><div class="center content" v-show="showaddload"><select v-model="loadhero">'+
'<option class="center" v-for="hero in herolist" v-bind:value="hero[0]">{{hero[1]}}</option> </select>' +
'<button v-on:click="load" type="button" class="btn btn-info">Load</button></div>' +
//Start of content
'<div class="content"><input class="form-control input-lg center" type="text" v-model="hero.name" placeholder="NAME"></div>'+
'<div class="content container-fluid">' +
'<div class="row strong"><div class="center col-xs-6">XP: <input class="center input-mid" type="number" min="0" v-model="hero.XP"></div>'+
'<div class="center col-xs-6">Level: {{level}}</div></div>'+
'<div class="row strong"><h4 class="center bar-bottom">Status</h4>'+
'<div class="center col-xs-4">HP ({{maxhp}}) <div><input class="center input-slim" type="number" min="0" v-model="hero.HP"></div></div>'+
'<div class="center col-xs-4">Effort ({{maxeffort}}) <div><input class="center input-slim" type="number" min="0" v-model="hero.Effort"></div></div>'+
'<div class="center col-xs-4">Influence ({{maxinfluence}}) <div><input class="center input-slim" type="number" min="0" v-model="hero.Influence"></div></div></div>'+
//Attributes
'<div class="row strong"><h4 class="center bar-bottom">Attributes</h4><div class="center col-xs-4" v-for="n in 3">'+
'<div>{{lineone[n]}}</div><div><input class="center input-slim" type="number" min="3" max="18" v-model="hero.attributes[lineone[n]]"> ({{bonus(hero.attributes[lineone[n]])}})</div>'+
'<div>{{linetwo[n]}}</div><div><input class="center input-slim" type="number" min="3" max="18" v-model="hero.attributes[linetwo[n]]"> ({{bonus(hero.attributes[linetwo[n]])}})</div>'+
'</div></div>'+
'<div class="row strong"><h4 class="center bar-bottom">Saves</h4><div class="center col-xs-4" v-for="(key, val) in saves">{{key}} {{val}}</div></div></div>'+
//Facts
'<h4 class="center bar-bottom">Facts ({{maxfacts}}) <button v-on:click="toggleadd(`fact`)" type="button" class="btn btn-xs">Add Fact</button></h4>'+
'<div class="center content-minor box" v-for="fact in hero.facts"> {{fact}} '+
'<button v-on:click="remove(`facts`,$index)" type="button" class="close"><span aria-hidden="true">&times;</span></button></div>' +
'<input class="form-control input center" v-show="showaddfact" type="text" v-on:keyup.enter="add(`fact`)" v-model="newfact" placeholder="FACT">' +
//Words
'<h4 class="center bar-bottom">Words <button v-on:click="toggleadd(`word`)" type="button" class="btn btn-xs">Add Word</button></h4>' +
'<div class="center content-minor box" v-for="word in hero.words"> {{htmlwords(word)}} ' +
'<button v-on:click="remove(`words`,$index)" type="button" class="close"><span aria-hidden="true">&times;</span></button></div>'+
'<div class="center" v-show="showaddword"><select v-model="currentword"> <option class="center" v-for="word in words">{{word}}</option> </select>' +
'<button v-on:click="add(`word`)" type="button" class="btn btn-info">Add Word</button></div>' +
//Gifts
'<h4 class="center bar-bottom">Gifts ({{giftpoints-gpused}}) <button v-on:click="toggleadd(`gift`)" type="button" class="btn btn-xs">Add Gift</button></h4>'+
'<div class="center content-minor box" v-for="gift in hero.gifts"> {{htmlgifts(gift)}} ' +
'<button v-on:click="remove(`gifts`,$index)" type="button" class="close"><span aria-hidden="true">&times;</span></button></div>' +
'<div class="center" v-show="showaddgift"><select v-model="currentgift">'+
'<option class="center" v-for="gift in gifts" v-bind:value="gift[2]">{{gift[2]}}</option> </select>' +
'<button v-on:click="add(`gift`)" type="button" class="btn btn-info">Add Gift</button></div></div>' +
//Inventory
'<h4 class="center bar-bottom">Inventory <button v-on:click="toggleadd(`inventory`)" type="button" class="btn btn-xs">Add Item</button></h4>'+
'<div class="center content-minor box" v-for="item in hero.inventory"> {{item}} '+
'<button v-on:click="remove(`inventory`,$index)" type="button" class="close"><span aria-hidden="true">&times;</span></button></div>' +
'<input class="form-control input center" v-show="showaddinventory" type="text" v-on:keyup.enter="add(`inventory`)" v-model="newitem" placeholder="ITEM">' 
);
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.vue.heroEditor = new Vue({
  el: '#heroeditor',
  data: {
    show: false,
    showaddword : false,
    showaddgift : false,
    showaddfact : false,
    showaddinventory : false,
    showaddload : false,
    id: '',
    lineone: ['Strength','Dexterity','Constitution'],
    linetwo: ['Intelligence','Wisdom','Charisma'],
    currentword: '',
    currentgift: '',
    newfact:'',
    newitem:'',
    hero : objCopy(OSR.hero),
    herolist: [],
    loadhero:'',
    allgifts: []
  },
  computed : {
    //computes the level based upon XP
    level : function () {
      var l = 1, VU = this;
      GB.levels.XP.forEach(function(el,i){
        if(VU.hero.XP>=el) { l = i+1; }
      })
      return l;
    },
    //computes saves based upon attribute bonuses
    saves : function () {
      var bonus = this.allbonus(), base = 15-(this.level-1),
      h = (bonus.str > bonus.con) ? base-bonus.str : base-bonus.con,
      e = (bonus.dex > bonus.int) ? base-bonus.dex : base-bonus.int,
      s = (bonus.wis > bonus.cha) ? base-bonus.wis : base-bonus.cha;

      return {Hardiness:h,Evasion:e,Spirit:s};
    },
    //number of facts based on level 
    maxfacts : function () { return 3+this.level-1; },
    //hp based upon level and con bonus
    maxhp : function () {
      var con = this.allbonus().con;
      return 8+con+(this.level-1)*(4+con);
    },
    //effort based upon level
    maxeffort : function () {
      return 2+this.level-1;
    },
    //influence based upon level
    maxinfluence : function () {
      return 2+this.level-1;
    },
    //number of points for gifts - based upon level
    giftpoints : function () { return 6 + (this.level-1)*2; },
    //calculates the number of gift points used
    gpused : function () {
      var ng = this.hero.gifts.length, nw = this.hero.words.length, used=ng;
      if(nw>3) { used+= (nw-3)*3; }
      return used;
    },
    //pulls the word list for selection
    words : function () {
      var list = [];
      for (var x in GB.words) { 
        //if the hero has the word - do not include it
        if(!this.hero.words.includes(x)) {
          list.push(x); 
        }
      }
      return list;
    },
    //pulls the gift list for selection
    gifts : function () {
      var VU=this, list = [], rank=['Lesser','Greater'];
      this.allgifts.forEach(function(el){
        //if the hero has the gift, do not include it
        if(!VU.hero.gifts.includes(el[2])){
          //only inlcude gifts that are universal or the hero has the words for
          if(el[0]=='Universal' || VU.hero.words.includes(el[0])) {
            list.push(el);  
          }
        }
      })
      return list;
    }
  },
  methods: {
    //load a saved hero
    load : function () {
      var VU = this;
      this.id = this.loadhero;

      SAVEUNITS.getItem(this.id).then(function(hero) {
        VU.hero = hero;
        VU.loadhero = '';
      });
    },  
    //function to open the form
    open: function () {
      var VU = this;
      //populates saved hero list
      CPX.allHeroes().then(function(list){
        VU.herolist = list;        
      })
      //randomly assigns values to attributes
      var vals = CPXC.shuffle([16,14,13,13,10,8]), i=0;
      for (var x in this.hero.attributes) {
        this.hero.attributes[x] = vals[i];
        i++;
      }
      //calculates the hit points
      this.hero.HP = 8+this.allbonus().con;
      //randomly generates guid for hero id
      this.id  = CPXC.guid();
      this.hero._id = this.id;
      this.show = true; 
    },
    //calculates all of the bonues for the attributes
    allbonus: function(){
      return {
        str: this.bonus(this.hero.attributes.Strength),
        dex: this.bonus(this.hero.attributes.Dexterity),
        con: this.bonus(this.hero.attributes.Constitution),
        int: this.bonus(this.hero.attributes.Intelligence),
        wis: this.bonus(this.hero.attributes.Wisdom),
        cha: this.bonus(this.hero.attributes.Charisma),
      } 
    },
    //standard bonus calculation based upon attribute val
    bonus: function(val){
      if(val<4) { return -3; }
      else if (val<6) { return -2; } 
      else if (val<9) { return -1; } 
      else if (val<13) { return 0; } 
      else if (val<16) { return 1; } 
      else if (val<18) { return 2; } 
      else { return 3; } 
    },
    //specal formatting for words
    htmlwords: function (word) {
      return word;
    },
    //special formatting for gifts
    htmlgifts: function (gift) {
      var G = this.allgifts.find(function(el){
        return el[2] == gift;
      })
      return G[2];
    },
    //toggle function for displaying select boxes and input fields
    toggleadd : function (what) {
      this['showadd'+what] = !this['showadd'+what];
    },
    //the function to add select box and input form data to the hero
    add: function (what) {
      if(what == 'fact') { 
        this.hero.facts.push(this.newfact);
        this.newfact = '';
      }
      if(what == 'inventory') { 
        this.hero.inventory.push(this.newitem);
        this.newitem = '';
      }
      else if (what == 'word')  { this.hero.words.push(this.currentword); }
      else if (what == 'gift')  {
        this.hero.gifts.push(this.currentgift);
      }
    },
    //remove items from arrays
    remove: function (what,idx) {
      this.hero[what].splice(idx,1);
    },
    //save the hero the the IndexedDB
    save: function() {
      SAVEUNITS.setItem(this.id,this.hero).then(function(){});
    },
    //close the editor - open the main menu 
    close: function(event) {
      this.show = false;
      vMainMenu.open();
    }
  }
})