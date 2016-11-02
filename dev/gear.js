var GEAR = {
	//Basic gear
	"Adventuring Gear":{id:"Adventuring Gear",cost:1,use:5,wt:1,class:["gear","basic"]},
	"Healing Potion":{id:"Healing Potion",cost:1,use:1,wt:0,class:["gear","basic"]},
	"Sunwand":{id:"Sunwand",cost:1,use:1,wt:0,class:["gear","basic"]},
	"Antitoxin":{id:"Antitoxin",cost:1,use:1,wt:0,class:["gear","basic"]},
	//Ranged weapons
	"Longbow":{id:"Longbow",cost:1,dmg:['1d6','1d6'],range:"1",ammo:"arrows",special:["range","ammo"],class:["bow","weapon","ranged","basic"]},
	"Compound Bow":{id:"Compound Bow",cost:1,dmg:['1d6','1d6'],range:"0",ammo:"arrows",special:["range","ammo"],class:["bow","weapon","ranged","basic"]},
	"Shortbow":{id:"Shortbow",cost:1,dmg:['1d4','1d6'],range:"0",ammo:"arrows",special:["range","ammo"],class:["bow","weapon","ranged","basic"]},
	"Crossbow":{id:"Crossbow",cost:1,dmg:['1d6','1d6'],range:"0",ammo:"arrows",special:["range","ammo"],class:["crossbow","weapon","ranged","basic"]},
	//Ranged ammo
	"Arrows":{id:"Arrows",cost:1,use:4,wt:1,special:[],class:["ammo","basic"]},
	"Bolts":{id:"Bolts",cost:1,use:4,wt:1,special:[],class:["ammo","basic"]},
	//Melee weapons
	"Club":{id:"Club",cost:1,dmg:['1d6'],special:[],class:["weapon","basic"]},
	"Staff":{id:"Staff",cost:1,dmg:['1d4'],special:[],class:["weapon","basic"]},
	"Dagger":{id:"Dagger",cost:1,dmg:['1d4'],range:"0",special:["throw"],class:["weapon","basic"]},
	"Short sword":{id:"Short sword",cost:1,dmg:['1d6'],special:[],class:["weapon","basic"]},
	"Axe":{id:"Axe",cost:1,dmg:['1d6'],special:[],class:["weapon","basic"]},
	"Mace":{id:"Mace",cost:1,dmg:['1d6'],special:[],class:["weapon","basic"]},
	"Warhammer":{id:"Warhammer",cost:1,dmg:['1d6'],special:[],class:["weapon","basic"]},
	"Spear":{id:"Spear",cost:1,dmg:['1d6'],range:0,special:["throw"],class:["weapon","basic"]},
	"Longsword":{id:"Longsword",cost:1,dmg:['1d8'],special:[],class:["weapon","basic"]},
	"Battle Axe":{id:"Battle Axe",cost:1,dmg:['1d8'],special:[],class:["weapon","basic"]},
	"Rapier":{id:"Rapier",cost:1,dmg:['1d6'],special:[],class:["weapon","basic"]},
	//Armor
	"Leather":{id:"Leather",cost:1,armor:1,special:[],class:["armor","basic"]},
	"Chainmail":{id:"Chainmail",cost:1,armor:2,special:[],class:["armor","basic"]},
	"Scale mail":{id:"Scale mail",cost:1,armor:2,special:[],class:["armor","basic"]},
	"Plate mail":{id:"Plate mail",cost:1,armor:3,special:[],class:["armor","basic"]},
	"Shield":{id:"Shield",cost:1,armor:1,special:["deflect"],class:["shield","basic"]}
}

var EFFECTS = {
  'Bless' : {name:'Bless',skill:['Lore','Will'],range:0,condition:'Blessed'},
  'Confuse' : {name:'Confuse',skill:['Lore','Will'],range:0,defense:'Will',condition:'Confused'},
  'Command' : {name:'Command',skill:['Lore','Will'],range:0,condition:'Boldened'},
  'Curse' : {name:'Curse',skill:['Lore','Will'],range:0,defense:'Will',condition:'Cursed'},
  'Dishearten' : {name:'Dishearten',skill:['Lore','Will'],range:0,defense:'Will',condition:'Disheartened'},
  'Enchant' : {name:'Enchant',skill:['Lore','Will'],range:0,condition:'Enchanted'},
  'Encourage' : {name:'Encourage',skill:['Lore','Will'],range:0,condition:'Encouraged'},
  'Frighten' : {name:'Frighten',skill:['Lore','Will'],range:0,defense:'Will',condition:'Frightened'},
  'Haste' : {name:'Haste',skill:['Lore','Will'],range:0,condition:'Hastened'},
  'Heal' : {name:'Heal',skill:['Lore','Will'],range:0,dmg:-1},
  'Rally' : {name:'Rally',skill:['Lore','Will'],range:0},
  'Slow' : {name:'Slow',skill:['Lore','Will'],range:0,defense:'Will',condition:'Slowed'},
  'Strike' : {name:'Strike',skill:['Lore','Will'],range:0,defense:'Will',dmg:1}
}

var SPELLS = {
  'Bless' : {name:'Bless',rank:1,effects:['Bless'],skill:'Will'},
  'Entangle' : {name:'Entangle',rank:1,effects:['Curse','Slow'],skill:'Will',defense:'Athletics'},
  'Magic Missile' : {name:'Magic Missile',rank:1,effects:['Strike'],skill:'Lore'}
}