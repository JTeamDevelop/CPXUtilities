SPECTRAL = ['OBFKKMMMM','AFGKMMMMM','FGGKMMMMM','GGGKMMMMM','KKKKMMMMM','KMMMMMMMM','MMMMMMMMC','MMMMMMMST','MMMMMMCLY'];
HABSTARS= [['A','F','G','H'],[1,4,7,1]];
NSTARS = [1,1,1,1,2,2,2,2,3];
STARPROB = {
  cluster: [0.081,0.350],
  inner: [0.0013,0.197],
  basic: [0.0051,0.195],
  voids: [0,0.189],
}
STARS = {
  Habitable: "AFFFFGGGGGGGH", 
  Major:"AFFGGGGHHHHHHHHHJJJJJ", 
  Minor:"MMMMMMMMML",
  //Supertorrid,Torrid,Temperate,Frigid+
  O:{nP:-6},
  B:{nP:-4},
  A:[[1.5,3.7,9,36],"White",259.3,"white"],
  F:[[0.6,1.5,3.8,16],"Yellow White",310,"lightyellow"],
  G:[[0.35,0.8,2.5,10],"Yellow",386.5,"yellow"],
  H:[[0.1,0.25,0.65,4],"Orange",438.3,"orange"],
  J:[[0,0,0.01,0.05],"White Dwarf",374,"white"],
  L:[[0,0,0.01,0.05],"Brown Dwarf",1550,"brown"],
  M:[[0,0,0.01,0.05],"Red Dwarf",820,"red"],
  S:{nP:-4}
}; 
JOVIAN = {
  //Supertorrid,Torrid,Temperate,Frigid+
  Supertorrid: [[27,46,49,52,61,62,92],["SP","TP","HP","VP","AB","SJ","JJ","TJ"]],
  Torrid: [[27,46,49,50,59,62,92],["SP","TP","HP","VP","AB","SJ","JJ","TJ"]],
  Temperate: [[27,32,46,49,52,53,62,92],["SP","TP","NP","HP","AP","VP","AB","JJ","TJ"]],
  Frigid: [[32,41,59,92],["GP","AB","SJ","JJ","TJ"]]
}
NONJOVIAN = {
  //Supertorrid - Temperate Zone, Frigid+
  Temperate: ["SP","SP","SP","TP","TP","HP","VP","VP","AB","AB"],
  Frigid: ["GP","GP","GP","GP","GP","AB","AB","SJ","SJ","SJ"]
}
PLANETS = {
  SP:{name:"Selenian",mass:[0.01,0.03,0.1],d:[[2800,4400,6400],["1d4","1d6","1d8"],400]},
  TP:{name:"Terran",mass:[0.3,1],d:[[9600,12000],["1d6","1d8"],400]},
  HP:{name:"Hadean",mass:[3],d:[[15200],["1d20"],400]},
  VP:{name:"Vestan",mass:[10],d:[[23200],["1d6"],400]},
  NP:{name:"Nerean",mass:[0.3,1,1],d:[[9600,12000],["1d6","1d8"],400]},
  AP:{name:"Aquarian",mass:[3],d:[[18400],["1d12"],800]},
  GP:{name:"Glacian",mass:[0.01,0.01,0.01,0.03,0.03,0.1,0.1,0.3],d:[[2800,5200,6800,10400],["1d6","1d4","1d10","1d8"],400]},
  AB:{name:"Asteroid Belt",mass:[0.01,0.01,0.01,0.03,0.03,0.1]},
  SJ:{name:"Subjovian",mass:[[0.03,0.1],[1,1]],d:[[27500,78000],["1d20","1d20"],2250]},
  JJ:{name:"Jovian",mass:[[0.3,1,3],[3,3,2]],d:[[120000,138000],["2d6-2","1d1"],2000]},
  TJ:{name:"Transjovian",mass:[[10],[1]],d:[[140000],["1d1"],0]},
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpy-result', { 
  props:['obj'],
  template:'\
    <div>\
      <input class="form-control input-lg center" type="text" v-model="obj.name" placeholder="NAME">\
      <textarea class="form-control" type="textarea" v-model="obj.notes" placeholder="ADD NOTES"></textarea>\
      <h4 class="center bar-bottom">Stars</h4>\
      <c-chs-star v-for="s in obj.stars" v-bind:S="s" v-bind:i="$index"></c-chs-star>\
      <h4 class="center bar-bottom">Planets</h4>\
      <component v-bind:is="type" v-for="p in obj.planets" v-bind:HZ="obj.HZone" v-bind:P="p" v-bind:i="$index"></component>\
    </div>\
  ',
  computed: {
    type: function(){
      if(this.obj._id.includes('CHS-')){ return 'c-chs-planet'; }
      else if(this.obj._id.includes('SWS-')){ return 'c-swp-planet'; }
    }
  },
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpy', { 
  template: '\
  <div>\
    <h2 class="center">Star System Generator</h2>\
    <c-menubar id="CPY" v-bind:show="showmenu"></c-menubar>\
    <c-loadselect id="CPY" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
    <div class="content-minor center">\
      <button v-on:click="CHS" type="button" class="btn btn-info">Traveller Gen</button>\
      <button v-on:click="SWN" type="button" class="btn btn-info">Stars Without Number Gen</button>\
    </div>\
    <c-cpy-result v-bind:obj="system" v-if="ready"></c-cpy-result>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'CPY',
      loadids: ['CHS','SWS'],
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {load:false},
      system: {},
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
    ready: function(){
      if(objExists(this.system.planets)){return true;}
      return false;
    },
    type: function(){
      if(this.system._id.includes('CHS-')){ return 'c-chs-planet'; }
      else if(this.system._id.includes('SWS-')){ return 'c-swp-planet'; }
    }
  },
  methods: {
    save: function () {
      CPXSAVE.setItem(this.system._id,this.system).then(function(){});
      if(!objExists(this.allgens[this.system._id])){
        Vue.set(this.allgens, this.system._id, this.system.name);
      } 
    },
    load: function (S) {
      this.system = S;
    },
    new : function () { 
      this.system={};
    },
    CHS: function () {
      this.new();
      this.system = CHS.system(['CHS','-',CPXC.string({length: 27, pool: base62})]);
    },
    SWN: function () {
      this.new();
      this.system = CPX.SWN.system(['SWS','-',CPXC.string({length: 27, pool: base62})]);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.system = {};
      this.allgens = {};
    }
  }
})