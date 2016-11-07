const HEXSITES = {
  all: ['town','lair','natural','ruin','resource','other'],
  town:{class:['town'],color:'black'},
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
  //populate cells
  CPX.rectHexArea.addCells(map);
  //setup the NEDB to hold the mods
  map.mods = new Nedb();
  map.mods.persistence.setAutocompactionInterval(120000);
  
  return map;
}
CPX.rectHexArea.addCells = function (map){
  //r is for counting rows
  var w= map.opts.width, h=map.opts.height, r=0, nid='', Z=map.zones[0];
  //loop though, floor on one side, ceiling on the other
  for(var j=-Math.floor(h/2);j<Math.ceil(h/2);j++){
    for(var i=-Math.floor(w/2)-Math.floor(r/2);i<Math.ceil(w/2)-Math.ceil(r/2);i++){
      nid=i+'_'+j;
      //if it exists, skip it
      if(!objExists(map.cells[nid])){
        map.cells[nid] = new HCell(i,j,map.opts.terrain,Z);
        Z.cells.push(nid);  
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
  '<div class="center">'+
    '<select class="form-control half" v-model="site.class[0]" @change="mod">'+
      '<option class="center" v-for="site in hexsites.all" v-bind:value="site">{{site | capitalize}}</option>'+
    '</select>'+
    '<button v-on:click="removeSite" type="button" class="btn btn-sm"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>'+
  '</div>',
  data: function(){
    return {
      hexsites: HEXSITES
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
  '<div class="box">'+
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
      <div class="content-minor">\
        <input class="form-control input-lg center" type="text" v-model="map.name" placeholder="NAME">\
        <textarea class="form-control pad-y" type="textarea" v-model="map.notes" placeholder="ADD NOTES"></textarea>\
        <div class="center">\
          <div class="input-group strong">\
            <span class="input-group-addon strong">Global Terrain</span>\
            <select class="form-control" v-model="dataterrain">\
              <option v-for="t in terrains" v-bind:value="$index">{{t | capitalize}}</option>\
            </select>\
            <span class="input-group-btn">\
              <button v-on:click="globalTerrain" type="button" class="btn strong">Change</button>\
            </span>\
          </div>\
          <div class="btn-group" role="group" aria-label="...">\
            <button v-on:click="addCells(`w`)" type="button" class="btn strong">\
              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Width\
            </button>\
            <button v-on:click="addCells(`h`)" type="button" class="btn strong">\
              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Height\
            </button>\
          </div>\
        </div>\
      </div>\
    </div>\
    <c-cha-cell v-for="cid in map.selected" v-bind:cell="map.cells[cid]" v-bind:mid="map._id"></c-cha-cell>\
  </div>\
  <div id="{{map._id}}" class="map active" v-bind:class="front" v-show="showlist.map">\
    <canvas width="{{map.bounds.x}}" height="{{map.bounds.y}}"></canvas></div>\
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
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {
        load:false,
        map:false,
        minimal:false,
        paint:false,
      },
      front:'back',
      terrains: TERRAINS,
      tcolor: terrainColors,
      palette: -1,
      dataterrain: 0,
      seed:[],
      width:7,
      height:7,
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
    isMinimal:function(){
      if(this.showlist.minimal){return 'glyphicon-plus';}
      return 'glyphicon-minus';
    }
  },
  methods: {
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
      //width
      if(type=='w'){this.map.opts.width++;}
      //height
      else {this.map.opts.height++;}
      //increase the number of cells
      var w= this.map.opts.width, h=this.map.opts.height, nid='';
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
      CPX.display.clearActive(this.map);
      //copy the opts
      var VU=this, opts = M;
      //make map
      CPXDB[M._id] = CPX.rectHexArea(opts);
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
      if(objExists(this.map.display)){
        //clear the old map display so clicks register
        CPX.display.clearActive(this.map);
      }
      
      this.width = 7; 
      this.height = 7;
      this.seed = ['CHA','-',CPXC.string({length: 27, pool: base62})];
      this.showlist.map=true;
      this.generate();
    },
    generate: function () {
      CPXDB[this.seed.join('')] = this.map = CPX.rectHexArea({
        seed:this.seed,
        width:this.width,
        height:this.height,
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
      this.allgens = [];
      this.active = false;
    }
  }
})