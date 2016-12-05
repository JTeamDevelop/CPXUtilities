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
  foes:[]
}
CPX.CPI.addSector = function (I){
  //pull the temlpate
  var S = objCopy(CPX.CPI.SectorTemplate);
  //add the explore array
  CPX.CPI.sectorExploreArray(S,I);
  //determine the closing challenge
  var ct = ['disorder','investigation','invention','labor','persuasion','puzzle','encounter'],
  C = CPX.gen.challenge();
  S.challenge = CPXC.capitalize(CPXC.pickone(ct))+' '+C.text;
  //push to add
  I.sectors.push(S);
}
CPX.CPI.sectorExploreArray = function (sector,I){
  var exbase = ['ally','treasure','encounter','trap'], elite=false;
  //empty the array
  sector.exarray = [];
  
  var EF = {
    ally: function (){ return CPX.gen.ally(); },
    treasure: function (){ return CPX.gen.treasure(); },
    encounter: function (){ return CPX.CPI.encounter(I,false);},
    trap: function (){ return CPX.gen.trap(); }
  }
  
  if(sector.encounter>0){
    elite=true;
    //push the elite
    sector.exarray.push(CPX.CPI.encounter(I,true));
    sector.encounter--;
  }

  //push the basic 
  exbase.forEach(function(el) {
    //for each type push the required items
    for(var i=0;i<sector[el];i++){
      sector.exarray.push(EF[el]())
    }
  });
  
  if(elite){sector.encounter++;}
  
  //shuffle
  sector.exarray = CPXC.shuffle(sector.exarray);
}

CPX.CPI.encounter = function(I,elite){
  var r = CPXC.d6(), n =0, T=Number(I.T),
    E={class:['encounter'],text:''}, 
    foes={}, list={minion:[],elite:[]};
  
  I.foes.forEach(function(el) {
    var types = {
      minion : ['vermin','rabble','soldier','thug','veteran'],
      elite : ['controller','brute','tank','swarm','Lt.']  
    }
    
    for(var x in types){
      if(types[x].includes(el.type)) {
        if(!list[x].includes(el.type)) { list[x].push(el.type); }
      }
    }
    
    if(objExists(foes[el.type])){
      foes[el.type].push(el.text);
    }
    else {
      foes[el.type] = [el.text];
    }
  });
  
  function foeSelect(type){
    if(!objExists(foes[type])){  
      if(elite){ 
        if(list.elite.length==0) { return type; }
        type = CPXC.pickone(list.elite); 
      }
      else{ 
        if(list.minion.length==0) { return type; }
        type = CPXC.pickone(list.minion); 
      }
    }
    return CPXC.pickone(foes[type]);
  }
  
  //elite encounter
  if(elite){
    E.class.push('elite');
    //Controller
    if(r==1){
      n=CPXC.d6()+T;
      E.text = foeSelect('controller')+', '+n+' '+foeSelect('vermin');
    }
    //Brute
    else if(r==2){
      n=CPXC.d4()+T;
      E.text = foeSelect('brute')+', '+n+' '+foeSelect('thug');
    }
    //Tank
    else if(r<5){
      n=CPXC.d4();
      E.text = foeSelect('tank')+', '+n+' '+foeSelect('thug');
    }
    //Swarm
    else if(r==5){
      E.text = foeSelect('swarm');
    }
    //Leader
    else if(r==6){
      n=CPXC.d4();
      E.text = foeSelect('Lt.')+', '+n+' '+foeSelect('thug');
    }
  }
  //minion encounter
  else {
    //Vermin
    if(r==1){
      n=CPXC.d6();
      E.text = n+' '+foeSelect('vermin');
    }
    //Rabble
    else if(r==2){
      n=CPXC.d4()+T;
      E.text = n+' '+foeSelect('rabble');
    }
    //Rabble
    else if(r<5){
      n=CPXC.d4()+T;
      E.text = n+' '+foeSelect('rabble')+', '+foeSelect('veteran');
    }
    //Soldiers
    else if(r==5){
      n=CPXC.d4()+T;
      E.text = n+' '+foeSelect('soldier')
    }
    //Thugs
    else if(r==6){
      n=CPXC.d6()+T;
      E.text = n+' '+foeSelect('thug')+', '+foeSelect('veteran');
    }
  }
  
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
      <span class="input-group-addon" id="pwd-addon-i">To Secure</span>\
      <input class="form-control center" type="text" v-model="S.challenge">\
    </div>\
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
      <button v-on:click="explore" type="button" class="btn btn-info">Explore</button>\
      Secured <input type="checkbox" v-model="S.secured" >\
      <button v-on:click="reset" type="button" class="btn btn-info">Reset</button>\
      <div class="input-group center" v-for="E in S.explored">\
        <span class="input-group-addon" id="pwd-addon-i">{{E.class[0] | capitalize}}\
          <span v-if="E.class.includes(`elite`)"> [Elite]</span>\
        </span>\
        <input class="form-control center" type="text" v-model="E.text">\
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
    reset: function(){
      this.S.explored =[];
      this.S.secured = false;
    },
    explore: function() {
      //pull the item from the explore array
      var ex = this.S.exarray.shift();
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
  <div>\
  <h2 class="center">CPX Incursion Builder</h2>\
  <c-menubar id="CPI" v-bind:show="showmenu"></c-menubar>\
  <c-loadselect id="CPI" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
  <div class="content-minor center">\
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
    <h4 class="header center">Countdown: {{countdown}}</h4>\
  </div>\
  <div class="center">\
    <button v-on:click="add" type="button" class="btn btn-info">Add Sector Map</button>\
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
      showlist: {load:false},
      content: {},
      foetypes:['vermin','rabble','soldier','thug','veteran','controller','brute','tank','swarm','Lt.','boss'],
      allgens: {}
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
    countdown: function(){
      var max = 10 * this.content.sectors.length, nex = 0;
      this.content.sectors.forEach(function(el) {
        nex+=el.explored.length;
      });
      return max-nex;
    }
  },
  methods: {
    foe: function(){
      this.content.foes.push({type:'soldier',text:''});
    },
    rfoe: function(i){
      this.content.foes.splice(i,1);
    },
    change: function(){
      var I = this.content;
      I.sectors.forEach(function(el) {
        CPX.CPI.sectorExploreArray(el,I);
      });
    },
    trandom: function (){
      var r = CPXC.diceSum('2d6'), mod = 0, ACL = Number(this.content.ACL), T=0, OT=thus.content.T;
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