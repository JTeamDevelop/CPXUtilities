const axialDirections = [
  [1,-1],[1,0],[0,1],[-1,1],[-1,0],[0,-1]
];
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Zone = function (map,i) {
  this.id=i;
  this.cells=[];
  this.color=map.RNG.color({format: 'hex'});
  this.visible = false;
  this.special = [];
  this.class=['zone'];
  this.parent = [map];
}
var HCell = function (q,r,terrain,zone) {
  this.id = q+"_"+r;
  this.q = q;
  this.r = r;
  this.terrain = terrain;
  this.climate = -1;
  this.zone = -1;
  this.special=[];
  this.doom = 0;

  if(objExists(zone)) {
    this.zone = zone.id;
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hex = {};
CPX.hex.center = function (radius,hex,pointy) {
  pointy = typeof pointy === "undefined" ? true : pointy;
  x = radius * Math.sqrt(3) * (hex.q + hex.r/2);
  y = radius * 3/2 * hex.r;
  if(!pointy) {
    x = radius * 3/2 * hex.q;
    y = radius * Math.sqrt(3) * (hex.r + hex.q/2);
  }
  return {x:x,y:y};
}
CPX.hex.mapBounds = function (map) {
  var mmin = CPX.hex.center(map._hexradius,{q:map.r,r:map.q},map._pointy);
  var mmax = CPX.hex.center(map._hexradius,{q:map.r+map.dw,r:map.q+map.dh},map._pointy);
  var span = {x:mmax.x-mmin.x+2*map._hexradius,y:mmax.y-mmin.y+2*map._hexradius};

  return span;
}
CPX.hex.axialD = function (a,b){
  return (Math.abs(a.q - b.q)
        + Math.abs(a.q + a.r - b.q - b.r)
        + Math.abs(a.r - b.r)) / 2;
}
CPX.hex.neighboorIDs = function (hex) {
  var R = [], id="", q=0, r=0;
  for (var i = 0; i < axialDirections.length; i++) {
    q = hex.q + axialDirections[i][0];
    r = hex.r + axialDirections[i][1];
    R.push(q+"_"+r);
  }
  return R;
}
CPX.hex.withinX = function (hex,X) {
  var all = [], R= [], id="", q=0, r=0, nhex = {}, ihex={};

  all.push(hex.id);
  R[0] = [hex];

  for (var i = 1; i <= X; i++) {
    R[i] = []

    for (var j = 0; j < R[i-1].length; j++) {
      ihex = R[i-1][j];

      for (var k = 0; k < axialDirections.length; k++) {
        q = ihex.q + axialDirections[k][0];
        r = ihex.r + axialDirections[k][1];
        id = q+"_"+r;

        if(!all.includes(id)) {
          all.push(id);
          R[i].push({id:id,q:q,r:r});
        }
      }
    }
  }

  R.all = all;
  return R;
}
//get the cell q r from id
CPX.hex.cellQR = function (cid) {
  var i = cid.indexOf("_"),
    q=Number(cid.substr(0,i)),
    r=Number(cid.substr(i+1));
  return {q:q,r:r};
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.hex.pop = function (map,cell,level) {
  var visible = false, i = cell.special.length, scale = level, 
  pop={
    type:"pop",
    seed : map.seed.concat([cell.id,"p"+i]),
    terrain : cell.terrain,
    visible: false
  };
  
  if(map._type=="atlas"){
    scale = map.RNG.weighted([level-1,level,level+1], [0.25,0.6,0.15]);
  }
  pop.scale = scale;
  
  if(CPX.basicVisibility(map,scale)){
    pop.visible = true;
  }

  if (map._type=="hexPlane") {
    pop.template = {
      people: CPX.people({seed:pop.seed.concat(['pop']),terrain:cell.terrain})
    };
  }
  
  cell.special.push(pop);
  
}
CPX.hex.hideout = function (map,cell,level) {
  var i = cell.special.length;

  var hideout  = {
    type:"pop",
    subtype:"hideout",
    seed : map.seed.concat([cell.id,"h"+i]),
    terrain : cell.terrain,
    scale : level[0],
    level : level[1],
    visible: false
  };

  cell.special.push(hideout);
}
CPX.hex.order = function (map,cell,level) {
  var i = cell.special.length, scale = level[0];
  if(map._type=="atlas"){
    scale = map.RNG.weighted([level[0]-1,level[0],level[0]+1], [0.25,0.6,0.15]);  
  }

  var order = {
    type:"pop",
    subtype:"order",
    seed : map.seed.concat([cell.id,"d"+i]),
    terrain : cell.terrain,
    scale:scale,
    level: level[1],
    visible: false
  };

  if(CPX.basicVisibility(map,scale)){
    order.visible = true;
  }

  cell.special.push(order);
}
CPX.hex.lair = function (map,cell,level) {
  var i = cell.special.length;

  var lair = {
    type:"lair",
    seed : map.seed.concat([cell.id,"l"+i]),
    terrain : cell.terrain,
    scale:4,
    level:level,
    visible: false
  };

  //scale is determined by the level and the random creature
  cell.special.push(lair);
}
CPX.hex.ruin = function (map,cell,level) {
  var i = cell.special.length, scale = level;
  scale = map.RNG.weighted([level[0]-2,level[0]-1,level[0],level[0]+1,level[0]+2], [0.05,0.2,.5,0.2,0.05]);  

  var ruin = {
    type:"ruin",
    seed : map.seed.concat([cell.id,"r"+i]),
    terrain : cell.terrain,
    scale:scale,
    level:level[1],
    visible: false
  };

  if(CPX.basicVisibility(map,scale)){
    ruin.visible = true;
  }

  cell.special.push(ruin);
}
CPX.hex.site = function (map,cell,level) {
  var i = cell.special.length, scale=level[0];
  if(map._type=="hexPlane"){
    scale = map.RNG.weighted([level[0]-1,level[0],level[0]+1], [0.2,.6,0.2]);  
  }
  else if(map._type=="atlas"){
    scale = map.RNG.weighted([level[0]-2,level[0]-1,level[0],level[0]+1], [0.1,0.45,.4,0.05]);  
  }

  var terrain = cell.terrain;
  if(map.RNG.bool()) {
    terrain = map.RNG.pickone(TERRAINS);
  }

  var site = {
    type:"site",
    seed : map.seed.concat([cell.id,"s"+i]),
    terrain : terrain,
    level: level[1],
    scale : scale,
    visible: false
  };

  if(CPX.basicVisibility(map,scale)){
    site.visible = true;
  }

  cell.special.push(site);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.cellArray = function (map) {
  var cA=[];
  //put all the cells in an array for random selection
  for(var x in map.cells) {
    cA.push(x);
  }
  return cA;
}
