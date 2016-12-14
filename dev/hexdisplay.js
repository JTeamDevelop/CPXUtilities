//terrain colors
const TERRAINS = ["water","swamp","desert","plain","forest","hill","mountain"];
const terrainColors = ["aqua","CadetBlue","Beige","LightGreen","ForestGreen","Brown","DarkGrey"];
const CLIMATES = ["arctic","sub-arctic","temperate","sub-tropical","tropical"];
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function mapLocation(dhex) {
  var hex = dhex.hex, size = dhex.map._hexradius, pointy = dhex.map._pointy;

  var deg = -90;
  if(!dhex.map._pointy){
    deg = 0;
  }

  var center = CPX.hex.center(size,hex,pointy),
  bounds = dhex.map.bounds;
  center.x+= bounds.x/2;
  center.y+= bounds.y/2;

  if(objExists(dhex.viewcenter)){
    center.x-=dhex.viewcenter.x;
    center.y-=dhex.viewcenter.y;
  }
  return center;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function makeHex(opts) {
  var size = opts.size,stroke=opts.stroke,fill=opts.fill;
  var center = mapLocation(opts), deg = -90;
  if(!opts.map.class.includes('pointy')){
    deg = 0;
  }
  var graphics = new createjs.Graphics();
  //set the stroke of the hex
  graphics.setStrokeStyle(1).beginStroke(stroke);
  //add gradient  if hex class has gradient OR hex is selected
  if(opts.map.class.includes('gradient') || opts.map.selected.includes(opts.hex.id)) {
    graphics.beginRadialGradientFill(["white",fill], [0.3, 0.9], center.x, center.y, 0, center.x, center.y, opts.map._hexradius);
    if(objExists(opts.unit)){ 
      graphics.beginFill(fill);
    }
  }
  else {
    graphics.beginFill(fill);
  }
  graphics.drawPolyStar(center.x, center.y, opts.map._hexradius, 6, 0, deg);  
  return graphics;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function makeShape(opts) {
  var size = opts.size,
  stroke=opts.stroke,
  fill=opts.fill,
  //get the center postion
  center = mapLocation(opts),
  //setup graphics element
  graphics = new createjs.Graphics();
  //provide the stroke, and fill
  graphics.setStrokeStyle(1).beginStroke(stroke).beginFill(fill);
  
  if(opts.shape == 'circle'){
    graphics.drawCircle(center.x, center.y, size);  
  }
  else if (opts.shape == 'square'){
    graphics.drawRect(center.x-size/2, center.y-size/2, size, size);  
  }
  else if(opts.token.shape == 'triangle'){
    graphics.drawPolyStar(center.x, center.y, size, 3, 0, 0)
  }

  return graphics;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//type of display shape function, click function, container object, data 
CPX.display.makeGraphics = function(opts){
  var c = new createjs.Shape();
  //cell data
  c.data = opts.data.data;
  c.graphics = opts.dtype(opts.data);
  opts.container.addChild(c);
  c.addEventListener("click", opts.onClick);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.centerAdjust = function (map) {
  map.display.stage.children.forEach(function(el) {
   el.x-=map.center.x;
   el.y-=map.center.y; 
  });
  map.display.stage.update();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.clearActive = function (map) {
  if(objExists(map.display)){
    //remove event listers to stop multi click
    var containers = ['map','siteMarkers','tokens'];
    containers.forEach(function(c) {
      map.display[c].children.forEach(function(el) {
        el.removeAllEventListeners();
      });  
    });
    delete map.display;
  }
}

