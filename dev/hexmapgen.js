/* Version 1.1
 Last chainge: update pop and ruin generation 
 Use user input
*/

CPX.data.mapResources = ['Fertile Land', 'Lush Pasture','Good Fishing', 'Medicinal Plants', 'Good Hunting',
'Old Industry', 'Good Mine', 'Rich Gathering', 'Good Timber', 'Magical Materials'];
CPX.data.mapLairs = [
  'Ancient Evil', 'Magical Gate', 'Ancient Fort', 'Dark Elves/Fae', 'Aspiring Warlord',
  'Monster Nest', 'Bandit Camp', 'Renegade Outpost','Tainted Elemental','School of Dark Sorcery',
  'Dragon','Vicious Humanoids','Cursed Earth','Splinter Faction','Outsiders',
  "Thieves' Stronghold",'Deep Dwarves','Undead','Mad Wizard'
];

CPX.hexMapGen = function (opts) {
  var map = CPX.rectHexArea(opts);
  map.class = ['hexMapGen'].concat(map.class);
  //record # of cities
  map.ncity = opts.ncity;
  //record # of ruins
  map.nruin = opts.nruin;
  //gen terrain
  CPX.hexMapGen.terrain(map);
  //gen pop
  CPX.hexMapGen.pop(map);
  //identify bounds for display
  CPX.hexMap.bounds(map);
  
  map.RNG=null;
  delete map.RNG;
  return map;
}
CPX.hexMapGen.terrain = function(map){
  var R= CPX.cellArray(map), terrain = map.opts.terrain;
  
  //neighbooring terrains, first is secondary, then tertiary, then wildcard
  var NT = {
    "0" : [3,4,1,2,5,6],
    "1" : [3,4,0,2,5,6],
    "2" : [5,3,0,1,4,6],
    "3" : [4,5,0,1,2,6],
    "4" : [3,5,0,1,2,6],
    "5" : [6,3,0,1,2,4],
    "6" : [5,4,0,1,2,3]
  }
  
  function existingHex (pickfrom,selected) {
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
  
  //make terrain 
  function makeTerrain(n,nttype) {
    var array=[], newhex = {};
    for (var i = 0; i < n; i++) {
      newhex = existingHex(R,array);
      array.push(newhex.id);
      newhex.terrain = nttype;
    }
  }
  
  //generate secondary terrain
  var n = Math.round(R.length*8/24), rn=0, count = 0;
  while (n>0) {
    rn = map.RNG.natural({min: 1, max: n});
    if(count > 10) { rn = n; }
    makeTerrain(rn,NT[terrain][0]);
    n-=rn;
    count++;
  }
  
  //generate tertiary terrain
  n = Math.round(R.length*2/24);
  count = 0;
  while (n>0) {
    rn = map.RNG.natural({min: 1, max: n});
    if(count > 7) { rn = n; }
    makeTerrain(rn,NT[terrain][1]);
    n-=rn;
    count++;
  }
  
  //generate wildcard terrain
  nw = NT[terrain].slice(2);
  n = Math.round(R.length*1/24);
  while (n>0) {
    rn = map.RNG.natural({min: 1, max: n});
    makeTerrain(rn,map.RNG.pickone(nw));
    n-=rn;
  }
}
//GVenerate the population
CPX.hexMapGen.pop = function (map){
  var CFP = CPX.CFP, CA = CPX.cellArray(map), cid = '', size = 0, nc=map.ncity;
  
  //for each ncity push the city to the map
  for (var i=0; i<nc;i++){
    //pick a cell
    cid = map.RNG.pickone(CA);
    //size is either small or large city
    size = map.RNG.bool() ? 6 : 7;
    //push the city to the cell
    map.cells[cid].special.push({
      class:['town'],
      size: size
    }) 
  }
  
  //push the secondary towns (2-4 for each city)
  //push the resources (1-3 for each city)
  //push the lairs (1-3 for each city)
  //always have one set of towns if ncity = 0 
  var ns=-1;
  nc++;
  for (var i=0; i<nc; i++){
    //2-4 for each city
    ns = map.RNG.natural({min:2,max:4});
    for(var j=0; j<ns;j++){
      //pick a cell
      cid = map.RNG.pickone(CA);
      //size is 'hamlet','village','town, small', 'town, large'
      size = map.RNG.natural({min:2,max:5});
      //push the city to the cell
      map.cells[cid].special.push({
        class:['town'],
        size: size
      })   
    }
    //1-3 for each resource
    ns = map.RNG.natural({min:1,max:3});
    for(var j=0; j<ns;j++){
      //pick a cell
      cid = map.RNG.pickone(CA);
      //size is relative random between 2-5 - like ruin
      size = map.RNG.weighted([2,3,4,5],[3,6,2,1]);
      //push the resource to the cell
      map.cells[cid].special.push({
        name: map.RNG.pickone(CPX.data.mapResources),
        class:['resource'],
        size: size
      })   
    }
    //1-3 for each lair
    ns = map.RNG.natural({min:1,max:3});
    for(var j=0; j<ns;j++){
      //pick a cell
      cid = map.RNG.pickone(CA);
      //size is relative random between 2-5 - like ruin
      size = map.RNG.weighted([2,3,4,5],[3,6,2,1]);
      //push the lair to the cell
      map.cells[cid].special.push({
        name: map.RNG.pickone(CPX.data.mapLairs),
        class:['lair'],
        size: size
      })   
    }
  }
  
  //for each nruin push the ruin to the map
  for (var i=0; i<map.nruin;i++){
    //pick a cell
    cid = map.RNG.pickone(CA);
    //size of ruin 
    size = map.RNG.weighted([2,3,4,5],[3,6,2,1]);
    //push the ruin to the cell
    map.cells[cid].special.push({
      class:['ruin'],
      size: size
    }) 
  }

}
//direct the click
CPX.hexMapGen.mapClick = function (e){
  CPX.rectHexArea.mapClick(e);
}
