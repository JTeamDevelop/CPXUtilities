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
  //record density
  map.density = opts.density
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
  var CFP = CPX.CFP, dtxt = CFP.densities[map.density],
  density = CFP[dtxt], pid=-1, c='', name='', size=0, n=0; 
  
  for(var x in map.cells){
    //pop cance is 33%
    if(map.RNG.bool({likelihood:33})){
      //pick the pop id based upon the desnity of the map
      pid = map.RNG.weighted(density.items,density.p);
      //only if the id is greater tan 0, 0 is no pop
      if (pid>8){
        size = map.RNG.weighted([2,3,4,5],[3,6,2,1]);
        if(['ruin','stronghold'].includes(CFP.habitation[pid])){
          c = CFP.habitation[pid];
          name = '';
        }
        else {
          name = CFP.habitation[pid];
          c='other';
        }
        map.cells[x].special.push({
          name: name,
          class:[c],
          size: size
        })
      }
      else if(pid>0){
        //count locations bigger than thorp
        if(pid>2){n++;}
        //push a town of the size to the cell, size relative to index pid-1
        map.cells[x].special.push({
          class:['town'],
          size: pid-1
        })  
      }
    }
  }
  
  var id=-1, cr = CPX.cellArray(map), cl = CPX.cellArray(map), cid='';
  for(var i=0;i<n;i++){
    cid = map.RNG.pickone(cr);
    id = map.RNG.pickone(CPX.data.mapResources);
    map.cells[cid].special.unshift({
      name: id,
      class:['resource'],
      type: CPX.data.mapResources.indexOf(id)
    })
    
    cr.splice(cr.indexOf(cid),1);
    cid = map.RNG.pickone(cl);
    id = map.RNG.pickone(CPX.data.mapLairs);
    map.cells[cid].special.push({
      name: id,
      class:['lair'],
      type: CPX.data.mapLairs.indexOf(id)
    })
    cl.splice(cl.indexOf(cid),1);
  }

}
//direct the click
CPX.hexMapGen.mapClick = function (e){
  CPX.rectHexArea.mapClick(e);
}
