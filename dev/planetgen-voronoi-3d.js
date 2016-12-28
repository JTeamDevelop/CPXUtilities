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

/////////////////////////////////////////////////////////////////////////////////
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


