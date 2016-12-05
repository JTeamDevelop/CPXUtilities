CPX.OSRHero = {};
CPX.OSRHero.template = {
  _id:'',
  name:'',
  notes:'',
  rules: '',
  XP:0,
  HP:0,
  level:1,
  class:'',
  AC: '9 [10]',
  attributes: {
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0
  }, 
  facts:[],
  gifts:[],
  words:[],
  saves:[],
  abilities:[],
  inventory : [],
  spells : []
}

CPX.data.SWBonus = {
  "Strength" : [
    {
      "score" : 1,
      "tohit" : -2,
      "dmg" : -1,
      "opend" : "1",
      "carry" : -10
    },
    {
      "score" : 4,
      "tohit" : -1,
      "dmg" : 0,
      "opend" : "1",
      "carry" : 5
    },
    {
      "score" : 6,
      "tohit" : 0,
      "dmg" : 0,
      "opend" : "1-2",
      "carry" : 0
    },
    {
      "score" : 8,
      "tohit" : 0,
      "dmg" : 0,
      "opend" : "1-2",
      "carry" : 5
    },
    {
      "score" : 12,
      "tohit" : 1,
      "dmg" : 0,
      "opend" : "1-2",
      "carry" : 10
    },
    {
      "score" : 15,
      "tohit" : 1,
      "dmg" : 1,
      "opend" : "1-3",
      "carry" : 15
    },
    {
      "score" : 16,
      "tohit" : 2,
      "dmg" : 2,
      "opend" : "1-4",
      "carry" : 30
    },
    {
      "score" : 17,
      "tohit" : 2,
      "dmg" : 3,
      "opend" : "1-5",
      "carry" : 50
    }
  ],
  "Dexterity" : [
    {
      "score" : 1,
      "tohit" : -1,
      "AC" : -1
    },
    {
      "score" : 8,
      "tohit" : 0,
      "AC" : 0
    },
    {
      "score" : 12,
      "tohit" : 1,
      "AC" : 1
    }
  ],
  "Constitution" : [
    {
      "score" : 1,
      "hpmod" : -1,
      "raise" : 0.5
    },
    {
      "score" : 8,
      "hpmod" : 0,
      "raise" : 0.75
    },
    {
      "score" : 12,
      "hpmod" : 1,
      "raise" : 1
    }
  ],
  "Intelligence" : [
    {
      "score" : 1,
      "maxlang" : 0,
      "maxlv" : 4,
      "newspell" : 0.3,
      "basicspell" : "2/4"
    },
    {
      "score" : 7,
      "maxlang" : 1,
      "maxlv" : 5,
      "newspell" : 0.4,
      "basicspell" : "3/5"
    },
    {
      "score" : 8,
      "maxlang" : 1,
      "maxlv" : 5,
      "newspell" : 0.45,
      "basicspell" : "3/5"
    },
    {
      "score" : 9,
      "maxlang" : 2,
      "maxlv" : 5,
      "newspell" : 0.5,
      "basicspell" : "4/6"
    },
    {
      "score" : 10,
      "maxlang" : 2,
      "maxlv" : 6,
      "newspell" : 0.5,
      "basicspell" : "4/6"
    },
    {
      "score" : 11,
      "maxlang" : 3,
      "maxlv" : 6,
      "newspell" : 0.55,
      "basicspell" : "4/6"
    },
    {
      "score" : 12,
      "maxlang" : 3,
      "maxlv" : 7,
      "newspell" : 0.65,
      "basicspell" : "5/8"
    },
    {
      "score" : 13,
      "maxlang" : 4,
      "maxlv" : 7,
      "newspell" : 0.65,
      "basicspell" : "5/8"
    },
    {
      "score" : 14,
      "maxlang" : 4,
      "maxlv" : 8,
      "newspell" : 0.75,
      "basicspell" : "6/10"
    },
    {
      "score" : 15,
      "maxlang" : 5,
      "maxlv" : 8,
      "newspell" : 0.75,
      "basicspell" : "6/10"
    },
    {
      "score" : 16,
      "maxlang" : 5,
      "maxlv" : 9,
      "newspell" : 0.85,
      "basicspell" : "7/All"
    },
    {
      "score" : 17,
      "maxlang" : 6,
      "maxlv" : 9,
      "newspell" : 0.95,
      "basicspell" : "8/All"
    }
  ],
  "Charisma" : [
    {
      "score" : 1,
      "hirelings" : 1
    },
    {
      "score" : 4,
      "hirelings" : 2
    },
    {
      "score" : 6,
      "hirelings" : 3
    },
    {
      "score" : 8,
      "hirelings" : 4
    },
    {
      "score" : 12,
      "hirelings" : 5
    },
    {
      "score" : 15,
      "hirelings" : 6
    },
    {
      "score" : 17,
      "hirelings" : 7
    }
  ]
}
CPX.data.WSBonus = [
  {score:1,b:-1,p:-5,text:'(-1/-5%)'},
  {score:6,b:0,p:0,text:'(+0/0%)'},
  {score:14,b:1,p:5,text:'(+1/+5%)'}
]
CPX.data.GBBonus = [
  {score:1,b:-3,text:'(-3)'},
  {score:3,b:-2,text:'(-2)'},
  {score:5,b:-1,text:'(-1)'},
  {score:8,b:0,text:'(+0)'},
  {score:12,b:1,text:'(+1)'},
  {score:15,b:2,text:'(+2)'},
  {score:17,b:3,text:'(+3)'}
]

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//standard bonus calculation based upon attribute val
CPX.OSRHero.bonus = function(attributes,rules){
  rules = typeof rules === 'undefined' ? "SW" : rules;
  
  if(rules == 'SW') {
    var B = {};
    for(var x in attributes){
      B[x] = '';
      if(objExists(CPX.data.SWBonus[x])){
        CPX.data.SWBonus[x].forEach(function(el){
          if(attributes[x]>el.score) { B[x] = el; }
        })
      }
    }
    return B;
  }
  else if(rules == 'WS') {
    var B = {};
    for(var x in attributes){
      B[x] = '';
      CPX.data.WSBonus.forEach(function(el){
        if(attributes[x]>el.score) { B[x] = el; }
      })
    }
    return B;  
  }
  else if(rules == 'GB') {
    var B = {};
    for(var x in attributes){
      B[x] = '';
      CPX.data.GBBonus.forEach(function(el){
        if(attributes[x]>el.score) { B[x] = el; }
      })
    }
    return B;  
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//calculates all of the bonues for the attributes
CPX.OSRHero.GBSaves = function(attr,lv){
  var B = CPX.OSRHero.bonus(attr,'GB'),
  H = 15-B.Strength.b,
  E = 15-B.Dexterity.b,
  S = 15-B.Wisdom.b;
  
  if(attr.Constitution>attr.Strength){ H = 15-B.Constitution.b; }
  if(attr.Intelligence>attr.Dexterity){ E = 15-B.Intelligence.b; } 
  if(attr.Charisma>attr.Wisdom){ S = 15-B.Charisma.b; } 
  
  H-=lv-1; E-=lv-1; S-=lv-1;
  
  return {H:H,E:E,S:S} 
},
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-osr-swbonuses', { 
props:['attr','rules'],
template: '\
  <div class="center bar-bottom strong">Bonuses</div>\
  <div class="content-minor container-fluid">\
    <div class="row strong">\
      <div class="center col-xs-6">\
        <span class="strong">Bonus to Hit (STR): {{bonuses.Strength.tohit}}</span>\
      </div>\
      <div class="center col-xs-6">\
        <span class="strong">Damage Bonus (STR): {{bonuses.Strength.dmg}}</span>\
      </div>\
    </div>\
    <div class="row strong">\
      <div class="center col-xs-6">\
        <span class="strong">Open Doors (STR): {{bonuses.Strength.opend}}</span>\
      </div>\
      <div class="center col-xs-6">\
        <span class="strong">Carry Mod (STR): {{bonuses.Strength.carry}}</span>\
      </div>\
    </div>\
    <div class="row strong">\
      <div class="center col-xs-6">\
        <span class="strong">Missile Bonus (DEX): {{bonuses.Dexterity.tohit}}</span>\
      </div>\
      <div class="center col-xs-6">\
        <span class="strong">Armor Bonus (DEX): {{bonuses.Dexterity.AC}}</span>\
      </div>\
    </div>\
    <div class="row strong">\
      <div class="center col-xs-6">\
        <span class="strong">HP Bonus (CON): {{bonuses.Constitution.hpmod}}</span>\
      </div>\
      <div class="center col-xs-6">\
        <span class="strong">Raise Dead % (CON): {{bonuses.Constitution.raise}}</span>\
      </div>\
    </div>\
    <div class="row strong">\
      <div class="center col-xs-6">\
        <span class="strong"># Languages (INT): {{bonuses.Intelligence.maxlang}}</span>\
      </div>\
      <div class="center col-xs-6">\
        <span class="strong"># Hirelings (CHA): {{bonuses.Charisma.hirelings}}</span>\
      </div>\
    </div>\
  </div>\
  ',
  data: function(){
    return {
      bonuses : CPX.OSRHero.bonus(this.attr,'SW')
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-osr-attributes', { 
  props:['attr','rules'],
  template: '\
  <h4 class="header center">Attributes</h4>\
  <div class="content container-fluid">\
    <div class="row strong">\
      <div class="center col-xs-4" v-for="item in lineone">\
        <div>{{item}}</div>\
        <div>\
          <input class="form-control center" type="number" min="3" max="18" v-model="attr[item]"> \
        </div>\
        <div v-if="modtxt.includes(rules)">{{bonus[item].text}}</div>\
      </div>\
    </div>\
    <div class="row strong">\
      <div class="center col-xs-4" v-for="item in linetwo">\
        <div>{{item}}</div>\
        <div>\
          <input class="form-control center" type="number" min="3" max="18" v-model="attr[item]"> \
        </div>\
        <div v-if="modtxt.includes(rules)">{{bonus[item].text}}</div>\
      </div>\
    </div>\
  </div>\
  ',
  data: function(){
    return {
      lineone: ['Strength','Dexterity','Constitution'],
      linetwo: ['Intelligence','Wisdom','Charisma'],
      modtxt: ['WS','GB']
    }
  },
  computed: {
    bonus: function(){
      return CPX.OSRHero.bonus(this.attr,this.rules);
    }
  },
  methods: {
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-osr-gbsaves', { 
  props:['saves'],
  template: '\
  <div class="bar-bottom strong center">Saves</div>\
  <div class="content container-fluid">\
    <div class="row strong">\
      <div class="center col-xs-4" v-for="id in saveid">\
        <div>{{id[1]}}</div>\
        <div>{{saves[id[0]]}}</div>\
      </div>\
    </div>\
  </div>\
  ',
  data: function(){
    return {
      saveid: [['H','Hardiness'],['E','Evasion'],['S','Spirit']],
    }
  },
  computed: {
  },
  methods: {
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-che-list', { 
  props: ['list','name'],
  template: '\
  <h4 class="header center">{{name | capitalize}} \
    <button v-on:click="add" type="button" class="btn btn-xs">\
      <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>\
    </button>\
  </h4>\
  <div class="input-group" v-for="item in list" track-by="$index">\
    <input class="form-control center" type="text" v-model="item">\
    <span class="input-group-btn">\
      <button v-on:click="remove($index)" type="button" class="btn">\
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
      </button>\
    </span>\
  </div>\
  ',
  methods: {
    add: function (what) {
      this.list.push('');
    },
    //remove items from arrays
    remove: function (idx) {
      this.list.splice(idx,1);
    },
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-che', { 
  template: '\
  <div>\
    <h2 class="center">OSR Character Editor</h2>\
    <c-menubar id="OSR" v-bind:show="showmenu"></c-menubar>\
    <c-loadselect id="OSR" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
    <div class="content-minor">\
      <div class="input-group">\
        <span class="input-group-addon strong">Rules</span>\
        <select class="form-control center" v-model="rules">\
          <option v-for="rs in rulesets" v-bind:value="rs[0]">{{rs[1]}}</option>\
        </select>\
      </div>\
    </div>\
    <div class="content-minor">\
      <input class="form-control input-lg center" type="text" v-model="hero.name" placeholder="NAME">\
      <textarea class="form-control" type="textarea" v-model="hero.notes" placeholder="ADD NOTES"></textarea>\
      <div class="input-group">\
        <span class="input-group-addon strong">Race</span>\
        <input class="form-control center" type="text" v-model="hero.race">\
      </div>\
      <div class="input-group">\
        <span class="input-group-addon strong">Gender</span>\
        <input class="form-control center" type="text" v-model="hero.gender">\
        <span class="input-group-addon strong">Age</span>\
        <input class="form-control center" type="text" v-model="hero.age">\
        <span class="input-group-addon strong">Alignment</span>\
        <input class="form-control center" type="text" v-model="hero.AL">\
      </div>\
      <div class="input-group">\
        <span class="input-group-addon strong">XP</span>\
        <input class="form-control center" type="number" v-model="hero.XP">\
        <span class="input-group-addon strong">Level</span>\
        <input class="form-control center" type="number" v-model="hero.level">\
      </div>\
      <div class="input-group" v-if="rules!=`GB`">\
        <span class="input-group-addon strong">Class</span>\
        <input class="form-control center" type="text" v-model="hero.class">\
      </div>\
      <div class="input-group">\
        <span class="input-group-addon strong">HP</span>\
        <input class="form-control center" type="number" v-model="hero.HP">\
        <span class="input-group-addon strong">AC</span>\
        <input class="form-control center" type="text" v-model="hero.AC">\
      </div>\
    </div>\
    <c-osr-attributes v-bind:attr="hero.attributes" v-bind:rules="rules"></c-osr-attributes>\
    <c-osr-swbonuses v-bind:attr="hero.attributes" v-if="rules==`SW`"></c-osr-swbonuses>\
    <div v-if="rules==`GB`">\
      <c-osr-gbsaves v-bind:saves="gbsaves"></c-osr-gbsaves>\
      <c-che-list v-bind:list="hero.facts" name="Facts"></c-che-list>\
      <c-che-list v-bind:list="hero.words" name="Words"></c-che-list>\
      <c-che-list v-bind:list="hero.gifts" name="Gifts"></c-che-list>\
    </div>\
    <div v-else>\
      <c-che-list v-bind:list="hero.saves" name="Saving Throws"></c-che-list>\
      <c-che-list v-bind:list="hero.abilities" name="Class Abilities"></c-che-list>\
      <c-che-list v-bind:list="hero.spells" name="Spells"></c-che-list>\
    </div>\
    <c-che-list v-bind:list="hero.inventory" name="Inventory"></c-che-list>\
    <div class="input-group">\
      <span class="input-group-addon strong">Coin</span>\
      <input class="form-control center" type="text" v-model="hero.coin">\
    </div>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'OSR',
      loadids: ['OSR','COH'],
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
      rulesets: [
        ['GN','Generic'],['SW','Swords & Wizardry'],['WS','WhiteStar'],['GB','Godbound']
      ],
      rules:'GN',
      hero: {},
      allgens: {},
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
  computed: {
    gbsaves : function(){
      return CPX.OSRHero.GBSaves(this.hero.attributes,this.hero.level);
    },
  },
  methods: {
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
      this.hero = objCopy(CPX.OSRHero.template);
      this.hero._id = 'COH-'+CPXC.string({length: 27, pool: base62}); 
      //randomly assigns values to attributes
      var vals = CPXC.shuffle([16,14,13,13,10,8]), i=0;
      for (var x in this.hero.attributes) {
        this.hero.attributes[x] = vals[i];
        i++; 
      }
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.hero={};
      this.allgens = {};
    }
  }
})