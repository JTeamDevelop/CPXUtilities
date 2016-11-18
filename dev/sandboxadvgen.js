/* Version 1.11
  Last Update: changed name of component to match seed 
  - fixed vue fragment warnings by adding div
*/

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
  NPC: ['cleric','druid/cleric','fighter','paladin/fighter','ranger/dwarf','magic-user',
  'illusionist/magic-user','thief','assassin/halfling','monk/elf','animal trainer',
  'hermit','merchant','misc. NPC','pilgrim','sage','scribe','spy','smith','tradesman',
  'king','queen','queen mother','noble','noble household','noble teacher','castle employee',
  'soldier','slave','peasant']
};
SAG.adventure = function(opts){
  var A = {
    seed : opts.seed
  }
  //make id and RNG
  A._id = A.seed.join('');
  A.RNG = new Chance(A._id);
  
  //adventure keys
  var x = ['theme','trigger','goal','obstacle','location','feature','phenomena','artifact','vreason','NPC'];
  x.forEach(function(el) {
    //randomly pick from the data array
    A[el] = A.RNG.pickone(SAG[el]);
  });
  
  //clean up RNG & return adventure
  A.RNG = null;
  delete A.RNG;
  return A;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-fpg-SAG', { 
  props: ['A','idx'],
  template: '\
  <div class="content-minor">\
    <input class="form-control input-lg center" type="text" v-model="A.name" placeholder="NAME">\
    <textarea class="form-control" type="textarea" v-model="A.notes" placeholder="ADD NOTES"></textarea>\
    <div class="input-group ">\
      <span class="input-group-addon strong">Villain Reason</span>\
      <input class="center form-control" type="text" v-model="A.vreason">\
    </div>\
    <div v-for="key in keys" class="input-group ">\
      <span class="input-group-addon strong">{{key | capitalize}}</span>\
      <input class="center form-control" type="text" v-model="A[key]">\
    </div>\
  </div>\
  ',
  data: function(){
    return {
      keys: ['theme','trigger','goal','obstacle','location','feature','phenomena','artifact','NPC']
    }
  }
})

