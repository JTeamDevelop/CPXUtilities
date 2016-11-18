/*
    A hex plane random generator

    This is free because the grace of God is free through His son Jesus.

	The code is Copyright (C) 2016 JTeam

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>

V 1.2.1
Recalculate map bounds after doing mod update
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.mapDimensions = function () {
  var width =document.getElementById("maps").offsetWidth*.95,
    height = document.getElementById("maps").offsetHeight*.95;

  return {width:width,height:height};
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap = function (opts) {
  var map = {
    _dtype : "zones",
    _radial : false,
    _pointy : typeof opts.pointy === "undefined" ? true : opts.pointy,
    _hexradius : 35,
    seed : typeof opts.seed === "undefined" ? [CPXC.string({length: 32, pool: base62})] : opts.seed,
    cells : {},
    zones : [],
    mods : {}
  }

  //id based on the seed
  map._id = map.seed.join("");
  //parent if contained in another object
  map.parent = typeof opts.parent === "undefined" ? "" : opts.parent;
  //classes of the map
  map.class = typeof opts.class === "undefined" ? ['hexMap'] : opts.class;
  map.special = typeof opts.special === "undefined" ? [] : opts.special;
  //number of cell zones
  map._nZones = typeof opts.nZones === "undefined" ? -1 : opts.nZones;
  //optionally a number of cells
  map._nCells = typeof opts.nCells === "undefined" ? 0 : opts.nCells;
  //uniform distribution of planes = no zones used
  var uniform = typeof opts.uniform === "undefined" ? false : opts.uniform;

  map._visible = typeof opts.visible === "undefined" ? [] : opts.visible;
  map._zoneEnter = typeof opts.zoneEnter === "undefined" ? -1 : opts.zoneEnter;

  map._parentNeighboors = typeof opts.parentNeighboors === "undefined" ? [] : opts.parentNeighboors;

  //start the seeded RNG
  map.RNG = new Chance(map.seed.join(""));
  
  map._size = typeof opts.size === "undefined" ? CPX.size(map.RNG)/2 : opts.size;

  //Uniform distribution of cells in one zone
  if(uniform) {
    //if uniform a number of cells has to be provided
    if(map._nCells == 0){
      //based on size
      for (var i = 0; i < map._size; i++) {
        map._nCells += Math.round(map.RNG.normal({mean: 40, dev: 7}));
      }
    }
    //make 1 zone to contain all zones
    map.zones.push(new Zone(map,0));
    //for every cell add one
    for (var i = 0; i < map._nCells; i++) {
      CPX.hexMap.addCell(map);
    }
  }
  else {
    //if it isn't a uniform map and there are no defined zones - randomly create a number of zones
    if(map._nZones == -1){
      map._nZones = Math.round(10*map._size);
    }
    //generate the zones
    for (var i = 0; i < map._nZones; i++) {
      CPX.hexMap.addZone(map);
    }
  }

  //make zones visible
  CPX.hexMap.makeVisible(map);

  //null and delete RNG for cleanup
  map.RNG = null;
  delete map.RNG;
  
  //identify neighboors and bounds for display
  CPX.hexMap.zoneNeighboors(map);
  CPX.hexMap.bounds(map);

  //save the options provided
  map.opts = opts;
  //setup the NEDB to hold the mods
  map.mods = new Nedb();
  map.mods.persistence.setAutocompactionInterval(120000);
  
  return map;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//push to mod DB, mod {query,type,data}
CPX.hexMap.pushMod = function (map,mod) {
  //pass data to mod db
  if(mod.type=='set'){
    map.mods.update(mod.query, { $set: mod.data }, { upsert: true }, function () {}); 
  }
  else if(mod.type=='addtoset'){
    map.mods.update(mod.query, { $addToSet: mod.data }, { upsert: true }, function () {}); 
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap.save = function (map) {
  var data = {
    _id: map._id,
    seed: map.seed,
    mods: map.mods,
    opts: map.opts
  }
  CPXSAVE.setItem(map._id,data);
}
CPX.hexMap.applyMods = function (map) {
  var mods = map.opts.mods;
  //return promise
  return new Promise(function(resolve,reject){
    //update mod db accordingly
    map.mods.insert([mods], function (err) {});
    //pull mods and loop through
    mods.forEach(function(el) {
      //if the id is a cell id - loop through
      if(objExists(map.cells[el._id])){
        //loop through keys and mod cell
        for(var x in el){
          if(x=='_id'){continue;}
          map.cells[el._id][x] = el[x];
        }
      }
      //if an id that isn't currently part of the cells
      else if (el._id.includes('_')){
        //get the coords
        var qr = CPX.hex.cellQR(el._id);
        //make the new cells
        map.cells[el._id] = new HCell(qr.q,qr.r,map.opts.terrain,map.zones[0]);
        map.zones[0].cells.push(el._id);
      }
      else {
        map[el._id] = el.val;
      }
    })
    //update bounds
    CPX.hexMap.bounds(map);
    resolve(map);
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap.addZone = function (map) {
  var size = CPX.size(map.RNG),
    nz = map.zones.length, Z = new Zone(map,nz);

  Z.size = size/2;

  map.zones.push(Z);

  var rZ=map.RNG.pickone(map.zones), nA=[], nid="";

  for (var i = 0; i < size*3/2; i++) {
    nid="";
    //new map - first cell is at 0,0
    if(nz==0 && i==0) {
      nid="0_0";
    }
    else {
      //first cell in new zone has to start at a random zone
      if(i==0) {
        while (nA.length==0) {
          nA = CPX.hexMap.zoneEmptyNeighboors(map,rZ.id);
          rZ = map.RNG.pickone(map.zones);
        }
      }
      //otherwise we get edges from the zone
      else {
        nA = CPX.hexMap.zoneEmptyNeighboors(map,Z.id);
        //if no new id - it is encased, move one to new zone
        if (nA.length==0){
          break;
        }
      }
      nid = map.RNG.pickone(nA);
    }

    var cXY = CPX.hex.cellQR(nid);
    map.cells[nid] = new HCell(cXY.q,cXY.r,-1,Z);
    Z.cells.push(nid);
    map._nCells++;
  }

  CPX.hexMap.zoneBounds(map,Z.id);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap.addCell = function (map) {
  var Z=map.zones[0], nid="", nA=[];

  //new map - first cell is at 0,0
  if(!objExists(map.cells["0_0"])){
    nid = "0_0"
  }
  else {
    //get the empty neighboors
    nA = CPX.hexMap.zoneEmptyNeighboors(map,Z.id);
    nid = map.RNG.pickone(nA);
  }

  var cQR = CPX.hex.cellQR(nid);
  map.cells[nid] = new HCell(cQR.q,cQR.r,-1,Z);
  Z.cells.push(nid);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//cell immediate neighboors
CPX.hexMap.cellNeighboors = function (map,cell) {
  var R={n:[],o:[]};
  //n will be neighboors, o will be open cells
  var neighboors = CPX.hex.withinX(cell,1)[1];
  for (var i = 0; i < neighboors.length; i++) {
    if(objExists(map.cells[neighboors[i].id])){
      R.n.push(neighboors[i].id);
    }
    else {
      R.o.push(neighboors[i].id);
    }
  }
  return R;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap.bounds = function (map) {
  var cell={}, rmax=0, qmax=0, rmin=0, qmin=0;

  for (var x in map.cells) {
    cell = map.cells[x];
    if(cell.q<qmin) { qmin = cell.q; }
    if(cell.q>qmax) { qmax = cell.q; }
    if(cell.r<rmin) { rmin = cell.r; }
    if(cell.r>rmax) { rmax = cell.r; }
  }

  map.q = qmin;
  map.r = rmin;
  //display height and width
  map.dw = Math.abs(qmax-qmin);
  map.dh = Math.abs(rmax-rmin);
  map.center = {
    q:qmin+map.dw/2,
    r:rmin+map.dh/2
  };

  map.bounds = CPX.hex.mapBounds(map);
  var center = CPX.hex.center(map._hexradius,map.center,map._pointy);
  map.center.x = center.x;
  map.center.y = center.y;
   
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap.zoneBounds = function (map,zid) {
  var Z = map.zones[zid], cell={}, rmax=0, qmax=0, rmin=0, qmin=0;

  for (var i = 0; i < Z.cells.length; i++) {
    cell = map.cells[Z.cells[i]];
    if(cell.q<qmin) { qmin = cell.q; }
    if(cell.q>qmax) { qmax = cell.q; }
    if(cell.r<rmin) { rmin = cell.r; }
    if(cell.r>rmax) { rmax = cell.r; }
  }

  Z.q = qmin;
  Z.r = rmin;
  Z.width = Math.abs(qmax-qmin);
  Z.height = Math.abs(rmax-rmin);
  Z.center = {q:qmin+Z.width/2,r:rmin+Z.height/2};
  Z.radius = Math.sqrt((qmin+Z.width)*(qmin+Z.width)+(rmin+Z.height)*(rmin+Z.height));

  return Z;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap.makeVisible = function (map) {
  var count = 0;
  for (var i = 0; i < map.zones.length; i++) {
    if(map._visible.includes(i) || map._visible.includes("all")) {
      map.zones[i].visible = true;
      count++;
    }
  }

  if(map._zoneEnter == -1) {
    var edge = CPX.hexMap.zoneOnEdge(map);
    map._zoneEnter = map.RNG.pickone(edge);
  }

  if(count == 0){
    map.zones[map._zoneEnter].visible = true;
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//get Zone empty cell neighboors
CPX.hexMap.zoneEmptyNeighboors = function (map,zid) {
  var Z = map.zones[zid], cA=[];
  for (var i = 0; i < Z.cells.length; i++) {
    cA = cA.concat(CPX.hexMap.cellNeighboors(map,map.cells[Z.cells[i]]).o);
  }

  return cA.unique();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap.zoneOnEdge = function (map) {
  var edge = [];
  for (var x in map.cells) {
    if(CPX.hexMap.cellNeighboors(map,map.cells[x]).o.length>0){
      edge.push(map.cells[x].zone);
    }
  }

  return edge.unique();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//provides the zones with a list of their zone neighboors
CPX.hexMap.zoneNeighboors = function (map) {
  var ZN = [], Zid = -1, nZid=-1, cN=[];
  for (var x in map.cells) {
    Zid = map.cells[x].zone;
    if(!objExists(ZN[Zid])) {
      ZN[Zid] = [];
    }

    cN = CPX.hexMap.cellNeighboors(map,map.cells[x]).n;
    for (var i = 0; i < cN.length; i++) {
      nZid = map.cells[cN[i]].zone;
      if(Zid != nZid) {
        if(!ZN[Zid].includes(nZid)) {
          ZN[Zid].push(nZid);
        }
      }
    }
  }

  map._ZN = ZN;
  return ZN;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexMap.mapClick = function (e) {
  var target = e.target,
    data =target.data,
    map = CPXDB[data.map],
    cell = map.cells[data.cid],
    zone = map.zones[cell.zone], 
    auzid = CPXAU.location[CPXAU.location.length-1];

  //if it is the zone with the active unit offer some options
  if(CPXAU.location.join("").includes(map._id) && auzid == zone.id) {

  }
  else {
    //move the active unit if it is a neighboor zone
    if(map._ZN[auzid].includes(zone.id)) { 
      CPX.hexMap.enterZone(map,zone);
    }
  }
  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.drawTokens = function (map) {
  if(objExists(map.display.tokens)){
    //remove it and start fresh
    map.display.stage.removeChild(map.display.tokens);
  }
  map.display.tokens = new createjs.Container();
  
  var t={}, data={};
  map.tokens.forEach(function(el) {
    data= {map:map._id, cid:ac.id};
    //type of display shape function, click function, container object, data 
    CPX.display.makeGraphics({
      dtype: makeShape,
      onClick: CPX[map.class[0]].mapClick,
      container: map.display.tokens,
      data: {token:t,map:map,size:t.size,stroke:t.line,fill:t.color}
    });
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.drawHex = function (map) {
  //display container ids
  var dids = ['hexmap','siteMarkers'];
  dids.forEach(function(el) {
    if(objExists(map.display[el])){
      //remove it and start fresh
      map.display.stage.removeChild(map.display[el]);
    }
    map.display[el] = new createjs.Container();
  });
  

  var c={}, ac={}, cdata={}, ddata={}, color ="", alpha = 0.5;
  for (var x in map.cells) {
    ac= map.cells[x];
 
    if(map.zones[ac.zone].visible || map.visible.includes(ac.zone)) {
      //cell data
      cdata = {map:map._id, cid:ac.id};
      //set the color based upon the zone color
      color = hexToRgbA(map.zones[ac.zone].color,alpha);
      if(map.class.includes("terrain")){
        color = terrainColors[ac.terrain];
      }
      //display data and variables
      ddata = {hex:ac,map:map,data:cdata,size:map._hexradius,stroke:"black",fill:color};

      //type of display shape function, click function, container object, data 
      CPX.display.makeGraphics({
        dtype: makeHex,
        onClick: CPX[map.class[0]].mapClick,
        container: map.display.hexmap,
        data: ddata 
      });
    }
    //do all the special sites
    ac.special.forEach(function(el) {
      //set to circle to draw the site
      el.shape = 'circle';
      //set default color to white
      color = (el.class[0].length==0) ? 'white' : HEXSITES[el.class[0]].color;
      //call the graphics
      CPX.display.makeGraphics({
        dtype: makeShape,
        onClick: CPX[map.class[0]].mapClick,
        container: map.display.siteMarkers,
        data: {hex:ac,map:map,data:cdata,size:5,shape:'circle',stroke:'black',fill:color} 
      });
    });
  }
  
  //add containers to stage
  dids.forEach(function(el) {
    map.display.stage.addChild(map.display[el]);  
  })
  //make tokens
  CPX.display.drawTokens(map);
  //adjust everything
  CPX.display.centerAdjust(map);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.clearActive = function (map) {
  if(objExists(map.display)){
    //remove event listers to stop multi click
    var containers = ['hexmap','siteMarkers','tokens'];
    containers.forEach(function(c) {
      map.display[c].children.forEach(function(el) {
        el.removeAllEventListeners();
      });  
    });
    delete map.display;
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.hexMap = function (map) {
  CPX.display.clearActive(map);
  
  map.display = {data:{}};
  map.display.canvas = $( "#"+map._id + " canvas")[0];
  map.display.stage = new createjs.Stage(map.display.canvas);

  CPX.display.drawHex(map);
}
