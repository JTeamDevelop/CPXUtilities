//special / unique terrain features
const FEATURECHANCE = [5,170/3,40/3,40/3,80/3,20,100/3];
const TERRAINFEATURES = {
  0: [],
  1: [],
  2: [],
  3: ["aquifer","butte","cave, fracture","cave, limestone","crater lake","dry lake","escarpment","esker","gulch",
    "heavy shrubs", "heavy underbrush","hillock/knoll","lake","lava dome","limestone pavement","mesa","mud pits",
    "plateau","ridge","riparian zone","rock outcropping","rock shelter","sinkhole","strath","tar pit","thicket",
    "tor","vernal pool","well"],
  4: [],
  5: [],
  6: []
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.pop = function (opts) {
  var generate = ["name","level","size"];
  if(!objExists(opts.template)) {
    generate.push("people");
  }

  var obj = CPX.obj(opts,[["atlas",{}]],generate);
  obj.class.push("city");
  obj.actions = ["help","rest"];

  if(objExists(opts.subtype)){
    obj.class = [opts.subtype];
    if(opts.subtype == "order"){
      obj.profession = obj.RNG.pickone(["Knight","Wizard","Priest","Monk"]);
      obj.recruit = [obj.profession];
    }
    if(opts.subtype == "hideout"){
      obj.profession = obj.RNG.pickone(["Knight","Wizard","Priest","Monk"]);
      obj.actions = ["explore"];
    }
  }
  else {
    obj.store = [{basic:true}];
    obj.recruit = [{basic:true}];
  }

  CPX.obj.closure(obj,opts);
  return obj._id;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.subSites = function (site){
  var minscale = 2, maxscale = 4;
  if(site.class.includes("site")){
    minscale = 3; maxscale = 5;
  }
  var subs = {}, remainder=0;
  var P = [0.04,0.02,0.01], n =-1, an=-1;

  //the following will calculate how many sub-scale 4,3, and 2 dungeons are in the ruin
  //based upon scale of ruin, its size, and the probability (P) table above
  //P is percent chance to find a dungeon of that idx scale+1  (ie 1% chance for a scale 4 dungeon)
  //ex: a scale 5 ruin of size 2 has a 20% chance of producing a scale 4 dungeon 
  //It will have ~20 scale 3 dungeons and ~540 scale 2 dungeons - that is a lot of exploring   

  //calculates hexmap dungeons based on raw multiplicaiton using above probabilities
  function scalc(s,n) {
    an=-1;
    //starting at the max scale and moving down
    for (var i = s; i >= minscale; i--) {
      //calculate the number of sites size times scale probability
      an = n*P[i-2];
      //post the number ot the object array
      subs[i]=an;
      //set the size of the next iteration, multiply by 10 because scale will be reduced
      n = (n-an)*10;
    }
    //the remainder - scale 1 sites in the ruin
    remainder = Math.round(n);
  }

  //determine how many special hexmap dungeon style sites to explore
  //start at scale 4 - a huge superstructure, if the ruin is that scale there is a percent chance
  if (site.scale >= maxscale) {
    //check for maxscale dungeon
    n = Math.pow(10,(site.scale - maxscale))*site.size;
    scalc(maxscale,n);
  }
  //if the ruin isn't that big, set the scale and the size based on the ruin
  else {
  //check for smaller dungeons
    scalc(site.scale,site.size);
  }
  return subs;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.ruin = function (opts) {
  //provides weights for random selection of lairs later
  var subprob = [];
  function subSites () {
    var n = obj.RNG.natural({min:5,max:10}), minx = -1;
    var special = CPX.subSites(obj);
    //round and check for dungeons if results are less than 1
    for(var x in special) {
      if (special[x]<1) {
        if(obj.RNG.bool({likelihood:special[x]*100})) { 
          obj.subsites.push({scale:x,name:obj.RNG.pickone(sites),special:[]}); 
          subprob.push(Math.pow(10,x));
          n--;
        }
      }
      else if (special[x]<10) {
        for(var i=0;i<special[x];i++) { 
          if(n<0) {continue;}
          obj.subsites.push({scale:x,name:obj.RNG.pickone(sites),special:[]}); 
          subprob.push(Math.pow(10,x));
          n--;
        }
      }
      else { minx = x; } 
    }
    for(var i =0;i<n;i++) {
      obj.subsites.push({scale:minx,name:obj.RNG.pickone(sites),special:[]}); 
      subprob.push(Math.pow(10,minx));
    }
  }
  function factions(n,type) {
    var temp = {}, ns = obj.scale-2;

    for(var i=0;i<n;i++){
      temp = CPX.people(obj.RNG,obj.parent[1].terrain);
      //determine the population in the ruin - around 1% of ruin former population
      if((ns-temp.scale)>=0) { ns-=temp.scale; }
      temp.n = Math.round(Math.pow(10,ns)*CPX.size(obj.RNG));
      temp.nmod = 0;
      //not unique like wandering monsters
      temp.unique = false;
      //no solutary factions
      if(temp.nappearing ='solitary') { temp.nappearing = obj.RNG.pickone(['group','horde']); }
      obj.pop.push(temp);
    }
  }
  function wanderingMonsters() {
    var temp = {};
    if(obj.scale<3 && !['monsters','meltingpot'].includes(obj.class[2])) { return; }
    var n = obj.RNG.natural({min:3,max:5});
    for(var i=0;i<n;i++){ 
      temp = CPX.encounter(obj.RNG,obj.parent[1].terrain);
      //determine pop, always limited
      temp.n = 1;
      temp.nmod = 0;
      if(temp.nappearing =='group') { temp.n = obj.RNG.d6()+1; }
      else if(temp.nappearing =='horde') { temp.n = obj.RNG.rpg('3d4',{sum:true})+10; }
      //wanderingMonsters are always unique
      temp.unique = true;
      obj.pop.push(temp); 
    }
  }
  function applyMods(obj) {
    CPX.mod.find(obj).then(function(mods){
      //apply pop mods 
      for(var x in mods){
        obj[x] = mod[x];
      }
    });
  }

  var generate = ["name","size"];
  if(!objExists(opts.template)) {
    generate.push("people");
  }

  var obj = CPX.obj(opts,
    [["level","uncommon"],['class',['ruin']],['actions',['explore']],['subsites',[]],['pop',[]]],
    generate);

  //if an atlas only building a ruin one hex big, each hex has its own unique ecosystem/features
  if(obj.scale>7 && obj.parent[0]._type == 'atlas') { obj.scale=7; }

  //ruin nature - idx 1
  var cities = ["abandoned","ancient","undergroundhold","plundered","prehuman"];
  var sites = ["Crypt",'Mine','Holdfast','Warren',"Fort","Keep","Shrine","Spire","Temple","Tomb","Palace","Tower","Wall","Library","School"];

  if(obj.scale>=3) { 
    obj.class.push(obj.RNG.weighted(cities,[4,2,1,2,1])); 
    subSites();
  }
  else { 
    obj.class.push(obj.RNG.pickone(sites)); 
    obj.subsites.push({scale:obj.scale,name:obj.class[1],special:[]});
  }
  if (obj.scale==3) {  
    obj.subsites.push({scale:2,name:obj.RNG.pickone(sites),special:[]});
  }
  
  //ruin trouble, 30% a melting pot of random inhabitants - idx 2
  if(obj.RNG.bool({likelihood:30})) { obj.class.push('meltingpot'); }
  else {
    obj.class.push(obj.RNG.pickone(["angrydead","curse","barren","darkwizards","disputed","warlord","raiders",
    "monsters","severedamage","cult","outsiders","contaminated"]));  
  }
  
  //big reward in the ruin - idx 3
  obj.class.push(obj.RNG.pickone(["armory","treasure","magic","art","science","relic","resource","recruits"]));

  //find mods, determine pop
  if(obj.class[2] == 'monsters') {
    wanderingMonsters();
  }
  else if(['meltingpot',"angrydead","darkwizards","disputed","warlord","raiders","cult","outsiders"].includes(obj.class[2])) {
    if(obj.class[2] == 'meltingpot' && obj.scale>=3) { 
      factions(obj.RNG.natural({min:2,max:4}),'people'); 
    }
    else { factions(1,obj.class[2]); }    
    wanderingMonsters();
  }

  //set lairs
  obj.popmod = {};
  var popd = 10;
  obj.pop.forEach(function(el,id){
    obj.popmod[id] = 0;
    //unique pops only have one lair
    if(el.unique) { obj.RNG.pickone(obj.subsites).special.push({class:['lair'],popid:id}); }
    else {
      popd = 10;
      if(el) {}
      //non uniques have one lair per ~10 pop
      for(var i=0;i<(el.n/10);i++) { 
        obj.RNG.weighted(obj.subsites,subprob).special.push({class:['lair'],popid:id});
      }
    }
  });
    
  //pull pop mods from db and update pop async
  applyMods(obj);
  CPX.obj.closure(obj,opts);

  return obj._id;  
  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.site = function (opts) {
  var obj = CPX.obj(opts,[["terrain","plain"],["atlas",{}]],["level","size"]);
  obj.class = ["site"];
  obj.actions = ["explore"];
  obj.special = [];
  obj.name = CPXC.capitalize(obj.terrain);

  var sitenames = ["Crater","Crypt","Fort","Keep","Shrine","Spire","Temple","Tomb","Palace","Tower","Wall","Library"];
  //base everything on scale 3 = 6 acres, good size for open area
  var maxn = Math.pow(10,obj.scale-3)*obj.size;
  if(maxn < 10) { 
    obj.special.push({scale:3,minScale:3,size:maxn,name:obj.RNG.pickone(sitenames)}); 
  }
  else if(maxn < 100) {
    obj.special.push({scale:3,minScale:3,size:obj.RNG.natural({min:7,max:20}),name:obj.RNG.pickone(sitenames)});
  }
  else {
    var rs = obj.RNG.natural({min:2,max:7});
    for(var i=0;i<rs;i++) {
      obj.special.push({scale:3,minScale:3,size:obj.RNG.natural({min:7,max:20}),name:obj.RNG.pickone(sitenames)});
    }
  }

  CPX.obj.closure(obj,opts);
  return obj._id;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.lair = function (opts) {
  var options = Object.assign({},opts), creature = {};
  delete options.visible;

  options.RNG = new Chance(opts.seed.concat(["c"]).join(""));
  if(!objExists(opts.template)) {
    creature = CPX.creature(options.RNG,opts.terrain,opts.level);
  }
  else {
    creature = Object.assign({},template.creature);
  }

  if(creature.nappearing == "horde") {
    creature.n = Math.round((CPX.size(options.RNG)+CPX.size(options.RNG))*10); 
    options.size = Math.round(creature.n/3); 
  }
  else if(creature.nappearing == "group") { 
    creature.n = Math.round((CPX.size(options.RNG)+CPX.size(options.RNG))*4);  
    options.size = Math.round(creature.n/3);
  }

  if(!objExists(opts.special)){
    creature.id = 0;
    options.special = [creature];
  }
  else {
    creature.id = options.special.length;
    options.special.push(creature);
  }

  var objid = CPX.hexMap(options),
  obj = CPXDB[objid];
  obj._subtype = "lair";

  options = null;
  CPX.obj.closure(obj,opts);
  return obj._id;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Overland adventure, based upon the atlas subhex - 6 mi to a side : 93.53 sq mi each
CPX.overland = function (opts) {
  var map = CPX.obj(opts,[["realm",""],["atlas",{}]],["size"]);
  map._type = "overland";
  map.nex = 0;

  map.RNG = null;
  delete map.RNG;

  CPXDB[map._id] = map;
  return map._id;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.overland.display = function (opts) {
  //display overland
  CPX.display.overland(opts.map);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.overland.enterSite = function (site) {
  //move the unit here
  CPX.unit.move(CPXAU,CPX.unit.previousLocation(CPXAU),{map:site,site:site});
  //display site
  CPX.display.site(site);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on('click',"button.btn-store-recruit",function(e) {
  var type = $(this).attr("data-type"), sid = CPX.vue.site.id,
  site = CPXDB[sid], maxpop = Math.round(Math.pow(10,site.scale)*site.size);
  
  CPXTEMP[type]={};
  vNotify[type+"Cost"]= 0;
  $("."+type+"Cost").html("");

  var id = $(this).attr("data-id"), OBJ = {}, result = [], R={}, RI={}, html="", max=99, maxcheck=true;
  if(type == "recruit") { 
    OBJ = MINIONS; 
    if(id=="general")  { max=Math.round(maxpop*0.005); }
    else if(id=="special")  { max=Math.round(maxpop*0.001); }
  
    if(max<1){ maxcheck = false; }
  }
  else if (type == "store") { OBJ = GEAR; }
  
  if(maxcheck) {
    site[type].forEach(function(el) {
      //if basic pull data from GEAR or MINIONS
      if(objExists(el.basic)){
        for(var x in OBJ) {
          R = objCopy(OBJ[x]);

          if(R.class.includes("basic") && R.class.includes(id)) { 
            R.max = max;
            R.rank = 0;
            result.push(R); 
            
            if(type == "recruit" && max>10) {
              RI= objCopy(OBJ[x]);
              RI.max=Math.round(max/10);
              RI.rank = 1;  
              result.push(RI);
            }
          }
        }
      }
      //If template, pull speicfic item from GEAR or MINIONS, not in basic
      else if(objExists(el.template)) { 
        if(OBJ[el.template].class.includes(id)) { 
          R = objCopy(OBJ[el.template]);
          R.max = el.max;
          result.push(R); 
        } 
      }
      //otherwise pull the item from the map itself
      else if (el.class.includes(id)) { 
        R = OBJ[el];
        R.max = el.max;
        result.push(R); 
      }
    });
    
    html+='<div class=content>'
    result.forEach(function(el,i){
      html+='<div class="'+type+'" data-id="'+el.id+'" data-type="'+type+'" data-rank="'+el.rank+'">'+el.id;
      if(type=="recruit") { html+=' (Rank: '+el.rank+')'; }
      html+='<input class=qty type=number min=0 max='+el.max+'></input></div>';
    });
    html+='</div>'
    CPX.vue.site[type+"Data"] = html; 
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on('change',".qty",function(e) {
    var id=$(this).parent().attr("data-id"),
    type=$(this).parent().attr("data-type"),
    sid = CPX.vue.site.id,
    rank = $(this).parent().attr("data-rank"),
    site = CPXDB[sid],
    parent = "", pOBJ = {}, btnText="",
    cost=0, item={};
    //set the value of the temp store/recruit
    if(type=="store"){ parent = "store"; pOBJ = GEAR; btnText="Buy"; }
    else { parent = "recruit"; pOBJ = MINIONS; btnText="Recruit"; }  
    CPXTEMP[parent][id+rank] = {id:id,rank:rank,qty:$(this).val()};  
    
    //sum the cost
    for(var x in CPXTEMP[parent]){
      item = CPXTEMP[parent][x];
      if(objExists(pOBJ[item.id])) { cost+=pOBJ[item.id].cost*item.qty*Math.pow(10,item.rank); }
      else {
        //find the object in the site store/recruit
        var sobj = site[parent].filter(function(el){ 
          if (el.id == item.id) { return el; } 
        })[0];
        //sum the cost
        cost+=item.qty * sobj.cost; 
      }
    }
    CPX.vue.site[parent+"Cost"]= cost;
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on('click',"button.siteBuy",function(e) {
    var type=$(this).attr("data-type"), coin = CPX.vue.site[type+"Cost"];
    if(coin>CPXAU.coin) {
      var n = noty({
        layout:'center',
        type:'error',
        timeout: 1000,
        text: "You don't have that much coin."
      });
    }
    else {
      CPX.vue.site[type+"Cost"] = 0;
      CPX.vue.site[type+"Data"] = "";
      CPX.unit.buy(CPXAU,coin,type);
      CPXTEMP[type]={};
    }
});  
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on('click',"button.site ",function(e) {
  var id = $(this).attr("data-id");
  vNotify.show=false;

  //display a hexmap
  if(CPXDB[id]._type=="hexMap") {
    CPXAU.location=CPXDB[id].seed.concat([CPXDB[id]._zoneEnter]);
    CPX.display({map:CPXDB[id]});
  }
  //display a html site
  else {
    CPX.vue.site.open(CPXDB[id]);
    //CPX.display.site();
  }

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
