CPX.sector = function (opts){
  opts = typeof opts === "undefined" ? {} : opts;
  
  var map = CPX.obj(opts,[['_dtype','sector'],['class',['sector']]]);
  map.special = [];
  map.RNG = new Chance(map.seed.join(""));

  map.density = map.RNG.pickone([0,1,2,3,4]);
  map.dCore = map.RNG.pickone([1,2,3,4,5]);

  CPX.sector.majorSites(map);
  CPX.sector.locations(map);
  return map;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.sector.randomPosition = function (RNG){
  var range = 10000;
  return {
    x: RNG.integer({min:-range,max:range}),
    y: RNG.integer({min:-range,max:range}),
    z: RNG.integer({min:-range,max:range})
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Populate sector with coolness - adventuring locales
CPX.sector.locations = function (map) {
  //P probability of a major/minor location, it is based on sector stellar density, and how close to the core
  T = {
    "0" : [10,1],
    "1" : [20,2],
    "2" : [30,3],
    "3" : [40,4],
    "4" : [60,6],
  },
  C = [-50,-10,-5,0,5,10],
  scales = {
    pop: [8,7],
    site: [10,9],
    ruin: [7,6],
    hideout: [5,4]
  };

  //n is arbitrary number for random ammounts of coolness
  var n = 50, majP = 0, p={}, temp={}, type='';
  //check for every cell
  for (var i = 0; i < n; i++) {
    //chance for major encounter is based upon terrain and climate
    majP = T[map.density][0]+C[map.dCore];
    //if true, there is a major item
    if(map.RNG.bool({likelihood: majP})){
      type = map.RNG.pickone(["pop","ruin","site","hideout"]);
      temp=CPX.sector.special(type,map,scales[type][0]);
      //random x,y,z
      temp.p = CPX.sector.randomPosition(map.RNG);
      map.special.push(temp);
    }
    //check for minor item
    for (var j = 0; j < T[map.density][1]; j++) {
      //d6 roll, on a 1 a minor item
      if(map.RNG.d6() == 1){
        type = map.RNG.pickone(["pop","ruin","site","hideout"]);
        temp=CPX.sector.special(type,map,scales[type][1]);
        //random x,y,z
        temp.p = CPX.sector.randomPosition(map.RNG);
        map.special.push(temp);
      }
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.sector.special = function (type,map,scale) {
  var special={
    class: [type],
    seed : map.seed.concat([map.RNG.string({length: 7, pool: base62})]),
    visible: 1
  };

  if(type == 'pop'){
    special.scale = map.RNG.weighted([scale-1,scale,scale+1], [0.25,0.6,0.15]);
    special.people = CPX.people({seed:special.seed.concat(['pop'])});
  }
  else if(type == 'hideout'){
    special.scale = scale;
    special.visible = 0;
  }
  else if(type == 'ruin'){
    special.scale = map.RNG.weighted([scale-2,scale-1,scale,scale+1,scale+2], [0.05,0.2,.5,0.2,0.05]);  
    special.visible = map.RNG.bool() ? 1 : 0;
  }
  else if(type == 'site'){
    special.scale = map.RNG.weighted([scale-2,scale-1,scale,scale+1], [0.1,0.45,.4,0.05]); 
    special.visible = map.RNG.bool() ? 1 : 0; 
  }
    
  return special; 
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.sector.majorSites = function (map) {
  var special = [].concat(map.special);
  map.special.length=0;
  //loop through special looking for pop
  special.forEach(function (S) {
    //if the type is pop - place it on the map
    if(S.class[0] == "pop"){
      //n is the number of sub-pop sites 10 times the average size
      var n = Math.round(CPX.size(map.RNG)/2*10),
      subP = objCopy(S);
      subP.scale--;

      //for each of the sub pops
      for (var i = 0; i < n; i++) {
        map.special.push(subP);
      }
    }
    else { map.special.push(S); }
  })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.sector.display = function (map){
  CPX.display.makeCanvas(map,CPX.display.sector);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.sector.mapClick = function (e) {
  var target = e.target,
    data =target.data;
  console.log(data);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.display.sector = function (map){
  if(objExists(map.display)){
    delete map.display;
  }
  map.display = {data:{}};
  map.display.canvas = $( "#"+map._id + " canvas")[0];
  map.display.stage = new createjs.Stage(map.display.canvas);

  map.display.sectorGrid = new createjs.Container();
  var s= {}, p={};
  for(var i=0;i<11;i++) {
    s = new createjs.Shape();
    s.graphics.setStrokeStyle(1).s('black').mt(0,i*80).lt(800,i*80);
    map.display.sectorGrid.addChild(s);
  }
  for(var i=0;i<11;i++) {
    s = new createjs.Shape();
    s.graphics.setStrokeStyle(1).s('black').mt(i*80,0).lt(i*80,800);
    map.display.sectorGrid.addChild(s);
  }

  map.display.locations = new createjs.Container();
  map.special.forEach(function(el,id){
    if(el.visible>0){
      s = new createjs.Shape();
      p = {x:400+400*el.p.x/10000, y:400+400*el.p.y/10000};
      s.data = el;
      s.graphics.setStrokeStyle(0).s('black').f('green').dc(p.x,p.y,5);
      s.addEventListener("click", CPX.sector.mapClick);
      map.display.locations.addChild(s);
    }
  })

  map.display.stage.addChild(map.display.sectorGrid);
  map.display.stage.addChild(map.display.locations);
  map.display.stage.update();
}