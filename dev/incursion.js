/* Version 0.1
  Added to dev 
*/

CPX.CPI = {}
CPX.CPI.SectorTemplate = {
  name:'',notes:'',explored:[],secured:false,
  ally:1,treasure:3,encounter:4,trap:2
}
CPX.CPI.template = {
  _id:'',
  seed:[],
  name:'',
  notes:'',
  ACL:1,
  T:1,
  reinforce: 0,
  challenge:'',
  Ttxt:'',
  sectors:[],
  foes:[],
  encountered:[],
}
CPX.CPI.addSector = function (I){
  //pull the temlpate
  var S = objCopy(CPX.CPI.SectorTemplate);
  //create selectable list
  CPX.CPI.foesSelectable(I);
  //add the explore array
  CPX.CPI.sectorExploreArray(S,I);
  //determine the closing challenge
  var ct = ['disorder','investigation','invention','labor','persuasion','puzzle','encounter'],
  C = CPX.gen.challenge();
  S.challenge = CPXC.capitalize(CPXC.pickone(ct))+' '+C.text;
  //push to add
  I.sectors.push(S);
  //do the elite shuffle
  CPX.CPI.eliteShuffle(I);
}
CPX.CPI.eliteShuffle = function (I) {
  var open = [], bi=-1; 
  //if boss on the loose
  if(!I.encountered.includes('boss')){
    I.sectors.forEach(function(s,idx) {
      //if not secured push to open
      if(!s.secured){ open.push(idx); }
    });
    //select which one the boss will be in
    bi = CPXC.pickone(open);
  }
  I.sectors.forEach(function(s,idx) {
    //if not secured and there are encounters left
    if(s.encounter>0 && !s.secured){
      //push the boss
      if(idx == bi) {
        s.exarray.push(CPX.CPI.encounter(I,I.foesSelectable.boss));  
      } 
      //push the elite
      else {
        s.exarray.push(CPX.CPI.encounter(I,I.foesSelectable.elite));
      }
    }
    //shuffle
    s.exarray = CPXC.shuffle(s.exarray);
  });
}
CPX.CPI.foesSelectable = function (I) {
  I.foesSelectable={minion:[],elite:[],boss:[]};
  //load the list of foes
  I.foes.forEach(function(el) {
    //push all minions
    if(el.type=='minion'){ I.foesSelectable.minion.push(el.text); }
    //push all elite
    else if(el.type=='elite'){ I.foesSelectable.elite.push(el.text); }
    else { 
      //if not encountered
      if(!I.encountered.includes(el.text)) {
        //push the boss
        if(el.type=='boss') { I.foesSelectable.boss.push(el.text); }
        //lieutenant
        else { I.foesSelectable.elite.push(el.text); }
      }
    }
  });
  
  //if empty push generic
  if(I.foesSelectable.minion.length==0){ I.foesSelectable.minion.push('Minion'); }
  if(I.foesSelectable.elite.length==0){ I.foesSelectable.elite.push('Elite'); }
  //no boss in encountered 
  if(!I.encountered.includes('boss')){ 
    if(I.foesSelectable.boss.length==0) { I.foesSelectable.boss.push('Boss'); }
  }
}
CPX.CPI.sectorExploreArray = function (sector,I){
  var exbase = ['ally','treasure','encounter','trap'], elite=false;
  //empty the array
  sector.exarray = [];

  var EF = {
    ally: function (){ return CPX.gen.ally(); },
    treasure: function (){ return CPX.gen.treasure(); },
    encounter: function (){ return CPX.CPI.encounter(I,[]);},
    trap: function (){ return CPX.gen.trap(CPXC,I.T); }
  }
  //decrement to account for elite later - elite shuffle
  if(sector.encounter>0){ elite=true; sector.encounter--; }

  //push the basic 
  exbase.forEach(function(el) {
    //for each type push the required # of items
    for(var i=0;i<sector[el];i++){
      sector.exarray.push(EF[el]())
    }
  });
  //add back for elite later - elite shuffle
  if(elite){sector.encounter++;}
}
CPX.CPI.encounter = function(I,elite){
  var E={class:['encounter'],text:''};

  function minions(){
    var nm = CPXC.weighted(['1d4','1d6','2d4'],[1,2,3]);  
    var t = CPXC.pickone(I.foesSelectable.minion);
    return CPXC.diceSum(nm)+' '+t;
  }
  
  //if there is an elite array, make the encounter
  if(elite.length>0) {
    var name = CPXC.pickone(elite);
    E.class.push('elite');
    E.name = name;
    E.text = name+'; ';
  }
  //add a veteran 50/50
  if(CPXC.bool()){ E.text+= 'Veteran; '}
  //add minions
  E.text += minions();
  //50/50 of adding more minions
  if(CPXC.bool()){ E.text+= '; '+minions();  }
  
  return E;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpi-sector', { 
  props: ['S','idx','I'],
  template: '\
  <div class="box center bottom-pad pwd-area" v-bind:class="{ explored: S.secured }">\
    <h4 class="header">\
      {{S.name}}<span v-if="S.name.length==0">Sector {{idx+1}}</span>\
      <button v-on:click="remove" type="button" class="close">\
        <span aria-hidden="true">&times;</span>\
      </button>\
    </h4>\
    <input class="form-control input-lg center" type="text" v-model="S.name" placeholder="NAME">\
    <div class="input-group">\
      <span class="input-group-addon" id="pwd-addon-i">Notes</span>\
      <textarea class="form-control" type="textarea" v-model="S.notes" placeholder="INFO"></textarea>\
    </div>\
    <div class="input-group center">\
      <span class="input-group-addon" id="pwd-addon-i">Challenge</span>\
      <input class="form-control center" type="text" v-model="S.challenge">\
    </div>\
    <div class="strong center bar-bottom">Events</div>\
    <div class="input-group center">\
      <span class="input-group-addon" id="pwd-addon-i">Ally</span>\
      <input class="form-control center" type="number" v-model="S.ally" @change="change">\
      <span class="input-group-addon" id="pwd-addon-i">Treasure</span>\
      <input class="form-control center" type="number" v-model="S.treasure" @change="change">\
    </div>\
    <div class="input-group center">\
      <span class="input-group-addon" id="pwd-addon-i">Trap</span>\
      <input class="form-control center" type="number" v-model="S.trap" @change="change">\
      <span class="input-group-addon" id="pwd-addon-i">Encounter</span>\
      <input class="form-control center" type="number" v-model="S.encounter" @change="change">\
    </div>\
    <div class="center content-minor">\
      <div class="bar-bottom">\
        <button v-on:click="explore" type="button" class="btn btn-info">Explore</button>\
        Secured <input type="checkbox" v-model="S.secured" >\
      </div>\
      <div class="top-pad">\
        <div class="input-group center" v-for="E in S.explored">\
          <span class="input-group-addon" id="pwd-addon-i">{{E.class[0] | capitalize}}\
            <span v-if="E.class.includes(`elite`)"> [Elite]</span>\
          </span>\
          <input class="form-control center" type="text" v-model="E.text">\
        </div>\
      </div>\
    </div>\
  </div>\
  ',
  methods:{
    change: function(){
      CPX.CPI.sectorExploreArray(this.S,this.I);
    },
    remove: function(){
      HUB.$emit('CPI-remove',this.i)
    },
    explore: function() {
      //pull the item from the explore array
      var ex = this.S.exarray.shift();
      //push elite encounters
      if(ex.class.includes('elite')){ 
        this.I.encountered.push(ex.name); 
        //look for boss
        if(this.I.foesSelectable.boss.includes(ex.name)) { this.I.encountered.push('boss'); }
      }
      //push it to explored
      this.S.explored.push(ex);
      //reduce the value accordingly
      this.S[ex.class[0]]--;
    }
  }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpi', { 
  template: '\
  <div class="slim center-div box">\
    <c-map-footer v-bind:map="map" v-bind:mapd="mapd"></c-map-footer>\
    <h2 class="center" v-show="!mapd.minimal">CPX Incursion Builder</h2>\
    <h4 class="center header" v-show="mapd.minimal">{{content.name}}</h4>\
    <div v-show="!mapd.minimal">\
      <c-menubar id="CPI" v-bind:show="showmenu"></c-menubar>\
      <c-loadselect id="CPI" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
      <div class="content-minor center">\
        <a role="button" class="btn btn-info center bottom-pad" href="cpxrpg.html">What are Incursions</a>\
        <input class="form-control input-lg center" type="text" v-model="content.name" placeholder="NAME">\
        <textarea class="form-control" type="textarea" v-model="content.notes" placeholder="ADD NOTES"></textarea>\
        <div class="input-group">\
          <span class="input-group-addon" id="cpi-addon-i">Average CL</span>\
          <input class="form-control" type="number" v-model="content.ACL" min=1>\
        </div>\
        <div class="input-group">\
          <span class="input-group-addon" id="cpi-addon-i">Threat Level</span>\
          <input class="form-control" type="number" v-model="content.T" min=1 @change="change">\
          <span class="input-group-btn">\
            <button v-on:click="trandom" type="button" class="btn btn-info">Random</button>\
          </span>\
        </div>\
        <p v-show="content.Ttxt.length>0">{{content.Ttxt}}</p>\
      </div>\
      <div class="center">\
        <button v-on:click="addmap" type="button" class="btn btn-info">Add Sector Map</button>\
        <button v-on:click="reset" type="button" class="btn btn-info">Reset All Sectors</button>\
      </div>\
      <h4 class="center bar-bottom">Foes \
        <button v-on:click="foe" type="button" class="btn btn-sm">\
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>\
        </button>\
      </h4>\
      <div v-for="foe in content.foes">\
        <div class="input-group">\
          <input class="form-control" type="text" v-model="foe.text" @change="change">\
          <span class="input-group-btn">\
            <button v-on:click="rfoe($index)" type="button" class="btn">\
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
            </button>\
          </span>\
        </div>\
        <div class="input-group">\
          <span class="input-group-addon" id="cpi-addon-i">Type</span>\
          <select class="form-control" v-model="foe.type" @change="change">\
            <option v-for="ft in foetypes" v-bind:value="ft">{{ft}}</option>\
          </select>\
        </div>\
      </div>\
      <h4 class="center bar-bottom">Sectors \
        <button v-on:click="add" type="button" class="btn btn-sm">\
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>\
        </button>\
      </h4>\
      <c-cpi-sector v-for="S in content.sectors" v-bind:S="S" v-bind:I="content" v-bind:idx="$index"></c-cpi-sector>\
    </div>\
  </div>\
  <div id="{{map._id}}" class="map active" v-bind:class="mapd.front" v-show="showlist.map">\
    <canvas width="{{bounds.x}}" height="{{bounds.y}}"></canvas>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'CPI',
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {
        load:false,
        map:true,
      },
      content: {},
      map:{},
      foetypes:['minion','elite','lieutenant','boss'],
      allgens: {},
      mapd:{
        front: 'back',
        minimal:false,
      }
    }
  },
  //called when created
  created: function () {
    CPX.vue.page.onCreated(this);
    HUB.$on('CPI-change', this.change);
  },
  beforeDestroy: function () {
    CPX.vue.page.onBeforeDestroy(this);
    HUB.$off('CPI-change', this.change);
  },
  computed: {
    bounds : function(){
      if(this.hasmap){
        return this.map.bounds;
      }
      else { return {x:0,y:0}; } 
    },
    hasmap: function(){
      return objExists(this.map.cells);
    },
  },
  methods: {
    frontback:function(){
      if(this.front=='front'){this.front='back';}
      else {this.front='front';}
    },
    addmap: function(){
      //clear the old map display so clicks register
      CPX.display.clearActive(this.map);
      //random seed - can be changed
      this.content.mapseed = ['CPH','-',CPXC.string({length: 27, pool: base62})]
      //set the map
      this.map = CPX.hexMap({
        seed: this.content.mapseed,
        parent : this.content._id,
        nZones : this.content.sectors.length,
        visible: ['all']
      });
      //update after vue/canvas has been updated
      Vue.nextTick(this.display); 
    },
    display: function () {
      //send the vue to the display function
      CPX.display.hexMap(this.map);
    },
    reset: function(){
      var I=this.content;
      //reset encountered
      I.encountered = [];
      //create selectable list
      CPX.CPI.foesSelectable(I);
      //run through the sectors
      I.sectors.forEach(function(s) {
        s.explored =[];
        s.secured = false;
        s.ally=1;
        s.treasure=3;
        s.encounter=4;
        s.trap=2;  
        //add the explore array
        CPX.CPI.sectorExploreArray(s,I);
      });
      //do the elite shuffle
      CPX.CPI.eliteShuffle(I);
    },
    foe: function(){
      this.content.foes.push({type:'soldier',text:''});
    },
    rfoe: function(i){
      this.content.foes.splice(i,1);
    },
    change: function(){
      var I = this.content;
      I.sectors.forEach(function(el) {
        //add the explore array
        CPX.CPI.sectorExploreArray(el,I);
      });
      //do the elite shuffle
      CPX.CPI.eliteShuffle(I);
    },
    trandom: function (){
      var r = CPXC.diceSum('2d6'), mod = 0, ACL = Number(this.content.ACL), T=0, OT=this.content.T;
      //set the text to null 
      Vue.set(this.content,'Ttxt','');
      
      //calculate the T
      if(r==2){
        mod = CPXC.d4() - CPXC.d4();
        T = ACL - mod;
      }
      else if(r==3){T = ACL-1;}
      else if(r<6){
        T = ACL;
        T.reinforce = CPXC.d4();
        Vue.set(this.content,'Ttxt',
          'After half the sectors have been secured increase the Threat by '+T.reinforce+'.'
        );
      }
      else if(r<11){T = ACL;}
      else{T = ACL+CPXC.d4()+2;}
      
      //can't be less than 1
      if(T<1){T=1;}
      //set
      Vue.set(this.content,'T',T);
      //call the change 
      if(OT!=T){ this.change(); }
    },
    remove: function(i){
      this.content.sectors.splice(i,1);
    },
    add: function () {
      CPX.CPI.addSector(this.content);
    },
    save: function () {
      CPXSAVE.setItem(this.content._id,this.content).then(function(){});
      if(!objExists(this.allgens[this.content._id])){
        Vue.set(this.allgens, this.content._id, this.content.name);
      }
    },
    load: function (I) {
      this.content = I;
    },
    new : function () { 
      this.generate();
    },
    generate: function () {
      this.content = objCopy(CPX.CPI.template);
      this.content.seed = ['CPI','-',CPXC.string({length: 27, pool: base62})];
      this.content._id = this.content.seed.join('');
      CPX.CPI.addSector(this.content);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.content = {};
      this.allgens = {};
    }
  }
})