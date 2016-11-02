var CHS = {};
CHS.DATA = {
  //all in 100 km
  size:[8,16,32,48,64,80,96,112,128,144,160],
  g:[0,0.05,0.15,0.25,0.35,0.45,0.7,0.9,1,1.25,1.4],
  atm:[
    [0,'None', '0.00', 'Vacc Suit'],
    [1,'Trace', '0.001 to 0.09', 'Vacc Suit'],
    [2,'Very Thin, Tainted', '0.1 to 0.42', 'Respirator, Filter'],
    [3,'Very Thin', '0.1 to 0.42', 'Respirator'],
    [4,'Thin, Tainted', '0.43 to 0.7', 'Filter'],
    [5,'Thin', '0.43 to 0.7',''],
    [6,'Standard', '0.71–1.49',''],
    [7,'Standard, Tainted', '0.71–1.49', 'Filter'],
    [8,'Dense', '1.5 to 2.49',''],
    [9,'Dense, Tainted', '1.5 to 2.49', 'Filter'],
    ['A','Exotic', 'Varies', 'Air Supply'],
    ['B','Corrosive', 'Varies', 'Vacc Suit'],
    ['C','Insidious', 'Varies', 'Vacc Suit'],
    ['D','Dense, High', '2.5+',''],
    ['E','Thin, Low', '0.5 or less',''],
    ['F','Unusual', 'Varies', 'Varies'],
  ],
  hydro:[
    ['0%–5%', 'Desert world'],
    ['6%–15%', 'Dry world'],
    ['16%–25%', 'A few small seas.'],
    ['26%–35%', 'Small seas and oceans.'],
    ['36%–45%', 'Wet world'],
    ['46%–55%', 'Large oceans'],
    ['56%–65%', 'Large oceans'],
    ['66%–75%', 'Earth-like world'],
    ['76%–85%', 'Water world'],
    ['86%–95%', 'Only a few small islands and archipelagos.'],
    ['96–100%', 'Almost entirely water.']
  ],
  starport: {
    X:['None', 'None', 'No', 'None', 'None'],
    E:['Frontier', 'None', 'No', 'None', 'None'],
    D:['Poor', 'Unrefined', 'No', 'None', 'Scout'],
    C:['Routine', 'Unrefined', 'No', 'Can perform reasonable repairs', 'Scout'],
    B:['Good', 'Refined', 'Yes', 'Can construct non-starships', 'Naval, Scout'],
    A:['Excellent', 'Refined', 'Yes', 'Can construct starships and non-starships', 'Naval, Scout']
  },
  govt: [
    [0, 'None'],
    [1, 'Company/Corporation'],
    [2, 'Participating Democracy'],
    [3, 'Self-Perpetuating Oligarchy'],
    [4, 'Representative Democracy'],
    [5, 'Feudal Technocracy'],
    [6, 'Captive Government'],
    [7, 'Balkanization'],
    [8, 'Civil Service Bureaucracy'],
    [9, 'Impersonal Bureaucracy'],
    ['A', 'Charismatic Dictator'],
    ['B', 'Non-Charismatic Leader'],
    ['C', 'Charismatic Oligarchy'],
    ['D', 'Religious Dictatorship'],
    ['E', 'Religious Autocracy'],
    ['F', 'Totalitarian Oligarchy']
  ],
  law:[
    [0, 'No Law', 'No restrictions; candidate for Amber Zone status'],
    [1, 'Low Law', 'Poison gas, explosives, undetectable weapons, weapons or mass destruction'],
    [2, 'Low Law', 'Portable energy weapons (except ship-mounted weapons)'],
    [3, 'Low Law', 'Heavy weapons'],
    [4, 'Medium Law', 'Light assault weapons and submachine guns'],
    [5, 'Medium Law', 'Personal concealable weapons'],
    [6, 'Medium Law', 'All firearms except shotguns and stunners; carrying weapons discouraged'],
    [7, 'High Law', 'Shotguns'],
    [8, 'High Law', 'All bladed weapons, stunners'],
    [9, 'High Law', 'Any weapons outside one’s residence; candidate for Amber Zone status'],
    ['A', 'Extreme Law', 'Any weapons allowed at all; candidate for Amber Zone status']
  ],
  pop: ['None','Few','Hundreds','Thousands','Tens of thousands','Hundreds of thousands','Millions',
    'Tens of millions', 'Hundreds of millions', 'Billions', 'Tens of billions'  
  ]
}
CHS.system = function (seed){
  var system = {seed:seed}, np=0, n=0;
  system._id = seed.join('');
  system.RNG = new Chance(system._id);
  
  system.name=CPXC.capitalize(system.RNG.word());
  
  system.stars = [system.RNG.weighted(HABSTARS[0],HABSTARS[1])];
  //habitable zone
  var habit = [STARS[system.stars[0]][0][1],STARS[system.stars[0]][0][2]];
  
  system.planets = [];
  //add gas giants
  n=0;
  if(system.RNG.diceSum('2d6')>4){
    n = system.RNG.d6()-2;
    if(n<1) { n=1; }
    for(var i=0;i<n;i++){
      system.planets.push({class:['planet','gasgiant']});
    }
  }
  //number of planets based on giant presence
  if(system.planets.length>0) { np = system.RNG.diceSum('2d6'); }
  else { np = system.RNG.diceSum('3d6'); }
  //add belts
  n=0;
  if(system.RNG.diceSum('2d6')>3){
    n = system.RNG.d6()-3;
    if(n<1) { n=1; }
    for(var i=0;i<n;i++){
      system.planets.push({class:['belt']});
    }
  }

  //generate non-main planets
  for(var i=system.planets.length;i<np;i++){
    system.planets.push({class:['planet','terran']})
  }
  //randomize obits
  system.planets = system.RNG.shuffle(system.planets);
  
  system.HZone = [], val=0;
  system.orbits = [(system.RNG.d4()+1)/10];
  system.orbits[1] = system.orbits[0]+0.3;
  for(var i=2;i<np;i++){
    val = Math.round10(system.orbits[0]+0.3*Math.pow(2,i-1),-1);
    system.orbits[i] = val;
    if(val>=habit[0] && val<=habit[1]){ system.HZone.push(i); }
  }
  
  if(system.HZone.length>0){
    system.planets[system.RNG.pickone(system.HZone)] = {class:['planet','terran']};    
  }
  else {
    system.planets.push({class:['planet','terran']});
    val = habit[0]+(habit[1]-habit[0])*system.RNG.d20()/20;
    system.orbits.push(val);
    system.HZone.push(system.orbits.length-1);
  }
  
  system.RNG = null;
  delete system.RNG;
  
  system.planets.forEach(function(el,idx) {
    CHS.planet(system,idx);
  });
  
  return system;
}
CHS.planet = function (system,i) {
  var p =system.planets[i];
  p.RNG = new Chance(system._id+'-'+i);
  
  if(p.class[1]=='terran'){
    if(system.HZone.includes(i)) { CHS.main(p.RNG,p); }
    else { CHS.terran(p.RNG,p); }
  }
  else if (p.class[1]=='gasgiant'){ CHS.gasGiant(p.RNG,p); }
  
  p.RNG=null;
  delete p.RNG;
}
CHS.gasGiant = function (RNG,p) {
  p.class.push(p.RNG.weighted(['SJ','JJ','TJ'],[3,6,1]));
  p.mass = RNG.weighted(PLANETS[p.class[2]].mass[0],PLANETS[p.class[2]].mass[1]);
}
CHS.terran = function(RNG,p){
  p.size = RNG.diceSum('2d6')-2;
  if(p.size > 0) {p.atm = RNG.diceSum('2d6')-7+p.size;}
  else {p.atm=0;}
  if(p.atm<0) { p.atm=0; }
}
CHS.main = function(RNG,p){
  p.class.push('main')
  p.size = RNG.diceSum('2d6')-2;

  if(p.size > 0) {p.atm = RNG.diceSum('2d6')-7+p.size;}
  else {p.atm=0;}
  if(p.atm<0) { p.atm=0; }
  
  //Hydrographics
  p.hydro = RNG.diceSum('2d6')-7+p.size;
  if([0,1,10,11,12].includes(p.atm)) { p.hydro-= 4; } 
  else if (p.atm == 14) { p.hydro-= 2; }
  
  if(p.size<2) { p.hydro = 0; }
  if(p.hydro<0) { p.hydro = 0; }
  
  //Population
  p.pop = RNG.diceSum('2d6')-3+p.size;
  if(p.size<3) { p.pop -= 1; }
  if(p.atm<4 && p.hydro===0) { p.pop -= 2; }
  if(p.atm>9) { p.pop -= 2; }
  else if(p.atm==6) { p.pop += 3; }
  else if([5,8].includes(p.atm)) { p.pop += 1; }
  if(p.pop>10){p.pop=10;}

  //starport
  p.starport = RNG.diceSum('2d6')-7+p.pop;
  if(p.starport<3){ p.starport='X'; }
  else if(p.starport<5){ p.starport='E'; }
  else if(p.starport<7){ p.starport='D'; }
  else if(p.starport<9){ p.starport='C'; }
  else if(p.starport<11){ p.starport='B'; }
  else { p.starport='A'; }
  //Government
  p.gov = RNG.diceSum('2d6')-7+p.pop;
  //Law
  p.law = RNG.diceSum('2d6')-7+p.pop;
  if(p.law>10){p.law=10;}
  //Tech Level
  p.TL = RNG.d6();
  var spTL= {A:6,B:4,C:2,D:0,E:0,X:-4};
  p.TL+= spTL[p.starport];
  if(p.size<2){p.TL+=2;}
  else if(p.size<5){p.TL+=1;}
  if([0,1,2,3,10,11,12,13,14,15].includes(p.atm)){p.TL+=1;}
  if([0,9].includes(p.hydro)){p.TL+=1;}
  else if(p.hydro==10){p.TL+=2;}
  if([2,3,4,5,6,7].includes(p.pop)){p.TL+=1;}
  else if(p.pop==8){p.TL+=2;}
  else if(p.pop==9){p.TL+=3;}
  else if(p.pop==10){p.TL+=4;}
  if([0,5].includes(p.gov)){p.TL+=1;}
  else if([13,14].includes(p.gov)){p.TL-=2;}
  else if(p.gov==7){p.TL+=2;}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-chs-star', {
  props:['S','i'],
  template: '<div class="header strong">{{head | capitalize}} Main Sequence</div>',
  computed: {
    head: function(){ return STARS[this.S][1]; }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-chs-planet', {
  props:['P','i',"O",'HZ'],
  template: '\
  <div class="header strong">{{head | capitalize}} ({{O[i]}} AU) \
  <div class="pull-right" v-if="HZ.includes(i)">[HabZone]</div></div>\
  <div v-if="P.class.includes(`main`)" class="bottom-pad"><input class="form-control center" type="text" v-model="P.name" placeholder="NAME"></div>\
  <div v-if="P.class[1] == `terran`">\
  <div class="center"><strong>Diameter:</strong> {{D.size[P.size]*100}} km \
  ({{Math.round10(D.size[P.size]*100/12742,-2)}} earth) <strong>Gravity:</strong> {{D.g[P.size]}}g</div>\
  <div class="center"><strong>Atmosphere:</strong> {{D.atm[P.atm][1]}}</div>\
  <div v-if="main">\
  <div class="center"><strong>Hydrosphere:</strong> {{D.hydro[P.hydro][1]}} ({{D.hydro[P.hydro][0]}} water)</div>\
  <div class="content">\
  <div><strong>Population:</strong> {{D.pop[P.pop]}} [<strong>Tech:</strong> {{P.TL}}]</div>\
  <div><strong>Starport:</strong> {{D.starport[P.starport][1]}}</div>\
  <div><strong>Government:</strong> {{D.govt[P.gov][1]}}</div>\
  <div><strong>Law:</strong> {{D.law[P.law][1]}}</div>\
  </div></div></div>\
  ',
  data: function () {
    return {
      D: CHS.DATA,
    }
  },
  computed: {
    main: function(){
      if(this.P.class.includes('main')){return true;}
      return false;
    },
    head: function(){
      if(this.P.class[0]=='planet'){
        if(this.P.class[1]=='gasgiant') {
          return PLANETS[this.P.class[2]].name+' ['+this.P.mass+'x Juptier]'; 
        }
        else{return this.P.class[1];}
      }
      return this.P.class[0];
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-chs', { 
  template: '<div>'+
  '<h2 class="center">Cepheus RPG System Generator</h2>'+
  '<c-menubar id="CHS" v-bind:show="showmenu"></c-menubar>'+
  '<c-loadselect id="CHS" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>'+
  '<div class="content"><input class="form-control input-lg center" type="text" v-model="system.name" placeholder="NAME">'+
  '<textarea class="form-control" type="textarea" v-model="system.notes" placeholder="ADD NOTES"></textarea></div>'+
  '<h4 class="center bar-bottom">Stars</h4>'+
  '<c-chs-star v-for="s in system.stars" v-bind:S="s" v-bind:i="$index"></c-chs-star>'+
  '<h4 class="center bar-bottom">Planet</h4>'+
  '<c-chs-planet v-for="p in system.planets" v-bind:HZ="system.HZone" v-bind:P="p" v-bind:i="$index" v-bind:O="system.orbits"></c-chs-planet>'+
  '</div>',
  data: function () {
    return {
      vid: 'CHS',
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {load:false},
      system: {},
      loadgen: '',
      allgens: {}
    }
  },
  //called when created
  created: function () {
    CPX.vue.page.onCreated(this);
  },
  beforeDestroy: function () {
    CPX.vue.page.onBeforeDestroy(this);
  },
  methods: {
    save: function () {
      CPXSAVE.setItem(this.system._id,this.system).then(function(){});
      if(!objExists(this.allgens[this.system._id])){
        Vue.set(this.allgens, this.system._id, this.system.name);
      } 
    },
    load: function (S) {
      this.system = S;
    },
    new : function () { 
      this.system={};
      this.generate();
    },
    generate: function () {
      this.system = CHS.system(['CHS','-',CPXC.string({length: 27, pool: base62})]);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.system = {};
      this.allgens = [];
    }
  }
})