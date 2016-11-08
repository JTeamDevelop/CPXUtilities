CPX.CFP = {
  densities: ['dense','scattered','frontier','unsettled','desolate'],
  habitation: ['uninhabited','single dwelling','thorp','hamlet','village','town, small',
  'town, large','city, small','city, large','metropolis, small','metropolis, large',
  'stronghold','temple','ruin','special'],
  special: {
    water: 'achored boat', 
    "swamp": 'unihabited',
    "desert": 'nomad camp',
    "plain": 'nomad camp',
    "forest": 'logging camp',
    "hill": 'military outpost',
    "mountain": 'mine'
  },
  dense:{
    items: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    p: [3,3,3,2,2,1,1,2,2,1,3,3,2,1],
    special:{
      items: ['manor','peasant long house','orphanage','traders’ village','mill',
        'military barracks','church','chapterhouse','bath house','alehouse/tavern/inn'],
      p: [4,3,3,3,2,3,3,3,3,2]
    }
  },
  scattered:{
    items: [0,1,2,3,4,5,6,7,8,11,12,13,14],
    p: [5,6,3,3,2,2,1,1,1,2,2,1,1],
    special:{
      items: ['manor','farmstead','farmstead','migrant camp','mill','military structure',
      'abbey', 'priory','nunnery','bath house','inn'],
      p: [4,3,3,3,2,1,1,1,2,9]
    }
  },
  frontier:{
    items: [0,1,2,3,4,5,6,11,12,13,14],
    p: [10,3,3,2,2,2,1,1,1,4,1],
    special:{
      items: ['manor','trading outpost','military outpost','military camp','work camp',
              'abbey','priory','nunnery','hermitage','nomad camp'],
      p: [3,8,5,2,2,1,1,1,3,4]
    }
  },
  unsettled:{
    items: [0,1,2,3,4,5,13,14],
    p: [13,6,2,2,2,1,3,1],
    special:{
      items: ['hermit','trading outpost','military outpost','military camp','work camp',
              'prison','hermitage','nomad camp','monastery','re-roll on “Desolate”'],
      p: [1,5,6,3,2,2,3,3,4,1]
    }
  },
  desolate:{
    items: [0,1,2,3,13],
    p: [23,2,1,1,3],
    special:{
      items: ['abandoned/forgotten tower','abandoned/forgotten castle/fortress',
              'abandoned/forgotten temple','abandoned/forgotten town','abandoned/forgotten city',
              'sunken city (partially submerged in ground)','lost city (below ground)',
              'shrine (1-2 on 1d3 = inactive)','hermit','monastery'],
      p: [6,5,2,1,2,1,1,3,7,1]
    }
  }
}
CPX.CFP.city = function (opts){
  var P = {
    seed: opts.seed,
    class:[CPX.CFP.habitation[opts.type]],
    name : typeof opts.name === "undefined" ? '' : opts.name,
    notes : typeof opts.notes === "undefined" ? '' : opts.notes,
    people : typeof opts.people === "undefined" ? [] : opts.people,
    govt : typeof opts.govt === "undefined" ? -1 : opts.govt,
  }
  P._id = P.seed.join('');
  P.RNG = new Chance(P._id);
  
  //population calc
  var pmult= [[50,500],[500,1000],[500,5000],[5000,10000],[5000,50000],[50000,100000],[50000,500000]]
  if(opts.type==2){ P.pop = P.RNG.rpg('1d5')*10; }
  else if(opts.type==3){ P.pop = P.RNG.rpg('1d12')*30; }
  else { 
    P.pop = (P.RNG.diceSum('2d6')-2)*pmult[opts.type-4][0]+pmult[opts.type-4][1]; 
  }
  
  //pick population if none given
  if(P.people.length==0){
    //number of people
    var np = PRNG.weighted([1,2,3],[7,2.5,0.5]);
    for(var i=0;i<np;i++){
      P.people.push(CPX.people(P.RNG,{terrain:opts.terrain}));
    }
  }
  
  //pick economy
  P.economy = P.RNG.pickone(['booming','bullish/hopeful','depressed','doomed','expanding',
                             'inflationary','overheated/growing too fast','recessionary',
                             'uncontrolled/fluctuating','weak']);

  
}
