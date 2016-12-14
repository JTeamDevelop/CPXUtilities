CPX.data.actorCommon = ['scholar','ex-adventurer','navy captain', 'banker', 'investigator',
  'sage', 'sailor', 'merchant', 'jeweler', 'bookseller', 'explorer', 'bureaucrat',
  'artist','heir','bounty hunter','mercenary','merchant captain','alchemist','priest',
  'artisan','soldier','doctor']
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.data.CPVinvestigation = [
  function (I){
    var actor = CPX.gen.actor(),
    check = CPX.gen.challenge(CPXC,I.CL);
    
    return "Find (Investigate "+check.text+") an "+actor+" whom you have reason \
      to suspect can give you a clue."
  }, 
  function (I){
    var check = CPX.gen.challenge(CPXC,I.CL),
    fight = CPX.gen.fight(I);
    
    return "Infiltrate (Burglary "+check.text+") a Location where the activities\
      relate to a Clue. On a check failure, face a "+fight.text;
  },
  function (I) {
    var check = CPX.gen.challenge(CPXC,I.CL),
    actor = CPX.gen.actor(),
    fight = CPX.gen.fight(I);
    
    return"Tail (Burglary "+check.text+") an "+actor+" who might have a Clue. \
      On a check failure, face a "+fight.text;
  },
  function (I) {
    var check = CPX.gen.challenge(CPXC,I.CL),
    fight = CPX.gen.fight(I),
    text = 'Search (Investigate '+check.text+') a Location related to past events where a Clue can be found.';
    
    if(CPXC.bool()){
      text+= ' Face a '+fight.text;
    }
    return text;
  },
  function (I) {
    var actor = CPX.gen.actor(),
    fight = CPX.gen.fight(I);
    
    return"Ambush a dangerous "+actor+" who holds a Clue. Face a a "+fight.text;
  },
  function (I) {
    var check = CPX.gen.challenge(CPXC,I.CL),
    actor = CPX.gen.actor(),
    fight = CPX.gen.fight(I),
    text = 'Trick (Persuasion '+check.text+') an '+actor+' into revealing a Clue.';
    
    if(CPXC.bool()){
      text+= ' Face a '+fight.text;
    }
    
    return text;
  },
  function (I) {
    var actor = CPX.gen.actor(),
    fight = CPX.gen.fight(I),
    text = 'An allied '+actor+' can get you a Clue at personal risk.';
    
    if(CPXC.bool()){
      text+= ' Protect them. '+fight.text;
    }
    else {
      text+= ' Make a skill check to help them succeed.'
    }
  
    return text;
  },
  function (I) {
    var actor = CPX.gen.actor(),
    text = 'Bribe an '+actor+' to give you a Clue.';
    if(CPXC.bool()){
      text+= ' Immediately face a Conflict scene with them or on their behalf and win it to succeed.'
    }
    else {
      text+= ' Pay a reasonable bribe or fail the challenge.'
    }
  
    return text;
  },
  function (I) {
    var actor = CPX.gen.actor(),
    fight = CPX.gen.fight(I);
    
    return"Be waylaid by a hostile "+actor+" with a Clue. Face a "+fight.text;
  }
];
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.data.CPVconflict = [
  function (I){
    var fight = CPX.gen.fight(I);
    
    return'Waylay a minion of the foe. Face a '+fight.text;
  },
  function (I){return'Intimidate or put social pressure on an associate of the foe.'},
  function (I){
    var fight = CPX.gen.fight(I),
    text = "Support an Actor who's working against the foe for their own reasons."
    
    if(CPXC.bool()){
      text+= ' Face a '+fight.text;
    }
    
    return text;
  },
  function (I){
    var fight = CPX.gen.fight(I),
    text = "Sabotage or steal the foe's possessions that are important to the plot.";
    
    if(CPXC.bool()){
      text+= ' Face a '+fight.text;
    }
  
    return text;
  },
  function (I){
    var fight = CPX.gen.fight(I);
    return "Fight through an ambush arranged by the foe at a Location. \
      Face a "+fight.text;
  },
  function (I){return"Discredit or frame an Actor ally of the foe."},
  function (I){return"Suffer betrayal by an Actor; face a Fight as you try to escape or avenge yourself."},
  function (I){
    if(CPXC.bool()){ I.heat++; }
    
    return "Outmaneuver a local official suborned or bribed by the foe."},
  function (I){
    var fight = CPX.gen.fight(I),
    text = "Do a friendly Actor a favor that will advance them into a position to help you.";
    
    if(CPXC.bool()){
      text+= ' The villain tries to stop you. Face a '+fight.text;
    }
    return text;
  },
  function (I){
    var fight = CPX.gen.fight(I);
    
    return"Eliminate an outside Actor brought in to aid the foe. Face a "+fight.text;
  }
];
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.data.CPVaction = [
  function (I){return'Convince an Actor ally of the foe to betray them. On a failure, face a Fight.'},
  function (I){
    var fight = CPX.gen.fight(I),
    text = "Despoil or ruin a sanctum or safehouse belonging to the foe.";
    
    if(CPXC.bool()){
      text+= ' Face a '+fight.text;
    }
    return text;
  },
  function (I){return'Pass an incriminating or disgraceful Clue to an Actor who can make sure important \
    people learn of the evidence.'},
  function (I){
    var fight = CPX.gen.fight(I);
    return"Face the foe's best warrior- or the foe himself if this is a climactic battle and they're \
    fit for combat. Face a "+fight.text;},
  function (I){
    var fight = CPX.gen.fight(I),
    text = "Plunder resources necessary to the foe's plan.";
    
    if(CPXC.bool()){
      text+= ' Make a check at +2 difficulty.'
    }
    else { text+= ' Face a '+fight.text; } 
    return text;
  },
  function (I){return"Destroy proof, evidence, or information necessary to the foe's plan. On a failure, face a Fight."},
  function (I){return"Rally an Actor and their comrades to oppose the foe."},
  function (I){
    var fight = CPX.gen.fight(I),
    text = "Guide the Target or another important Actor out of the foe's reach for at least \
                a temporary period.";
                
    if(CPXC.bool()){ text+= ' Face a '+fight.text; }
    return text;
  },
  function (I){return"Bring in an outside authority or useful Actor to oppose the foe."},
  function (I){return"Sabotage a tool, evidence, or ally of the foe so that it betrays their attempted use of it."}
];
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.CPV = {};
CPX.CPV.template = {
  scenes:[],
  heat:0,
  T:1,
  clues:0,
  HVP:0,
  VVP:0
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.CPV.addScene = function(I,type){
  var id = CPXC.natural({min:0,max:DATA['CPV'+type].length-1}),
  text = DATA['CPV'+type][id](I);
  
  I.scenes.push({type:type,id:id,notes:text});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpv-scene', { 
  props:['S','idx'],
  template: '\
    <div>\
      <h4 class="header center">{{S.type | capitalize}} \
        <button v-on:click="remove" type="button" class="close"><span aria-hidden="true">&times;</span></button>\
      </h4>\
      <textarea class="form-control" type="textarea" v-model="S.notes" placeholder="ADD NOTES"></textarea>\
    </div>\
  ',
  methods: {
    remove: function(){
      HUB.$emit('CPV-remove',this.idx);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpv', { 
  template: '\
  <div>\
    <h2 class="center">Investigation Generator</h2>\
    <c-menubar id="CPV" v-bind:show="showmenu"></c-menubar>\
    <c-loadselect id="CPV" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
    <div class="content-minor">\
      <input class="form-control input-lg center" type="text" v-model="I.name" placeholder="NAME">\
      <textarea class="form-control" type="textarea" v-model="I.notes" placeholder="ADD NOTES"></textarea>\
      <div class="input-group">\
        <span class="input-group-addon strong">Threat</span>\
        <input class="form-control center" type="number" v-model="I.T">\
        <span class="input-group-addon strong">Clues</span>\
        <input class="form-control center" type="number" v-model="I.clues">\
      </div>\
      <div class="input-group">\
        <span class="input-group-addon strong">Hero Victories</span>\
        <input class="form-control center" type="number" v-model="I.HVP">\
        <span class="input-group-addon strong">Villain Victories</span>\
        <input class="form-control center" type="number" v-model="I.VVP">\
      </div>\
      <div class="input-group">\
        <span class="input-group-addon strong">Type</span>\
        <select class="form-control center" v-model="scenetype">\
          <option v-for="scene in allscenes" v-bind:value="scene">{{scene | capitalize}}</option>\
        </select>\
        <span class="input-group-btn">\
          <button v-on:click="add" type="button" class="btn">Add Scene</button>\
        </span>\
      </div>\
    </div>\
    <c-cpv-scene v-for="scene in I.scenes" v-bind:S="scene" v-bind:idx="$index"></c-cpv-scene>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'CPV',
      loadids: ['CPV'],
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {
        load:false,
      },
      scenetype:'',
      I: {},
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
  computed: {
    allscenes: function(){
      if(this.I.clues>0){ return ['investigation','conflict','action']; }
      return ['investigation','conflict'];
    }
  },
  methods: {
    remove: function(idx){
      this.I.scenes.splice(idx,1);
    },
    add: function(){
      CPX.CPV.addScene(this.I,this.scenetype);
    },
    load: function (I) {
      this.I = I;
    },
    new : function () { 
      this.I=objCopy(CPX.CPV.template);
    },
    generate: function () {
      
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.I={};
      this.allgens = {};
    }
  }
})