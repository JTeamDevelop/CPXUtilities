//Based on PRD Ultimate Equipment
var TREASURE = {
  spellcaster: {
    50: {coin:[2,'2d4'],items:[[1,'potion','minor','lesser']]},
    75: {coin:[1,'2d4'],items:[[1,'potion','minor','lesser'],[1,'scroll','minor','lesser']]},
    100: {items:[[1,'potion','minor','lesser'],[2,'scroll','minor','lesser']]},
    150: {items:[[1,'scroll','minor','lesser'],[1,'scroll','minor','greater']]},
    200: {items:[[2,'potion','minor','lesser'],[1,'scroll','minor','greater']]},
    250: {items:[[2,'scroll','minor','greater']]},
    500: {items:[[3,'potion','minor','lesser'],[3,'scroll','minor','greater']]},
    750: {items:[[1,'potion','minor','greater'],[1,'wand','minor','lesser']]},
    1000: {coin:[1,'7d6'],items:[[3,'scroll','minor','greater'],[1,'wand','minor','lesser']]},
    1500: {coin:[10,'3d6'],items:[[1,'potion','medium','lesser'],[1,'scroll','medium','lesser'],[1,'wand','minor','lesser']]},
    2000: {coin:[10,'2d4'],items:[[1,'weapon','mw'],[2,'scroll','medium','lesser'],[1,'wand','minor','lesser']]},
    2500: {items:[[2,'potion','medium','greater'],[1,'wand','minor','greater']]},
    3000: {items:[[1,'potion','medium','greater'],[2,'scroll','medium','lesser'],[1,'wand','minor','greater']]},
    4000: {items:[[1,'wondrous','minor','lesser'],[1,'potion','medium','greater'],[1,'wand','minor','greater']]},
    5000: {items:[[1,'ring','minor','lesser'],[1,'wondrous','minor','lesser'],[2,'scroll','medium','lesser']]},
    6000: {items:[[1,'ring','minor','lesser'],[1,'wondrous','minor','lesser'],[1,'potion','medium','greater'],[1,'wand','minor','greater']]},
    7500: {items:[[2,'potion','medium','greater'],[1,'scroll','minor','lesser'],[1,'wand','medium','lesser']]},
    10000: {items:[[1,'ring','minor','lesser'],[1,'wondrous','minor','lesser'],[1,'wand','medium','lesser']]},
    12500: {items:[[1,'ring','minor','lesser'],[1,'wondrous','minor','greater'],[2,'scroll','medium','greater'],[2,'wand','minor','greater']]},
    15000: {items:[[1,'ring','minor','lesser'],[1,'rod','medium','lesser'],[1,'wand','medium','lesser']]},
    20000: {items:[[1,'ring','minor','greater'],[1,'wondrous','minor','greater'],[1,'potion','medium','greater'],[2,'scroll','medium','greater'],[1,'wand','medium','lesser']]},
    25000: {items:[[1,'ring','minor','lesser'],[1,'wondrous','minor','greater'],[1,'wand','medium','lesser'],[1,'wand','medium','greater']]},
    30000: {items:[[1,'ring','minor','greater'],[1,'wondrous','medium','lesser'],[1,'scroll','major','lesser'],[1,'wand','medium','greater']]},
    40000: {items:[[1,'weapon','minor','lesser'],[1,'staff','medium','lesser'],[1,'rod','medium','greater'],[2,'wondrous','minor','lesser'],[1,'wand','medium','lesser']]},
    50000: {items:[[1,'ring','minor','greater'],[2,'wondrous','medium','lesser'],[1,'potion','major','lesser'],[3,'scroll','medium','greater'],[1,'wand','major','lesser']]},
    60000: {items:[[1,'staff','medium','lesser'],[1,'rod','medium','greater'],[1,'wondrous','medium','greater'],[1,'potion','medium','greater'],[1,'wand','medium','lesser'],[2,'scroll','major','lesser']]},
    75000: {items:[[1,'weapon','minor','lesser'],[1,'staff','medium','greater'],[1,'wondrous','medium','greater'],[3,'scroll','major','greater'],[1,'wand','major','greater']]},
    100000: {items:[[1,'ring','major','lesser'],[1,'rod','medium','greater'],[1,'staff','major','lesser'],[1,'scroll','major','lesser'],[1,'wand','medium','greater']]},
  },
  combat: {
    50: {coin:[2,'2d4'],items:[[1,'potion','minor','lesser']]},
    250: {coin:[2,'2d4'],items:[[1,'armor','mw','light'],[1,'potion','minor','lesser']]},
    350: {coin:[2,'2d4'],items:[[1,'armor','mw','medium'],[1,'potion','minor','lesser']]},
    400: {coin:[2,'2d4'],items:[[1,'weapon','mw'],[1,'potion','minor','lesser']]},
    500: {items:[[1,'weapon','mw'],[1,'potion','minor','greater']]},
    750: {coin:[1,'6d6'],items:[[1,'armor','mw','medium'],[1,'weapon','mw'],[2,'potion','minor','lesser']]},
    1000: {items:[[1,'armor','mw','heavy']]},
    1500: {items:[[1,'armor','mw','heavy'],[1,'weapon','mw'],[1,'potion','minor','greater']]},
    2000: {items:[[1,'armor','minor','lesser'],[1,'weapon','mw'],[1,'potion','minor','greater']]},
    3000: {items:[[1,'armor','mw','medium'],[1,'weapon','minor','lesser'],[1,'potion','minor','greater']]},
    4000: {items:[[1,'armor','minor','lesser'],[1,'weapon','mw'],[1,'wondrous','minor','lesser'],[1,'potion','minor','greater']]},
    5000: {items:[[1,'armor','mw','medium'],[1,'weapon','minor','lesser'],[1,'wondrous','minor','lesser'],[1,'potion','minor','greater']]},
    6000: {items:[[1,'armor','minor','lesser'],[1,'weapon','minor','lesser'],[1,'wondrous','minor','lesser']]},
    7000: {items:[[1,'armor','minor','greater'],[1,'weapon','minor','lesser'],[1,'ring','minor','lesser']]},
    8500: {items:[[1,'armor','minor','greater'],[1,'weapon','minor','lesser'],[1,'ring','minor','lesser'],[1,'wondrous','minor','lesser'],[3,'potion','minor','greater']]},
    10000: {items:[[1,'armor','minor','greater'],[1,'weapon','minor','greater'],[2,'potion','medium','greater']]},
    12500: {items:[[1,'armor','minor','greater'],[1,'weapon','minor','lesser'],[1,'wondrous','minor','greater'],[2,'potion','medium','greater']]},
    15000: {items:[[1,'armor','minor','greater'],[1,'weapon','minor','greater'],[1,'ring','minor','greater']]},
    20000: {items:[[1,'armor','medium','lesser'],[1,'weapon','minor','greater'],[1,'wondrous','minor','greater'],[2,'potion','medium','greater']]},
    25000: {items:[[1,'armor','medium','lesser'],[1,'weapon','medium','lesser'],[1,'ring','minor','lesser'],[1,'wondrous','minor','lesser'],[2,'potion','medium','greater']]},
    30000: {items:[[1,'armor','medium','lesser'],[1,'weapon','medium','lesser'],[2,'ring','minor','lesser'],[1,'wondrous','minor','greater']]},
    40000: {items:[[1,'armor','medium','lesser'],[1,'weapon','medium','lesser'],[1,'ring','medium','lesser'],[1,'wondrous','minor','greater'],[2,'potion','medium','greater']]},
    50000: {items:[[1,'armor','medium','greater'],[1,'weapon','medium','greater'],[1,'wondrous','medium','lesser'],[2,'potion','major','lesser']]},
    60000: {items:[[1,'armor','medium','greater'],[1,'weapon','medium','greater'],[2,'ring','minor','greater'],[2,'wondrous','minor','greater']]},
    75000: {items:[[1,'armor','major','lesser'],[1,'weapon','medium','greater'],[1,'ring','minor','greater'],[1,'wondrous','medium','greater'],[3,'potion','major','greater']]},
    100000: {items:[[1,'armor','major','lesser'],[1,'weapon','major','lesser'],[1,'ring','medium','lesser'],[1,'ring','minor','greater'],[2,'wondrous','medium','lesser']]}
  },
  gems: [
    ['Agate','Alabaster','Azurite','Hematite','Lapis lazuli','Malachite','Obsidian','Pearl, irregular freshwater','Pyrite','Rhodochrosite','Quartz, rock crystal','Shell','Tigereye','Turquoise'],
    ['Bloodstone','Carnelian','Chrysoprase','Citrine','Ivory','Jasper','Moonstone','Onyx','Peridot','Quartz, milky, rose, or smoky','Sard','Sardonyz','Spinel, red or green','Zircon'],
    ['Amber','Amethyst','Chrysoberyl','Coral','Garnet','Jade','Jet','Pearl, saltwater','Spinel, deep blue','Tourmaline'],
    ['Aquamarine','Opal','Pearl, black','Topaz'],
    ['Diamond, small','Emerald','Ruby, small','Sapphire'],
    ['Diamond, large','Emerald, brilliant green','Ruby, large','Sapphire, star']
  ],
  gemValue : [[5,[1,'2d4']],[25,[5,'2d4']],[50,[10,'2d4']],[250,[50,'2d4']],[500,[100,'2d4']],[2500,[500,'2d4']]],
  potionlevels : {
    'minor lesser':[[[0,1],[1,1]],[40,60]],
    'minor greater':[[[0,1],[1,1],[2,3]],[10,50,40]],
    'medium lesser':[[[1,1],[2,3],[3,5]],[25,60,15]],
    'medium greater':[[[1,1],[2,3],[3,5]],[10,40,50]],
    'major lesser':[[[2,3],[3,5]],[35,65]],
    'major greater':[[[2,3],[3,5]],[10,90]]
  },
  scrolllevels : {
    'minor lesser':[[[0,1],[1,1],[2,3]],[15,80,5]],
    'minor greater':[[[0,1],[1,1],[2,3],[3,5]],[5,30,55,10]],
    'medium lesser':[[[2,3],[3,5],[4,7]],[10,45,45]],
    'medium greater':[[[3,5],[4,7],[5,9]],[20,40,40]],
    'major lesser':[[[4,7],[5,9],[6,11],[7,13]],[30,35,25,10]],
    'major greater':[[[6,11],[7,13],[8,15],[9,17]],[5,30,35,30]]
  },
  wandlevels : {
    'minor lesser':[[[0,1],[1,1]],[40,60]],
    'minor greater':[[[1,1],[2,3]],[80,20]],
    'medium lesser':[[[2,3],[3,5]],[75,25]],
    'medium greater':[[[2,3],[3,5]],[20,80]],
    'major lesser':[[[3,5],[4,7]],[60,40]],
    'major greater':[[[3,5],[4,7]],[30,70]]
  }
};

CPX.treasure = function (value) {

}

CPX.treasure.text = function (treasure) {
  var text = "You've found: "+treasure.coin+' coin', totals={};

  treasure.items.forEach(function(el){
    if(objExists(totals[el.class[1]])) { totals[el.class[1]]++; }
    else { totals[el.class[1]] = 1; }
  })

  for(var x in totals){
    text+=', '+totals[x]+' '+x;
  }

  return text+'.';
}

CPX.treasure.wisp = function(lv){
  var temp ={};
  temp.class = ['item','wisp',CPXC.pickone(COLORLIST)];
  temp.class.push(CPXC.pickone(COLORS[temp.class[2]].element));
  temp.name = 'Wisp of '+temp.class[3];
  if(lv[0]==0) { temp.max = 1; }
  else if (lv[0]>3) { temp.max = 3; }
  else { temp.max = lv[0]; }
  temp.use = lv[1];
  return temp;
}

CPX.treasure.item = function(item){
  var result = [], temp={};
  
  if(['potion','wand','scroll'].includes(item[1])){
    var lv=TREASURE[item[1]+'levels'][item.slice(2).join(' ')], tlv=[];
  
    for(var i=0;i<item[0];i++){
      temp={};
      tlv = CPXC.weighted(lv[0],lv[1]);
      if(['potion','scroll'].includes(item[1]) && CPXC.bool()) { 
        result.push(CPX.treasure.wisp(tlv)); 
        continue; 
      }

      temp.name = CPXC.capitalize(item[1]);
      temp.class = ['item'].concat(item.slice(1));
      temp.todo = true;
      temp.common = (CPXC.bool({likelihood:75}) ? true : false);
      temp.lvSpell = tlv[0];
      temp.lvCaster = tlv[1];
      if(CPXC.bool({likelihood:25})) { 
        common = false; 
        temp.class.push('uncommon'); 
      }
      else { temp.class.push('common'); }
      result.push(temp);
    }
  }
  else {
    for(var i=0;i<item[0];i++){
      temp={};
      temp.class = [item[1],item[1]].concat(item.slice(2));
      temp.todo = true;
      temp.name= item[1];
      result.push(temp);
    }
  }

  return result;
}

CPX.treasure.gems = function (gems) {
  var result = [], temp={}, value =[];
  gems.forEach(function(el){
    for(var i=0;i<el[0];i++){
      temp = {class:['item','gem']};
      temp.rank = el[1];
      temp.name = CPXC.pickone(TREASURE.gems[el[1]-1]);
      temp.rough = (CPXC.bool() ? false : true);
      value = TREASURE.gemValue[el[1]-1];
      temp.cost = value[0]+CPXC.diceSum(value[1][1])*value[1][0];
      result.push(temp);
    }
  });
  return result;
}

CPX.treasure.gear = function (value,type) {
  var T=TREASURE[type], match = 500, coin=0, result = {coin:0,items:[]};
  for (var x in T){
    if(value >= Number(x)) { match = Number(x); }
  }
  value -= match;

  if(objExists(T[match].coin)) {
    coin+= CPXC.diceSum(T[match].coin[1])*T[match].coin[0];
  }
  
  result.coin+=coin+value;
  result.items = result.items.concat(T[match].items);  

  var items = [];
  result.items.forEach(function(el){
    items = items.concat(CPX.treasure.item(el)); 
  });
  result.items = items;
  
  return {T:result,text:CPX.treasure.text(result)};
}

CPX.treasure.lair = function (value) {
  var T = {
    500 : {coin:[[1,'4d4'],[1,'3d6'],[10,'2d4']],gems:[[1,2]],item:[[1,'weapon','mw'],[1,'potion','minor','lesser'],[1,'scroll','minor','lesser']]},
    1000 : {coin:[[1,'2d4'],[10,'2d6'],[1,'6d6']],gems:[[3,1]],item:[[1,'wand','minor','lesser'],[1,'potion','minor','greater'],[1,'scroll','minor','greater']]},
    2500 : {coin:[[1,'3d6'],[1,'2d4']],gems:[[1,2]],item:[[1,'armor','mw','heavy'],[1,'weapon','mw'],[2,'potion','medium','lesser'],[2,'scroll','minor','greater']]},
    5000 : {coin:[[10,'2d4'],[10,'4d6']],gems:[],item:[[1,'weapon','mw','heavy'],[1,'ring','minor','lesser'],[1,'potion','medium','greater'],[1,'scroll','medium','lesser'],[1,'wand','minor','greater']]},
    7500 : {coin:[[10,'4d4'],[10,'6d6']],gems:[[2,3]],item:[[1,'weapon','minor','lesser'],[1,'wondrous','minor','lesser'],[2,'potion','medium','greater'],[1,'wand','minor','greater']]},
    10000 : {coin:[[10,'4d8'],[100,'1d6']],gems:[[1,4]],item:[[1,'armor','minor','greater'],[1,'ring','minor','lesser'],[1,'wondrous','minor','lesser'],[1,'scroll','medium','lesser'],[1,'wand','minor','greater']]},
    15000 : {coin:[[10,'4d4'],[100,'4d4']],gems:[[1,3]],item:[ [1,'armor','minor','greater'], [1,'wondrous','minor','lesser'], [2,'potions','medium','greater'], [2,'scrolls','medium','greater'],[1,'wand','medium','lesser']]},
    20000 : {coin:[[100,'2d4']],gems:[],item:[[1,'ring','minor','greater'],[2,'wondrous','minor','lesser'],[2,'potions','medium','greater'],[2,'scrolls','major','lesser'],[1,'wand','medium','lesser']]},
    25000 : {coin:[[100,'1d6'],[10,'6d6']],gems:[[1,4]],item:[[1,'armor','medium','lesser'],[1,'weapon','minor','lesser'],[1,'wondrous','minor','greater'], [2,'scrolls','major','lesser'],[1,'wand','medium','lesser']]},
    30000 : {coin:[[10,'6d6'],[100,'2d4']],gems:[[3,3]],item:[[1,'weapon','minor','greater'], [1,'wondrous','medium','lesser'], [1,'wand','medium','greater']]},
    40000 : {coin:[[10,'4d4'],[100,'4d4']],gems:[],item:[[1,'ring','medium','lesser'], [1,'rod','medium','lesser'],[2,'potions','major','greater'],[2,'scrolls','major','lesser'],[1,'wand','major','lesser']]},
    50000 : {coin:[[100,'4d4']],gems:[[1,5]],item:[[1,'armor','medium','greater'],[1,'staff','medium','staff'],[1,'wondrous','medium','lesser'],[1,'scrolls','major','greater'],[1,'wand','medium','lesser']]},
    75000 : {coin:[[100,'2d8'],[100,'4d4']],gems:[[1,5]],item:[[1,'weapon','minor','greater'], [1,'ring','medium','greater'], [1,'staff','medium','greater'],[3,'potions','major','greater'],[1,'scroll','major','greater'],[1,'wand','major','lesser']]},
    100000 : {coin:[[100,'8d6'],[100,'4d4']],gems:[[2,5],[1,6]],item:[[1,'ring','major','lesser'],[1,'wondrous','major','lesser'],[3,'potions','medium','greater'], [2,'scrolls','medium','greater'],[1,'wand','medium','lesser']]}
  }

  var match = 500, result = {coin:0,gems:[],items:[]}, coin=0;
  while(value>500) {
    coin = 0; 
    for (var x in T){
      if(value >= Number(x)) { match = Number(x); }
    }
    value -= match;

    T[match].coin.forEach(function(el){
      coin+= CPXC.diceSum(el[1])*el[0];
    });
    
    result.coin+=coin;
    result.gems = result.gems.concat(T[match].gems);
    result.items = result.items.concat(T[match].item);
  }
  
  result.coin+=value;

  var items = CPX.treasure.gems(result.gems);
  result.items.forEach(function(el){
    items = items.concat(CPX.treasure.item(el)); 
  });
  result.items = items;
  delete result.gems;
  
  return {T:result,text:CPX.treasure.text(result)};
}