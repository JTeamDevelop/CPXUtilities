CPX.CFP = {
  densities: ['dense','scattered','frontier','unsettled','desolate'],
  habitation: ['uninhabited','single dwelling','thorp','hamlet','village','town, small',
  'town, large','city, small','city, large','metropolis, small','metropolis, large',
  'stronghold','temple','ruin','special'],
  special: {
    water: 'achored boat', 
    "swamp": 'unihabited',
    "desert": 'nomad camp',
    "plain": 'nomad camp',
    "forest": 'logging camp',
    "hill": 'military outpost',
    "mountain": 'mine'
  },
  dense:{
    items: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    p: [3,3,3,2,2,1,1,2,2,1,3,3,2,1],
    special:{
      items: ['manor','peasant long house','orphanage','traders’ village','mill',
        'military barracks','church','chapterhouse','bath house','alehouse/tavern/inn'],
      p: [4,3,3,3,2,3,3,3,3,2]
    }
  },
  scattered:{
    items: [0,1,2,3,4,5,6,7,8,11,12,13,14],
    p: [5,6,3,3,2,2,1,1,1,2,2,1,1],
    special:{
      items: ['manor','farmstead','farmstead','migrant camp','mill','military structure',
      'abbey', 'priory','nunnery','bath house','inn'],
      p: [4,3,3,3,2,1,1,1,2,9]
    }
  },
  frontier:{
    items: [0,1,2,3,4,5,6,11,12,13,14],
    p: [10,3,3,2,2,2,1,1,1,4,1],
    special:{
      items: ['manor','trading outpost','military outpost','military camp','work camp',
              'abbey','priory','nunnery','hermitage','nomad camp'],
      p: [3,8,5,2,2,1,1,1,3,4]
    }
  },
  unsettled:{
    items: [0,1,2,3,4,5,13,14],
    p: [13,6,2,2,2,1,3,1],
    special:{
      items: ['hermit','trading outpost','military outpost','military camp','work camp',
              'prison','hermitage','nomad camp','monastery','re-roll on “Desolate”'],
      p: [1,5,6,3,2,2,3,3,4,1]
    }
  },
  desolate:{
    items: [0,1,2,3,13],
    p: [23,2,1,1,3],
    special:{
      items: ['abandoned/forgotten tower','abandoned/forgotten castle/fortress',
              'abandoned/forgotten temple','abandoned/forgotten town','abandoned/forgotten city',
              'sunken city (partially submerged in ground)','lost city (below ground)',
              'shrine (1-2 on 1d3 = inactive)','hermit','monastery'],
      p: [6,5,2,1,2,1,1,3,7,1]
    }
  },
  govt: [
    ['anarchy', 'lawless society'],
    ['argentocracy', 'money - all decisions made by financial prudence'],
    ['aristarchy', 'the best - through contest'],
    ['aristocracy', 'nobility'],
    ['autocracy', 'individual with absolute power (e.g., emperor/dictator)'],
    ['cryptarchy', 'secret rulership'],
    ['democracy', 'the people'],
    ['demonocracy', 'demons (or representatives of demons)'],
    ['ecclesiarchy', 'clerics'],
    ['ethnocracy', 'a particular race (among mixed races)'],
    ['gerontocracy', 'eldest citizens (age-based)'],
    ['gynocracy', 'women'],
    ['heroarchy', 'heroes'],
    ['heterarchy', 'foreign ruler'],
    ['matriarchy', 'eldest females'],
    ['militocracy', 'military rulers'],
    ['monarchy', 'individual, usually hereditary (e.g., queen/king)'],
    ['oligarchy', 'the few (usually co-equal)'],
    ['patriarchy', 'eldest males'],
    ['pedantocracy', 'strict rule-bound scholars'],
    ['pedocracy', 'learned, savants, and scholars'],
    ['phallocracy', 'government by men'],
    ['plutocracy', 'the wealthy'],
    ['prophetocracy', 'government by a prophet'],
    ['quangocracy', 'quasi-autonomous non-governmental organizations'],
    ['statocracy', 'the state alone, without ecclesiastical influence'],
    ['thearchy', 'a god or gods (or through 1 or more representatives)'],
    ['theocracy', 'priests or religious law'],
    ['tritheocracy', 'three gods (or representatives thereof)'],
    ['xenocracy', 'a body of foreigners']
  ],
  outsiders: [
    'accepting of','aggravated by','amused by','annoyed with','anxious around','apathetic toward',
    'bored by','curious about','cynical of','enraged by','enthralled with','envious of',
    'excited by','frustrated with','grumpy around','impressed by','indifferent to','infuriated by',
    'irritated by','melancholy about','peaceful around','pissed off with','predatory of',
    'rejecting of','restless around','sympathetic toward','tired of','uncomfortable around',
    'unimpressed by','weird around'
  ],
  economy: ['booming','bullish/hopeful','depressed','doomed','expanding',
    'inflationary','overheated/growing too fast','recessionary',
    'uncontrolled/fluctuating','weak'],
  taxes: ['low','average','exorbitant'],
  issues: ['beggars/vagrancy','drunkards','corruption','disease','feuding','fire',
    'prostitution','theft (pickpockets)','unrest (general)','waste issues'],
  issuedegree:['minor/contained','moderate/widespread','major/pervasive'],
  threats: ['bandits (thieves)','barbarians (horde)','beetles, giant','bugbears',
    'chimera','clerics (evil)','dragon','elves (evil)','ettin','gargoyles','ghouls',
    'giant(s)','gnolls','goblins','harpie(s)','hobgoblins','kobolds','lizard men','mage (hostile)',
    'manticore','ogre(s)','ogre mage','pterodactyl','roc','skeletons','troglodytes',
    'trolls','witch','wolves','zombies'],
  leader: {
    class:['fighter','magic-user','cleric','dwarf','elf','halfling'],
    p:[8,6,10,2,2,2],
    levelstart:[9,11,7,9,9,9]
  },
  stype : {
    'fighter':['castle','keep/square','keep/round','keep/shell','towers/square','towers/round','concentric'],
    'magic-user':['tower','round/sloped','round/straight','round/stepped','square/sloped','square/straight','square/stepped'],
    'dwarf':['mountain stronghold','centralized/flat','spread/concave','spread/convex','modular/towered','hidden/disguised','concentric'],
    'halfling':['shire','mounds/walled','mounds/hidden','mounds & trees/walled','mounds & trees/hidden','castle/walled','castle/hidden']
  },
  ssize: {
    'fighter':{
      levels:[['1d2',1],['1d3',2],['1d3',4],['1d5',6],['1d6',10]],
      rings:[['1d2',1],['1d2',2],['1d2',3],['1d2',4],['1d2',5]]
    },
    'magic-user':[['1d2',1],['1d3',2],['1d3',4],['1d5',6],['1d6',10]],
    'elf':{
      trees:[['1d2',0],['1d2',1],['1d3',3],['1d5',6],['1d6',10]],
      levels:[1,2,3,5,6,10]
    },
    'dwarf':[['1d2',0],['1d2',1],['1d3',3],['1d5',6],['1d6',10]],
    'halfling':[['1d2',1],['1d3',2],['1d3',4],['1d5',6],['1d6',10]]
  },
  ruin: [
    
  ]
}
CPX.CFP.stronghold = function (opts){
  var S = {
    seed: opts.seed,
    class:['stronghold'],
    name : typeof opts.name === "undefined" ? '' : opts.name,
    notes : typeof opts.notes === "undefined" ? '' : opts.notes,
  }
  S._id = S.seed.join('');
  S.RNG = new Chance(S._id);

  var L =CPX.CFP.leader; lt = S.RNG.weighted(L.class,L.p), li=L.class.indexOf(lt);
  S.leader = {
    class: lt
  }
  S.leader.level = L.levelstart[li] + S.RNG.rpg('1d'+L.p[li])[0];
  
  S.type = S.RNG.d6();
  S.size = S.RNG.rpg('1d5')[0]-1;
  
  var size=[], type = '';
  if(['magic-user','dwarf','halfling'].includes(lt)){
    S.class.push(CPX.CFP.stype[lt][0]);
    size = CPX.CFP.ssize[lt][S.size];
    S.size = S.RNG.rpg(size[0])[0]+size[1];
    S.type = CPX.CFP.stype[lt][S.type];
  }
  else if(['fighter','cleric'].includes(lt)){
    S.class.push(CPX.CFP.stype.fighter[0]);
    if([0,1,3,4].includes(S.type-1)){  
      size = CPX.CFP.ssize.fighter.levels[S.size];
    }
    else {
      size = CPX.CFP.ssize.fighter.rings[S.size];
    }
    S.size = S.RNG.rpg(size[0])[0]+size[1];
    S.type = CPX.CFP.stype.fighter[S.type];
  }
  else {
    S.class.push('Tree Stronghold');
    size = CPX.CFP.ssize.elf.trees[S.size];
    S.size = S.RNG.rpg(size[0])[0]+size[1];

    if(S.type>1){
      S.type = S.RNG.rpg('1d'+CPX.CFP.ssize.elf.levels[S.type-1]);
    }
    S.type += ' trees'
  }

  S.RNG = null;
  delete S.RNG;
  return S;
}
CPX.CFP.city = function (opts){
  var CFP = CPX.CFP;
  var P = {
    seed: opts.seed,
    type: opts.type,
    class:['city',CPX.CFP.habitation[opts.type]],
    name : typeof opts.name === "undefined" ? '' : opts.name,
    notes : typeof opts.notes === "undefined" ? '' : opts.notes,
    people : typeof opts.people === "undefined" ? [] : opts.people,
    govt : typeof opts.govt === "undefined" ? -1 : opts.govt,
  }
  P._id = P.seed.join('');
  P.RNG = new Chance(P._id);
  
  //population calc
  var pmult= [[50,500],[500,1000],[500,5000],[5000,10000],[5000,50000],[50000,100000],[50000,500000]]
  if(opts.type==2){ P.pop = P.RNG.rpg('1d5')*10; }
  else if(opts.type==3){ P.pop = P.RNG.rpg('1d12')*30; }
  else { 
    P.pop = (P.RNG.diceSum('2d6')-2)*pmult[opts.type-4][0]+pmult[opts.type-4][1]; 
  }
  
  //pick population if none given
  if(P.people.length==0){
    //number of people
    var np = P.RNG.weighted([1,2,3],[7,2.5,0.5]);
    for(var i=0;i<np;i++){
      P.people.push(CPX.people(P.RNG,{terrain:opts.terrain}));
    }
  }
  
  //pick economy
  P.economy = P.RNG.pickone(CPX.CFP.economy);
  P.taxes = P.RNG.pickone(CPX.CFP.taxes);
  //government
  P.government = P.RNG.natural({min:0,max:CPX.CFP.govt.length-1});
  //view of outsiders
  P.outsiders = P.RNG.pickone(CPX.CFP.outsiders);
  //issues
  P.issue = P.RNG.pickone(CPX.CFP.issues);
  P.idegree = P.RNG.pickone(CPX.CFP.issuedegree);
  
  //threats
  P.threat = P.RNG.pickone(CPX.CFP.threats);
  
  P.RNG = null;
  delete P.RNG;
  return P;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cfp-ppl', { 
  props:['P'],
  template: ''+
  '<div class="content-minor box">'+
    '<input class="center form-control strong" type="text" v-model="P.name">'+
    '<div class="input-group" v-if="P.tags.length>0">'+
      '<span class="input-group-addon strong">Tags</span>'+
      '<input class="center form-control" type="text" v-model="P.tags">'+
    '</div>'+
  '<div>'
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cfp-30S', { 
props:['obj'],
template: ''+
  '<div class="content">'+
    '<input class="form-control input-lg center" type="text" v-model="obj.name" placeholder="NAME">'+
    '<textarea class="form-control" type="textarea" v-model="obj.notes" placeholder="ADD NOTES"></textarea>'+
    '<div class="input-group">'+
       '<span class="input-group-addon strong">Leader</span>'+
       '<input class="center form-control" type="text" v-model="obj.leader.class">'+
       '<span class="input-group-addon strong">Level</span>'+
       '<input class="center form-control" type="number" v-model="obj.leader.level">'+
    '</div>'+
    '<div class="input-group">'+
      '<span class="input-group-addon strong">Type</span>'+
      '<input class="center form-control" type="text" v-model="obj.type">'+
      '<span class="input-group-addon strong">Size</span>'+
      '<input class="center form-control" type="text" v-model="obj.size">'+
    '</div>'+
  '</div>',
  data: function () {
    return {
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cfp-30C', { 
props:['obj'],
template: ''+
  '<div class="content">'+
    '<input class="form-control input-lg center" type="text" v-model="obj.name" placeholder="NAME">'+
    '<textarea class="form-control" type="textarea" v-model="obj.notes" placeholder="ADD NOTES"></textarea>'+
    '<div class="content-minor box">'+
      '<div class="header strong center">Population ({{obj.pop}})</div>'+
      '<c-cfp-ppl v-for="ppl in obj.people" v-bind:P="ppl"></c-cfp-ppl>'+
    '</div>'+
    '<div class="input-group">'+
      '<span class="input-group-addon strong">Government</span>'+
      '<select class="form-control" v-model="obj.government">'+
        '<option  v-for="g in govt" v-bind:value="$index">{{g[0]}}</option>'+
      '</select>'+
    '</div>'+
    '<div class="center strong bottom-pad">{{govt[obj.government][1]}}</div>'+
    '<div v-for="key in keys" class="input-group">'+
       '<span class="input-group-addon strong">{{titles[$index] | capitalize}}</span>'+
       '<input class="center form-control" type="text" v-model="obj[key]">'+
    '</div>'+
  '</div>',
  data: function () {
    return {
      keys : ['economy','taxes','issue','idegree','threat'],
      titles : ['economy','taxes','issue','Issue Degree','threat'],
      govt: CPX.CFP.govt
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cfp-result', { 
  props:['obj','idx','allgens'],
  template: ''+
  '<h4 class="center header">'+
    '{{obj.name}} {{obj.class[1] | capitalize}}'+
    '<button v-on:click="remove" type="button" class="close"><span aria-hidden="true">&times;</span></button>'+
  '</h4>'+
  '<component v-bind:is="type" v-bind:obj="obj" v-bind:idx="idx"></component>'+
  '<button v-on:click="save" type="button" class="btn btn-info btn-block bottom-pad">Save</button>',
  computed: {
    type: function(){
      return 'c-cfp-'+this.obj.seed[0];
    }
  },
  methods:{
    save: function(){
      CPXSAVE.setItem(this.obj._id,this.obj).then(function(){});
      if(!objExists(this.allgens[this.obj._id])){
        Vue.set(this.allgens, this.obj._id, this.obj.name);
      }
    },
    remove: function(){
      HUB.$emit('CFP-remove',this.idx);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cfp', { 
  template: ''+
  '<div>'+
    '<h2 class="center">City/Stronghold Generator</h2>'+
    '<c-menubar id="CFP" v-bind:show="showmenu"></c-menubar>'+
    '<c-loadselect id="CFP" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>'+
    '<div class="center content-minor">'+
      '<div class="btn-group bottom-pad" role="group" aria-label="...">'+
        '<button v-on:click="d30C" type="button" class="btn btn-info">d30 City</button>'+
        '<button v-on:click="d30S" type="button" class="btn btn-info">d30 Stronghold</button>'+
      '</div>'+
      '<div class="btn-group bottom-pad" role="group" aria-label="...">'+
        '<button v-on:click="DWS" type="button" class="btn btn-info">DW Stading</button>'+
        '<button v-on:click="CPC" type="button" class="btn btn-info">CPX City</button>'+
      '</div>'+
    '</div>'+
    '<c-cfp-result v-for="obj in current" v-bind:obj="obj" v-bind:type="type" v-bind:idx="$index" v-bind:allgens="allgens"></c-cfp-result>'+
  '</div>',
  data: function () {
    return {
      vid: 'CFP',
      loadids: ['30C','30S','DWS','CPC'],
      showmenu:{
        new:true,
        load:true,
        save:false,
        close:true
      },
      type: '',
      showlist: {load:false},
      current: [],
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
    load: function (C) {
      var push = [C].concat(this.current);
      this.current = push;
    },
    new : function () { 
      this.current=[];
    },
    d30C : function () { 
      this.current=[];
      for(var i=0;i<4;i++){
        this.current.push(CPX.CFP.city({
          seed:['30C','-',CPXC.string({length: 27, pool: base62})],
          type: CPXC.rpg('1d9')[0]+1
        }));
      }
    },
    d30S : function () {
      this.current=[];
      for(var i=0;i<4;i++){
        this.current.push(CPX.CFP.stronghold({
          seed:['30S','-',CPXC.string({length: 27, pool: base62})]
        }));
      }
    },
    DWS : function () {
      this.current=[];
      for(var i=0;i<4;i++){
        this.current.push(CPX.DWSteading({
          seed:['DWS','-',CPXC.string({length: 27, pool: base62})],
          type : CPXC.pickone(CPX.data.DWSteadings.basic)
        }));
      }
    },
    CPC : function () {
      this.current=[];
      for(var i=0;i<4;i++){
        this.current.push(CPX.city({
          seed:['CPC','-',CPXC.string({length: 27, pool: base62})],
          size : CPXC.natural({min:1,max:5})
        }));
      }
    },
    generate: function () {
    },
    remove: function(idx){
      this.current.splice(idx,1);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.current=[];
      this.allgens = {};
    }
  }
})