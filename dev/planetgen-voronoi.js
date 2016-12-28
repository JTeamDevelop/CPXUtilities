var light = null;
var canvas = null;
var raycaster = null;
var mouse = new THREE.Vector2();

var CRNG = new Chance(Math.random());
const TERRAINS = [
  {id:"water",color: "aqua", hex:'#00FFFF'},
  {id:"swamp",color: "CadetBlue", hex:'#5F9EA0'},
  {id:"desert",color: "Beige", hex:'#F5F5DC'},
  {id:"plain",color: "LightGreen", hex:'#90EE90'},
  {id:"forest",color: "ForestGreen", hex:'#228B22'},
  {id:"hill",color: "Brown", hex:'#A52A2A'},
  {id:"mountain",color: "DarkGrey", hex:'#A9A9A9'}
];

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function voronoiGlobe (opts) {
  opts = typeof opts === "undefined" ? {} : opts;
  
  this.seed = typeof opts.seed === "undefined" ? ['CPP','-',CPXC.string({length: 27, pool: base62})] : opts.seed;
  this._id = this.seed.join('');
  this.RNG = new Chance(this._id);
  
  this.n = typeof opts.n === "undefined" ? 4000 : opts.n;
  
  this.opts = opts;
  
  this.water = this.RNG.floating({min:4,max:8})/10; 
  this.nContinents = this.RNG.natural({min:2,max:15});
  
  this.name = (typeof opts.name === "undefined") ? CPXC.capitalize(this.RNG.word()) : opts.name;
  if(this.name.length==0) { this.name = CPXC.capitalize(this.RNG.word()); }
  
  this.rotate = 0.000;
  this.angle = {lat:0,long:0};
  
  delete this.RNG;
  
  this.selected=[];
  this.points = [];
  this.show = 'people';
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.objectFind = function(id){
  if(objExists(this.peoples[id])) {return this.people[id];}
  if(objExists(this.empires[id])) {return this.empires[id];}
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.setProjection = function(type){
  this.projectionType = 'type';
  
  var context = canvas.node().getContext("2d");
  
  var width = canvas.node().width,
      height = canvas.node().height;
 
  
  if(type=='globe'){
    //set the projection we will use
    this.projection = d3.geoOrthographic()
        .scale(height / 2.25)
        .translate([width / 2, height / 2])
        .clipAngle(90)
        .precision(.2);
  }
  else if(type=='rectangular'){
    //set the projection we will use
    this.projection = d3.geoEquirectangular()
         .scale(height / Math.PI)
         .translate([width / 2, height / 2]);
  }
  else if(type=='hammer'){
    //set the projection we will use
    this.projection = d3.geoHammer()
         .scale(165)
         .translate([width / 2, height / 2])
         .precision(.1);
  }
  
  //standard path using the projection and the canvas context
  this.path = d3.geoPath()
      .projection(this.projection)
      .pointRadius(3)
      .context(context); 

  if(objExists(this.voronoi))
  {
    this.d3Globe(context);
  }
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.geoVoronoi = function(){
  //points for the voronoi
  var points = { 
    type: "FeatureCollection",
    features: this.coords.map(function(el) {
      return {
        type: "Point",
        coordinates: el
      }
    })
  };
  
  //set the voronoi
  this.voronoi = d3.geoVoronoi()(points);
  console.log('voronoi done');
  
  var G =this;
  this.poly = this.voronoi.polygons().features.map(function(el,i){
    //set all to water
    el.terrain = 'water';
    //create new tile object
    return Object.assign(new CPXTile(G,i), el);
  });
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.generate = function(){
  var G= this;
  this.RNG = new Chance(this._id);
  
  //coordinates on a globe
  this.coords = d3.range(this.n*0.95).map(function() {
    return [ G.RNG.floating({min:0,max:360}), G.RNG.floating({min:-70,max:70}) ];
  });
  
  d3.range(this.n*0.05).map(function() { 
    var ns = G.RNG.bool() ? -1 : 1;
    G.coords.push([ G.RNG.floating({min:0,max:360}), ns*G.RNG.floating({min:70,max:90}) ]);
  });

  //generate for quick reference object for display
  this.terrainPoly = {};
  TERRAINS.forEach(function(el) {
    G.terrainPoly[el.id] = []; 
  });
  
  //return promise - keep things moving
  return new Promise(function(resolve,reject){
    //create voronoi
    G.geoVoronoi();
    //G.flatVoronoi();
    
    //generate terrain
    G.genContinents();
    
    //update reference object
    G.poly.forEach(function(el) {
      G.terrainPoly[el.terrain].push(el.coordinates);
    });
    G.terrainArrayIDs();
    
    resolve(true);
  })
  
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.genContinents = function(){
  var G=this, polyper = this.n*(1-this.water)/this.nContinents,
  //create polygon ID array
  pIdArray = this.poly.map(function(el){
    return el.id;
  }),
  //array to hold Continents & plains
  continents = [], plains=[];
  
  //set as land
  function makeLand(id,cid,terrain){
    //remove from pick array
    pIdArray.splice(pIdArray.indexOf(id),1);
    //make land
    G.poly[id].terrain=terrain;
    G.poly[id].continent = cid;
    //push to continent
    continents[cid].push(id);
    //if plain
    if(terrain=='plain') {
      //push to plains
      plains[cid].push(id);
    }
  }
  
  //make mountain chain
  function makeMtnChain(cid){
    var neighbours=[], pid=-1,
    //last id
    last = continents[cid][continents[cid].length-1];
    //pull the neighbours array
    neighbours = G.poly[last].properties.neighbours;
    //pick and set to mountain
    pid = G.RNG.pickone(neighbours);
    makeLand(pid,cid,'mountain');
    //return the id
    return pid;
  }
  
  //find the borders
  function border(cid){
    var barray = [], neighbours=[];
    //pick the continent and loop through polys
    continents[cid].forEach(function(el){
      //pull the neighbours array
      neighbours = G.poly[el].properties.neighbours;
      //loop to find polys that are water
      neighbours.forEach(function(nid) {
        if(G.poly[nid].terrain=='water') { barray.push(nid); }
      });
    })
    return barray;
  }
  
  console.log('making continents');
  var cPoly=0, polyvar = 0, mtncount=0, pid=-1, borderPoly=[];
  for(var i=0;i<this.nContinents;i++){
    //variance in number of polys in continent
    polyvar = this.RNG.normal({mean:1,dev:0.2});
    cPoly = polyper*polyvar;
    //determine mountain count, betweeen 5 and 20 %
    mtncount = cPoly*this.RNG.floating({min:5,max:20})/100;
    //create the first
    continents[i] = []; plains[i] = [];
    //pick first id
    pid = this.RNG.pickone(pIdArray);
    //make mountain seed
    makeLand(pid,i,'mountain');
    cPoly--;
    //make mtn chain
    for(var j=1;j<mtncount;j++){
      makeMtnChain(i);
      cPoly--;
    }
    //now for the number of polys, add to continent
    for(var j=0;j<cPoly;j++){
      //find border polys, and pick
      borderPoly = border(i);
      pid = this.RNG.pickone(borderPoly);
      //make land
      makeLand(pid,i,'plain');
    }
  }
  //now make hills
  this.poly.forEach(function(el) {
    var neighbours=[];
    //find mountains
    if(el.terrain=='mountain'){
      //pull the neighbours array
      neighbours = el.properties.neighbours;
      //for each, make hills, if not mountain
      neighbours.forEach(function(nid){
        if(G.poly[nid].terrain=='plain') {
          //75% chance of hill
          if(G.RNG.bool({likelihood:75})){ 
            G.poly[nid].terrain='hill'; 
            //remove from plains
            plains[G.poly[nid].continent].splice(plains[G.poly[nid].continent].indexOf(nid),1);
          }
        }
      })
    }
  });
  
  function addTerrain(cp,tc,type){
    //desert count 3-10% land
    var ta = [], pid=-1,neighbours=[];
    //pick the first
    pid=G.RNG.pickone(cp);
    G.poly[pid].terrain = type;
    //remove
    cp.splice(cp.indexOf(pid),1);
    //push
    ta.push(pid);
    
    while(ta.length<tc){
      neighbours = G.poly[pid].properties.neighbours;
      pid = G.RNG.pickone(neighbours);
      //if in plains
      if(cp.includes(pid)){
        //make trrain
        G.poly[pid].terrain = type;
        //remove
        cp.splice(cp.indexOf(pid),1);
        //push
        ta.push(pid);
      }
    }
  }
  //add desert
  for(var i=0;i<plains.length;i++){
    addTerrain(
      plains[i],
      continents[i].length * G.RNG.floating({min:3,max:10})/100,
      'desert'
    );
  }
  //add swamp
  for(var i=0;i<plains.length;i++){
    addTerrain(
      plains[i],
      G.RNG.natural({min:2,max:6}),
      'swamp'
    );
  }
  //add forest
  for(var i=0;i<plains.length;i++){
    addTerrain(
      plains[i],
      plains[i].length * G.RNG.floating({min:30,max:60})/100,
      'forest'
    );
  }
  
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.resources = function(){
  //set the RNG 
  this.RNG = new Chance(this._id+'-'+this.popSeed+'-R');
  
  //n is the probibility of resources
  var n = this.RNG.normal({mean: 10, dev: 1.5}),
  G = this, type='';
  
  CPX.data.mapResources = ['Fertile Land', 'Lush Pasture','Good Fishing', 'Medicinal Plants', 
  'Minerals', 'Timber', 'Magical Materials'];
  
  this.poly.forEach(function(tile) {
    //check resource probability
    if(G.RNG.bool({likelihood:n})){
      if(tile.terrain == 'water') {
        type = G.RNG.pickone(['Good Fishing', 'Medicinal Plants','Minerals','Magical Materials']);
      }
      else if(tile.terrain == 'mountain') {
        type = G.RNG.pickone(['Minerals', 'Timber', 'Magical Materials']);
      }
      else if(tile.terrain == 'desert') {
        type = G.RNG.pickone(['Minerals','Magical Materials']);
      }
      else if(tile.terrain == 'swamp') {
        type = G.RNG.pickone(['Medicinal Plants','Timber','Magical Materials']);
      }
      else if(tile.terrain == 'forest') {
        type = G.RNG.pickone(['Fertile Land','Medicinal Plants','Timber','Minerals','Magical Materials']);
      }
      else if(tile.terrain == 'plain') {
        type = G.RNG.pickone(['Fertile Land', 'Lush Pasture','Minerals','Magical Materials']);
      }
      
      tile.special.push({
        id: G.RNG.string({length: 27, pool: base62}),
        name: type,
        class:['resource'],
        //size is relative random between 2-5 
        size: G.RNG.weighted([2,3,4,5],[3,6,2,1])
      }) 
    }
  });
  
  delete this.RNG;
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.terrainArrayIDs = function(){
  var G=this, lat=0, 
  tids = {
    basic : {},
    ice : {}
  };
  
  TERRAINS.forEach(function(el) {
    tids.basic[el.id] = [];
    tids.ice[el.id] = [];
  });
  
  this.poly.forEach(function(el) {
    lat = el.properties.site.coordinates[1];
    //if less than 45 degrees lat, push the poly to basic
    if(Math.abs(lat)<=45){ tids.basic[el.terrain].push(el.id); }
    //if less than60 only 50 percent push
    else if(Math.abs(lat)<=60) { 
      if (G.RNG.bool()) { tids.basic[el.terrain].push(el.id); }
      tids.ice[el.terrain].push(el.id);
    }
    //push cold tiles
    else {
      tids.ice[el.terrain].push(el.id);
    }
  });
  
  this.terrainIDs = tids;
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.pointCalc = function(){
  var G=this;
  //setup points
  this.points = {};
  HEXSITES.all.forEach(function(el) {
    G.points[el] = [];
  });
  
  //place markers
  this.poly.forEach(function(tile) {
    tile.special.forEach(function(s) {
      //don't count empires - they are handled differently
      if(s.class[0]=='empire'){return;}
      G.points[s.class[0]].push(tile.properties.sitecoordinates);
    });
  });

  if(objExists(this.opts.mods)){
    for(var x in this.opts.mods){
      //only display if there is a poly
      if(objExists(this.poly[x])){
        //only display if there is something special
        this.opts.mods[x].special.forEach(function(s) {
          G.points[s.class[0]].push(G.poly[x].properties.sitecoordinates);
        }); 
      }
    }
  }
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.turn = function(long,val){
  var G = this, context = canvas.node().getContext("2d");
  if(long){ 
    if(val==1 && G.angle.long==360) { G.angle.long = 0; } 
    if(val==-1 && G.angle.long==0) { G.angle.long = 360; }
    
    G.angle.long+= val*30; 
  }
  else {
    G.angle.lat+= val*15; 
    
    if(val==1 && G.angle.lat>=90) { G.angle.lat=90; }
    if(val==-1 && G.angle.lat<=-90) { G.angle.lat=-90; }
  } 
  
  G.projection.rotate([G.angle.long,G.angle.lat]);
  G.d3Globe(context); 
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.animate = function(long,val){
  var G = this, context = canvas.node().getContext("2d");
  
  this.rotate = 0.005;
  
  this.timer = setInterval(function(){
    if(long){ 
      if(val==1 && G.angle.long==360) { G.angle.long = 0; } 
      if(val==-1 && G.angle.long==0) { G.angle.long = 360; }
      
      G.angle.long+= val*2; 
    }
    else {
      G.angle.lat+= val*2; 
      
      if(val==1 && G.angle.lat>=90) { G.angle.lat=90; }
      if(val==-1 && G.angle.lat<=-90) { G.angle.lat=-90; }
    } 
    
    G.projection.rotate([G.angle.long,G.angle.lat]);
    G.d3Globe(context); 
  }, 25);
  
}
voronoiGlobe.prototype.stop = function(){
  clearInterval(this.timer);
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.d3Display = function(status){
  canvas = d3.select("#viewportFrame").append("canvas")
  .attr("width", 1000)
  .attr("height", 800);
  
  var context = canvas.node().getContext("2d"), G= this;
  
  this.setProjection('globe'); 
   
  d3.select('canvas').on("click touch", function(evt){
    G.click(this);
  });
  d3.select('canvas').on("mousemove", function(evt){
    
  });
  
  //return promise - keep things moving
  return new Promise(function(resolve,reject){
    if(!G.hasOwnProperty("voronoi")){
      G.generate(status).then(function(result){
        delete G.RNG;
        
        //sets points if there are mods
        G.pointCalc();
  
        G.d3Globe(context); 
      
        resolve(true);
      });  
    }
    else{
      G.d3Globe(context); 
      resolve(true);
    }
  })
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.d3Globe = function(){
  var context = canvas.node().getContext("2d");
  
  context.clearRect(0, 0, canvas.node().width, canvas.node().height);

  //sphere
  context.beginPath();
  this.path({type: "Sphere"});
  context.lineWidth = 3;
  context.strokeStyle = "#000";
  context.stroke();
  
  //polygons & borders
  this.displayTerrain(context,this.path);
  
  //locations
  this.displayEmpires(context);
  
  //locations
  this.displayLocations(context);
  
  //display selected polys
  this.displaySelected(context);
  
  //grid 
  context.beginPath();
  this.path(d3.geoGraticule()());
  context.lineWidth = .9;
  context.strokeStyle = "rgba(119,119,119,.9)";
  context.stroke(); 
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.click = function(evt){
  var G = this;
  var pos = d3.mouse(evt);
  var latlong = this.projection.invert(pos);  
  var cell = this.voronoi.find(latlong[0],latlong[1]);
  var poly = this.poly[cell.index];
  
  console.log(poly);
  VU.setTile(cell.index);
  G.selected = [poly.coordinates];
  
  G.d3Globe(canvas.node().getContext("2d"));
}
voronoiGlobe.prototype.displaySelected = function(context) { 
  if(this.selected.length==0) { return; }
  
  var C = {
    "water":'#00FFFF',
    "swamp":'#5F9EA0',
    "desert":'#F5F5DC',
    "plain":'#90EE90',
    "forest":'#228B22',
    "hill":'#A52A2A',
    "mountain":'#A9A9A9'
  }, G= this;
  
  //polygon
  context.beginPath();
  this.path({type: "MultiPolygon",coordinates:this.selected});
  /*
  //terrain color fill
  context.fillStyle = poly.terrain;
  context.fill(); 
  */
  //borders
  context.lineWidth = 2;
  context.strokeStyle = "#FFF";
  context.stroke();
}
voronoiGlobe.prototype.displayLocations = function(context) {
  //only show what is desired
  if(this.points[this.show].length==0) {return;}
  //points
  context.beginPath();
  this.path({type: "MultiPoint", coordinates:this.points[this.show]});
  context.fillStyle = HEXSITES[this.show].fill;
  context.fill(); 
  context.lineWidth = 0.6;
  context.strokeStyle = HEXSITES[this.show].color;
  context.stroke();
}
voronoiGlobe.prototype.displayEmpires = function(context) {
  if(!objExists(this.empires)) {return;}
  
  var E={};
  for(var x in this.empires){
    E = this.empires[x];
    //polygons
    context.beginPath();
    this.path({type: "MultiPolygon",coordinates:E.tileData()});
    //borders
    context.lineWidth = 3;
    context.strokeStyle = E.color;
    context.stroke();
  }
}
voronoiGlobe.prototype.displayTerrain = function(context,path) {
  var C = {
    "water":'#00FFFF',
    "swamp":'#5F9EA0',
    "desert":'#F5F5DC',
    "plain":'#90EE90',
    "forest":'#228B22',
    "hill":'#A52A2A',
    "mountain":'#A9A9A9'
  };
  
  for(var x in this.terrainPoly){
    var tPoly = this.terrainPoly[x];
    //polygons
    context.beginPath();
    path({type: "MultiPolygon",coordinates:tPoly});
    //terrain color fill
    context.fillStyle = C[x];
    context.fill(); 
    //borders
    context.lineWidth = 0.5;
    context.strokeStyle = "rgba(0,0,0,.9)";
    context.stroke();
  }
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
var ages = {
  '1' : {
    age:1,
    events:['ruin','conversion','schism','retract','growth','expansion'],
    eventweight: [10,20,10,20,15,5],
    addempires : [3,8]
  }
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.agePreModern = function() {
  var f='', n=0, 
  age = {
    n:3,
    events: ['ruin','conversion','schism','retract','growth','expansion'],
    eweight : [10,20,10,20,15,5]
  };
  //run previous ages
  this.agePreAntiquity();
  this.ageAntiquity();
  this.ageSail();
  //set the RNG for the age
  this.RNG = new Chance(this._id+'-'+this.popSeed+'-'+age.n);
  
  //cycle through empires t determine if still remain
  CPX.empireEvents.start(this,age);
  //add new empires
  this.addEmpires(this.RNG.natural({min:3,max:8}),age.n);
  
  //expand empires
  for(var x in this.empires){
    if(['ruin','conversion'].findOne(this.empires[x].events)){continue;}
    
    //expand
    n = this.RNG.natural({min:2,max:4});
    //20% chance of massive expansion
    if(this.RNG.bool({likelihood:20})){ 
      n = n * this.RNG.weighted([2,3,4],[6,3,1]); 
    }
    //expand
    this.popExpand(this.empires[x],n,age.n);
  }

  delete this.RNG;
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.ageSail = function() {
  var f='', n=0,
  age = {
    n:2,
    events: ['ruin','conversion','schism','retract','growth','expansion'],
    eweight : [40,10,10,30,5,5]
  };
  //run previous ages
  this.agePreAntiquity();
  this.ageAntiquity();
  //set the RNG for the age
  this.RNG = new Chance(this._id+'-'+this.popSeed+'-'+age.n);
  
  //cycle through empires t determine if still remain
  CPX.empireEvents.start(this,age);
  //add new empires
  this.addEmpires(this.RNG.natural({min:3,max:8}),age.n);
  
  //expand empires
  for(var x in this.empires){
    if(['ruin','conversion'].findOne(this.empires[x].events)){continue;}
    //expand
    this.popExpand(this.empires[x],this.RNG.natural({min:2,max:4}),age.n);
  }

  delete this.RNG;
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.ageAntiquity = function() {
  var f='', n=0, 
  age = {
    n:1,
    events: ['ruin','conversion','schism','retract','growth','expansion'],
    eweight : [40,10,15,10,20,5]
  };
  //run pre-Antiquity
  this.agePreAntiquity();
  //set the RNG for the age
  this.RNG = new Chance(this._id+'-'+this.popSeed+'-'+age.n);

  //cycle through empires t determine if still remain
  CPX.empireEvents.start(this,age);
  //add new empires
  this.addEmpires(this.RNG.natural({min:3,max:8}),age.n);
  
  //expand empires
  for(var x in this.empires){
    if(['ruin','conversion'].findOne(this.empires[x].events)){continue;}
    //expand
    this.popExpand(this.empires[x],this.RNG.natural({min:2,max:4}),age.n);
  }

  delete this.RNG;
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.agePreAntiquity = function(){
  this.RNG = new Chance(this._id+'-'+this.popSeed+'-0');
  
  var G=this, age = 0, n=-1, ppl={};
  
  //peoples
  n = this.RNG.natural({min:12,max:28});
  this.addPeople(n);
  
  for(var x in this.peoples){
    //for each people - expand
    this.popExpand(this.peoples[x],this.RNG.natural({min:2,max:5}),age);
  }
  
  //add new empires
  this.addEmpires(this.RNG.natural({min:3,max:8}),age);
  
  //expand empires
  for(var x in this.empires){
    if(['ruin','conversion'].findOne(this.empires[x].events)){continue;}
    //expand
    this.popExpand(this.empires[x],this.RNG.natural({min:2,max:4}),age);
  }
  
  delete this.RNG;
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.likelyTerrain = function(tags){
  var tA = this.terrainIDs, pa=[]; 

  if(tags.includes('ice')){
    pa = [].concat(tA.ice.plain,tA.ice.forest,tA.ice.desert,tA.ice.swamp,tA.ice.hill);
    if(tags.findOne(['mountain','earth','air','flight'])) {
      pa = pa.concat(tA.ice.mountain);
    }
    
    if(tags.includes('water')) {
      if(tags.length==1) {pa = tA.ice.water;}
      else { pa = pa.concat(tA.ice.water); }
    }
     
  }
  else {
    pa = [].concat(tA.basic.plain,tA.basic.forest,tA.basic.hill);
    if(tags.findOne(['mountain','earth','air','flight'])) {
      pa = pa.concat(tA.basic.mountain);
    }
    
    if(tags.includes('water')) {
      if (tags.length==1) { pa = tA.basic.water; }
      else { pa = pa.concat(tA.basic.water); }
    }
  }
  
  return pa;
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.addPeople = function(n) {
  var pplid ='', lT = [];
  for(var i=0;i<n;i++){
    //people id 
    pplid = this.RNG.string({length: 27, pool: base62});
    //make people
    this.peoples[pplid] = new CPXPeople(pplid);
    //likely terrain
    lT = this.likelyTerrain(this.peoples[pplid].special);
    //pick
    pid = this.RNG.pickone(lT);
    //add tile
    this.peoples[pplid].addTile(this.poly[pid]);
  }
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.addEmpires = function(n,age) {
  var allpeople = [];
  for(var x in this.peoples){ allpeople.push(x); }
  
  var eid = '', pplid='', tile={}, m=-1; 
  for(var i=0;i<n;i++){
    //empire id
    eid = this.RNG.string({length: 27, pool: base62});
    //track empires
    this.empires[eid] = new CPXEmpire(eid,age);
    //people
    pplid = this.RNG.pickone(allpeople);
    //pick empire
    tile = this.RNG.pickone(this.peoples[pplid].tiles);
    //capital
    this.empires[eid].capital = tile;
    //add tile to empire
    this.empires[eid].addTile(tile);
  }
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.popExpand = function(obj,n,age) {
  var tags = [];
  //consolidate tags
  if(objExists(obj.peoples)){
    obj.peoples.forEach(function(el) {
      tags = tags.concat(el.special);
    });
  }
  else { tags = obj.special; }
  //find likely terrain
  var lT = this.likelyTerrain(tags);
  
  var pN = [], G=this, neighbours=[], next ={};
  //multiply by people factor
  n = n * obj.expandMultiply();
  //loop through n expansions
  for(var i=0;i<n;i++){
    //loop through tiles 
    obj.tiles.forEach(function(tile) {
      neighbours = tile.properties.neighbours;
      neighbours.forEach(function(nid) {
        if(lT.includes(nid)) { 
          if(!obj.tileIDs().includes(nid)) { pN.push(nid); }
        }
      });
    });
    //ran into empty array errors
    if(pN.length==0) { pN = [].concat(neighbours); }
    pN = pN.unique();
  
    next = this.poly[this.RNG.pickone(pN)];
    
    //add tile to people/empire
    obj.addTile(next);  
  }
}
/////////////////////////////////////////////////////////////////////////////////
//populate the globe based on the given age and then display
voronoiGlobe.prototype.populate = function(age) {
  this.popSeed = CPXC.string({length: 7, pool: base62});
  this.peoples = {};
  this.empires = {};
  
  //wipe the slate
  this.poly.forEach(function(tile) {
    tile.special.length = 0;
  });
  
  this.resources();
  this['age'+age]();
  
  this.pointCalc();
  this.d3Globe();
}
voronoiGlobe.prototype.peopleList = function (){
  var list = [], info='', ppl={};
  for(var x in this.peoples){
    ppl = this.peoples[x];
    info = ppl.people + '['+ppl.rarity+']'+' Tags: '+ppl.special.join(', ');
    list.push(info);
  }
  return list;
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//basic tile object
function CPXTile (parent,id){
  this.name='';
  this.notes='';
  this.parent = parent;
  this.id = id;
  this.special = [];
}
CPXTile.prototype.save = function(){
  var doc = {
    id : this.id,
    name: this.name,
    notes: this.notes,
    special:[]
  }
  this.special.forEach(function(s) {
    if(['people','empire'].includes(s.class[0])){
      doc.special.push({class:s.class,seed:s.seed});
    }
    else {doc.special.push(s);}
  });
  return doc;
}
CPXTile.prototype.peoples = function(){
  var a=[];
  this.special.forEach(function(s) {
    if(s.class[0]=='people'){a.push(s);}
  });
  return a;
}
//add special - check if they exist, add if they dont
CPXTile.prototype.addSpecial = function(obj){
  //make sure doesn't exist already
  if(this.specialIDs().includes(obj.id)){ return; }
  //if the object is an empire, remove other empires
  if(obj.class[0]=='empire'){
    this.removeEmpires();
  }
  //add if it doesn't exist
  this.special.push(obj); 
}
CPXTile.prototype.removeEmpires = function(){
  for(var i=this.special.length-1;i>-1;i--){
    if(this.special[i].class[0]=='empire'){
      this.special.splice(i,1);
    }
  }
}
//remove objects 
CPXTile.prototype.removeSpecial = function(obj){
  if(this.specialIDs().includes(obj.id)){ 
    this.special.splice(this.specialIDs().indexOf(obj.id),1);
  }
}
CPXTile.prototype.specialIDs = function(){
  return this.special.map(function(s){ return s.id; });
}

