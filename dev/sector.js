CPX.sector = function (opts) {
  var map = {
    seed : typeof opts.seed === "undefined" ? ['CPS','-',CPXC.string({length: 27, pool: base62})] : opts.seed,
    parent : typeof opts.parent === "undefined" ? "" : opts.parent,
    class : typeof opts.class === "undefined" ? ['sector'] : opts.class,
    type: typeof opts.type === "undefined" ? 'SWN' : opts.type,
    dsize : 800,
    systems: {},
    mods : {},
    tokens:[],
    opts: opts,
  }

  //id based on the seed
  map._id = map.seed.join("");
  //initiate the RNG
  map.RNG = new Chance(map._id);
  //add systems
  for(var i=0; i<opts.nsystem;i++){
    CPX.sector.addSystem(map);
  }
  //if jumplanes, add them
  if(objExists(opts.jumplanes)){ CPX.sector.computeLanes(map); } 
  //remove the RNG
  delete map.RNG;
  //apply mods - uses a promise to keep going
  CPX.sector.applyMods(map);
  //return
  return map; 
}
CPX.sector.addSystem = function (map){
  var seed = ['','-',CPXC.string({length: 27, pool: base62})];
  if(objExists(map.RNG)){
    seed[2] = map.RNG.string({length: 27, pool: base62}); 
  }
  //core system object
  var S = {};
  if(map.type=='CHS'){ 
    seed[0] = 'CHS'
    S = CHS.system(seed);
  }
  else if(map.type=='SWN'){ 
    seed[0] = 'SWS'
    S = CPX.SWN.system(seed); 
  }
  S.parent = map._id;
  //a RNG specific to the system
  S.RNG = new Chance(S._id);
  //generix name
  S.name = S.RNG.word();
  //coordinates for the system - between 0 and 20000
  S.p = {
    x : S.RNG.natural({min:0,max:20000}),
    y : S.RNG.natural({min:0,max:20000}),
    z : S.RNG.natural({min:0,max:20000})  
  };
  //remove the RNG
  delete S.RNG;
  //set the sysyem
  map.systems[S._id] = S;
}
CPX.sector.applyMods = function (map){
  //return promise
  return new Promise(function(resolve,reject){
    //iterate through the save
    CPXSAVE.iterate(function(value, key, iterationNumber) {
      //saved object matches map system
      if(objExists(map.systems[key])){
        //load the saved system
        map.systems[key] = value;
      }
    }).then(function(){
      resolve(true);
    })
  })
}
CPX.sector.computeLanes = function (map){}
CPX.sector.onClick = function (e){
  var target = e.target,
  data =target.data,
  map = CPXDB[data.map];
  
  map.VU.system = [map.systems[data.id]];

  console.log(data);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.sector = function (map) {
  CPX.display.clearActive(map);
  
  map.display = {data:{}};
  map.display.data = map;
  map.display.canvas = $( "#"+map._id + " canvas")[0];
  map.display.stage = new createjs.Stage(map.display.canvas);

  CPX.display.drawSector(map);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.drawSector = function (map) {
  //display container ids
  var dids = ['map','siteMarkers'];
  dids.forEach(function(el) {
    if(objExists(map.display[el])){
      //remove it and start fresh
      map.display.stage.removeChild(map.display[el]);
    }
    map.display[el] = new createjs.Container();
  });
  
  var s={}, shape={}, color ="", size = map.dsize/20000, x=0,y=0, step=map.dsize/10;
  //draw a grid
  for(var j=0;j<10;j++){
    for(var i=0;i<10;i++){
      x = i*step; y=j*step;
      shape = new createjs.Shape();
      shape.graphics.setStrokeStyle(1).beginStroke("black").drawRect(x, y, step, step);
      map.display.map.addChild(shape);
    }  
  }
  //draw the systems
  for(var x in map.systems){
    s=map.systems[x];
    //set default color is the star color
    color = STARS[s.stars[0]][3];
    //call the graphics
    shape = new createjs.Shape();
    shape.data = {id:s._id,map:map._id};
    shape.graphics.setStrokeStyle(1).beginStroke("black").beginFill(color).drawCircle(s.p.x*size,s.p.y*size,5);
    shape.addEventListener("click", CPX.sector.onClick);
    map.display.siteMarkers.addChild(shape);
  }

  //add containers to stage
  dids.forEach(function(el) {
    map.display.stage.addChild(map.display[el]);  
  })
  //make tokens
  CPX.display.drawTokens(map);
  //finish
  map.display.stage.update();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cps-system', { 
  props:['S'],
  template: '\
  <div class="background-white">\
    <h4 class="header center">{{S.name | capitalize}}\
      <button v-on:click="remove" type="button" class="close">\
        <span aria-hidden="true">&times;</span>\
      </button>\
    </h4>\
    <div class="content-minor" v-show="minimal">\
      <div v-for="p in habitable">{{head(p) | capitalize}} ({{p.orbit}} AU)</div>\
    </div>\
    <div class="center">\
      <button v-on:click="edit" type="button" class="btn btn-info">Edit System</button>\
      <button v-on:click="save" type="button" class="btn btn-info" v-if="!minimal">Save</button>\
    </div>\
    <c-cpy-result v-bind:obj="S" v-if="!minimal" class="height-limit-min content-minor"></c-cpy-result>\
  </div>\
  ',
  data: function(){
    return {
      minimal:true
    }
  },
  computed:{
    habitable: function (){
      var hz = [], orbits=[], VU=this;
      this.S.planets.forEach(function(p,i) {
        if(VU.HZone(p)){ 
          hz.push(p); 
          orbits.push(i);
        }
      });
      return hz;
    },
  },
  methods: {
    save:function(){
      //save the system - not the sector, if not saved it will be generated from seed again
      CPXSAVE.setItem(this.S._id,this.S).then(function(){});
    },
    edit:function(){
      this.minimal = !this.minimal;
    },
    HZone:function(p){
      if(p.orbit>this.S.HZone.min && p.orbit<this.S.HZone.max){return true;}
      return false;
    },
    head: function(p){
      if(p.class[0]=='planet'){
        if(p.class[1]=='gasgiant') {
          return PLANETS[p.class[2]].name+' ['+p.mass+'x Juptier]'; 
        }
        else{return p.class[1];}
      }
      return p.class[0];
    },
    remove: function(){
      HUB.$emit('CPS-remove',this.idx);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cps', { 
  template: '\
  <div class="slim center-div box">\
    <h2 class="center" v-show="!showlist.minimal">Sector Builder</h2>\
    <h4 class="center header" v-show="showlist.minimal">{{map.name}}</h4>\
    <div v-show="!showlist.minimal">\
      <c-menubar id="CPS" v-bind:show="showmenu"></c-menubar>\
      <c-loadselect id="CPS" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
      <div class="content-minor" v-show="showlist.make">\
        <div class="input-group strong">\
          <span class="input-group-addon strong" ># of Systems</span>\
          <input class="form-control center" type="number" v-model="nsystem" min="0">\
        </div>\
        <div class="center">\
          <button v-on:click="make(`CHS`)" type="button" class="btn btn-info strong">Gen Traveller</button>\
          <button v-on:click="make(`SWN`)" type="button" class="btn btn-info strong">Gen Stars Without Number</button>\
        </div>\
      </div>\
      <div class="content-minor" v-show="hasmap">\
        <input class="form-control center" type="text" v-model="map.name" placeholder="NAME">\
        <textarea class="form-control" type="textarea" v-model="map.notes" placeholder="Notes"></textarea>\
      </div>\
    </div>\
    <c-cps-system v-for="S in system" v-bind:S="S"></c-cps-system>\
  </div>\
  <div id="{{map._id}}" class="map active" v-bind:class="front" v-show="showlist.map">\
    <canvas width="{{bounds}}" height="{{bounds}}"></canvas></div>\
  <div class="footer box strong slim">\
    <div class="center">\
      <div class="btn-group" role="group" aria-label="...">\
        <button v-on:click="frontback" type="button" class="btn">{{front | capitalize}}</button>\
        <button v-on:click="zoom(-1)" type="button" class="btn">Z <span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>\
        <button v-on:click="zoom(1)" type="button" class="btn">Z <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>\
        <button v-on:click="showlist.minimal=!showlist.minimal" type="button" class="btn">\
          <span class="glyphicon" v-bind:class="isMinimal" aria-hidden="true"></span>Menu\
        </button>\
      </div>\
    </div>\
  <div>\
  ',
  data: function () {
    return {
      vid: 'CPS',
      loadids: ['CPS'],
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {
        load:false,
        map:true,
        make:false,
        makegen:false,
        minimal:false,
      },
      type:'',
      front:'back',
      nsystem : 0,
      nruin : 0,
      map: {},
      system:[],
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
    bounds : function(){
      if(this.hasmap){
        return this.map.dsize;
      }
      else { return 0; } 
    },
    hasmap: function(){
      return objExists(this.map.systems);
    },
    isMinimal:function(){
      if(this.showlist.minimal){return 'glyphicon-plus';}
      return 'glyphicon-minus';
    }
  },
  methods: {
    remove: function(idx){
      this.system = [];
    },
    mod:function(opts){
      //pass data to mod db
      CPX.hexMap.pushMod(this.map,{query:opts.query,type:opts.type,data:opts.data});
      this.display();
    },
    frontback:function(){
      if(this.front=='front'){this.front='back';}
      else {this.front='front';}
    },
    zoom: function(n){
      if(this.map.dsize==600 && n==-1){return;}
      if(n==1){this.map.dsize+=50;}
      else {this.map.dsize-=50};
      //update after vue/canvas has been updated
      Vue.nextTick(this.display); 
    },
    save: function () {
      var VU=this, doc = objCopy(this.map.opts);
      doc._id = this.map._id;
      doc.seed = this.map.seed;
      doc.name = this.map.name;
      doc.notes = this.map.notes;
      //now save
      CPXSAVE.setItem(VU.map._id,doc).then(function(){});
      if(!objExists(VU.allgens[VU.map._id])){
        Vue.set(VU.allgens, VU.map._id, VU.map.name);
      }
    },
    load: function (M) {
      //clear the old map display so clicks register
      this.new();
      //clear the gen options
      this.showlist.make=false;
      //create the map
      this.map = CPX.sector(M);
      //put in the name and notes
      this.map.name = M.name;
      this.map.notes = M.notes;
      //set in the DB for quick access
      CPXDB[this.map._id]=this.map;
      //reference
      this.map.VU = this;
      //update after vue/canvas has been updated
      Vue.nextTick(this.display);
    },
    new : function () {
      this.showlist.make=true;
      if(objExists(this.map.display)){
        //clear the old map display so clicks register
        CPX.display.clearActive(this.map);
      }
      this.map = {};
    },
    make: function (type) {
      this.new();
      //clear the gen options
      this.showlist.make=false;
      //create the map
      this.map = CPX.sector({
        type:type,
        nsystem: this.nsystem,
        nruin: this.nruin,
      });
      //set in the DB for quick access
      CPXDB[this.map._id]=this.map;
      //reference
      this.map.VU = this;
      //update after vue/canvas has been updated
      Vue.nextTick(this.display);
    },
    display: function () {
      //send the vue to the display function
      CPX.display.sector(this.map);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.map = {};
      this.allgens = {};
    }
  }
})
