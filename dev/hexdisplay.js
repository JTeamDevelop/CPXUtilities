//terrain colors
const TERRAINS = ["water","swamp","desert","plain","forest","hill","mountain"];
const terrainColors = ["aqua","CadetBlue","Beige","LightGreen","ForestGreen","Brown","DarkGrey"];
const CLIMATES = ["arctic","sub-arctic","temperate","sub-tropical","tropical"];
///////////////////////////////////////////////////////////////////////////////////////////////////////////
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
CPX.display.makeCanvas = function (VU,map) {
  $(".map").removeClass("active");
  $(".map").slideUp();
  if ( $( "#"+map._id ).length ) {
    if(map._type == "hexMap"){
      footer.showExit = true;
      footer.showEnter = true;
      footer.showZoomOut = false;
      footer.showZoomIn = false;
      footer.exitMap = map.seed.slice(0,3).join("");
    }
    else {
      footer.showExit = false;
      footer.showZoomIn = true;
      if(map._type == "atlas") {
        footer.showZoomOut = true;
        footer.showZoomIn = false;
        footer.showEnter = true;
      }
    }
    $( "#"+map._id ).addClass("active");
    $( "#"+map._id ).slideDown();
    return false;
  } 
  else {
    var B = {x:800, y:800};
    if(map._dtype !='sector') {
      B= CPX.hex.mapBounds(map);
    }
    $("#maps").append('<div id='+map._id+' class="map active"><canvas width="'+B.x+'" height="'+B.y+'"></canvas>');
    callback(map);
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

