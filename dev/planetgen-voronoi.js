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
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.flatVoronoi = function(){
  //coordinates on a globe
  var coords = d3.range(this.n).map(function() {
    return {
      x : G.RNG.floating({min:0,max:360}), 
      y: G.RNG.floating({min:-90,max:90})
    }
  });
  
  this.voronoi = new Voronoi();
  
  this.diagram = this.voronoi.compute(coords,{xl: 0, xr: 360, yt: -90, yb: 90});
  
  this.poly = this.diagram.cells.map(function(el,i){
    var np = {
      id:i,
      site: el.site,
      terrain: 'water',
      coordinates:[],
      properties:{
        neighbours: el.getNeighborIds()
      }
    }
    el.halfedges.forEach(function(he) {
      var start = he.getStartpoint();
      np.coordinates.push([start.x,start.y]);
    });
    
    np.coordinates = [np.coordinates];
    return np;
  })
  
}
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
  
  this.poly = this.voronoi.polygons().features.map(function(el,i){
    el.id = i;
    //set all to water
    el.terrain = 'water';
    return el;
  });
}
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
voronoiGlobe.prototype.pointCalc = function(){
  this.points = [];
  
  if(objExists(this.opts.mods)){
    for(var x in this.opts.mods){
      //only display if there is somehting special
      if(this.opts.mods[x].special.length>0){
        //multi points are the simple array of points 
        this.points.push(this.poly[x].properties.sitecoordinates)  
      }
    }
  }
}
/////////////////////////////////////////////////////////////////////////////////
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
voronoiGlobe.prototype.d3Display = function(){
  canvas = d3.select("#viewportFrame").append("canvas")
  .attr("width", 1000)
  .attr("height", 800);
  
  var context = canvas.node().getContext("2d");
   
   var width = canvas.node().width,
       height = canvas.node().height;
  
  //set the projection we will use
  this.projection = d3.geoOrthographic()
      .scale(height / 2.25)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .precision(.2);
   
   //standard path using the projection and the canvas context
   this.path = d3.geoPath()
       .projection(this.projection)
       .pointRadius(4)
       .context(context);  
  
  if(!this.hasOwnProperty("voronoi")){
    this.generate().then(function(result){
      delete G.RNG;
      
      //sets points if there are mods
      G.pointCalc();

      G.d3Globe(context); 
    });  
  }
  else{
    this.d3Globe(context); 
  }
   
  d3.select('canvas').on("click touch", function(evt){
    G.click(this);
  });
  d3.select('canvas').on("mousemove", function(evt){
    
  });
}
/////////////////////////////////////////////////////////////////////////////////
voronoiGlobe.prototype.threeDisplay = function(){
  canvas = d3.select("body").append("canvas")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
   
  canvas.node().getContext("webgl");
  
  renderer = new THREE.WebGLRenderer({canvas: canvas.node(), antialias: true});
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 1000;
  
  scene = new THREE.Scene();
  
  light = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);
  light.position.set(0, 1000, 0);
  scene.add(light);
  
  raycaster = new THREE.Raycaster();

  window.addEventListener('resize', onWindowResize, false);
  
  if(!this.hasOwnProperty("voronoi")){
    this.generate().then(function(result){
      delete G.RNG;
    
      G.threeGlobe(); 
      
      renderer.render(scene, camera);
      
      animate();
    });  
  }
  else{
    this.threeGlobe(); 
    renderer.render(scene, camera);
  }
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
}
voronoiGlobe.prototype.threeGlobe = function() {
  var base = 512, multi =1;

  this.projection = d3.geoEquirectangular()
    .translate([base*2*multi, base*multi])
    .scale(326.5);

  /*
  this.projection = d3.geoOrthographic();
  
  .scale(475)
  .translate([1024 / 2, 512 / 2])
  .clipAngle(90)
  .precision(.1);
  */
  
  var segments = 155; // number of vertices. Higher = better mouse accuracy

  /*
  // Base globe with blue "water"
  let blueMaterial = new THREE.MeshPhongMaterial({color: '#2B3B59', transparent: true});
  let sphere = new THREE.SphereGeometry(200, segments, segments);
  let baseGlobe = new THREE.Mesh(sphere, blueMaterial);
  baseGlobe.rotation.y = Math.PI;
  */

  // add base map layer with all countries
  let worldTexture = this.threeMapTexture();
  let mapMaterial  = new THREE.MeshPhongMaterial({map: worldTexture, transparent: true});
  var baseMap = new THREE.Mesh(new THREE.SphereGeometry(200, segments, segments), mapMaterial);
  baseMap.rotation.y = Math.PI;
  baseMap.addEventListener('click', onGlobeClick);
  baseMap.addEventListener('mousemove', onGlobeMousemove);
  
  /*
  // add wireframe layer
  let wireMaterial  = new THREE.MeshPhongMaterial({wireframe: true, transparent: true});
  var wireFrame = new THREE.Mesh(new THREE.SphereGeometry(201, segments, segments), wireMaterial);
  wireFrame.rotation.y = Math.PI;
  */

  // create a container node and add the two meshes
  this.root = new THREE.Object3D();
  this.root.scale.set(2.5, 2.5, 2.5);
  //this.root.add(baseGlobe);
  this.root.add(baseMap);
  //this.root.add(wireFrame);
  scene.add(this.root);
  
  var G=this;
  function onGlobeMousemove(event) {
    // Get pointc, convert to latitude/longitude
    var latlng = getEventCenter.call(this, event);
  }
  function onGlobeClick(event) {
    // Get pointc, convert to latitude/longitude
    var latlng = getEventCenter.call(this, event),
    //find the voronoi point, don't forget to flip lat and long
    vt = G.voronoi.find(latlng[1],latlng[0]),
    //get the actuall poly data
    poly = G.poly[vt.index];
    console.log(poly);
    //overlay
    var material = new THREE.MeshPhongMaterial({map: G.threeMapTexture(poly), transparent: true});
    
    if (!G.overlay) {
      G.overlay = new THREE.Mesh(new THREE.SphereGeometry(201, 40, 40), material);
      G.overlay.rotation.y = Math.PI;
      G.root.add(G.overlay);
    } else {
      G.overlay.material = material;
    }
    
  }
  
  setEvents(camera, [baseMap], 'click');
  setEvents(camera, [baseMap], 'mousemove', 10);
}
voronoiGlobe.prototype.threeMapTexture = function(poly) {
  var base = 1024,
    texture, 
    canvas = d3.select("body").append("canvas")
           .style("display", "none")
           .attr("width", base*2+"px")
           .attr("height", base+"px"), 
    context = canvas.node().getContext("2d"),
    path = d3.geoPath()
           .projection(this.projection)
           .context(context);

  if(typeof poly === 'undefined'){
    console.log('building texture');
    this.displayTerrain(context,path);
  }
  else {
    this.displayTile(context,path,poly)
  }
  
  texture = new THREE.Texture(canvas.node());
  texture.needsUpdate = true;

  canvas.remove();

  return texture;
}
voronoiGlobe.prototype.click = function(evt){
  var G = this;
  var pos = d3.mouse(evt);
  var latlong = this.projection.invert(pos);  
  var cell = this.voronoi.find(latlong[0],latlong[1]);
  var poly = this.poly[cell.index];
  
  VU.setTile(poly);
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
  if(this.points.length==0) { return; }
  
  //points
  context.beginPath();
  this.path({type: "MultiPoint", coordinates:this.points});
  context.fillStyle = "#000";
  context.fill(); 
  context.stroke();
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

function voronoiPlane (){
  this.canvas = d3.select("canvas").on("touchmove mousemove", this.moved).node();
  var context = this.canvas.getContext("2d");
  
  var width = this.canvas.width,
      height = this.canvas.height;
  
  this.sites = d3.range(100).map(function() {
    return [ width * Math.random(), height * Math.random() ] 
  })
  
  this.voronoi = d3.voronoi()
  .extent([[-1, -1], [width + 1, height + 1]]);
  
}
voronoiPlane.prototype.display = function (){
  var context = this.canvas.getContext("2d"),
      diagram = this.voronoi(this.sites),
      links = diagram.links(),
      polygons = diagram.polygons();

  context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  context.beginPath();
  for (var i = 0, n = polygons.length; i < n; ++i) drawCell(polygons[i]);
  context.strokeStyle = "#000";
  context.stroke();

  context.beginPath();
  for (var i = 0, n = links.length; i < n; ++i) drawLink(links[i]);
  context.strokeStyle = "rgba(0,0,0,0.2)";
  context.stroke();

  context.beginPath();
  for (var i = 0, n = this.sites.length; i < n; ++i) drawSite(this.sites[i]);
  context.fillStyle = "#000";
  context.fill();
  context.strokeStyle = "#fff";
  context.stroke();
  
  function drawSite(site) {
    context.moveTo(site[0] + 7, site[1]);
    context.arc(site[0], site[1], 7, 0, 2 * Math.PI, false);
  }
  
  function drawLink(link) {
    context.moveTo(link.source[0], link.source[1]);
    context.lineTo(link.target[0], link.target[1]);
  }
  
  function drawCell(cell) {
    if (!cell) return false;
    context.moveTo(cell[0][0], cell[0][1]);
    for (var j = 1, m = cell.length; j < m; ++j) {
      context.lineTo(cell[j][0], cell[j][1]);
    }
    context.closePath();
    return true;
  }
}
voronoiPlane.prototype.moved = function() {
  var pos = d3.mouse(this);
  //redraw();
}

var G = {};

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

function getPoint(event) {

  // Get the vertices
  let a = this.geometry.vertices[event.face.a];
  let b = this.geometry.vertices[event.face.b];
  let c = this.geometry.vertices[event.face.c];

  // Averge them together
  let point = {
    x: (a.x + b.x + c.x) / 3,
    y: (a.y + b.y + c.y) / 3,
    z: (a.z + b.z + c.z) / 3
  };

  return point;
}

function getEventCenter(event, radius) {
  radius = radius || 200;

  var point = getPoint.call(this, event);

  var latRads = Math.acos(point.y / radius);
  var lngRads = Math.atan2(point.z, point.x);
  var lat = (Math.PI / 2 - latRads) * (180 / Math.PI);
  var lng = (Math.PI - lngRads) * (180 / Math.PI);

  return [lat, lng - 180];
}

function setEvents(camera, items, type, wait) {

  let listener = function(event) {

    let mouse = {
      x: ((event.clientX - 1) / window.innerWidth ) * 2 - 1,
      y: -((event.clientY - 1) / window.innerHeight) * 2 + 1
    };

    let vector = new THREE.Vector3();
    vector.set(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);

    raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

    let target = raycaster.intersectObjects(items);

    if (target.length) {
      target[0].type = type;
      target[0].object.dispatchEvent(target[0]);
    }

  };

  if (!wait) {
    document.addEventListener(type, listener, false);
  } else {
    document.addEventListener(type, debounce(listener, wait), false);
  }
}
/*
function render(){
  renderer.render(scene, camera);
}

function animate() {
  //G.root.rotation.y += G.rotate;
  G.root.rotation.x += G.rotate;
  requestAnimationFrame(animate);
  render();
}

function startThree(){
  addG(4000);
  G.threeDisplay();
}
*/

