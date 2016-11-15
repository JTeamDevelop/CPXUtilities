//Fantasy plot Object
//Contains basic data to be randomly selected
CPX.FP = {};
CPX.FP.factions=["Refugees", "Bandits", "Pirates", "Halfings", "Gnolls", "Goblins", "Lycantrophes", "Ogres", "Orcs", "Hobgoblins", "Trolls",  "Kobolds", "Lizardfolk", "Sahuagin", "Gargoyles", "Harpies", "Minotaurs", "Yeti", "Giant Insects", "Giant Spiders", "Giant Bugs", "Demi-humans", "Monstrous Humaniods", "Beasts", "Elves", "Dwarves", "Gnomes","Merfolk","Secret Brotherhood", "Assassins", "Monks",  "Dark Elves", "Deep Dwarves", "Ghouls", "Wights", "Wraiths", "Ghosts", "Vampires", "Aliens (Hive)", "Aliens (Conquerors)", "Aliens (Breeders)", "Aliens (Experimentors)", "Undead", "Constructs","Elementals", "Wizards", "Cultists", "Dragons", "Golems", "Liches", "Genies", "Outsiders (Positive)", "Outsiders (Negative)", "Outsiders (Neutral)", "Aliens (Alien)", "Foreigners", "Evil Empire", "Snake Men"];
CPX.FP.threats=["Bandit", 'Monstrous Humanoid', "Demi-human", "Beast", "Alien Predator", "Intelligent Alien", "Dragon", "Elemental", "Outsider", "Undead", "Construct", "Wizard", "Vermin"];
CPX.FP.villains=["Gang Lord","Murderer","Internal Faction","Cult Leader","Ruler of Lost Civilization","Wicked Foreigner","Thief","Assassin","Femme Fatale", "Law Official","Dictator","Foreign Allied Faction","Powerful Noble","Merchant","Crime Lord","Pirate","Anarchist", "Royal","Government Official","Mastermind","Nemesis",'Creature','Ruler','Former Ally','Monstrous Humanoid', 'Fanatic','Friend','Barbarian','Enemy','Shadowy Figure','Ally','Priest', 'Gang', 'Stranger', 'Nation','Mercenary', 'Criminals', 'Warrior','Watchmen', 'Spy', 'Military Veteran', 'Lunatic', 'Adventurer', 'Warlord', 'Recurring NPC', 'Champion','Construct', 'Undead', 'Giant','Invader', 'Demi-human','Immortal', 'Guild','Monster','Abberation','Outlaw','Traitor','Cult', "Wizard", "Supernatural Threat","Mad Alchemist", "Alien", 'Dragon', 'Magic User', 'Magical Beast', 'Artifact',  'Outsider', 'Sorcerer', 'Deity', 'Hazardous Environment', 'Time', 'War','Conspiracy', 'Puzzle'];
CPX.FP.agendas=["Radical", "Fiend", "Destroyer", "Invader", "Collaborator"];
CPX.FP.hooks=["Solicitation","Dead Body","Disaster","Attack","Bizarre Occurrence","News","Friend in Need","Up To Their Necks"];
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Dungeon World data - spefically the data from the Fronts section
CPX.DW = {};
CPX.DW.DangerTypes=["Ambitious Organization","Planar Force","Arcane Enemy","Horde","Cursed Place"];
CPX.DW.DangerList=[
  [["Misguided Good","To do what is 'right' no matter the cost"],["Thieves Guild","To take by subterfuge"],["Cult","To infest from within"],["Religious Organization","To establish and follow doctrine"],["Corrupt Government","To maintain the status quo"],["Cabal ","To absorb those in power, to grow"]],
  [["God","To gather worshippers"],["Demon Prince","To open the gates of Hell"],["Elemental Lord","To tear down creation to its component parts"],["Force of Chaos","To destroy all semblance of order"],["Choir of Angels","To pass judgement"],["Construct of Law","To eliminate perceived disorder"]],
  [["Lord of the Undead","To seek true immortality"],["Power-mad Wizard","To seek magical power"],["Sentient Artifact","To find a worthy wielder"],["Ancient Curse","To ensnare"],["Chosen One","To fulfill or resent their destiny"],["Dragon","To hoard gold and jewels, to protect the clutch"]],
  [["Wandering Barbarians","To grow strong, to drive their enemies before them"],["Humanoid Vermin","To breed, to multiply and consume"],["Underground Dwellers","To defend the complex from outsiders"],["Plague of the Undead","To spread"]],
  [["Abandoned Tower","To draw in the weak-willed"],["Unholy Ground","To spawn evil"],["Elemental Vortex","To grow, to tear apart reality"],["Dark Portal","To disgorge demons"],["Shadowland","To corrupt or consume the living"],["Place of Power","To be controlled or tamed"]]
];
CPX.DW.ImpendingDoom=[["Tyranny","rule of the strong over the weak or the few over the many"],["Pestilence","the spread of sickness and disease, the end of wellness"],["Destruction","apocalypse, ruin and woe"],["Usurpation","the chain of order comes apart, someone rightful is displaced"],["Impoverishment","enslavement, the abandonment of goodness and right"],["Rampant Chaos","the laws of reality, of society, or any order is dissolved"]];
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Villain generator for fantasy plot - input is the Random NUmber Generator (RNG) so that the results can be seeded 
CPX.FP.Villain = function (RNG) {
  //villain gen
  var va = [], V={}; 
  //10% chance of a Cursed Place - impersional - villain pulled from DungeonWorld data
  if(RNG.d10()==1){
    //dungeon world danger - the reason becomes the danger's motive
    va = RNG.pickone(CPX.DW.DangerList[4]);
    V.name = va[0];
    V.reason = va[1];
    V.class = ['danger'];
  }
  else {
    //33% chance of pulling a DungeonWorld Danger 
    if(RNG.rpg('1d3')[0]==1){
      //from the "Ambitious Organization","Planar Force","Arcane Enemy","Horde" categories
      va = RNG.pickone(CPX.DW.DangerList[RNG.d4()-1]);
      //villain sitll has reason determined above
      V.name = va[0];
      V.class = ['danger'];
      V.reason = RNG.pickone(SAG.vreason);
    }
    //alternately roll up a random people to be a villain
    else {
      V = CPX.people(RNG,{rank:RNG.weighted(["uncommon", "rare", "legendary"], [4,0.8,0.2])});
      V.reason = RNG.pickone(SAG.vreason);
    }
  }
  //pick doom
  V.doom = RNG.pickone(CPX.DW.ImpendingDoom);
  //make special tags
  V.tags = [RNG.pickone(COLORDESCRIPTORS)].concat(
    CPX.creature.special(RNG,"aspect"),
    CPX.creature.special(RNG,"ability"),
    CPX.creature.special(RNG,"element"),
    CPX.creature.special(RNG,"magic")
  );
  V.tags = V.tags.join(', ');
  
  return V;
}
//Random location generator
CPX.FP.Location = function(RNG) {
  var x='';
  //basic terrain types
  var al=['Mountains', 'Forest/Jungle', 'Desert/ Wasteland', '...by the Sea', 'Island', 'Plains', 'Swamp', 'Hills', 'Underground'];
  //special location whereuiring long travel -  the terrain is located
  var el=['Another Plane', 'Distant Kingdom' , 'The South', 'The North', 'The West', 'The East', 'Frontier', 'Foreign Land', 'Border', 'Across the Sea', 'Nearby Kingdom', 'Fabled Land'];
  //sub-location specific to the terrain
  var sl=['Wilderness','Town','Fortification','Ruins'];
  
  //25% chance of special location
  if(RNG.bool({likelihood:25})){
    x+=RNG.pickone(el)+": ";
  }
  //33% chance of double terrain types
  if(RNG.bool({likelihood:33})){
    x+=RNG.pickone(al)+" & ";
  }

  x+=RNG.pickone(al)+" ("+RNG.pickone(sl)+") ";
  return x;
}
//Random plot generator
CPX.FP.Plot = function(RNG) {
  //the verb performs the noun
  var verb=['Assassinate','Combat','Guide','Chase','Disguise','Move','Conceal','Strike','Assist','Discover','Avenge','Quest For','Travel with','Track','Obliterate','Reveal','Find','Protect','Liberate','Escort','Deliver','Aid','Encounter','Beset','Retrieve','Attack','Foil'  ,'Rescue','Defeat','Assault','Oppose','Shield','Race','Serve','Guard','Meet','Investigate','Get Past','Speak with','Contend with','Negotiate with','Defend','Explore','Resist','Support','Fight','Observe','Infiltrate','Join','Take','Journey to/with','Repel','Destroy','Protect','Fight','Kill','Steal','Escape from','Create','Safeguard','Battle','Trap','Locate','Save', "Manipulate","Sell","Acquire","Kill","Control","Steal","Create","Hunt","Terrorize","Infiltrate","Overthrow", "Obliterate","Ransom","Blackmail","Hijack","Bomb","Smuggle","Murder","Rob","Attack","Rule","Take","Destroy","Extort"];
  var noun=['Angel','Demon','Treasure','Wizard','God','Army','Monster','New Race','Princess','Thief','Friend','Magical Beast','Soldiers','Bard','Monk','Magical Event','Organization','Giant','Enemy','Undead','Villain','Rogue','Barbarian', 'Merchant','Secret','Warlord','Gem or Jewel','Ally','Village','Warrior','Stranger','Woman','Item','Secret','Rival','Peasants', 'Magic','Artifact','Noble','Man','Construct','Priest','Oracle','Dragon','Dungeon','Kingdom','Child','Creature','Ruler','Map','Guards','Humanoid','Castle','Weapon','Animal','Magic Item','Monster','Government','Abberation','Outsider','Love Interest','Sorcerer','Humanoid','Prophecy',"Monster","Building","People","a Country","Treasure","an Enemy","an Object","an Invention","a Woman","a Man","the Hero (or team)","Money","a City","the World","a Vehicle","a Business","a Lost World","Jewels","a Ruler","Someone famous","a Rival","the Law","Innocent Victims","Hero's Friends or Family"];

  return RNG.pickone(verb)+' '+RNG.pickone(noun);
}
//Faction generator
CPX.FP.Faction = function(RNG,allfactions) {
  //rarity of the faction people 
  var rank = RNG.weighted(["uncommon","rare","legendary"],[4,1,0.2]);
  //use the CPX people generator
  var x= CPX.people(RNG,{rank:rank});
  
  //faction desire
  var desire=["want to protect their territory", "are hunting", "are raiding", "are warring", "are seeking", "are increasing in number", "are scheming", "are hiding", "are seeking to trade"];
  //randomly add 4 plots 
  for(var i=0;i<4;i++) { desire.push('want to '+CPX.FP.Plot(RNG)); }
  //if there are already factions created, they may support one anohter
  if(allfactions.length>1){ desire.push("allied to the "+RNG.pickone(allfactions).name); }
  //give the faction a profession - using CPX generator
  x.profession = CPX.professions(RNG,['Bandits','Refugees','Cult','Mob','Mystics'])
  //randomly pick desire
  x.desire = RNG.pickone(desire);
  return x;
}
//Creates a random cast of supporting characters
CPX.FP.SupportingCast = function(RNG) {
  //random number of characters
  var n = RNG.diceSum('2d4'), S=[], sc='';
  //na and nb are natures
  var na=["Neat", "Foreign", "Ambitious", "Wild", "Patriotic", "Hard-boiled","Urban","Old","Native","Secretive","Quirky","Big","Small","Young"], 
  nb=["Trustworthy", "Lucky", "Beautiful", "Talented", "Highly Trained", "Helpful", "Professional", "Athletic", "Agile", "Famous", "Well Connected", "Empathetic", "Sharp Eyed", "Quick Thinking", "Logical", "Smart", "Educated", "Strong", "Tough", "Intimidating", "Powerful", "Understanding", "Smooth Talking", "Charming", "Rich", "Nimble Footed", "Strong Willed"],
  //drawbacks
  db=["Evil","Odd","Amateur","Violent","Feisty","Ugly","Shifty","Helpless","Troublesome","Sloppy", "Dense","Cold","Impulsive","Clumsy", "Dangerous","Weak", "Unlucky","Menacing","Weak-willed", "Slow", "Deceptive", "Shifty", "Unperceptive", "Sickly", "Unimpressive", "Bumbling", "Poor"],
  //profession
  prof=["Actor","Captain","Soldier","Government Official","Contact", "Burglar", "Merchant","Guide","Servant","Noble","Wizard", "Healer","Criminal", "Investigator","Spouse","Expert","Informant","Farmer","Thug","Fanatic","Academic","Assistant", "Worker","Henchman","Kid","Fighter","Barbarian","Monk","Cleric","Priest","Thief","Scout","Explorer","Ranger","Bard","Royal","Druid","Foreigner"];
  //for n randomply pick the above
  for (var i=0; i<n; i++) {
    sc=RNG.pickone(na);
    if(RNG.bool({likelihood:15})) {sc+=' and '+ RNG.pickone(nb);}
    sc+=' but ' + RNG.pickone(db) + ' ' + RNG.pickone(prof);
    S.push(sc);
  }
  
  return S;    
}
//Randomly generates plot twists
CPX.FP.PlotTwist = function(RNG) {
  //Types of plot twists
  var T = ["Betrayal!","New Location: " +CPX.FP.Location(RNG),"Greater Villain", "Hidden Plot: " + CPX.FP.Plot(RNG),
    "Reversal!","Bizarre Occurrence","Deus Ex Machina"];
  var PT=RNG.pickone(T);
  //if greater villain, generate the villain 
  if(PT=="Greater Villain") {
    var V = CPX.FP.Villain(RNG);
    PT = "Greater Villain: " + V.name;
  }
  return PT;
}
//Random Complications to create setbacks for the players
CPX.FP.AdventureComplication = function (RNG){
    var x='';
    //big list of complications
    var ca=['Ambush','Monsters','Enemy','Ranged Assault','Magical Attack','Mob','Brawl'];
    var cb=['Travel Problem', 'Getting Lost', 'Environment', 'Weather', 'Disaster', 'Barriers', 'Physical Challenge','Side-tracked','Magical Event','Magical Barrier'];
    var cc=['Trap','Mechanical Trap','Equipment Failure','Construct','Lack of Information','Red Herring', 'Race', 'Contest', 'Tournament', 'Puzzles','Physical Puzzle', 'Riddles','Unknown Language','Mystery', 'Magical Mystery','Magical Trap','Magical Puzzle'];
    var cd=['Trickery','Theft','Criminals','Thieves','Spies','Abduction','Misdirection'];
    var ce=['Royal Influence','Power Struggle','Politics','Love Interest','Bureaucracy','Diplomacy','Superstition','Royal Ambition','Social Event','Angry Mob','Frightened Commoners','Power Struggle','Noble Influence','Military Influence','Guild Influence','Local Conflict','Legal Trouble','Lack of trust','Religion' ];
    var cf=['Duel','Rivalry','Vendetta','Betrayal','Double-Cross','Mistaken Identity','Deity Interference'];
    var cg=['Drugs','Insanity','Fear','Money','Taxes','Disease','Plague','Famine','Innocents','War','Invasion'];
    var ch=['Chest', 'Locker', 'Treasure Map', 'Cache'];
    //chain the complications together
    var clist=[ca,cb,cc,cd,ce,cf,cg,ch];
    //randomly pick 
    return RNG.pickone(RNG.pickone(clist));
}
//Core adventure generator, provide include array
CPX.FP.Adventure = function (opts){
  //Adventure object, they all have a villain, plot, location, and factions
  //twist, complications, hook, and supporting cast are optional - include them in the include array
  var A = {
    seed : opts.seed,
    factions:[],
    twist:'',
    complication:'',
    hook:'',
    cast:[]
  }
  //make id and RNG
  A._id = A.seed.join('');
  A.RNG = new Chance(A._id);
  
  A.villain = CPX.FP.Villain(A.RNG);
  A.plot = CPX.FP.Plot(A.RNG);
  A.location = CPX.FP.Location(A.RNG);
  for(var i=0;i<(Number(A.RNG.rpg('1d3'))+1);i++){
    A.factions.push(CPX.FP.Faction(A.RNG,A.factions));
  }
  
  A.twist = CPX.FP.PlotTwist(A.RNG);
  A.complication = CPX.FP.AdventureComplication(A.RNG);
  A.hook = A.RNG.pickone(CPX.FP.hooks);
  A.cast = CPX.FP.SupportingCast(A.RNG);
  
  //clean up RNG & return adventure
  A.RNG = null;
  delete A.RNG;
  return A;
} 
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Components to load with the fantasy generator 
//Standard villain display
Vue.component('c-fpg-villain', { 
props: ['V'],
template: ''+
  '<div class="box">'+
    '<h4 class="center strong">Villain</h4>'+
    '<input class="form-control center strong" type="text" v-model="V.name" placeholder="NAME">'+
    '<div class="input-group ">'+
      '<span class="input-group-addon strong">Tags</span>'+
      '<textarea class="center form-control" type="textarea" v-model="V.tags"></textarea>'+
    '</div>'+
    '<div class="input-group ">'+
      '<span class="input-group-addon strong">Reason</span>'+
      '<input class="center form-control" type="text" v-model="V.reason">'+
    '</div>'+
  '</div>'
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Standard faction display
Vue.component('c-factions', { 
  props: ['factions'],
  template: '<div><strong>Main Factions:</strong><ul><li v-for="f in factions"><div><strong>{{f.name}} {{f.profession}}</strong> who {{f.desire}}</div>' +
            '<div v-if="f.special.length>0"><strong>Tags:</strong> {{f.special.unique().join(`, `) | capitalize }}</div></li></ul></div>' 
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-fpg-cfp', {
  props: ['A','idx'],
  template: '\
  <div class="content"><input class="form-control input-lg center" type="text" v-model="A.name" placeholder="NAME">\
  <textarea class="form-control" type="textarea" v-model="A.notes" placeholder="ADD NOTES"></textarea></div>\
  <c-fpg-villain v-bind:V="A.villain"></c-fpg-villain>\
  <div><strong>Plot:</strong> {{A.plot}}</div>\
  <div><strong>Doom:</strong> {{A.villain.doom[0]}} ({{A.villain.doom[1]}})</div>\
  <div><strong>Location:</strong> {{A.location}}</div>\
  <c-factions v-bind:factions="A.factions"></c-factions>\
  <div v-if="idx>1"><strong>Twist:</strong> {{A.twist}}</div>\
  <div v-if="idx==0"><strong>Hook:</strong> {{A.hook}}</div>\
  <div v-if="idx==0"><strong>Supporting Cast: </strong><ul><li v-for="c in A.cast">{{c}}</li></ul></div>\
  '
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Standard adventure display
Vue.component('c-fpg-result', {
  props: ['A','idx','allgens','type'],
  template: '\
  <h4 class="header">\
    <div class="btn-group" role="group" aria-label="...">\
      <button v-on:click="remove" type="button" class="btn btn-sm">\
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
      </button>\
      <button v-if="idx>0" v-on:click="move(-1)" type="button" class="btn btn-sm"><span class="glyphicon glyphicon-chevron-up"></span></button>\
      <button v-on:click="move(1)" type="button" class="btn btn-sm"><span class="glyphicon glyphicon-chevron-down"></span></button>\
    </div>\
    {{header}} {{A.name}}\
  </h4>\
  <component v-bind:is="type" v-bind:A="A" v-bind:idx="idx"></component>\
  <div class="center bottom-pad">\
    <button v-on:click="save" type="button" class="btn btn-info">Save This As A New Adventure</button>\
  </div>\
  ',
  computed: {
    header: function(){
      if(this.idx==0) {return 'Central Plot'; }
      return 'Adventure';
    }
  },
  methods: {
    save: function () {
      var doc ={
        name:this.A.name,
        arc:[this.A]
      }
      CPXSAVE.setItem(this.A._id,doc).then(function(){});
      if(!objExists(this.allgens[this.A._id])){
        Vue.set(this.allgens, this.A._id, this.A.name);
      }
    },
    remove: function(){
      HUB.$emit('FPG-remove',this.idx);
    },
    move: function(val){
      HUB.$emit('FPG-move',{i:this.idx,val:val});
    }
  }
})
//Standard faction display
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-fpg', { 
  template: '\
  <h2 class="center">Fantasy Plot Generators</h2>\
  <c-menubar id="FPG" v-bind:show="showmenu"></c-menubar>\
  <c-loadselect id="FPG" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
  <div class="center content-minor">\
    <div class="btn-group bottom-pad" role="group" aria-label="...">\
      <button v-on:click="JTF" type="button" class="btn btn-info">CPX Fantasy</button>\
      <button v-on:click="d30S" type="button" class="btn btn-info">d30 Sandbox</button>\
    </div>\
    <button v-show="content.length>0" v-on:click="add" type="button" class="btn btn-info">Add New Adventure To Arc</button>\
  </div>\
  <c-fpg-result v-for="A in content" v-bind:type="advType" v-bind:A="A" v-bind:idx="$index" v-bind:allgens="allgens"></c-fpg-result>\
',
  data: function () { 
    return {
      vid: 'FPG',
      loadids: ['FPG','SAG'],
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      advType:'',
      showlist: {load:false},
      content: [],
      allgens: {}
    }
  },
  //called when created
  created: function () {
    CPX.vue.page.onCreated(this);
    HUB.$on('FPG-move', this.move);
  },
  beforeDestroy: function () {
    CPX.vue.page.onBeforeDestroy(this);
    HUB.$off('FPG-move', this.move);
  },
  methods: {
    add: function() {
      if(this.advType == 'c-fpg-cfp'){
        this.content.push(CPX.FP.Adventure({
          seed:['FPG','-',CPXC.string({length: 27, pool: base62})]
        }));
      }
      else {
        this.content.push(SAG.adventure({
          seed:['SAG','-',CPXC.string({length: 27, pool: base62})]
        }));
      }
    },
    move: function(val){
      var temp = [].concat(this.content), a = objCopy(temp[val.i]),
      newi = val.i+val.val;
      if(newi>=temp.length) {return;}
      
      temp[val.i] = objCopy(temp[newi]);
      temp[newi] = a;
      this.content = [].concat(temp);
    },
    save: function () {
      var doc ={
        name:this.content[0].name,
        arc:this.content
      }
      CPXSAVE.setItem(this.content[0]._id,doc).then(function(){});
      if(!objExists(this.allgens[this.content[0]._id])){
        Vue.set(this.allgens, this.content[0]._id, this.content[0].name);
      }
    },
    load: function (A) {
      if(A.arc[0]._id.includes('FPG-')){
        if(this.advType=='' || this.advType == 'c-fpg-cfp'){
          this.advType = 'c-fpg-cfp';
          this.content = A.arc.concat(this.content);
        }
      }
      else {
        if(this.advType=='' || this.advType == 'c-sag-adv'){
          this.advType = 'c-sag-adv';
          this.content = A.arc.concat(this.content);
        }
      }
    },
    JTF : function (){
      this.content = [];
      this.advType = 'c-fpg-cfp';
      for(var i=0;i<4;i++){
        this.add();
      }
    },
    d30S : function (){
      this.content = [];
      this.advType = 'c-sag-adv';
      for(var i=0;i<4;i++){
        this.add();
      }
    },
    new : function () { 
      this.advType = '';
      this.content = [];
    },
    generate: function () {
      
    },
    remove: function(idx){
      this.content.splice(idx,1);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.content=[];
      this.allgens = [];
    }
  }
})