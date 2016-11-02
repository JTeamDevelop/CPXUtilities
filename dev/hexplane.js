CPX.hexPlane = function (opts) {
  opts = typeof opts === "undefined" ? {} : opts;

  opts.scale = 13;
  opts.size = 3;
  opts.uniform = true;
  opts.dataOnly = true;

  var map = CPX.hexMap(opts);
  map._type = "hexPlane";
  map._dtype = "cells";

  var seed = map.seed.concat(["p"]);
  //since we are passing an array use the ES6 spread(...) command
  map.RNG = new Chance(seed.join(""));

  //percent water
  map._water = typeof opts.water === "undefined" ? map.RNG.normal({mean: 30, dev: 5}) : opts.water;

  CPX.hexPlane.terrain(map);
  CPX.hexPlane.climate(map);
  CPX.hexPlane.locations(map);

  map.name= CPX.name(map.RNG);

  delete map.RNG;

  CPXDB[map._id] = map;
  
  return map._id;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexPlane.climate = function (map) {
  var cA=CPX.cellArray(map), done=[], cid = "";

  function climate() {
    return map.RNG.weighted([0,1,2,3,4], [1/11,2/11,3/11,3/11,2/11])
  }

  function initialize() {
    //number of climate zones
    var nz= map.RNG.integer({min: 3, max: 5});

    for (var i = 0; i < nz; i++) {
      //for each zone find a random cell
      cid=map.RNG.pickone(cA);
      done.push(cid);
      //set climate of cell
      map.cells[cid].climate=climate();
      //remove the cell from the array so it can't be selected again
      cA.splice(cA.indexOf(cid),1);
    }
  }

  initialize();

  var N = [];
  while (cA.length > 0) {
    cid = map.RNG.pickone(done);
    N = CPX.hexMap.cellNeighboors(map,map.cells[cid]).n;
    N = map.RNG.pickone(N);
    if (map.cells[N].climate == -1) {
      map.cells[N].climate = map.cells[cid].climate;
      cA.splice(cA.indexOf(N),1);
      done.push(N);
    }
  }

}
CPX.hexPlane.terrain = function (map) {
  //cA pushes index of all cells
  //Then we pick 5 to 10 points to start and add terrain
  var cA=CPX.cellArray(map), points = [];

  var land = Math.floor(cA.length*(1-(map._water/100)));

  function noTerrainNeighboors(cell) {
    //N are the neighboors that exist, no terrain contains cells without terrain
    var N=CPX.hexMap.cellNeighboors(map,cell).n, noTerrain=[];
    //for each if terrain is -1 (none), push to noTerrain
    N.forEach(function(cid){
      if(map.cells[cid].terrain == -1) {
        noTerrain.push(cid);
      }
    })
    //return array
    return noTerrain;
  }

  function terrainZone(cid) {
    //remove the cell from the array so it can't be used again
    cA.splice(cA.indexOf(cid),1);
    //size of the terrain zone
    var nc = map.RNG.normal({mean: 7, dev: 3}),
    //terrain of the zone
      T=map.RNG.weighted([1,2,3,4,5,6], [0.05,0.05,0.3,0.3,0.2,0.1]),
      //holds results
      zone=[], neighboors=[], noTerrain=[], rcid="";

    if(nc<1) { nc = 1; }

    //push the initial cell to the zone
    zone.push(cid);
    //if the number of cells in the points + the N in this zone is greater than the land, limit to land
    if(points.length + nc > land) {
      nc = land - points.length+1;
    }
    //while the N cells in the zone less than nc - loop
    while(zone.length < nc) {
      noTerrain=[];
      zone.forEach(function(zcid){
        //for each cell in the active zone find the neighboors without terrain
        noTerrain= noTerrain.concat(noTerrainNeighboors(map.cells[zcid])).unique();
      });
      //if none break and go on to next zone
      if(noTerrain.length==0) {
        break;
      }
      //add new terrain to cell
      else {
        rcid = map.RNG.pickone(noTerrain);
        map.cells[rcid].terrain = T;
        zone.push(rcid);
        points.push(rcid);
        //remove it
        cA.splice(cA.indexOf(rcid),1);
      }
    }

  }

  var cid = "";
  //only go up to 2/3 to reduce cycle time
  while (points.length < land) {
    //pick a random cell
    cid=map.RNG.pickone(cA);
    //make terrain
    terrainZone(cid);
  }

  for(var x in map.cells){
    if(map.cells[x].terrain == -1){
        map.cells[x].terrain = 0;
    }
  }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexPlane.locations = function (map) {
  //probabilities based upon terrain and climate
  var cA=CPX.cellArray(map),
  T = {
    "0" : [10,1],
    "1" : [20,2],
    "2" : [20,2],
    "3" : [60,6],
    "4" : [40,4],
    "5" : [40,4],
    "6" : [20,2]
  },
  C = [-10,-5,0,5,10], 
  scales = {
    pop: [6,5],
    site: [[8,"legendary"],[7,"rare"]],
    ruin: [[6,"legendary"],[5,"rare"]],
    lair: ["legendary","rare"],
    hideout: [[4,"legendary"],[3,"rare"]]
  };

  var majP = 0, cell={}, type="";
  //check for every cell
  for (var x in map.cells){
    cell = map.cells[x];
    //chance for major encounter is based upon terrain and climate
    majP = T[cell.terrain][0]+C[cell.climate];
    //if true, there is a major item
    if(map.RNG.bool({likelihood: majP})){
      //pick the type of item
      type = map.RNG.weighted(["pop","hideout","ruin","site"], [0.45,0.05,1/4,1/4]);
      //generator function
      CPX.hex[type](map,cell,scales[type][0]);
      //standard chance to have a lair of a monster
      if(map.RNG.bool({likelihood:30})) {
        CPX.hex.lair(map,cell,scales[type][0]);
      }
    }
    //check for minor item
    for (var i = 0; i < T[cell.terrain][1]; i++) {
      //d6 roll, on a 1 a minor item
      if(map.RNG.d6() == 1){
        //pick the type of item
        type = map.RNG.weighted(["pop","hideout","ruin","site","lair"], [0.2,0.05,1/5,1/2,1/10]);
        //generator function
        CPX.hex[type](map,cell,scales[type][1]);
      }
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexPlane.nonWater = function (map) {
  var nw= [];
  for(var x in map.cells){
    if(map.cells[x].terrain!=0){ nw.push(x); }
  }
  return nw;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexPlane.info = function (cell) {
  var html = 'Terrain: '+CPXC.capitalize(TERRAINS[cell.terrain]);
  html+= " Climate: "+CPXC.capitalize(CLIMATES[cell.climate]);
  return html;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexPlane.display = function (opts) {
  var adjust = true;
  if($("#"+opts.map._id).length) {
    adjust = false;
  }
  CPX.display.makeCanvas(opts.map,CPX.display.hexMap);
  if(adjust) { CPX.display.centerAdjust(opts.map); }
  $("#exit").hide();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexPlane.enterSite = function (map,cell) {
  var seed = map.seed.concat([cell.id,"a"]),
  options = {
    cell: cell,
    type: "atlas",
    seed:seed,
    realm:map.realm,
    parent:[map._id,cell.id],
    pointy: !map._pointy,
    scale:7
  };
  //check if the map exists - if it doesn't make it and enter it.
  CPX.mapCheck(seed,options);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hexPlane.mapClick = function (event) {
  var data = event.target.data,
    cell = CPXDB[data.map].cells[data.cid];
  console.log(JSON.stringify(cell.special));
}

