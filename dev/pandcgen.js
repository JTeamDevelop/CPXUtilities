/* Version 1.2
  Updated to include Generic, Dungeon Wolrd and OSR
  OSR can generate Dragons and Undead
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-CPC', { 
  props: ['obj'],
  template: '\
  <div><c-pnc-generic v-bind:obj="obj" hname="Tags"></c-pnc-generic></div>\
  ',
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-generic', { 
  props: ['obj','hname'],
  template: '\
  <div class="content-minor">\
    <input class="form-control input-lg center" type="text" v-model="obj.name" placeholder="NAME">\
    <textarea class="form-control" type="textarea" v-model="obj.notes" placeholder="ADD NOTES"></textarea>\
    <div v-if="obj.class.length>0"><strong>Nature: </strong>{{nature | capitalize}}</div>\
    <div class="content-minor">\
      <div class="header strong center">{{hname}} \
        <button v-on:click="addtag" type="button" class="btn btn-xs">\
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>\
        </button>\
      </div>\
      <div class="input-group" v-for="item in obj.special">\
        <input class="form-control center" type="text" v-model="item">\
        <span class="input-group-btn">\
          <button v-on:click="remove($index)" type="button" class="btn">\
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
          </button>\
        </span>\
      </div>\
    </div>\
  </div>\
  ',
  computed: {
    nature: function(){
      return this.obj.class.slice(0).unique().join(", ");
    }
  },
  methods: {
    addtag: function (){
      this.obj.special.push('NEW');
    },
    remove : function(idx){
      this.obj.special.splice(idx,1);      
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-result', { 
  props: ['obj','allgens','idx'],
  template: '\
  <div class="box">\
    <h4 class="header center">{{obj.name | capitalize}} \
      <button v-on:click="remove" type="button" class="close"><span aria-hidden="true">&times;</span></button>\
    </h4>\
    <button v-on:click="save" type="button" class="btn btn-info btn-block">{{savetxt}}</button>\
    <component v-bind:is="type" v-bind:obj="obj" v-bind:idx="idx"></component>\
  </div>\
  ',
  computed: {
    savetxt : function(){
      if(objExists(this.obj)){
        if(this.obj._id.slice(0,3)=='OSM'){
          return 'Save as New Monster';  
        }
        return 'Save';  
      }
    },
    type: function(){
      if(objExists(this.obj)){
        return 'c-pnc-'+this.obj._id.slice(0,3);  
      }
      else { return 'c-pnc-generic'; }
    },
  },
  methods:{
    save: function(){
      CPXSAVE.setItem(this.obj._id,this.obj).then(function(){});
      if(!objExists(this.allgens[this.obj._id])){
        Vue.set(this.allgens, this.obj._id, this.obj.name);
      }
    },
    remove: function(){
      HUB.$emit('CPC-remove',this.idx);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc', { 
  template: '\
  <div>\
  <h2 class="center">People & Creature Generator</h2>\
  <c-menubar id="CPC" v-bind:show="showmenu"></c-menubar>\
  <c-loadselect id="CPC" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
  <div class="center content-minor" >\
    <div class="btn-group" role="group" aria-label="...">\
      <button v-on:click="DWshow(`true`)" type="button" class="btn btn-info">Generic</button>\
      <button v-on:click="DWshow(`false`)" type="button" class="btn btn-info">Dungeon World</button>\
      <button v-on:click="OSRshow" type="button" class="btn btn-info">OSR</button>\
    </div>\
    <div v-show="showlist.DWBshow" class="center content-minor">\
      <div class="input-group">\
        <span class="input-group-addon strong">Creature Type</span>\
        <select v-model="typeselect" class="form-control">\
          <option v-for="type in dwtypes" v-bind:value="type">{{type | capitalize}}</option>\
        </select>\
      </div>\
      <button v-on:click="DWB" type="button" class="btn btn-info">Generate</button>\
    </div>\
    <div v-show="showlist.OSRshow" class="center content-minor">\
      <div class="input-group">\
        <span class="input-group-addon strong">Generate\
          <input type="checkbox" v-model="setosrgen" aria-label="...">\
        </span>\
        <span class="input-group-addon strong">Creature Type</span>\
        <select v-model="typeselect" class="form-control">\
          <option v-for="type in osrtypes" v-bind:value="type">{{type | capitalize}}</option>\
        </select>\
      </div>\
      <div class="input-group">\
        <span class="input-group-addon strong">CL Min</span>\
        <input class="form-control center" type="number" min="1" v-model="CL.min">\
        <span class="input-group-addon strong">CL Max</span>\
        <input class="form-control center" type="number" min="1" v-model="CL.max">\
      </div>\
      <button v-on:click="OSR" type="button" class="btn btn-info">{{osrbtn}}</button>\
    </div>\
  </div>\
  <c-pnc-result v-for="being in current" v-bind:idx="$index" v-bind:obj="being" v-bind:allgens="allgens"></c-pnc-result>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'CPC',
      loadids: ['CPC','DWB','OSM'],
      showmenu:{
        new:true,
        load:true,
        save:false,
        close:true
      },
      showlist: {
        load:false,
        DWBshow: false,
        OSRshow: false
      },
      generic: true,
      dwtypes: ['random','beast','chimerae','human','humanoid','beastfolk','monster','undead','unnatural','dragon'],
      setosrgen: false,
      osrbasic: ['animal','bug','beast','humanoid','giant-kin','plant','undead','fey','construct','fiend','elemental','dragon'],
      //osrgen: ['animal','bug','beast','chimerae','plant','human','humanoid','beastfolk','giant-kin','unnatural','undead','fey','construct','fiend','elemental','dragon'],
      osrgen: ['dragon','elemental','undead','chimerae','bug'],
      typeselect :'',
      CL: {min:1,max:1},
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
  computed: {
    osrbtn: function(){
      if(this.setosrgen){ return 'Generate'; }
      return 'Pull from DB';
    },
    osrtypes: function() {
      if(this.setosrgen){ 
        return this.osrgen; 
      }
      return this.osrbasic;
    }
  },
  methods: {
    load: function (E) {
      var push = [E].concat(this.current);
      this.current = push;
    },
    new : function () { 
      this.current=[];
      this.showlist.DWBshow = false;
      this.showlist.OSRshow = false;
      this.osrbtn = 'Pull from DB';
    },
    OSRshow : function () {
      this.new();
      this.showlist.OSRshow=true;
    },
    OSR : function () {
      //new to reset vue form 
      this.new();
      
      //randomly generate the monster
      if(this.setosrgen){
        for(var i=0;i<5;i++){
          this.current.push(
            CPX.SW.monsterGen({
              seed : ['OSM','-',CPXC.string({length: 27, pool: base62})],
              type: this.typeselect,
              CL: this.CL
          }));  
        }
      }
      //if not random generation - pull from DB
      else {
        //build the DB query
        var query = {}, CL = this.CL.min;
        query.CL = CL; 
        
        //if a span of CL, pass an array of all CL for the query
        if(this.CL.max-this.CL.min>0){
          CL = [];
          for(var i = this.CL.min; i<= this.CL.max; i++){
            CL.push(i);
          }  
          //query function for NEDB
          query.CL = { $in: CL };
        }
        //set the type
        query.type = this.typeselect;
        //set VU to pass to promise function
        var VU = this;
        //DB find - promise function - pass the query
        CPX.SW.mdbFind(query).then(function(docs){
          //with each doc/monster 
          docs.forEach(function(el) {
            //set the seed and ID
            el.seed = ['OSM','-',CPXC.string({length: 27, pool: base62})];
            el._id = el.seed.join('');
            el.n = '';
            el.mods = [];
            //push the monster to the vue
            VU.current.push(el);
          });
        }) 
      }
    },
    DWshow : function (generic) {
      this.new();
      this.generic = generic;
      this.showlist.DWBshow=!this.showlist.DWBshow;
    },
    DWB : function () { 
      this.new();
      
      var type = this.typeselect, id = 'DWB';
      if(this.generic=='true'){id = 'CPC';}
      if(type == 'random'){ type = 'creature'; }
      
      for(var i=0;i<5;i++){
        this.current.push(CPX.DW.beingGen({
          type: type,
          seed: [id,'-',CPXC.string({length: 27, pool: base62})]
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
      this.saveID = '';
      this.allgens = [];
    }
  }
})