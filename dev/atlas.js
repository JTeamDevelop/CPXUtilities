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

*/


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*atlas generates a standard atlas map:
20 cells to a side : 1141 cells | 106717.7 sq mi
A cell has 6 mi to a side : 93.53 sq mi each
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.atlas = function (opts) {
  var map = {
    _id: opts.seed.join(""),
    realm: opts.realm,
    parent: opts.parent,
    seed : opts.seed,
    scale: 20,
    _hexradius : 35,
    _type: "atlas",
    _dtype : "cells",
    _pointy : opts.pointy,
    _radial : true,
    _terrain : opts.cell.terrain,
    _climate : opts.cell.climate,
    explored : [],
    visible : [],
    cells: {},
    zones: [],
    units: []
  },
  cell = opts.cell;

  map.RNG = new Chance(map.seed.join(""));

  var R=[], ac={};
  var NT = {
    "0" : [3,4,1,2,5,6],
    "1" : [3,4,0,2,5,6],
    "2" : [5,3,0,1,4,6],
    "3" : [4,5,0,1,2,6],
    "4" : [3,5,0,1,2,6],
    "5" : [6,3,0,1,2,4],
    "6" : [5,4,0,1,2,3]
  }

  //make 1 zone to contain all zones
  map.zones.push(new Zone(map,0));

  //create all of the atlas cells
  for (var i = -map.scale ; i < map.scale; i++) {
    for (var j = -map.scale; j < map.scale; j++) {
      d = CPX.hex.axialD({q:0,r:0},{q:i,r:j});
      if(d >= map.scale ) { continue; }

      ac = new HCell(i,j,cell.terrain,map.zones[0]);
      ac.climate = cell.climate;
      ac.element = map.RNG.weighted(["standard","secret","resource","huntingground","feature","difficult"], [3/10,1/10,1/10,2/10,3/20,3/20]);

      map.cells[ac.id] = ac;
      R.push(ac.id)
    }
  }

  function makeTerrain(n,nttype) {
    var array=[], newhex = {};
    for (var i = 0; i < n; i++) {
      newhex = CPX.atlas.existingHex(map,R,array);
      array.push(newhex.id);
      newhex.terrain = nttype;
    }
  }

  //generate secondary terrain
  var n = Math.round(R.length*8/24), rn=0, count = 0;
  while (n>0) {
    rn = map.RNG.natural({min: 1, max: n});
    if(count > 10) { rn = n; }
    makeTerrain(rn,NT[cell.terrain][0]);
    n-=rn;
    count++;
  }

  //generate tertiary terrain
  n = Math.round(R.length*2/24);
  count = 0;
  while (n>0) {
    rn = map.RNG.natural({min: 1, max: n});
    if(count > 7) { rn = n; }
    makeTerrain(rn,NT[cell.terrain][1]);
    n-=rn;
    count++;
  }

  //generate wildcard terrain
  nw = NT[cell.terrain].slice(2);
  n = Math.round(R.length*1/24);
  while (n>0) {
    rn = map.RNG.natural({min: 1, max: n});
    makeTerrain(rn,map.RNG.pickone(nw));
    n-=rn;
  }

  CPX.atlas.locations(map);
  CPX.atlas.majorSites(map,cell);
  CPX.atlas.explored(map);

  CPX.atlas.atlasNeighboor(map);
  CPX.hexMap.bounds(map);

  delete map.RNG;
  CPXDB[map._id] = map;

  return map._id;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.atlas.existingHex = function (map,pickfrom,selected) {
  var nhex = {}, initial = {}, rid ="";

  do {
    if(selected.length == 0){
      initial = map.cells[map.RNG.pickone(pickfrom)];
    }
    else {
      initial = map.cells[map.RNG.pickone(selected)];
    }
    rid = map.RNG.pickone(CPX.hex.neighboorIDs(initial));
    nhex = map.cells[rid];
  }
  while (nhex == undefined || selected.includes(nhex.id));
  return nhex;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.basicVisibility = function (map,scale) {
  var visibility = [0,5,10,30,50,50,100,100,100,100];
  if(map.RNG.bool({likelihood: visibility[scale]})){
    return true;
  }
  else { return false; }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//populate neighboor atlas sub hexes to enable cross atlas movement
CPX.atlas.atlasNeighboor = function (map) {
  //get the atlas neighboors
  var atlasNIDs = CPX.hex.neighboorIDs(map.parent[1]), atlasNCells=[], scale=map.scale-1;
  /*
  axialDirections = [1,-1],[1,0],[0,1],[-1,1],[-1,0],[0,-1]
  */
  
  var i=-1, cell={}, ac={}, cn = [], newid={}, nid="";
  for (var x in map.cells){
    i=-1; cell = map.cells[x];

    //set the index if a border cell - the nid is the atlas sub hex the unit will move to
    //atlas to the east
    if(cell.q==scale) { i = 1; nid=-cell.q+"_"+(cell.r+scale); }
    //atlas to the west
    else if(cell.q==-scale) { i = 4; nid=-cell.q+"_"+(cell.r-scale); }
    //atlas to the north east
    else if(cell.r==-scale) { i = 0; nid=(cell.q-scale)+"_"+(-cell.r); }
    //atlas to the south west
    else if(cell.r==scale) { i = 3; nid=(cell.q+scale)+"_"+(-cell.r); }
    //atlas to the north west
    else if(cell.r+cell.q==-scale) { i = 5; nid=(cell.q+scale)+"_"+(cell.r+scale); }
    //atlas to the south east
    else if(cell.r+cell.q==scale) { i = 2; nid=(cell.q-scale)+"_"+(cell.r-scale); }

    //if border cell
    if(i>-1) {
      //get cell neighboors
      cn = CPX.hex.neighboorIDs(cell);
      //if atlas neighboor exists
      if(objExists(map.parent[0].cells[atlasNIDs[i]])) {
        //atlas cell
        ac = map.parent[0].cells[atlasNIDs[i]];
        //run through cell neighboors and push
        cn.forEach(function(el){
          //if it isn't in the map 
          if(!objExists(map.cells[el])){
            newid = CPX.hex.cellQR(el);
            //create the cell
            map.cells[el] = new HCell(newid.q,newid.r,ac.terrain,map.zones[0]);
            //set atlas id and atlas sub hex id
            map.cells[el].naid = ac.id;
            map.cells[el].nid = nid;
          }
        })
      }
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Populate atlas with coolness - adventuring locales
CPX.atlas.locations = function (map) {
  var cA=CPX.cellArray(map),
  //E is the probability of a "major" location, it is based on terrain type
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
    pop: [3,2],
    site: [[6,"uncommon"],[5,"common"]],
    ruin: [[5,"uncommon"],[4,"common"]],
    lair: ["uncommon","common"],
    order: [[2,"rare"],[1,"uncommon"]],
    hideout: [[3,"uncommon"],[2,"common"]]
  };

  //n is roughly the area of the atlas / 375
  var n = 225, majP = 0, cell={}, nMin = 0, cid="", type="";
  //check for every cell
  for (var i = 0; i < n; i++) {
    //chance for major encounter is based upon terrain and climate
    majP = T[map._terrain][0]+C[map._climate];
    //if true, there is a major item
    if(map.RNG.bool({likelihood: majP})){
      //random cell
      cid = map.RNG.pickone(cA);
      cA.splice(cA.indexOf(cid),1);
      //pick the type of item
      type = map.RNG.pickone(["pop","ruin","lair","site","order","hideout"]);
      //generator function
      CPX.hex[type](map,map.cells[cid],scales[type][0]);
    }
    //check for minor item
    for (var j = 0; j < T[map._terrain][1]; j++) {
      //d6 roll, on a 1 a minor item
      if(map.RNG.d6() == 1){
        //random cell
        cid = map.RNG.pickone(cA);
        cA.splice(cA.indexOf(cid),1);
        //pick the type of item
        type = map.RNG.pickone(["pop","ruin","lair","site","order","hideout"]);
        //generator function
        CPX.hex[type](map,map.cells[cid],scales[type][1]);
      }
    }
  }
}
CPX.atlas.majorPop = function (map,cell,pop,cA) {
  //n is the number of sub-pop sites 10 times the average size
  var n = Math.round(CPX.size(map.RNG)/2*10), group=[], cid = "", idx=0, nx=0,
  subP = objCopy(pop);
  subP.scale--;

  if(objExists(pop.subtype)) {
    if(S.subtype=="hideout")  { subP.visible = false; }
  }

  //for each of the sub sites
  for (var i = 0; i < n; i++) {
  //if the pop is less than scale 6
    if(subP.scale < 7) {
    //pick a random cell and remove it from the list so it isn't picked again
      cid = map.RNG.pickone(cA);
      cA.splice(cA.indexOf(cid),1);
      //load the seed & push the pop data to the cell
      idx = map.cells[cid].special.length;
      subP.seed = map.seed.concat([cid,"p"+idx]);
      map.cells[cid].special.push(subP);
    }
    //if it is scale 6 or bigger - see how many cells it takes up
    else {
      group = []; cid="";
      //determine the number of cells it will take up - easy conversion 1 hex per million
      nx = Math.floor(Math.pow(10, subP.scale-6));
      //make a pop cell for every nx
      for (var j = 0; j < nx; j++) {
        //pick a random cell neighboor and remove it from the list so it isn't picked again
        cid = CPX.atlas.existingHex(map,cA,group).id;
        cA.splice(cA.indexOf(cid),1);
        //add it to the array of picked cells
        group.push(cid);
        //load the seed & push the pop data to the cell
        idx = map.cells[cid].special.length;
        subP.options.seed = map.seed.concat([cid,"p"+idx])
        map.cells[cid].special.push(subP);
      }
    }
  }
}
CPX.atlas.majorSites = function (map,cell) {
  var cA = CPX.cellArray(map), cid ="", cn=[], ms={},
  n = 0, idx = 0, group=[];

  //loop through the special sites in parent cell
  cell.special.forEach(function (S) {
    //if the type is pop - place it on the map
    if(S.type == "pop"){
      CPX.atlas.majorPop(map,cell,S,cA);
    }
    else {
      ms = objCopy(S);
      ms.visible = CPX.basicVisibility(map,S.scale);
      //scale is less than eight - one hex
      if (S.scale<8) {
        //pick a random cell and remove it from the list so it isn't picked again
        cid = map.RNG.pickone(cA);
        cA.splice(cA.indexOf(cid),1);
        //determine the index of the seed
        idx = map.cells[cid].special.length;
        ms.terrain = map.cells[cid].terrain;
        ms.seed = map.seed.concat([cid,S.type[0]+idx]);
        //push the data to the cell
        map.cells[cid].special.push(ms);
      }
      //if it is 8 or more it will take up multiple hexes
      else {
        group = [];
        //the number of hexes is based on the scale
        n = Math.pow(10,S.scale-7);
        //for each hex, find a neighboor hex
        for (var i = 0; i < n; i++) {
          //pick a random cell neighboor and remove it from the list so it isn't picked again
          cid = CPX.atlas.existingHex(map,cA,group).id;
          cA.splice(cA.indexOf(cid),1);
          //add it to the array of picked cells
          group.push(cid);
          //determine the index of the seed
          idx = map.cells[cid].special.length;
          ms.terrain = map.cells[cid].terrain;
          ms.seed = map.seed.concat([cid,S.type[0]+idx]);
          //push the data to the cell
          map.cells[cid].special.push(ms);
        }
      }
    }

  })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.atlas.explored = function (map) {
  var modmapid = map.seed.slice(1).join("");
  if(!objExists(CPXDB[map.seed[0]].mods[modmapid])){
    return;
  }

  var elements = ["secret","resource","huntingground","feature"],
  types = ["pop","ruin","lair","site","order","hideout"],
  explored = CPXDB[map.seed[0]].mods[modmapid].explored, cell= {}, R={}, obj={},
  scales = { pop: 2, site: [4,"uncommon"], ruin: [3,"uncommon"], lair: "uncommon", order: [2,"uncommon"], hideout: [1,"uncommon"] };

  explored.forEach(function (eid) {
    cell = map.cells[eid];
    if(!elements.includes(cell.element)){ return; }

    R = CPX.discovery[cell.element](map.seed.concat([cell.id,"ex"]));
    if(types.includes(R.type)){
      //generator function
      CPX.hex[R.type](map,cell,scales[R.type]);
      obj = cell.special[cell.special.length-1];
      obj.visible = R.visible;

      if(objExists(R.subtype)) { obj.subtype = R.subtype; }
      if(objExists(R.nature)) { obj.nature = R.nature; }
    }
  })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.atlas.display = function (opts) {
  var seed = opts.map.seed.concat([opts.cell.id,"a"]),
  options = {
    cell: opts.cell,
    type: "atlas",
    seed:seed,
    realm:opts.map.realm,
    parent:[opts.map,opts.cell],
    pointy: !opts.map._pointy,
    scale:7
  };
  //check if the map exists - if it doesn't make it
  CPX.mapCheck(seed,options);
  //display it
  CPX.display.makeCanvas(CPXDB[seed.join("")],CPX.display.atlas);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Population centers know about surrounding sites - provide a map
CPX.atlas.popMaps = function (map,cell,pop) {
  var allCells = CPX.hex.withinX(cell,pop.scale).all, scell = {}, maps=[], update=false;
  allCells.forEach(function (cid) {
    if(objExists(map.cells[cid])){
      scell = map.cells[cid];
      var special = ["ruin","lair","encounters","site","pop"];

      for(var x in scell){
        if(special.includes(x)){
          if(!scell[x].visible){
            if(CPXC.bool()){
              if(CPX.user.updateVisible(map,cid+x[0])){
                update = true;
              }
            }
          }
        }
      }

    }
  })

  if(update){
    CPX.display.atlasLocations(map);
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.atlas.mapClick = function (event) {
  var target = event.target,
    data =target.data,
    cell = CPXDB[data.map].cells[data.cid],
    aucell = CPXAU.location[3],
    cellNeighboors = CPX.hex.neighboorIDs(cell); 

  //DEBUG: show the data 
  console.log({id:cell.id,e:cell.element,sp:JSON.stringify(cell.special)});
  if(objExists(cell.naid)){ console.log(cell.nid); }

  //no AP - can't do anything
  if(CPXAU.AP<1) {
    var n = noty({layout:'center',type:'error',timeout: 1000,text: "You don't have the AP."});  
    return;
  }

  //if a neighboor to the active unit - move the unit
  if(cellNeighboors.includes(aucell)) {
    //determine movement rates
    //["water","swamp","desert","plain","forest","hill","mountain"];
    //30 ft is standard, rate is hours to cross a plains hex
    var speed = CPX.unit.moveSpeed(CPXAU), rate = 5/30*speed, rest=0;
    if(CPXDB[data.map].cells[aucell].terrain != 3) { rate = rate*3/2; }
    //adjust to AP (24 hours)
    rate = Math.round10(rate/24,-4);
    //adjust the AP accordingly
    CPX.unit.change(CPXAU,{"AP":-rate});
    //if less than half a day left, the Unit rests for the remainder.
    rest = CPXAU.AP - Math.floor(CPXAU.AP);
    if(rest <0.5) {
      CPX.unit.change(CPXAU,{"AP":-rest});
    }  
     
    //check for neigboor atlas
    if(objExists(cell.naid)){
      //move to neighboor atlas
      CPX.display({map:CPXDB[CPXAU.location[0]],cell:CPXDB[CPXAU.location[0]].cells[cell.naid]});
      //set the location
      CPX.unit.move(CPXAU,[CPXDB[data.map].seed[0],cell.naid,"a",cell.nid]);
    }
    else {
      //set the location
      CPX.unit.move(CPXAU,CPXDB[data.map].seed.concat([data.cid]));  
    }
    //display units
    CPX.display.units();
  }
  
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.atlasLocations = function (map) {
  //pull map visible
  CPX.user.visible(map).then(function(visible){
    var sitelist = ["encounter","lair","site","ruin","pop"];

    sitelist.forEach(function (sl) {
      map.display[sl] = new createjs.Container();
    });

    //display characteristics for the various places of interest
    var dchar = {
      "ruin":[4,"black","grey"],
      "lair":[4,"black","red"],
      "encounter":[4,"black","yellow"],
      "site":[4,"black","blue"],
      "pop":[4,"black","black"]
    }

    var c={}, ac={}, cdata={}, dhex={}, vid="";
    for (var x in map.cells) {
      ac= map.cells[x];

      ac.special.forEach(function (S) {
        vid = S.seed.slice(-2).join("");
        if(S.visible || visible.includes(vid)){
          cdata = {realm:map.realm, map:map._id, cid:ac.id, seed:map.seed};
          dhex = {hex:ac,map:map,data:cdata};

          CPX.display.makeGraphics(makeCircle,CPX.atlas.mapClick,map.display[S.type],dhex,dchar[S.type]);
        }
      })
    }

    sitelist.forEach(function (sl) {
      map.display.stage.addChild(map.display[sl]);
    });
    //have to draw everything now due to promise
    map.display.stage.update();
    CPX.display.centerAdjust(map);
    CPX.display.units();
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.atlas = function (map) {
  if(objExists(map.display)){
    delete map.display;
  }
  map.display = {data:{}};
  map.display.canvas = $( "#"+map._id + " canvas")[0];
  map.display.stage = new createjs.Stage(map.display.canvas);

  map.display.hexmap = new createjs.Container();

  var c={}, ac={}, cdata={}, dhex={};
  for (var x in map.cells) {
    ac= map.cells[x];
    cdata = {realm:map.realm, map:map._id, cid:ac.id, seed:map.seed};
    dhex = {hex:ac,map:map,data:cdata};

    if(objExists(ac.naid)) {
      dhex.gradientFill = true;
      CPX.display.makeGraphics(makeHex,CPX.atlas.mapClick,map.display.hexmap,dhex,[map._hexradius,"white",terrainColors[ac.terrain]]);  
    }
    else {
      CPX.display.makeGraphics(makeHex,CPX.atlas.mapClick,map.display.hexmap,dhex,[map._hexradius,"black",terrainColors[ac.terrain]]);  
    }
  }

  map.display.stage.addChild(map.display.hexmap);
  CPX.display.atlasLocations(map);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.atlas.enterHex = function (map,cell) {
  //pull map visible - promise
  CPX.user.visible(map).then(function(visible){
    var header= "<h3 class='header center site'>"+CPXC.capitalize(TERRAINS[cell.terrain])+"</h3>",
    html = "<div class='site'>", special ="";

    html+= CPX.option({text:"Explore",classes:["atlasHexExplore","btn-info","btn-lg","btn-block"]});

    var specials = ["pop","ruin"], scaletitle = ["Settlement","Hamlet","Village","Town","City","Large City"], name="", sid="", obj={}, options={};
    cell.special.forEach(function (S) {
      if(specials.includes(S.type)) {
        if(S.visible || visible.includes(S.seed.slice(3).join(""))) {
          //if the object doesn't exist load it
          if(!objExists(CPXDB[S.seed.join("")])) {
            //load the options with the parent overland map and the atlas map
            options = objCopy(S);
            options.parent = [map,cell];
            //call the constructor
            sid = CPX[S.type](options);
            //build the site object for use
            obj = CPXDB[sid];
          }
          else {
            sid = S.seed.join("");
            obj = CPXDB[sid];
          }
          if(S.type =="pop") {
            name = obj.name+" ("+scaletitle[S.scale-1]+")"
          }
          else {
            name = CPXC.capitalize(S.type);
          }
  
          special+= CPX.option({text:name,classes:["site","btn-info","btn-lg","btn-block"],data:[["id",sid]]});
        } 
      }
    })

    if(special.length>0) {
      html+="<h3 class='center site'>Sites</h3>"+special;
    }
    html += "</div>";

    vNotify.id = cell.id;
    vNotify.closeText = "Exit";
    CPX.display.notify(true,header,html,"");
    vNotify.showClose = true;
  })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on('click',"button.atlasHexExplore",function(e) {
  var cid = vNotify.id, map = CPXDB[$(".map.active").attr("id")], cell = map.cells[cid], vid="";

  //TODO:use skills
  cell.special.forEach(function(el){
    vid=el.seed.slice(3).join("");
    CPX.user.updateVisible(map,vid).then(function(){
      vNotify.close();
      CPX.atlas.enterHex(map,cell);
    });
  })
});