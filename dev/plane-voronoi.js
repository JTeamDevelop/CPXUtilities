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
