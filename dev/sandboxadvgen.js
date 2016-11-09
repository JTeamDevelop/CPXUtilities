var SAG = {
  trigger : ['accusation','ambush','apparition','attack','conversation','destruction of object',
  'diary','drawing','dream','encounter w/ NPC','escape','manuscript','map','message','item, exotic',
  'item, mundane','oracle','plea','prophecy','public notice','reconnaissance','request',
  'summoned by group','survivor','symbol','teleportation','transaction','trap','vision','warning'],
  goal : ['aid other hero(es)','break curse affecting persons(s)','break curse affecting location',
  'capture fugitive','deal with growing threat','defend location','deliver message/object',
  'discover secret','escort/protect object(s)/person(s)','investigate location',
  'locate/track down NPC (ally/hero/villain)','maintain peace','prevent invasion',
  'rally ally(allies)/form allegiance(s)','reclaim lost location (regain control of)',
  'release person/creature from burden','rescue/free captive(s)/slave','root out spies/minions of evil',
  'search for knowledge/evidence','solve mystery - disappearance of object','solve mystery - disappearance of person(s)',
  'solve mystery - murder/death','solve mystery - theft','solve mystery - phenomenon',
  'stop conflict','stop impending devastation','stop plot from coming to fruition',
  'stop raids on location','stop strange phenomenon affecting location','stop villain from amassing power'],
  obstacle: ['acquire item','acquire knowledge','acquire key(s)/parts','awaken sleeping NPC',
  'beat time limitation','clear name(s)/restore honor','compete in tournament','complete scavenger hunt',
  'destroy item','escape location','explore location','find hidden/lost entrance',
  'find hidden/lost location','find magic item/object','find way back to key location',
  'fight for freedom','fix “broken” item','make long journey','make perilous journey',
  'navigate labyrinth','navigate series of portals','pass series of tests','perform ritual',
  'restore condition','race against antagonist(s)','reveal conspiracy','revive deceased NPC',
  'solve puzzle/riddles','speak incantation','stop ritual'],
  location: ['abbey','burial ground','catacombs','castle','cave/cavern','cemetery','chasm',
  'citadel/keep','city','dungeon','farmstead','fortress','forest','hamlet','hill','island',
  'mansion','mountain','outpost','palace','ruins','stronghold','temple','thorpe','tomb',
  'tower','town','undercity','village','volcano'],
  feature: ['altar','barracks','bridge','chapel','dais','door','fountain','garden',
  'gallery','gate','plaza','laboratory','library','machine, clockwork','machine, magical',
  'painting','pedestal','pit','pool','portal','sanctuary','sarcophagus','statue/idol',
  'shrine','statuary','tapestry','throne','waterfall','well','workshop'],
  phenomena: ['charm','darkness','decay','delusion','disease','disembodied voices',
  'energy drain (hp)','energy drain (level)','fear','fever','fog/mist','fungi/mold/slime',
  'hallucinations','hauntings','lights/colors','loss of memory','mania','monster plague',
  'nightmares','noises/sounds','panic/paranoia','paralyzation','poisoning(s)','shadows',
  'sickness','sightings of dead','sleep','strange vegetation','strange weather','transformation'],
  vreason: ['amusement/boredom','avoid loss/pain','corruption','debt owed','derangement/insanity',
  'destiny','domination/control','eliminate species','enslavement','envy','experimentation',
  'fear','forgotten reason','guilt','greed','hatred','honor','immortality','ideology (strange)',
  'loyalty (misplaced)','mass destruction','mischief','noble goal, extreme measures','power',
  'pride/vanity','pure evil','revenge','self-preservation/survival','serves higher “boss”','utopia (at all costs)'],
  artifact : ['amulet','bowl/brazier/censer','box','bracers','candle','codex/manual/tome',
  'cube','cup','figurine/idol','flask','gem/jewel','grimoire','horn/instrument','mask',
  'medallion','mirror','necklace','orb/sphere','pearl','potion','ring','rod','scarab',
  'scepter','spellbook','staff','stone','talisman','wand','weapon'],
  theme: ['blood','darkness/night','death','destiny','doom','freedom','forbidden','enchantment',
  'evil','flame(s)','glory','gold','greed','innocence','immortality','judgement','justice',
  'life','light/day','madness','mystery','power','rebirth','revenge','shadow','terror',
  'treasure','vengeance','wonder','wrath'],
  npc: ['cleric','druid/cleric','fighter','paladin/fighter','ranger/dwarf','magic-user',
  'illusionist/magic-user','thief','assassin/halfling','monk/elf','animal trainer',
  'hermit','merchant','misc. NPC','pilgrim','sage','scribe','spy','smith','tradesman',
  'king','queen','queen mother','noble','noble household','noble teacher','castle employee',
  'soldier','slave','peasant']
};
SAG.adventure = function(opts){
  var A = {
    seed : opts.seed
  }
  A._id = A.seed.join('');
  A.RNG = new Chance(A._id);
  
  //adventure keys
  var x = ['theme','trigger','goal','obstacle','location','feature','phenomena','vreason','artifact','npc'];
  x.forEach(function(el) {
    A[el] = A.RNG.pickone(SAG[el]);
  });
  
  var v = [];
  if(A.RNG.d10()==1){
    v = A.RNG.pickone(CPX.DW.DangerList[4]);
    A.villain = v[0];
    A.vreason = v[1];
  }
  else {
    if(A.RNG.d3()==1){
      v = A.RNG.pickone(CPX.DW.DangerList[A.RNG.d4()-1]);
      A.villain = v[0];  
    }
    else {
      A.villain = CPX.people(A.RNG,{rank:A.RNG.weighted(["uncommon", "rare", "legendary"], [4,0.8,0.2])});
    }
  }
  
  A.RNG = null;
  delete A.RNG;
  return A;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-sag-result', { 
  props: ['A','allgens','idx'],
  template: '\
  <div class="box margin-full">\
    <h4 class="header center">\
      {{A.name}}\
      <button v-on:click="remove" type="button" class="close"><span aria-hidden="true">&times;</span></button>\
    </h4>\
    <div class="content">\
      <input class="form-control input-lg center" type="text" v-model="A.name" placeholder="NAME">\
      <textarea class="form-control" type="textarea" v-model="A.notes" placeholder="ADD NOTES"></textarea>\
      <div v-for="key in keys">\
      </div>\
      <button v-on:click="save" type="button" class="btn btn-info btn-block">Save</button>\
    </div>\
  </div>\
  ',
  data: function(){
    return {
      keys: ['theme','trigger','goal','obstacle','location','feature','phenomena','vreason','artifact','npc']
    }
  },
  computed: {
    nature: function(){
      return this.object.class.slice(1).unique().join(", ");
    }
  },
  methods:{
    save: function(){
      CPXSAVE.setItem(this.A._id,this.A).then(function(){});
      if(!objExists(this.allgens[this.A._id])){
        Vue.set(this.allgens, this.A._id, this.A.name);
      }
    },
    remove: function(){
      HUB.$emit('SAG-remove',this.idx);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-sag', { 
  template: '\
  <div>\
    <h2 class="center">People & Creature Generator</h2>\
    <c-menubar id="SAG" v-bind:show="showmenu"></c-menubar>\
    <c-loadselect id="SAG" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
    <c-sag-result v-for="A in current" v-bind:A="A" v-bind:idx="$index" v-bind:allgens="allgens"></c-sag-result>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'SAG',
      showmenu:{
        new:true,
        load:true,
        save:false,
        close:true
      },
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
    load: function (A) {
      var push = [A].concat(this.current);
      this.current = push;
    },
    new : function () { 
      this.current=[];
      this.generate();
    },
    generate: function () {
      var seed=[];
      for(var i=0;i<5;i++){
        seed = ['SAG','-',CPXC.string({length: 27, pool: base62})];
        this.current.push(SAG.adventure({seed:seed}));
      }
    },
    remove: function(idx){
      this.current.splice(idx,1);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.current=[];
      this.saveID = '';
      this.allgens = [];
    }
  }
})

