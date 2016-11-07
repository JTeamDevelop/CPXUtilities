CPX.PWD = {};
CPX.PWD.explore = ['C','CD','CDI','CDI','CI','CI','TCD','TCDI','TCI','TUD','TUDI','TUI'];
CPX.PWD.themes = [
  ['rot/decay','torture/agony','madness','all is lost','noble sacrifice','savage fury','survival',
  'criminal activity','secrets/treachery','tricks and traps','invasion/infestation','factions at war'],
  ['creation/invention','*element','knowledge/learning','growth/expansion','deepening mystery',
  'transformation/change','chaos and destruction','shadowy forces','forbidden knowledge','poison/disease',
  'corruption/blight','impending disaster'],
  ['scheming evil','divination/scrying','blasphemy','arcane research','occult forces','an ancient curse',
  'mutation','the unquiet dead','bottomless hunger','incredible power','unspeakable horrors','holy war']
]
CPX.PWD.dangers = {
  core: [['trap','creature','entity'],[4,7,1]]
}
CPX.PWD.discovery = {
  core: [['dressing','feature','find'],[3,6,3]]
  
}

TRAPTYPES = ["alarm",'ensnaring/paralyzing','pit','crushing','piercing/puncturing','chopping/slashing',
            'confusing (maze, etc.)','gas (poison, etc.)','*element','ambush','*magic']

CPX.PWD.trap = function (RNG) {
  var T = {class:['trap'],text:RNG.pickone(TRAPTYPES)};
  if(T.text[0] == '*'){
    T.text = T.text.slice(1);
    T.text = T.text+' ('+RNG.pickone(SPECIALNATURE[T.text])+')';
  }
  return T;
}

CPX.PWD.find = function (RNG) {
  var F = {class:['find'],text:''};
  var types = ['trinkets','tools','weapons/armor','supplies/trade goods','coins/gems/jewelry',
              'poisons/potions','adventurer/captive','magic item','scroll/book','magic weapon/armor','artifact'];
  
  F.text = RNG.pickone(types);
  if(RNG.bool({likelihood:8})){  F.text += ' & '+RNG.pickone(types); }

  return F;
}

CPX.PWD.entity = function (RNG) {
  var E = {class:['entity'],name:'',special:[]};
  var types = ['alien interloper','vermin lord','criminal mastermind','warlord','high priest',
               'oracle','wizard/witch/alchemist','Monster lord' ,'evil spirit/ghost','undead lord' ,
               'demon','dark god'];
  
  E.name = RNG.pickone(types);
  return E;
}

CPX.PWD.generate = function (seed) {
  var D = CPX.obj({
    seed:seed
  },{
    name:'',
    notes:'',
    themes:[],
    areas:[]
  })
  
  D.RNG = new Chance(D.seed.join(""));
  D.scale = D.RNG.weighted([2,3,4,5],[3,6,2,1]);
  
  var themes = [], ti=-1;
  for(var i =0;i<D.scale;i++){
    ti=D.RNG.weighted([0,1,2],[5,4,3]);
    ti =D.RNG.pickone(CPX.PWD.themes[ti]);
    if(ti[0]=='*') {
      ti = ti.slice(1);
      ti = ti+' ('+D.RNG.pickone(SPECIALNATURE[ti])+')';
    }
    themes.push(ti);
  }
  D.themes = themes;
  
  var allthemes = [];
  themes.forEach(function(el) {
    for(var i =0;i<D.scale;i++){
      allthemes.push(el);
    }  
  });
  allthemes = D.RNG.shuffle(allthemes);
  
  var t=0, areas=[], ri={};
  while(t<allthemes.length){
    ri = {theme:'',explored:false,notes:'',unique:false};
    ri.ex = D.RNG.pickone(CPX.PWD.explore);
    if(ri.ex.includes('T')) { 
      ri.theme = allthemes[t];
      t++; 
    }
    areas.push(ri);
  }
  
  var finds=[], type='';
  areas.forEach(function(el,idx) {
    special=[];
    for(var i=0;i<el.ex.length;i++){
      if(el.ex[i]=="I") {
        type = D.RNG.weighted(CPX.PWD.discovery.core[0],CPX.PWD.discovery.core[1]);
        if(['feature','dressing'].includes(type)){
          areas[idx].notes+=CPXC.capitalize(type)+': nature of '+type+'.\n';
        }
        else{special.push(CPX.PWD.find(D.RNG));}
      }
      else if(el.ex[i]=="D") {
        type = D.RNG.weighted(CPX.PWD.dangers.core[0],CPX.PWD.dangers.core[1]);
        if(type == 'trap') { special.push(CPX.PWD.trap(D.RNG)); } 
        else if(type == 'creature') { special.push(CPX.encounter(D.RNG)); } 
        else { special.push(CPX.PWD.entity(D.RNG)); }
      }
      else if(el.ex[i]=="U") {areas[idx].unique = true;}
    }
    areas[idx].special = special;
  });
  D.areas = areas;
  
  D.RNG = null;
  delete D.RNG;
  
  return D;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pwd-textarea', { 
  props: ['object'],
  template: '\
  <div class="input-group">\
  <span class="input-group-addon" id="pwd-addon-i">{{object.class[0] | capitalize}}</span>\
  <textarea class="form-control" type="textarea" v-model="object.text" placeholder="INFO"></textarea>\
  </div>\
  '
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pwd-trap', { 
  props: ['object'],
  template: '\
  <div class="box bottom-pad">\
  <strong>Trap: </strong>{{object.text | capitalize}}\
  </div>\
  '
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pwd-find', { 
  props: ['object'],
  template: '\
  <div class="box bottom-pad">\
  <strong>Find: </strong>{{object.text | capitalize}}\
  </div>\
  '
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pwd-encounter', { 
  props: ['object'],
  template: '\
  <div class="box bottom-pad">\
  <div><strong>Encounter: </strong>{{object.name | capitalize}}</div>\
  <div v-if="object.special.length>0"><strong>Tags:</strong> {{object.special.unique().join(", ") | capitalize}}</div>\
  </div>\
  '
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pwd-area', { 
  props: ['A','i'],
  template: '\
  <div class="box center content bottom-pad pwd-area" v-bind:class="{ explored: A.explored }">\
  <div class="container-fluid">\
  <div class="row">\
  <div class="col-xs-6"><strong>Area {{i+1}} ({{txtUnique}})</strong></div>\
  <div class="col-xs-6"><input type="checkbox" v-model="A.explored" > Explored</div>\
  </div></div>\
  <div v-if="A.theme.length>0"><strong>Theme: </strong>{{A.theme | capitalize}}</div>\
  <component v-for="item in A.special" v-bind:is="pwdComponent(item.class[0])" v-bind:object="item"></component>\
  <div class="input-group">\
  <span class="input-group-addon" id="pwd-addon-i">Notes</span>\
  <textarea class="form-control" type="textarea" v-model="A.notes" placeholder="INFO"></textarea>\
  </div>\
  ',
  data: function () {
    return {
      textinputs: ['feature','dressing'],
      encounter: ['creature','people','entity'],
    }
  },
  computed: {
    txtUnique: function (){
      if(this.A.unique) {return 'Unique';}
      return 'Common';
    }
  },
  methods: {
    pwdComponent: function(type){
      if(this.textinputs.includes(type)){
        return 'c-pwd-textarea';
      }
      else if (this.encounter.includes(type)) { return 'c-pwd-encounter'; }
      else { return 'c-pwd-'+type; }
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pwd', { 
  template: '<div>'+
  '<h2 class="center">Perilous Wilds Dungeon Generator</h2>'+
  '<c-menubar id="PWD" v-bind:show="showmenu"></c-menubar>'+
  '<c-loadselect id="PWD" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>'+
  '<div class="content"><input class="form-control input-lg center" type="text" v-model="dungeon.name" v-on:input="onInput($event,`name`)" placeholder="NAME">'+
  '<textarea class="form-control" type="textarea" v-model="dungeon.notes" v-on:input="onInput($event,`notes`)" placeholder="ADD NOTES"></textarea></div>'+
  '<h4 class="center bar-bottom">Themes</h4>'+
  '<div class="box center content bottom-pad" v-for="theme in dungeon.themes" track-by="$index">{{theme | capitalize}}</div>'+
  '<h4 class="center bar-bottom">Areas</h4>'+
  '<c-pwd-area v-for="area in dungeon.areas" v-bind:A="area" v-bind:i="$index"></c-pwd-area></div>',
  data: function () {
    return {
      vid: 'PWD',
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {load:false},
      dungeon: {},
      seed: '',
      loadgen: '',
      allgens: {}
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
    save: function () {
      CPXSAVE.setItem(this.dungeon._id,this.dungeon).then(function(){});
      if(!objExists(this.allgens[this.dungeon._id])){
        Vue.set(this.allgens, this.dungeon._id, this.dungeon.name);
      }
    },
    load: function (D) {
      this.dungeon = D;
    },
    new : function () { 
      CPX.vue.page.newGen(this);
    },
    generate: function () {
      this.dungeon = CPX.PWD.generate(this.seed);
    },
    onInput: function (event,id){
      this.dungeon[id] = event.target.value;
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.seed='';
      this.dungeon = {};
      this.allgens = [];
    }
  }
})