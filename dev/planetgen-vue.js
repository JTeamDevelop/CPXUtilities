/*
  V 1.0

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

CPX.data.worldTemplate = {
  _id:'',
  CPXseed:[],
  n:4000,
  seed:0,
  subdivisions: 30,
  oceans: 70,
  heat: 0,
  moisture: 0,
  name:'',
  notes:'',
  mods:{}
};

CPX.display.removeTileObject = function(tile){
  var ro = planet.renderData.surface.renderObject.children.filter(function(el){
    return el.uuid = tile.display;
  })
  planet.renderData.surface.renderObject.remove(ro[0]);
}
CPX.display.tileObject = function(tile){
  var T = planet.topology.tiles[tile.id];
  //set colors - black and white
  var outerColor = new THREE.Color(0x000000);
  var innerColor = new THREE.Color(0xFFFFFF);
  
  var geometry = new THREE.Geometry();
  //average position save
  geometry.vertices.push(T.averagePosition);
  //create a new face half size
  var nc = {};
  for (var i = 0; i < T.corners.length; ++i)
  {
    //new face half the size
    nc = new THREE.Vector3().addVectors(T.averagePosition,T.corners[i].position).divideScalar(2);
    //get the verticies
    geometry.vertices.push(nc);
    geometry.faces.push(new THREE.Face3(i + 1, (i + 1) % T.corners.length + 1, 0, T.normal, [ outerColor, outerColor, innerColor ]));
  }

  geometry.boundingSphere = T.boundingSphere.clone();

  //have to set vertext colors since the array was passed
  var material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors, });
  //aterial properties
  material.transparent = true;
  material.opacity = 0.55;
  material.polygonOffset = true;
  material.polygonOffsetFactor = -4;
  material.polygonOffsetUnits = -2;
  
  //set the mesh
  var mesh = new THREE.Mesh(geometry, material);
  //pull the uuid so it can be deleted later
  tile.display = mesh.uuid;
  //push the mesh
  planet.renderData.surface.renderObject.add(mesh);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-expgen-header', { 
  props:['world','show'],
  template: '\
  <div class="box strong slim" v-if="world._id.length>0">\
    <div class="center">\
      <div class="btn-group" role="group" aria-label="...">\
        <button v-on:click="show.min=!show.min" type="button" class="btn">\
          <span class="glyphicon" v-bind:class="isMinimal" aria-hidden="true"></span>Menu\
        </button>\
        <button v-on:click="zoom(-1)" type="button" class="btn" v-if="CPXworld">Z <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>\
        <button v-on:click="zoom(1)" type="button" class="btn" v-if="CPXworld">Z <span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>\
        <button v-on:mousedown="long(-1)" v-on:mouseup="stop" type="button" class="btn"><span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span></button>\
        <button v-on:mousedown="lat(-1)" v-on:mouseup="stop" type="button" class="btn"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></button>\
        <button v-on:mousedown="lat(1)" v-on:mouseup="stop" type="button" class="btn"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></button>\
        <button v-on:mousedown="long(1)" v-on:mouseup="stop" type="button" class="btn"><span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span></button>\
      </div>\
    </div>\
  <div>\
  ',
  computed: {
    CPXworld : function(){
      if(this.world.CPXseed[0]=='CPP') {return false;}
      return true;
    }
  },
  methods: {
    stop: function(){
      G.stop();
    },
    zoom: function(n){
      CPX.EXP.zoom = Number(n);
    },
    lat: function(n){
      G.animate(false,Number(n));
      CPX.EXP.latdelta = Number(n);
    },
    long: function(n){
      G.animate(true,Number(n));
      CPX.EXP.longdelta = Number(n);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-expgen-site', {
  props:['site','tile','idx','world'],
  template: ''+
  '<div v-if="show">'+
    '<div class="input-group strong">'+
      '<input class="form-control" type="text" v-model="site.name" placeholder="NAME" @change="mod">'+
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
    '</div>'+
  '</div>',
  data: function(){
    return {
      hexsites: HEXSITES,
      citysize :  ['single dwelling','thorp','hamlet','village','town, small',
                 'town, large','city, small','city, large','metropolis, small','metropolis, large'],
    }
  },
  computed: {
    show : function(){
      return objExists(this.site.class);
    },
    data: function(){
      return {
        name: this.tile.name,
        notes: this.tile.notes,
        special: this.tile.special,
        display: this.tile.display
      }
    }
  },
  methods: {
    mod:function(){
      HUB.$emit('EXP-mod',{
        id: this.tile.id,
        data:this.data,
      });
    },
    removeSite: function(){
      //remove the display
      if(this.world.CPXseed[0]=='CEXP' && this.tile.special.length==1){
        CPX.display.removeTileObject(this.tile);
      }
      //remove the special
      this.tile.special.splice(this.idx,1);
      //mod
      this.mod();
    }
  }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-expgen-tile', { 
  props:['tile','world'],
  template: '\
  <div class="content-minor">\
    <h4 class="header center">{{terrain | capitalize}}\
      <button v-on:click="remove" type="button" class="close">\
        <span aria-hidden="true">&times;</span>\
      </button>\
    </h4>\
    <input class="form-control center" type="text" v-model="tile.name" placeholder="NAME" @change="mod">\
    <textarea class="form-control" type="textarea" v-model="tile.notes" placeholder="ADD NOTES" @change="mod"></textarea>\
    <h4 class="center">Sites \
      <button v-on:click="addSite" type="button" class="btn btn-sm"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>\
    </h4>\
    <c-expgen-site v-if="tile.special.length>0" v-for="site in tile.special" v-bind:site="site" v-bind:tile="tile" v-bind:idx="$index" v-bind:world="world"></c-expgen-site>\
  </div>\
  ',
  data: function(){
    return {
    }
  },
  computed : {
    terrain: function (){
      var T= {
        oceanGlacier: 'ocean Glacier',rainForest:'rain Forest', deciduousForest:'deciduous Forest', 
        landGlacier: 'land Glacier', coniferForest: 'conifer Forest', snowyMountain: 'snowy Mountain'
      }
      if(objExists(T[this.tile.terrain])) {return T[this.tile.terrain];}
      return this.tile.terrain;
    },
    data: function(){
      return {
        name: this.tile.name,
        notes: this.tile.notes,
        special: this.tile.special,
        display: this.tile.display
      }
    }
  },
  methods: {
    remove: function(){
      HUB.$emit('EXP-remove',this.idx);
    },
    mod:function(){
      HUB.$emit('EXP-mod',{
        id: this.tile.id,
        data:this.data,
      });
    },
    addSite: function(){
      this.tile.special.push({class:['']});
      if (this.world.CPXseed[0]=='CEXP' && this.tile.display==''){
        CPX.display.tileObject(this.tile) 
      }
      //save it
      this.mod();
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-planetgen', { 
  template: '\
  <div class="slim center-div background-white">\
    <c-expgen-header v-bind:world="world" v-bind:show="showlist"></c-expgen-header>\
    <h2 class="center" v-show="!showlist.min">Planet Generator</h2>\
    <h4 class="center header" v-show="showlist.min">{{world.name}}</h4>\
    <div v-show="!showlist.min">\
      <c-menubar id="EXP" v-bind:show="showmenu"></c-menubar>\
      <c-loadselect id="EXP" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
      <div class="center content-minor" v-if="showlist.gen">\
        <button v-on:click="EXPgen" type="button" class="btn btn-info">Experilous Gen</button>\
        <button v-on:click="CPXMapGen" type="button" class="btn btn-info">CPX Gen</button>\
      </div>\
      <div v-if="showlist.gen && type==`EXP`">\
        <div class="input-group">\
          <span class="input-group-addon strong">Complexity</span>\
          <input class="form-control center" type="number" v-model="world.subdivisions" min="20" max="40">\
          <span class="input-group-addon strong">% Ocean</span>\
          <input class="form-control center" type="number" v-model="world.oceans" min="0" max="100">\
        </div>\
        <div class="input-group">\
          <span class="input-group-addon strong">Heat</span>\
          <input class="form-control center" type="number" v-model="world.heat" min="-100" max="100">\
          <span class="input-group-addon strong">Moisture</span>\
          <input class="form-control center" type="number" v-model="world.moisture" min="-100" max="100">\
        </div>\
        <div class="center content-minor" >\
          <button v-on:click="generate" type="button" class="btn btn-info">Generate</button>\
        </div>\
      </div>\
      <div class="content-minor" v-if="!showlist.gen">\
        <input class="form-control input-lg center" type="text" v-model="world.name" placeholder="NAME">\
        <textarea class="form-control" type="textarea" v-model="world.notes" placeholder="ADD NOTES"></textarea>\
      </div>\
    </div>\
    <c-expgen-tile v-for="tile in tiles" v-bind:tile="tile" v-bind:world="world"></c-expgen-tile>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'EXP',
      loadids: ['CEXP','CPP'],
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {
        load:false,
        gen:true,
        min: false,
      },
      type: '',
      world: {
        _id:'',
        CPXseed:[],
        n:4000,
        seed:0,
        subdivisions: 30,
        oceans: 70,
        heat: 0,
        moisture: 0,
        name:'',
        notes:'',
        mods:{}
      },
      tiles: [],
      allgens: {}
    }
  },
  //called when created
  created: function () {
    CPX.vue.page.onCreated(this);
    VU = this;
  },
  beforeDestroy: function () {
    CPX.vue.page.onBeforeDestroy(this);
    VU =null;
  },
  computed: {
  },
  methods: {
    EXPgen: function(){
      var VU = this;
      CPX.experilousSetup().then(function(){
        VU.type = 'EXP';
      })
    },
    CPXMapGen: function(){
      this.world.seed = this.world.CPXseed = ['CPP','-',CPXC.string({length: 27, pool: base62})];

      G = new voronoiGlobe(this.world);
      
      this.showlist.gen = false;
      
      this.world._id = G._id;
      this.world.name = G.name;

      G.d3Display();
    },
    close:function(){
      location.href = "index.html";
    },
    remove:function(){
      this.tiles=[];
      deselectTile();
    },
    applyMods:function(){
      var mod = {};
      for(x in this.world.mods){
        //pull the mod
        mod = this.world.mods[x];
        //set the id
        mod.id = x;
        //if there is a special - display it
        if(mod.special.length>0){
          CPX.display.tileObject(mod);
        }
      } 
    },
    mod:function(opts){
      //pass data to mod db
      this.world.mods[opts.id] = opts.data;
      if(this.world.CPXseed[0]=='CPP'){
        //update and align mods
        G.opts.mods = this.world.mods; 
        //calc points for display
        G.pointCalc();
        //display
        G.d3Globe();  
      }
    },
    setTile: function (tile){
      var t = {
        name:'',
        notes: '',
        special:[],
        display:'',
        position:tile.position,
        id: tile.id,
      }
      
      if(this.world.CPXseed[0]=='CEXP'){
        t.terrain = tile.biome;
        t.elevation = tile.elevation;
        t.moisture = tile.moisture;
        t.tempurature = tile.temperature;
      }
      else {t.terrain=tile.terrain;}
      
      if(objExists(this.world.mods[tile.id])){
        var data = this.world.mods[tile.id];
        for(var x in data){
          t[x] = data[x];
        }
      }
      
      this.tiles = [t];
    },
    load: function (W) {
      this.new(); 
      
      this.world = W;
      if(W.CPXseed[0]=='CEXP'){
        var VU = this;
        //set seed
        generationSettings.seed = this.world.seed;
        //setup display
        CPX.experilousSetup().then(function(){
          VU.type = 'EXP';
          VU.display();  
        })
      }
      else {
        G = new voronoiGlobe(W);
        this.showlist.gen = false;
        G.d3Display();
      }
    },
    save: function () {
      var doc = objCopy(this.world);
      doc._id = doc.CPXseed.join('');
      // Save it
      CPXSAVE.setItem(doc._id,doc).then(function(){});
      if(!objExists(this.allgens[doc._id])){
        Vue.set(this.allgens, doc._id, doc.name);
      }
    },
    new : function () { 
      this.type = '';
      this.world = objCopy(CPX.data.worldTemplate);
      this.tiles = [];
      
      d3.select("#viewportFrame").html("");

      this.showlist.gen=true;
    },
    generate : function () {
      this.world.CPXseed = ['CEXP','-',CPXC.string({length: 27, pool: base62})];
      this.world._id = this.world.CPXseed.join('');
      this.world.Chance = new Chance(this.world._id); 
      
      this.world.seed = this.world.Chance.seed;
      this.world.name = CPXC.capitalize(this.world.Chance.word());
      
      delete this.world.Chance;
      
      generationSettings.seed = this.world.seed;
      //display
      this.display();
    },
    display: function(){
      this.showlist.gen=false;
      //make sure numbers are numbers
      generationSettings.subdivisions = Number(this.world.subdivisions);
      generationSettings.oceanicRate = Number(this.world.oceans)/100;
      generationSettings.heatLevel = (Number(this.world.heat)+100)/100;
      generationSettings.moistureLevel = (Number(this.world.moisture)+100)/100;
      //generate
      generatePlanetAsynchronous(this);
    }
  }
})

//function callback
function initialize() {
  CPX.vue.page.open('c-planetgen',''); 
}
//global start function - given a callback once finished.  
function EXPstart(f) {
  refreshRNG(f);
}
EXPstart(initialize);

