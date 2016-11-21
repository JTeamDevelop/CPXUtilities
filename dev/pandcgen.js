/* Version 1.1.5
  Updated to include Dungeon Wolrd and OSR
  TODO - re-integrate generic editor
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-CPG', { 
  props: ['obj'],
  template: '\
  <div class="content-minor">\
    <input class="form-control input-lg center" type="text" v-model="object.name" placeholder="NAME">\
    <textarea class="form-control" type="textarea" v-model="object.notes" placeholder="ADD NOTES"></textarea>\
    <div v-if="object.class.length>1"><strong>Nature: </strong>{{nature | capitalize}}</div>\
    <div v-if="object.special.length>0"><strong>Tags:</strong> {{object.special.unique().join(", ") | capitalize}}</div>\
  </div>\
  ',
  computed: {
    nature: function(){
      return this.object.class.slice(1).unique().join(", ");
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
        if(this.obj.seed[0]=='OSM'){
          return 'Save as New Monster';  
        }
        return 'Save';  
      }
    },
    type: function(){
      if(objExists(this.obj)){
        return 'c-pnc-'+this.obj.seed[0];  
      }
      else { return 'c-pnc-CPG'; }
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
      <button v-on:click="DWshow" type="button" class="btn btn-info">Dungeon World</button>\
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
      <button v-on:click="OSR" type="button" class="btn btn-info">Generate</button>\
    </div>\
  </div>\
  <c-pnc-result v-for="being in current" v-bind:idx="$index" v-bind:obj="being" v-bind:allgens="allgens"></c-pnc-result>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'CPC',
      loadids: ['DWB','OSM'],
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
      dwtypes: ['random','beast','chimerae','human','humanoid','beastfolk','monster','undead','unnatural','dragon'],
      osrtypes: ['animal','bug','beast','humanoid','giant-kin','undead','fey','construct','fiend','elemental','dragon'],
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
  methods: {
    load: function (E) {
      var push = [E].concat(this.current);
      this.current = push;
    },
    new : function () { 
      this.current=[];
      this.showlist.DWBshow = false;
    },
    OSRshow : function () {
      this.new();
      this.showlist.OSRshow=!this.showlist.OSRshow;
    },
    OSR : function () {
      this.new();
      
      var query = {}, CL = this.CL.min;
      query.CL = CL; 
      
      if(this.CL.max-this.CL.min>0){
        CL = [];
        for(var i = this.CL.min; i<= this.CL.max; i++){
          CL.push(i);
        }  
        query.CL = { $in: CL };
      }
      
      query.type = this.typeselect; 
      
      var VU = this;
      CPX.SW.mdbFind(query).then(function(docs){
        docs.forEach(function(el) {
          el.seed = ['OSM','-',CPXC.string({length: 27, pool: base62})];
          VU.current.push(el);
        });
      })
      
      /*
      //if the field is anything but name, search for it
      query[field] = value;
      //otherwise build a regular expression and search
      if(field == 'Name'){
        query[field] = new RegExp(value,"i"); 
      }
      */
      
    },
    DWshow : function () {
      this.new();
      this.showlist.DWBshow=!this.showlist.DWBshow;
    },
    DWB : function () { 
      this.new();
      
      var type = this.typeselect;
      if(type == 'random'){ type = 'creature'; }
      
      for(var i=0;i<5;i++){
        this.current.push(CPX.DW.beingGen({
          type: type,
          seed: ['DWB','-',CPXC.string({length: 27, pool: base62})]
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