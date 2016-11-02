var SAVEUNITS = localforage.createInstance({ name: "units", storeName: "CPXunits" });
var CPXSAVE = localforage.createInstance({ name: "CPXSave", storeName: "CPXsave" });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.save={};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.save.mods = function (realm) {
  var moddb = realm.mods;
  moddb.find({},function(err,docs){
    if (err == null) {
      SAVEMODS.setItem(realm._id,docs);
    }
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.save.realm = function (realm) {
  SAVEREALMS.setItem(realm._id,realm.opts);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.save.unit = function (unit) {
  SAVEUNITS.setItem(unit._id,unit).then(function(){
    CPX.vue.AU.showVue(CPXAU);
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.save.user = function () {
  USER.find({},function(err,docs){
    if (err == null) {
      SAVEUSER.setItem("user",docs);
    }
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.mod = {};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.mod.find = function (map) {
  var realmid = map.seed[0], modid = "",
  moddb = CPXDB[realmid].mods;

  if(map.seed.length==1) { modid = "realm"; }
  else { modid = map.seed.slice(1).join(""); }
  var query = {_id:modid};

  return new Promise(function(resolve,reject){
    moddb.findOne(query,function(err,doc){
      if (err == null) {
        // Resolve the promise with the doc
        if(doc==null) { resolve({}); }
        else { resolve(doc); } 
      }
      else {
        // Otherwise reject with the status text
        reject(err);
      }
    });    
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.mod.add = function (map,mod) {
  var realmid = map.seed[0], modid="";
  moddb = CPXDB[realmid].mods, modtype=mod[1], modO={};
  modO[mod[0]]=mod[2];

  if(map.seed.length==1) { modid = "realm"; }
  else { modid = map.seed.slice(1).join(""); }

 if(modtype=="inc"){
   moddb.update({_id:modid},
   {$inc : modO},
   {upsert:true},function(err, numAffected, affectedDocuments, upsert){
     CPX.save.mods(CPXDB[realmid]);
   });
 }
 else if(modtype=="set"){
   moddb.update({_id:modid},
   {$set : modO},
   {upsert:true},function(err, numAffected, affectedDocuments, upsert){
     CPX.save.mods(CPXDB[realmid]);
   });
 }
 else if(modtype=="addtoset"){
   moddb.update({_id:modid},
   {$addToSet : modO},
   {upsert:true},function(err, numAffected, affectedDocuments, upsert){
     CPX.save.mods(CPXDB[realmid]);
   });
 }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.user.updateVisible = function (map,location) {
  if(!map.visible.includes(location)) { map.visible.push(location); }
  //create promise to return to function when done
  return new Promise(function(resolve,reject){
    var query = {_id:map.seed[0]}, mid= map.seed.slice(1).join("")+".visible", vloc = {};
    vloc[mid] = location;

    USER.update(query,
    {$addToSet : vloc},
    {upsert:true},function(err, numAffected, affectedDocuments, upsert){
      CPX.save.user();
      resolve("true");
    });
  })
}
CPX.user.visible = function (map) {
  mid= map.seed.slice(1).join("");

  return new Promise(function(resolve,reject){
    USER.findOne({ _id: map.seed[0] },function(err,doc){
      if (err == null) {
        // Resolve the promise with the doc
        //if no doc - no visible
        if(doc==null){ resolve([]); }
        //if doc there may be visible
        else if (objExists(doc[mid])){ 
          //if doc has visible return it
          if(objExists(doc[mid].visible)) {resolve(doc[mid].visible); }
          else { resolve([]); }
        }
        else { resolve([]); }
      }
      else {
        // Otherwise reject with the status text
        reject(err);
      }
    });    
  });  
}

CPX.allHeroes = function(){
  return new Promise(function(resolve,reject){
    var list = [];
    SAVEUNITS.iterate(function(value, key, idx){
      list.push([key,value.name]);
    }).then(function() {
      resolve(list);
    });
  });  
}