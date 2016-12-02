/* Version 1.12
 Last change: add ncity and nruin to generation
*/

const HEXSITES = {
  all: ['town','stronghold','lair','natural','ruin','resource','other'],
  town:{class:['town'],color:'black'},
  stronghold:{class:['stronghold'],color:'green'},
  ruin:{class:['ruin'],color:'grey'},
  natural:{class:['natural'],color:'blue'},
  resource:{class:['resource'],color:'yellow'},
  lair:{class:['lair'],color:'red'},
  other:{class:['ruin'],color:'orange'}
} 

CPX.rectHexArea = function (opts) {
  
  var map = {
    class: ['rectHexArea','hexMap','pointy','terrain'],
    _hexradius : 35,
    seed : typeof opts.seed === "undefined" ? [CPXC.string({length: 32, pool: base62})] : opts.seed,
    //parent if contained in another object
    parent : typeof opts.parent === "undefined" ? "" : opts.parent,
    //includes specail objects
    special : typeof opts.special === "undefined" ? [] : opts.special,
    name : typeof opts.name === "undefined" ? '' : opts.name,
    notes : typeof opts.notes === "undefined" ? '' : opts.notes,
    opts:opts,
    width:opts.width,
    height:opts.height,
    selected: [],
    tokens: [],
    cells : {},
    zones : [],
    mods : {}
  }

  //id based on the seed
  map._id = map.seed.join("");
    //start the seeded RNG
  map.RNG = new Chance(map.seed.join(""));
  //make 1 zone to contain all cells
  var Z = new Zone(map,0);
  //make it visible
  Z.visible = 1;
  //push it to the map
  map.zones.push(Z);
  //setup the NEDB to hold the mods
  map.mods = new Nedb();
  map.mods.persistence.setAutocompactionInterval(120000);
  //populate cells
  CPX.rectHexArea.addCells(map);

  
  return map;
}
CPX.rectHexArea.addCells = function (map){
  var w = map.opts.width, h = map.opts.height;
  if(map.seed[0]=='CHM'){
    w = map.width; 
    h = map.height;
  }
  
  //r is for counting rows
  var r=0, nid='', Z=map.zones[0];
  //loop though, floor on one side, ceiling on the other
  for(var j=-Math.floor(h/2);j<Math.ceil(h/2);j++){
    for(var i=-Math.floor(w/2)-Math.floor(r/2);i<Math.ceil(w/2)-Math.ceil(r/2);i++){
      nid=i+'_'+j;
      //if it exists, skip it
      if(!objExists(map.cells[nid])){
        map.cells[nid] = new HCell(i,j,map.opts.terrain,Z);
        Z.cells.push(nid);  
        
        //random hex map - note the increase in the map 
        if(map.seed[0]=='CHM'){
          if(w!=map.opts.width || h!=map.opts.height){
            //set data othrwise it will not be passed correctly
            var query = {_id:nid}, nt = {terrain:map.opts.terrain}; 
            //pass data to mod db
            CPX.hexMap.pushMod(map,{query:query,type:'set',data:nt}); 
          }
        }
      }
    }
    //increase the count
    r++;
  }
    
  //identify bounds for display
  CPX.hexMap.bounds(map);
}
CPX.rectHexArea.mapClick = function (e){
  var target = e.target,
  data =target.data,
  map = CPXDB[data.map],
  cell = map.cells[data.cid],
  zone = map.zones[cell.zone];
  
  if(map.VU.palette>-1){
    //set data othrwise it will not be passed correctly
    var query = {_id:data.cid}, nt = {terrain:map.VU.palette}; 
    //pass data to mod db
    CPX.hexMap.pushMod(map,{query:query,type:'set',data:nt});
    //set live and update display
    cell.terrain = map.VU.palette;
  }
  //seelct the cell and highlight it
  else{
    if(map.selected[0] == data.cid) {map.selected = [];}
    else {map.selected = [data.cid];}
  }
  //don't dirty the display
  map.VU.display();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cha-site', {
  props:['site','ids'],
  template: ''+
  '<div class="input-group strong">'+
    '<input class="form-control" type="text" v-model="site.name" placeholder="NAME">'+
    '<span class="input-group-btn">'+
      '<button v-on:click="removeSite" type="button" class="btn"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>'+
    '</span>'+
  '</div>'+
  '<div class="input-group strong" >'+
    '<span class="input-group-addon strong">Type</span>'+
    '<select class="form-control" v-model="site.class[0]" @change="mod">'+
      '<option class="center" v-for="site in hexsites.all" v-bind:value="site">{{site | capitalize}}</option>'+
    '</select>'+
    '<span class="input-group-addon strong">Size</span>'+
    '<select class="form-control" v-model="site.size" @change="mod" v-if="site.class[0]==`town`">'+
      '<option class="center" v-for="size in citysize" v-bind:value="$index">{{size | capitalize}}</option>'+
    '</select>'+
    '<input class="form-control" type="number" v-model="site.size" v-else>'+
  '</div>',
  data: function(){
    return {
      hexsites: HEXSITES,
      citysize : CPX.CFP.citysizes
    }
  },
  methods: {
    mod:function(){
      HUB.$emit('CHA-mod',{
        query:{_id:this.ids.cid},
        data:{special:CPXDB[this.ids.mid].cells[this.ids.cid].special.concat([])},
        type:'set'
      });
    },
    removeSite: function(){
      CPXDB[this.ids.mid].cells[this.ids.cid].special.splice(this.ids.i,1);
      this.mod();
    }
  }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cha-cell', {
  props:['cell','mid'],
  template: ''+
  '<div class="box content-minor">'+
    '<h4 class="center header">{{cell.name}}</h4>'+
    '<input class="form-control center" type="text" v-model="cell.name" placeholder="NAME" @change="mod(`name`)">'+
    '<textarea class="form-control" type="textarea" v-model="cell.notes" placeholder="ADD NOTES" @change="mod(`notes`)"></textarea>'+
    '<h4 class="center">Sites '+
      '<button v-on:click="addSite" type="button" class="btn btn-sm"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>'+
    '</h4>'+
    '<c-cha-site v-for="site in cell.special" v-bind:site="site" v-bind:ids="{mid:mid,cid:cell.id,i:$index}"></c-cha-site>'+
  '</div>', 
  data: function(){
    return {

    }
  },
  methods: {
    mod:function(id){
      if(this.cell[id].length>0){
        var data = {};
        data[id] = this.cell[id];
        
        HUB.$emit('CHA-mod',{
          query:{_id:this.cell.id},
          data:data,
          type:'set'
        });
      }
    },
    addSite:function(){
      this.cell.special.push({class:['']});
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cha', { 
  template: '\
  <div class="slim center-div box">\
    <h2 class="center" v-show="!showlist.minimal">HexMap Area Builder</h2>\
    <h4 class="center header" v-show="showlist.minimal">{{map.name}}</h4>\
    <div v-show="!showlist.minimal">\
      <c-menubar id="CHA" v-bind:show="showmenu"></c-menubar>\
      <c-loadselect id="CHA" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
      <div class="center content-minor">\
        <div class="btn-group" role="group" aria-label="...">\
          <button v-on:click="buildShow" type="button" class="btn btn-info">Build Your Own</button>\
          <button v-on:click="randomShow" type="button" class="btn btn-info">Random Hex Area</button>\
        </div>\
      </div>\
      <div class="input-group strong" v-show="showlist.globalTerrain">\
        <span class="input-group-addon strong">Terrain</span>\
        <select class="form-control" v-model="dataterrain">\
          <option v-for="t in terrains" v-bind:value="$index">{{t | capitalize}}</option>\
        </select>\
        <span class="input-group-btn" v-show="showlist.changeTerrain">\
          <button v-on:click="globalTerrain" type="button" class="btn strong">Change</button>\
        </span>\
      </div>\
      <div class="input-group strong" v-show="showlist.makegen">\
        <span class="input-group-addon strong">Width</span>\
        <input class="form-control center" type="number" v-model="width" min=10">\
        <span class="input-group-addon strong">Height</span>\
        <input class="form-control center" type="number" v-model="height" min=10">\
      </div>\
      <div class="input-group strong" v-show="showlist.makegen">\
        <span class="input-group-addon strong" ># of Cities</span>\
        <input class="form-control center" type="number" v-model="ncity" min=0">\
        <span class="input-group-addon strong" ># of Ruins</span>\
        <input class="form-control center" type="number" v-model="nruin" min=0">\
      </div>\
      <div class="center" v-show="showlist.makegen">\
        <p>Plus 2-4 towns, 1-3 resources, and 1-3 lairs per city</p>\
      </div>\
      <div class="center" v-show="showlist.make">\
        <button v-on:click="make" type="button" class="btn btn-info strong">Generate Map</button>\
      </div>\
      <div class="center" v-show="showlist.addcells">\
        <div class="btn-group" role="group" aria-label="...">\
          <button v-on:click="addCells(`w`)" type="button" class="btn strong">\
            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Width\
          </button>\
          <button v-on:click="addCells(`h`)" type="button" class="btn strong">\
            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Height\
          </button>\
        </div>\
      </div>\
      <div class="content" v-show="hasmap">\
        <input class="form-control center" type="text" v-model="map.name" placeholder="NAME">\
        <textarea class="form-control" type="textarea" v-model="map.notes" placeholder="Notes"></textarea>\
      </div>\
    </div>\
    <c-cha-cell v-for="cid in map.selected" v-bind:cell="map.cells[cid]" v-bind:mid="map._id"></c-cha-cell>\
  </div>\
  <div id="{{map._id}}" class="map active" v-bind:class="front" v-show="showlist.map">\
    <canvas width="{{bounds.x}}" height="{{bounds.y}}"></canvas></div>\
  <div class="footer box strong slim">\
    <div class="center">\
      <div class="btn-group" role="group" aria-label="...">\
        <button v-on:click="palette=-1" type="button" class="btn"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></button>\
        <button v-on:click="frontback" type="button" class="btn">{{front | capitalize}}</button>\
        <button v-on:click="zoom(-1)" type="button" class="btn">Z <span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>\
        <button v-on:click="zoom(1)" type="button" class="btn">Z <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>\
        <button v-on:click="showlist.minimal=!showlist.minimal" type="button" class="btn">\
          <span class="glyphicon" v-bind:class="isMinimal" aria-hidden="true"></span>Menu\
        </button>\
      </div>\
    </div>\
    <div class="input-group">\
      <span class="input-group-addon strong">Terrain Paint</span>\
      <select class="form-control" v-model="palette">\
        <option v-for="t in terrains" v-bind:value="$index">{{t | capitalize}}\
          <span class="palette square" v-bind:class="t"></span>\
        </option>\
      </select>\
    </div>\
  <div>\
  ',
  data: function () {
    return {
      vid: 'CHA',
      loadids: ['CHA','CHM'],
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
        changeTerrain:false,
        globalTerrain: false,
        addcells:false,
        makegen:false,
        minimal:false,
        paint:false,
      },
      type:'',
      front:'back',
      ncity : 0,
      nruin : 0,
      terrains: TERRAINS,
      tcolor: terrainColors,
      palette: -1,
      dataterrain: 0,
      seed:[],
      width:12,
      height:12,
      map: {},
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
        return this.map.bounds;
      }
      else { return {x:0,y:0}; } 
    },
    hasmap: function(){
      return objExists(this.map.cells);
    },
    isMinimal:function(){
      if(this.showlist.minimal){return 'glyphicon-plus';}
      return 'glyphicon-minus';
    }
  },
  methods: {
    make:function(){
      this[this.type]();
    },
    buildShow:function(){
      this.new();
      this.type='build';
      this.showlist.globalTerrain = true;
      this.showlist.make = true;
    },
    randomShow:function(){
      this.new();
      this.type='random';
      this.showlist.makegen = true;
      this.showlist.globalTerrain = true;
      this.showlist.make = true;
    },
    globalTerrain:function(){
      for(var x in this.map.cells){
        if(this.map.cells[x].terrain == this.map.opts.terrain){
          this.map.cells[x].terrain = this.dataterrain;
        }
      }
      this.map.opts.terrain = this.dataterrain;
      this.display();
    },
    //increase the cells
    addCells:function(type){
      if(this.map.seed[0]=='CHA'){
        //width
        if(type=='w'){this.map.opts.width++;}
        //height
        else {this.map.opts.height++;}
      }
      else{
        //width
        if(type=='w'){this.map.width++;}
        //height
        else {this.map.height++;}
      }
      
      //addcell function
      CPX.rectHexArea.addCells(this.map);
      //update after vue/canvas has been updated
      Vue.nextTick(this.display); 
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
      if(this.map._hexradius==5 && n==-1){return;}
      if(n==1){this.map._hexradius+=5;}
      else {this.map._hexradius-=5};
      //identify bounds for display
      CPX.hexMap.bounds(this.map);
      //update after vue/canvas has been updated
      Vue.nextTick(this.display); 
    },
    save: function () {
      var VU=this, doc = objCopy(this.map.opts);
      doc._id = this.map._id;
      doc.name = this.map.name;
      doc.notes = this.map.notes;
      // Find all documents in the mod
      this.map.mods.find({}, function (err, mdocs) {
        doc.mods = mdocs;
        //now save
        CPXSAVE.setItem(VU.map._id,doc).then(function(){});
        if(!objExists(VU.allgens[VU.map._id])){
          Vue.set(VU.allgens, VU.map._id, VU.map.name);
        }
      });
    },
    load: function (M) {
      //clear the old map display so clicks register
      this.new();
      this.showlist.addcells = true;
      //copy the opts
      var VU=this, opts = M;
      //make map
      if(opts.seed[0]=='CHM'){
        CPXDB[M._id] = CPX.hexMapGen(opts);  
      }
      else{
        CPXDB[M._id] = CPX.rectHexArea(opts);
        this.showlist.globalTerrain = true;
        this.showlist.changeTerrain = true;
      }
      
      CPXDB[M._id].VU = this;
      this.seed = opts.seed;
      //apply mods
      if(objExists(opts.mods)){
        CPX.hexMap.applyMods(CPXDB[M._id]).then(function(map){
          VU.map = map;
          //update after vue/canvas has been updated
          Vue.nextTick(VU.display);     
        })
      }
      else {
        VU.map = CPXDB[M._id];
        //update after vue/canvas has been updated
        Vue.nextTick(this.display); 
      }
    },
    new : function () {
      this.type='';
      this.showlist.globalTerrain = false;
      this.showlist.make = false;
      this.showlist.makegen = false;
      this.showlist.changeTerrain = false;
      this.showlist.addcells = false;
      if(objExists(this.map.display)){
        //clear the old map display so clicks register
        CPX.display.clearActive(this.map);
      }
      this.map = {};
    },
    random: function () {
      this.new();
      this.showlist.addcells = true;
      this.seed = ['CHM','-',CPXC.string({length: 27, pool: base62})];
      CPXDB[this.seed.join('')] = this.map = CPX.hexMapGen({
        seed:this.seed,
        terrain: this.dataterrain,
        width:this.width,
        height:this.height,
        ncity: this.ncity,
        nruin: this.nruin,
      });
      //reference
      this.map.VU = this;
      //update after vue/canvas has been updated
      Vue.nextTick(this.display);
    },
    build: function () {
      this.new();
      this.showlist.addcells = true;
      this.showlist.globalTerrain = true;
      this.showlist.changeTerrain = true;
      this.seed = ['CHA','-',CPXC.string({length: 27, pool: base62})];
      
      CPXDB[this.seed.join('')] = this.map = CPX.rectHexArea({
        seed:this.seed,
        width:7,
        height:7,
        terrain: this.dataterrain
      });
      //reference
      this.map.VU = this;
      //update after vue/canvas has been updated
      Vue.nextTick(this.display); 
    },
    display: function () {
      //send the vue to the display function
      CPX.display.hexMap(CPXDB[this.seed.join('')]);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.map = {};
      this.allgens = {};
    }
  }
})