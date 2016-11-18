CPX.data.SWEncounters = {
  plains : [['Animals','Dragon','Flying','Humankind','Humanoids','Miscellaneous'],[24,11,13,25,13,14]],
  desert : [['Animals','Dragon','Flying','Humankind','Humanoids','Undead'],[20,10,20,20,20,10]],
  forest : [['Animals','Dragon','Flying','Humankind','Humanoids','Miscellaneous'],[12,11,13,25,19,20]],
  hills : [['Animals','Dragon','Flying','Humankind','Humanoids','Miscellaneous'],[12,26,13,12,25,11]],
  swamp : [['Animals','Dragon','Flying','Humankind','Humanoids','Miscellaneous',
    'Swimming','Undead'],[10,10,10,10,10,10,10,30]],
  water : [['Swimming','Dragon','Flying','Merchant Galley','Merchant Ship',
    'Pirate Galley','Pirate Ship','Warship (patrolling galley)','Warship (patrolling ship)'],[20,10,10,10,10,10,10,10,10]],
  Animals : ['Ants','Beetles','Apes','Bears','Boars','Centipedes','Scorpions','Frogs','Lions','great cat','Lizards',
    'Snakes','Spiders','Wolf','great dog'],
  Dragon : [['Basilisk'],['Black Dragon','1d4'],['Black Dragon','2d4'],['Black Dragon','1d8'],['Blue Dragon','1d4'],
    ['Blue Dragon','2d4'],['Blue Dragon','1d8'],['Cockatrice'],['Green Dragon','1d4'],['Green Dragon','2d4'],
    ['Green Dragon','1d8'],['Hydra'],['Red Dragon','1d4'],['Red Dragon','2d4'],['Red Dragon','1d8'],['Wyvern']],
  'Flying' :['Chimerae','Djinni','efreet','Gargoyles','Griffons','Harpies','Hippogriffs','Manticores',
    'Normal Birds (flock)','Ogre Mage','Pegasi','Rocs','Stirges','Giant bat','Wyverns'],
  'Humankind':['Adventurers','Bandits','Berserkers','Brigands','Caravan','Cavemen','Dwarves','Elves','Patrol',
    'Pilgrims','Priests of Chaos','Wizard'],
  'Miscellaneous': ['Cockatrice','Medusa','Minotaurs','Owlbears','Purple Worm','Treant','Werebears','Wereboars',
    'Weretigers','Werewolves'],
  'Swimming':['Crocodile, giant', 'Dragon Turtle', 'Fish, giant','Leeches, giant','Mermen','Nixie',
    'Octopus, giant','Sea Monster','Naga, water','Sea Serpent','Squid, giant'],
  'Undead':['Ghouls','Mummies','Skeletons','Spectres','Vampires','Wights','Wraiths','Zombies'],
  Humanoids: {
    plains:['Kobolds','Goblins','Orcs','Hobgoblins','Gnolls','Ogres','Trolls','Giant, Hill',
      'Giant, Cloud','Gnolls','Gnolls','Ogres','Trolls','Bugbears','Kobolds','Goblins',
      'Giant, Hill','Giant, Hill','Gnolls','Ogres'],
    forest:['Kobolds','Goblins','Orcs','Hobgoblins','Gnolls','Ogres','Trolls','Giant, Hill',
    'Elves','Bugbears','Kobolds','Goblins','Orcs','Hobgoblins','Gnolls','Ogres',
    'Trolls','Giant, Hill','Elves','Bugbears'],
    swamp:['Kobolds','Goblins','Orcs','Hobgoblins','Gnolls','Ogres','Trolls','Giant, Hill',
    'Giant, CLoud','Bugbears','Lizardmen','Trolls','Lizardmen','Lizardmen','Ogres','Goblins',
    'Kobolds','Trolls','Orcs','Ogres'],
    hills:['Kobolds','Goblins','Orcs','Hobgoblins','Gnolls','Ogres','Trolls','Giant, Hill',
    'Giant, Cloud','Bugbears','Giant, Fire','Giant, Stone','Giant, Storm','Giant, Frost','Goblins','Orcs',
    'Orcs','Trolls','Ogres','Giant, Hill'],
    desert:['Kobolds','Goblins','Orcs','Hobgoblins','Gnolls','Ogres','Trolls','Giant, Hill',
    'Giant, Cloud','Bugbears','Giant, Fire','Giant, Stone','Gnolls','Gnolls','Ogres','Gnolls',
    'Trolls','Ogres','Trolls','Gnolls']  
  }
}
CPX.data.SWEncounters.mountains = CPX.data.SWEncounters.hills;
CPX.data.SWEncounters.Humanoids.mountains = CPX.data.SWEncounters.Humanoids.hills;

CPX.SWEncounters = function (opts){
  var terrain = CPX.data.SWEncounters[opts.terrain],
  type = CPXC.weighted(terrain[0],terrain[1]);
  
  var r = '';
  if(type=='Humanoids'){
    r = CPXC.pickone(CPX.data.SWEncounters.Humanoids[opts.terrain]);
  }
  else {
    r =CPXC.pickone(CPX.data.SWEncounters[type]);
  }
  
  if(type=='Dragon'){
    if(r.length>1){
      r = r[0]+' age '+CPXC.diceSum(r[1]);
    }
    else {r=r[0];}
  }
  
  return r;
}