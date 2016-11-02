//terrain colors
const TERRAINS = ["water","swamp","desert","plain","forest","hill","mountain"];
const terrainColors = ["aqua","CadetBlue","Beige","LightGreen","ForestGreen","Brown","DarkGrey"];
const CLIMATES = ["arctic","sub-arctic","temperate","sub-tropical","tropical"];
//hexagon neighboors in axial coords
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.enter = function (map) {
  if(!objExists(USER[map._id])){
    USER[map._id] = {
      visible:[]
    }
  }

  CPX[map._type].enter(map);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//check if the map exists - and then enter it
CPX.mapCheck = function (seed,opts) {
  //find if the map exists
  var _id = CPX.findMap(seed);
  if(_id == false) {
    //if it doesn't exist make it, given the map type from the options
    _id = CPX[opts.type](opts);
    //testing
    console.log(CPXDB);
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function makeHex(dhex,gsize,stroke,fill) {
  var center = mapLocation(dhex), deg = -90;
  if(!dhex.map._pointy){
    deg = 0;
  }
  graphics = new createjs.Graphics();
  graphics.setStrokeStyle(1).beginStroke(stroke);
  if(dhex.map._type=="hexMap" || dhex.gradientFill) {
    graphics.beginRadialGradientFill(["white",fill], [0.3, 0.9], center.x, center.y, 0, center.x, center.y, dhex.map._hexradius);
    if(objExists(dhex.unit)){ 
      graphics.beginFill(fill);
    }
  }
  else {
    graphics.beginFill(fill);
  }
  graphics.drawPolyStar(center.x, center.y, dhex.map._hexradius, 6, 0, deg);  
  return graphics;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function makeCircle(dhex,size,stroke,fill) {
  var center = mapLocation(dhex);
  graphics = new createjs.Graphics();
  graphics.setStrokeStyle(1).beginStroke(stroke).beginFill(fill).drawCircle(center.x, center.y, size);
  return graphics;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function makeTriangle(dhex,gsize,stroke,fill) {
  var center = mapLocation(dhex);
  graphics = new createjs.Graphics();
  graphics.setStrokeStyle(1).beginStroke(stroke).beginFill(fill).drawPolyStar(center.x, center.y, gsize, 3, 0, 0);
  return graphics;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.makeGraphics = function(gf,cf,container,dhex,dvar){
  var c = new createjs.Shape();
  c.data = dhex.data;
  c.graphics = gf(dhex,dvar[0],dvar[1],dvar[2]);
  container.addChild(c);
  c.addEventListener("click", cf);
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
CPX.display.units = function(){
  var mapid = $(".map.active").attr("id"), map = CPXDB[mapid];
  var unit={}, unitloc="", site = {}, cdata={}, dhex = {}, newd=false;
  //create a new container for the units if one does not exist
  if(objExists(map.display.unit)){
    //remove it and start fresh
    map.display.stage.removeChild(map.display.unit);
  }
  map.display.unit = new createjs.Container();
  //for unit see if it is on the map - display it
  for (var x in CPXUNITS) {
    //load the unit
    unit = CPXUNITS[x];
    unitloc = unit.location.join("");
    //check if the map._id is in the location
    if(unitloc.includes(map._id)){
      //pull the site based on display type and site id - from unit
      site = map[map._dtype][unit.location[map.seed.length]];
      //load cell data
      cdata = {realm:map.realm, map:map._id, uid:unit._id, cid:site.id};
      //if display type is cell (hex)
      if(map._dtype == "cells") {
        dhex = {hex:site,map:map,data:cdata};
      }
      //if display type is zone
      else if (map._dtype == "zones") {
        //uses the center of the zone for placement
        dhex = {hex:map.cells[site.cells[0]],map:map,data:cdata};
      }
      //update the graphics - adding a triangle for every hero
      CPX.display.makeGraphics(makeTriangle,CPX.unit.Click,map.display.unit,dhex,[10,"black","green"]);
    }
  }

  map.display.unit.x-= map.center.x;
  map.display.unit.y-= map.center.y;
  //add container to the stage
  map.display.stage.addChild(map.display.unit);
  //updates display
  map.display.stage.update();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.makeCanvas = function (map,callback) {
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

