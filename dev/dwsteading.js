CPX.data.DWSteadings = {
  basic : ['village','town','keep','city'],
  bp : [5,3,3,1],
  village : {
    core: ['Poor', 'Steady', 'Militia','Resource (type)','Oath (steading)'],
    extra : [ 
      [0,'Natural defenses', ['Safe', '-Defenses']],
      [1,'Abundant resources', ['+Prosperity', 'Resource (type)', 'Enmity (steading)']],
      [2,'Protected by another steading', ['Oath (steading)', '+Defenses']],
      [3,'On a major road', ['Trade (steading)', '+Prosperity']],
      [4,'Built around a wizard’s tower', ['Personage (wizard)', 'Blight (arcane creatures)']],
      [5,'Built on a site of religious significance', ['Divine', 'History']]
    ],
    ep : [3,3,2,2,1,1],
    trouble : [
      [0,'Surrounded by arid or uncultivable land', ['Need (food)']],
      [1,'Dedicated to a deity', ['Religious (that deity)', 'Enmity (steading of opposing deity)']],
      [2,'Recently at war', ['-Population', '-Prosperityif they fought to the end', '-Defenses if they lost']],
      [3,'Monster problem', ['Blight (that monster)', 'Need (adventurers)']],
      [4,'Absorbed another village', ['+Population', 'Lawless']],
      [5,'Remote or unwelcoming', ['-Prosperity', 'Dwarven or Elven or other non-human']]
    ]
  }, 
  town : {
    core: ['Moderate', 'Steady', 'Watch', 'Trade (steading)', 'Trade (steading)'],
    extra : [ 
      [0,'Booming', ['Booming', 'Lawless']],
      [1,'At a crossroads', ['Market', '+Prosperity']],
      [2,'Defended by another steading', ['Oath (steading)', '+Defenses']],
      [3,'Built around a church', ['Power (divine)']],
      [4,'Built around a craft', ['Craft (type)', 'Resource (something required for that craft)']],
      [5,'Built around a military post', ['+Defenses']]
    ],
    ep : [1,2,2,2,3,2],
    trouble : [
      [0,'Outgrowing a vital resource', ['Need (type)', 'Trade (steading with need)']],
      [1,'Offers defense to others', ['Oath (steading)', '-Defenses']],
      [2,'Outlaw rumored to live there', ['Personage (outlaw)', 'Enmity (steading preyed upon)']],
      [3,'Controls a good/service', ['Exotic (good/service)', 'Enmity (steading)']],
      [4,'Suffers from disease', ['-Population']],
      [5,'Popular meeting place', ['+Population', 'Lawless']]
    ]
  },
  keep : {
    core: ['Poor', 'Shrinking', 'Guard', 'Need (supplies)', 'Trade (steading)','Oath (steading)'],
    extra : [ 
      [0,'Belongs to a noble family', ['+Prosperity', 'Power (political)']],
      [1,'Run by a skilled commander', ['Personage (commander)', '+Defenses']],
      [2,'Stands watch over a trade road', ['+Prosperity', 'Guild (trade)']],
      [3,'Used to train special troops', ['Arcane', '-Population']],
      [4,'Surrounded by fertile land', ['-Need (Supplies)']],
      [5,'Stands on a border', ['+Defenses', 'Enmity (steading)']]
    ],
    ep : [2,2,2,2,2,2],
    trouble : [
      [0,'Built on a naturally defensible position', ['Safe', '-Population']],
      [1,'Formerly occupied by another power', ['Enmity (steading)']],
      [2,'Safe haven for brigands', ['Lawless']],
      [3,'Built to defend from a specific threat', ['Blight (threat)']],
      [4,'Has seen horrible bloody war', ['History (battle)', 'Blight (restless spirits)']],
      [5,'Is given the worst of the worst', ['Need (skilled recruits)']],
      [6,'Suffers from disease', '-Population'],
      [7,'Popular meeting place', ['+Population', '-Law']]
    ]
  },
  city : {
    core: ['Moderate', 'Steady', 'Guard', 'Market', 'Guild (type)','Oath (steading)','Oath (steading)'],
    extra : [ 
      [0,'Permanent defenses, such as walls', ['+Defenses', 'Oath (steading)']],
      [1,'Ruled by a single individual', ['Personage (ruler)', 'Power (political)']],
      [2,'Diverse', ['Dwarven or Elven or both']],
      [3,'Trade hub', ['Trade (every nearby steading)', '+Prosperity']],
      [4,'Ancient, built on top of its own ruins', ['History (your choice)', 'Divine']],
      [5,'Center of learning', ['Arcane', 'Craft (your choice)', 'Power (arcane)']]
    ],
    ep : [3,3,1,3,1,1],
    trouble : [
      [0,'Outgrown its resources', ['+Population', 'Need (food)']],
      [1,'Designs on nearby territory', ['Enmity (nearby steadings)', '+Defenses']],
      [2,'Ruled by a theocracy', ['-Defenses', 'Power (divine)']],
      [3,'Ruled by the people', ['-Defenses', '+Population']],
      [4,'Supernatural defenses', ['+Defenses', 'Blight (related supernatural creatures)']],
      [5,'Occupies a place of power', ['Arcane', 'Personage (whoever watches the place of power)', 'Blight (arcane creatures)']]
    ]
  }
};

CPX.DWSteading = function (opts){
  var S = {
    seed : opts.seed,
    class:['steading',opts.type],
    name : typeof opts.name === "undefined" ? '' : opts.name,
    notes : typeof opts.notes === "undefined" ? '' : opts.notes,
    people : typeof opts.people === "undefined" ? [] : opts.people,
    terrain : typeof opts.people === "undefined" ? 3 : opts.terrain,
  }
  S._id = S.seed.join('');
  S.RNG = new Chance(S._id);
  
  var type = CPX.data.DWSteadings[opts.type];
  S.extra =S.RNG.weighted(type.extra,type.ep)[0];
  S.trouble = S.RNG.pickone(type.trouble)[0]; 

  S.tags = type.core.concat([]).join(', ');
  
  //pick population if none given
  if(S.people.length==0){
    //number of people
    var np = S.RNG.weighted([1,2,3],[7,2.5,0.5]);
    for(var i=0;i<np;i++){
      S.people.push(CPX.people(S.RNG,{terrain:opts.terrain}));
    }
  }
  
  S.RNG = null;
  delete S.RNG;
  return S;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cfp-DWS', { 
props:['obj'],
template: ''+
  '<div class="content">'+
    '<input class="form-control input-lg center" type="text" v-model="obj.name" placeholder="NAME">'+
    '<textarea class="form-control" type="textarea" v-model="obj.notes" placeholder="ADD NOTES"></textarea>'+
    '<div class="input-group">'+
       '<span class="input-group-addon strong">Tags</span>'+
       '<textarea class="center form-control" type="textarea" lines="3" v-model="obj.tags"></textarea>'+
    '</div>'+
    '<div class="content-minor box">'+
      '<div class="header strong center">Population</div>'+
      '<c-cfp-ppl v-for="ppl in obj.people" v-bind:P="ppl"></c-cfp-ppl>'+
    '</div>'+
    '<div class="input-group">'+
       '<span class="input-group-addon strong">Extra</span>'+
       '<select class="form-control" v-model="obj.extra">'+
         '<option  v-for="e in extras" v-bind:value="$index">{{e[1]}}</option>'+
       '</select>'+
    '</div>'+
    '<div class="center bottom-pad">{{extras[obj.extra][2].join(`, `)}}</div>'+ 
    '<div class="input-group">'+
       '<span class="input-group-addon strong">Trouble</span>'+
       '<select class="form-control" v-model="obj.trouble">'+
         '<option  v-for="t in trouble" v-bind:value="$index">{{t[1]}}</option>'+
       '</select>'+
    '</div>'+
    '<div class="center bottom-pad">{{trouble[obj.trouble][2].join(`, `)}}</div>'+ 
    '</div>',
  data: function () {
    return {
      extras: CPX.data.DWSteadings[this.obj.class[1]].extra,
      trouble: CPX.data.DWSteadings[this.obj.class[1]].trouble
    }
  }
})
