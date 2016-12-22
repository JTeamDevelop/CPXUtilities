CPX.web = function(){
  var times = ['year','month','week','day'],
  n = CPXC.diceSum('3d6')+4, 
  count = {
    'year':0,'month':0,'week':0,'day':0
  }
  d = new Date();
  
  var web = [], type='', cd='', week=0;
  for(var i=0;i<n;i++){
    type = (CPXC.weighted(times,[1,1,1,1]));
    
    if(type=='year'){
      cd = new Date(d.getFullYear(),0,0);
    }
    if(type=='month'){
      cd = new Date(d.getFullYear(),d.getMonth(),0);
    }
    if(type=='week'){
      week = Math.floor(d.getDate()/7)*7;
      cd = new Date(d.getFullYear(),d.getMonth(),week);
    }
    if(type=='day'){
      cd = new Date(d.getFullYear(),d.getMonth(),d.getDate());
    }
    web.push([type,cd.getTime(),base62[count[type]]]);
    
    count[type]++;
  }
  
  return web;
}