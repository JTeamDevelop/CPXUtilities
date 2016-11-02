var GB = {};
GB.levels = {
  XP:[0,3,6,12,24,48,72,96,130,170]
};
GB.hero = {
  _id:'',
  name:'',
  XP:0,
  HP:0,
  Dominion:{Available:0,Spent:0,perMonth:0},
  Effort:2,
  Influence:2,
  Wealth:0,
  attributes: {
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0
  }, 
  facts : [],
  words : [],
  gifts: [],
  inventory : []
}
GB.words = {
  Alacrity:{
    gifts: [
      [1,'All Directions as One','','Constant',''],
      [1,'Flickering Advance','','On Turn','Commit Effort to scene end'],
      [1,'Mist on Water','','On Turn','Commit Effort to scene end'],
      [1,'The Storm Breaks','','Instant',''],
      [1,'Swifter Than The Sun','','On Turn','Commit Effort'],
      [1,'Walk Between the Rain','','Constant',''],
      [2,'All-Encompassing Presence','','On Turn','Commit Effort'],
      [2,'Faster Than Thought','Smite','Instant','Commit Effort to scene end'],
      [2,'Untouchable','','Instant','Commit Effort to scene end']
    ]
  },
  Artifice:{
    gifts: [
      [1,'Faultless Repair','','Action',''],
      [1,'Command the Wheels','','Action','Commit Effort'],
      [1,'Hammerhand','','On Turn','Commit Effort'],
      [1,'Mark the Maker','','Action',''],
      [1,'Ten Thousand Tools','','Constant',''],
      [1,'Transmuter','','Action','Commit Effort for the scene and'],
      [2,"The Maker’s Eyes",'','Action',''],
      [2,'Perpetual Perfection','','Constant',''],
      [2,'Reverence of Steel','','Constant','']
    ]
  },
  Beasts:{
    gifts: [
      [1,'Distant Howl','','On Turn','Commit Effort'],
      [1,'Eyes of the Cat','','Constant',''],
      [1,'Link of Unity','','Constant',''],
      [1,'Red in Tooth and Claw','','On Turn','Commit Effort'],
      [1,'Scent the Prey','','On Turn','Commit Effort'],
      [1,'Untamed Will','','Instant','Commit Effort'],
      [2,'Conquer the Beast Within','','Constant',''],
      [2,'Lord of the Wild','','Constant',''],
      [2,'Many-Skinned Mantle','','Action','']
    ]
  },
  Bow:{
    gifts: [
      [1,'Bar the Red Descent','','On Turn','Commit Effort'],
      [1,'Bolt of Invincible Skill','','Instant',''],
      [1,'Feathered Tempest','','On Turn','Commit Effort'],
      [1,'None Beyond Reach','','Instant',''],
      [1,'Omnipresent Reach','','Constant',''],
      [1,'The Seeking Flight','','On Turn','Commit Effort to the end of the scene'],
      [2,'The Inexorable Shaft','','On Turn','Commit Effort'],
      [2,'Lord of That Which Falls','','Instant','Commit Effort'],
      [2,'Rain of Sorrow','','On Turn','Commit Effort']
    ]
  },
  Command:{
    gifts: [
      [1,'Guards! Seize him!','','Action',''],
      [1,'Know the Inner Truth','','On Turn','Commit Effort for the scene'],
      [1,"The Lieutenant's Wisdom",'','Action','Commit Effort'],
      [1,'The Lines of Rule','','On Turn','Special'],
      [1,"The Soldier's Faithful Heart",'','Constant',''],
      [1,"A Thousand Loyal Troops",'','Action','Commit Effort'],
      [2,"Bearer of the Scarlet Crown","","Constant",""],
      [2,'Invincible Iron General','','Constant',''],
      [2,'Thrall-Making Shout','','Action','Commit Effort for the day']
    ]
  },
  Death:{
    gifts: [
      [1,'Thrall-Making Shout','','Action','Commit Effort for the day'],
      [1,'Mantle of Quietus','','Instant','Commit Effort for the scene'],
      [1,'A Pale Crown Beckons','','Action','Commit Effort for the scene'],
      [1,'Scythe Hand','','On Turn','Commit Effort'],
      [1,'White Bone Harvest','Smite','Action','Commit Effort for the scene'],
      [1,'Withholding the Mercy','','Constant',''],
      [2,'No Release','','On Turn','Commit Effort'],
      [2,'Reaping Word','','Action','Commit Effort for the scene'],
      [2,'Summons to Day','','Action','Commit Effort for the day']
    ]
  },
  Deception:{
    gifts: [
      [1,'Deceiver’s Unblinking Eye','','Constant',''],
      [1,'A Familiar Face','','Action','Commit Effort'],
      [1,"Liar’s Flawless Grace",'', 'Constant',''],
      [1,'Perfect Masquerade','','On Turn','Commit Effort'],
      [1,'Shadow Play','','Action','Commit Effort'],
      [1,'Veiled Step','','On Turn','Commit Effort'],
      [2,'Conviction of Error','','Action','Commit Effort'],
      [2,'Impenetrable Deceit','','Action','Commit Effort'],
      [2,'Walking Ghost','','On Turn','Commit Effort']
    ]
  },
  Earth:{
    gifts: [
      [1,'Earthwalker','','On Turn','Commit Effort'],
      [1,'Jewel-Bright Eyes','', 'On Turn','Commit Effort'],
      [1,'Mountain Thews','', 'Action','Commit Effort to the end of the scene'],
      [1,'Obduracy of Stone','','Constant',''],
      [1,'Rebellion of the Soil', '','Action',''],
      [1,'Stonespeaker' ,'','On Turn','Commit Effort'],
      [2,'Builder of Mountain Peaks', '','Action',''],
      [2,'Fury of the Avalanche','','On Turn','Commit Effort'],
      [2,"Tremors of the World’s Heart", '','Action','Commit Effort to the end of the day']
    ]
  },
  Endurance:{
    gifts: [
      [1,'Amaranth Vitality', '','Constant',''],
      [1,'Body of Iron Will', '','Constant',''],
      [1,'Defy the Iron', '','Instant','Commit Effort to the end of scene'],
      [1,'Elemental Scorn' ,'','Constant',''],
      [1,'Harder than This', '','On Turn','Commit Effort'],
      [1,'Untiring Inspiration' ,'','Constant',''],
      [2,'Fear No Steel' ,'','On Turn','Commit Effort'],
      [2,'Unbreakable' ,'','Instant','Commit Effort to the end of the day'],
      [2,'Undying', '','Constant','']
    ]
  },
  Fertility:{
    gifts: [
      [1,'Birth Blessing' ,'','Action',''],
      [1,'A Second Spring', '','Action','Commit Effort for the day'],
      [1,'Seeds of Death', '','On Turn','Commit Effort'],
      [1,'A Sense of Ash', '','On Turn','Commit Effort'],
      [1,'Touch of Green Restraint', '','Action','Commit Effort for the scene'],
      [1,'Withering Curse', '','Action','Commit Effort for the scene'],
      [2,'Cornucopian Blessing' ,'','On Turn','Commit Effort'],
      [2,'Sever the Line', '','Action','Commit Effort for the day'],
      [2,'Unending Abundance', '','Action','Commit Effort for the day']
    ]
  },
  Fire:{
    gifts: [
      [1,'Consuming Gaze', '','Action',''],
      [1,'Firestorm', 'Smite','Action','Commit Effort for the scene'],
      [1,'Firewalker', '','On Turn','Commit Effort for the scene'],
      [1,'Give Forth the Ashes', '','Action',''],
      [1,'Master of the Furnace', '','On Turn','Commit Effort'],
      [1,'Nimbus of Flame', '','On Turn','Commit Effort'],
      [2,'Burning Rebuke' ,'','On Turn','Commit Effort'],
      [2,'Cinder Words', '','On Turn','Commit Effort'],
      [2,'Searing Blade', '','On Turn','Commit Effort']
    ]
  },
  Health:{
    gifts: [
      [1,'Ender of Plagues', '','Action','Commit Effort for the scene'],
      [1,'Flesh Made True', '','Action',''],
      [1,'Intrinsic Health', '','Constant',''],
      [1,'Merciful Gaze', '','Action','Special'],
      [1,'Plaguebringer', '','On Turn','Commit Effort'],
      [1,'Vital Furnace', '','On Turn','Commit Effort for the day'],
      [2,'Burning Vitality', '','On Turn','Commit Effort for the day'],
      [2,'Deplete Health', '','Action','Commit Effort for the scene'],
      [2,'Lifegiver', '','Constant','']
    ]
  },
  Journeying:{
    gifts: [
      [1,'Dust At Your Heels', '','On Turn','Commit Effort'],
      [1,'Know the Path', '','Constant',''],
      [1,'Master of the Key', '','Instant','Special'],
      [1,'Opening the Way','','Action','Commit Effort for the scene'],
      [1,'Swift Progress','','On Turn','Commit Effort'],
      [1,'Untroubled Passage','','On Turn','Commit Effort'],
      [2,'The Exodus Road','','On Turn','Commit Effort'],
      [2,'The Hour of Need','','Action','Commit Effort for the day'],
      [2,'The Path of Racing Dawn','','On Turn','Commit Effort']
    ]
  },
  Knowledge:{
    gifts: [
      [1,'The Best Course','','Action','Commit Effort for the scene'],
      [1,'The Best-Laid Plans','','Action','Commit Effort for the day'],
      [1,'Excision of Understanding','','Action',''],
      [1,'A Truth That Burns','','Action','Commit Effort for the scene'],
      [1,'The Unveiled Truth','','Action','Commit Effort for the scene'],
      [1,'A Word Far Off','','Action','Commit Effort for the scene'],
      [2,'Disclose the Flaw','','Instant','Commit Effort for the scene'],
      [2,'Irresistible Query','','Action','Commit Effort for the day'],
      [2,'The Omniscient Scholar','','Constant','']
    ]
  },
  Luck:{
    gifts: [
      [1,'Blighted Luck','','Action',''],
      [1,'Nine Lives','','Constant',''],
      [1,'Salting Away the Luck','','Instant','Commit Effort'],
      [1,'Spun Fortune','','Instant','Commit Effort for the scene'],
      [1,'Unmarred Beneficence','','Constant',''],
      [1,'The World Against You','','On Turn','Commit Effort'],
      [2,'By Chance','','Action','Commit Effort for the scene'],
      [2,'Impossible Victory','','Constant',''],
      [2,'Unfailing Fortune','','Constant','']
    ]
  },
  Might:{
    gifts: [
      [1,'Descent of the Mountain','','Action',''],
      [1,'Falling Meteor Strike','','Action','Special'],
      [1,'Fists of Black Iron','','Constant',''],
      [1,'Shoulders Wide as the World','','On Turn','Commit Effort'],
      [1,'Stronger Than You','','Constant',''],
      [1,'Surge of Strength','','Instant','Commit Effort for the scene'],
      [2,'Leap the Moon','','On Turn','Commit Effort'],
      [2,"Loosening God's Teeth",'','Action','Commit Effort for the day'],
      [2,'Thews of the Gods','','Constant','']
    ]
  },
  Night:{
    gifts: [
      [1,'Damn Their Eyes','','Action',''],
      [1,'The Darkling Stairs','','Constant',''],
      [1,'Knives of Night','','On Turn','Commit Effort'],
      [1,'A Road of Shadows','','Action','Commit Effort for the scene'],
      [1,'The Still Silence of Sleep Action','Commit Effort for the scene'],
      [1,'Welcoming the Dusk','','Action','Commit Effort'],
      [2,'A Darkness at Noon','','Action','Commit Effort for the scene'],
      [2,'Flesh of Shadows','','Action','Commit Effort'],
      [2,'A Speaker in Dreams','','Action','Commit Effort']
    ]
  },
  Passion:{
    gifts: [
      [1,'Banner of Passion','','Action','Commit Effort'],
      [1,'Fashioning a Friend','','Action','Commit Effort for the scene'],
      [1,'Follow the Threads','','Action',''],
      [1,'Heart of the Lion','','Constant',''],
      [1,"Snuff the Heart's Candle",'','Action',''],
      [1,'Terrifying Mien','','Action','Commit Effort to the end of the scene'],
      [2,'A Heart like Clay','','Action','Commit Effort for the scene'],
      [2,'Infectious Passion','','Action','Commit Effort for the scene'],
      [2,'A Song Buried Deep','','Action','Commit Effort for the day']
    ]
  },
  Sea:{
    gifts: [
      [1,'Body of Water','','Constant',''],
      [1,'Crushing Depths','','Action','Commit Effort for the scene'],
      [1,'Living Torrent','','On Turn','Commit Effort'],
      [1,'Lord of the Waters','','On Turn','Commit Effort'],
      [1,'Secrets of the Deep','','On Turn','Commit Effort'],
      [1,'Walking With the Tide','','Action','Commit Effort for the scene'],
      [2,'River Tamer','','Action','Commit Effort'],
      [2,'Salt-Spray Purity','','Action','Commit Effort for the scene'],
      [2,'Tsunami Hand','Smite','Action','Commit Effort for the scene']
    ]
  },
  Sky:{
    gifts: [
      [1,'The Clouds Below','','On Turn','Commit Effort'],
      [1,'Eyes Above','','Action',''],
      [1,'Rain of Lightning','','Action',''],
      [1,'Sapphire Wings','','On Turn','Commit Effort'],
      [1,'Stormsword','','On Turn','Commit Effort'],
      [1,'Windsinger','','Action','Commit Effort'],
      [2,'Boreal Spike','Smite','Action','Commit Effort for the scene'],
      [2,'Fury of the Heavens','Smite','Action','Commit Effort for the scene'],
      [2,'Voice of the Winds','','Action','']
    ]
  },
  Sorcery:{
    gifts: [
      [1,'Adept of the Gate','','Constant',''],
      [1,'The Excellent Pause','','Instant',''],
      [1,'Greater Pavis of Rule','','Action','Commit Effort for the scene'],
      [1,'Perfection of Understanding','','Constant',''],
      [1,'The Subtle Eye of Knowing','','On Turn',''],
      [1,'The Will that Burns','','Instant','Special'],
      [1,'Wizard’s Wrath','','Instant','Commit Effort'],
      [2,'Adept of the Throne','','Constant',''],
      [2,'Adept of the Way','','Constant',''],
      [2,'Ruler of the Lesser Paths','','Constant','Commit Effort']
    ]
  },
  Sun:{
    gifts: [
      [1,'Body of Burning Light','','On Turn','Commit Effort'],
      [1,'Hasten to the Light','','Action','Commit Effort for the scene'],
      [1,'Hope of the Dawn','','On Turn','Commit Effort'],
      [1,'Illumine That Which Is','','On Turn','Commit Effort'],
      [1,'Purity of Brilliant Law','','Instant','Commit Effort for the scene'],
      [1,'Sunlit Sight','','Action','Commit Effort'],
      [2,"Creation’s First Light",'','On Turn','Commit Effort'],
      [2,'Purging Noonday Blaze','','Action','Commit Effort for the scene'],
      [2,'Sunstrike','Smite','Action','Commit Effort for the scene']
    ]
  },
  Sword:{
    gifts: [
      [1,'Contempt of Distance','','Constant',''],
      [1,'Nine Iron Walls','','Instant','Commit Effort for the scene'],
      [1,'Steel Without End','','Constant',''],
      [1,'Thirsting Razor','','On Turn','Commit Effort'],
      [1,'Through A Red Forest','','On Turn','Commit Effort'],
      [1,'Unerring Blade','','Instant','Commit Effort to the end of the scene'],
      [2,'Cutting the Crimson Road','','On Turn','Commit Effort'],
      [2,'The Path Through War','','On Turn','Commit Effort'],
      [2,'Shattering Hand','','On Turn','Commit Effort']
    ]
  },
  Time:{
    gifts: [
      [1,'Echoes of the Past','','Action','Commit Effort for the scene'],
      [1,'Immediate Foresight','','Constant',''],
      [1,'Look Forward','','Action','Commit Effort for the day'],
      [1,'Prophetic Insight','','On Turn','Commit Effort for the day'],
      [1,'Reflex of Regret','','On Turn','Commit Effort for the scene'],
      [1,'Withering Hour','','On Turn','Commit Effort'],
      [2,'A Hand on the Balance','','Action','Commit Effort for the day'],
      [2,'Sundered Moment','','On Turn','Commit Effort for the scene'],
      [2,'Reweave Time','','Action','Commit Effort for the day']
    ]
  },
  Wealth:{
    gifts: [
      [1,'The Craft to Make','','Action','Commit Effort'],
      [1,'Ever-Sufficient Provenance','','On Turn','Commit Effort'],
      [1,'Flawless Reproduction','','Action','Commit Effort'],
      [1,"Prosperity's Abundance",'','Action',''],
      [1,'Sustain the Multitude','','On Turn','Commit Effort'],
      [1,'Wither the Purse','','Action','Commit Effort for the scene'],
      [2,'Forever Sufficient','','Constant',''],
      [2,"The Golden God's Hand",'','Action','Commit Effort'],
      [2,"Thieves’ Bane",'','Constant','']
    ]
  }
}

GB.gifts = [
  [1,'Divine Wrath','Smite','Action','Commit Effort to the end of the scene'],
  [1,'Corona of Fury','Smite','Action','Commit Effort to the end of the scene'],
  [1,'Effort of the Word','','Constant',''],
  [1,'Influence of the Word','','Constant',''],
  [1,'Excellence of the Word','','Constant','']
]

GB.loadGifts = function (){
  CPX.vue.heroEditor.allgifts=[];
  var ng = [];
  GB.gifts.forEach(function(el) {
    ng = ['Universal'].concat(el);
    CPX.vue.heroEditor.allgifts.push(ng)
  });
  var word = {};
  for (var x in GB.words) {
    word = GB.words[x];
    word.gifts.forEach(function(el) {
      ng = [x].concat(el);
      CPX.vue.heroEditor.allgifts.push(ng);
    });
  }
}