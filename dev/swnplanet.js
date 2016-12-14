CPX.data.SWNWorldTags = [
  'Abandoned Colony','Out of Contact','Alien Ruins','Outpost World','Altered Humanity',
  'Perimeter Agency','Area 51','Pilgrimage Site','Badlands World','Police State',
  'Bubble Cities','Preceptor Archive','Civil War','Pretech Cultists','Cold War',
  'Primitive Aliens','Colonized Population','Psionics Fear','Desert World','Psionics Worship',
  'Eugenic Cult','Psionics Academy','Exchange Consulate','Quarantined World','Feral World',
  'Radioactive World','Flying Cities','Regional Hegemon','Forbidden Tech','Restrictive Laws',
  'Freak Geology','Rigid Culture','Freak Weather','Seagoing Cities','Friendly Foe',
  'Sealed Menace','Gold Rush','Sectarians','Hatred','Seismic Instability','Heavy Industry',
  'Secret Masters','Heavy Mining','Theocracy','Hostile Biosphere','Tomb World','Hostile Space',
  'Trade Hub','Local Specialty','Tyranny','Local Tech','Unbraked AI','Major Spaceyard',
  'Warlords','Minimal Contact','Xenophiles','Misandry/Misogyny','Xenophobes','Oceanic World','Zombies'
];
CPX.SWN = {};
CPX.SWN.atmosphere = function(RNG){
  var r = RNG.diceSum('2d6'), text='';
  if(r==2){ text = 'Corrosive'; }
  else if(r==3){ text = 'Inert gas'; }
  else if(r==4){ text = 'Airless or thin atmosphere'; }
  else if(r<10){ text = 'Breatheable mix'; }
  else if(r==10){ text = 'Thick atmosphere, breathable with a pressure mask'; }
  else if(r==11){ text = 'Invasive, toxic atmosphere'; }
  else if(r==12){ text = 'Corrosive and invasive atmosphere'; }
  return text;
}
CPX.SWN.temperature = function(RNG){
  var r = RNG.diceSum('2d6'), text='';
  if(r==2){ text = 'Frozen'; }
  else if(r==3){ text = 'Variable cold-to-temperate'; }
  else if(r<6){ text = 'Cold'; }
  else if(r<9){ text = 'Temperate'; }
  else if(r<11){ text = 'Warm'; }
  else if(r==11){ text = 'Variable temperate-to-warm'; }
  else if(r==12){ text = 'Burning'; }
  return text;
}
CPX.SWN.biosphere = function(RNG){
  var r = RNG.diceSum('2d6'), text='';
  if(r==2){ text = 'Biosphere remnants'; }
  else if(r==3){ text = 'Microbial life'; }
  else if(r<6){ text = 'No native biosphere'; }
  else if(r<9){ text = 'Human-miscible biosphere'; }
  else if(r<11){ text = 'Immiscible biosphere'; }
  else if(r==11){ text = 'Hybrid biosphere'; }
  else if(r==12){ text = 'Engineered biosphere'; }
  return text;
}
CPX.SWN.population = function(RNG){
  var r = RNG.diceSum('2d6'), text='';
  if(r==2){ text = 'Failed colony'; }
  else if(r==3){ text = 'Outpost'; }
  else if(r<6){ text = 'Tens of thousands of inhabitants'; }
  else if(r<9){ text = 'Hundreds of thousands of inhabitants'; }
  else if(r<11){ text = 'Millions of inhabitants'; }
  else if(r==11){ text = 'Billions of inhabitants'; }
  else if(r==12){ text = 'Alien civilization'; }
  return text;
}
CPX.SWN.tech = function(RNG){
  var r = RNG.diceSum('2d6'), text='';
  if(r==2){ text = 'Tech Level 0. Stone-age technology.'; }
  else if(r==3){ text = 'Tech level 1. Medieval technology.'; }
  else if(r==4){ text = 'Tech level 2. Nineteenth-century technology.'; }
  else if(r<7){ text = 'Tech level 3. Twentieth-century technology.'; }
  else if(r<11){ text = 'Tech level 4. Baseline postech'; }
  else if(r==11){ text = 'Tech level 4 with specialties or some surviving pretech.'; }
  else if(r==12){ text = 'Tech level 5. Pretech, pre-Silence technology.'; }
  return text;
}
CPX.SWN.planetTags = function(RNG){
  return [RNG.pickone(CPX.data.SWNWorldTags),RNG.pickone(CPX.data.SWNWorldTags)];
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SWN.planet = function(RNG){
  //[8,16,32,48,64,80,96,112,128,144,160]
  //all in 100 km
  var p = {class:['planet','terran','main','habitable']};
  //size & g - limit to larget planets
  p.size = RNG.natural({min:5,max:10});
  //Hydrographics
  p.hydro = RNG.diceSum('2d6')-7+p.size;
  if(p.hydro<0) { p.hydro = 0; }
  if(p.hydro>10) { p.hydro = 10; }
  p.hydro = '('+CHS.DATA.hydro[p.hydro][0]+') '+CHS.DATA.hydro[p.hydro][1]
  //atmosphere
  p.atm = CPX.SWN.atmosphere(RNG);
  //temperature
  p.temp = CPX.SWN.temperature(RNG);
  //biosphere
  p.bio = CPX.SWN.biosphere(RNG);
  //population
  p.pop = CPX.SWN.population(RNG);
  //tech Level
  p.tech = CPX.SWN.tech(RNG);
  //tags
  p.tags = CPX.SWN.planetTags(RNG).join(', ');
  
  return p;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.SWN.system = function(seed){
  var S = CHS.system(seed);
  S.RNG = new Chance(S._id);
  
  function HZone(){
    if(p.orbit>system.HZone.min && p.orbit<system.HZone.max){return true;}
    return false;
  }
  
  S.planets.forEach(function(p,i) {
    var np = {};
    if(p.class.includes('main')){
      //new SWN planet
      np = CPX.SWN.planet(S.RNG);
      //add the orbit info
      np.orbit = p.orbit;
      //set the SWN planet in the system
      S.planets[i] = np;
    }
  });
  
  delete S.RNG;
  
  return S;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-swp-planet', {
  props:['P','i',"O",'HZ'],
  template: '\
  <div class="header strong">\
    {{head | capitalize}} ({{P.orbit}} AU) \
    <div class="pull-right" v-if="HZone">[HabZone]</div>\
  </div>\
  <div v-if="P.class.includes(`main`)" class="bottom-pad">\
    <input class="form-control center" type="text" v-model="P.name" placeholder="NAME">\
  </div>\
  <div v-if="P.class[1] == `terran`">\
    <div class="input-group">\
      <span class="input-group-addon strong">\
        Diameter: {{D.size[P.size]*100}} km \
        ({{Math.round10(D.size[P.size]*100/12742,-2)}} earth) \
      </span>\
      <span class="input-group-addon strong">\
        Gravity:</strong> {{D.g[P.size]}}g\
      </span>\
    </div>\
    <div class="center" v-if="!P.class.includes(`main`)"><strong>Atmosphere:</strong> {{D.atm[P.atm][1]}}</div>\
    <div v-if="P.class.includes(`main`)">\
      <div class="input-group">\
        <span class="input-group-addon strong">Atmosphere</span>\
        <input class="form-control center" type="text" v-model="P.atm">\
      </div>\
      <div class="input-group">\
         <span class="input-group-addon strong">Hydrosphere</span>\
         <input class="form-control center" type="text" v-model="P.hydro">\
      </div>\
      <div class="input-group">\
         <span class="input-group-addon strong">Temperature</span>\
         <input class="form-control center" type="text" v-model="P.temp">\
      </div>\
      <div class="input-group">\
         <span class="input-group-addon strong">Biosphere</span>\
         <input class="form-control center" type="text" v-model="P.bio">\
      </div>\
      <div class="input-group">\
         <span class="input-group-addon strong">Population</span>\
         <input class="form-control center" type="text" v-model="P.pop">\
      </div>\
      <div class="input-group">\
         <span class="input-group-addon strong">Tech Level</span>\
         <input class="form-control center" type="text" v-model="P.tech">\
      </div>\
      <div class="input-group">\
         <span class="input-group-addon strong">Tags</span>\
         <input class="form-control center" type="text" v-model="P.tags">\
      </div>\
    </div>\
  </div>\
  ',
  data: function () {
    return {
      D: CHS.DATA,
    }
  },
  computed: {
    HZone: function(){
      if(this.P.orbit>this.HZ.min && this.P.orbit<this.HZ.max){return true;}
      return false;
    },
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
