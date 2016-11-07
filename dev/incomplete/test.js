// 0 = 46, 46, 8
// 1 = 55, 35, 10
// 2 = 64, 26, 10
// 3 = 70, 22, 8
// 4 = 71, 23, 6
function diceTest (a,b) {
  var n=2000, p=100/n, aw=0, bw=0, t=0, ar=0, br=0, 
  ad=DIERANKS[a[0]].concat(DIERANKS[a[1]]), bd=DIERANKS[b[0]].concat(DIERANKS[b[1]]);
  
  for(var i=0;i<n;i++){
    ar = 0; br=0; 
    ad.forEach(function(el){ ar+=CPXC.diceSum(el); })
    bd.forEach(function(el){ br+=CPXC.diceSum(el); })
    if(ar==br) {t++;}
    else if(ar>br) {
      if(ar/br < 1) {t++}
      else {aw++}
    }
    else {
      if(br/ar < 1) {t++}
      else {bw++}
    }
  }
  return [aw*p,bw*p,t*p];
}
function DWDTest (a,b) {
  var n=2000, p=100/n, aw=0, bw=0, t=0, ar=0, br=0; 
   
  for(var i=0;i<n;i++){
    ar = CPXC.DW(); br=CPXC.DW(); 
    a.forEach(function(el){ ar+=el; })
    b.forEach(function(el){ br+=el; })
    if(ar<br) {bw++;}
    else if(ar-br<3) { t++; }
    else { aw++; }
  }
  return [aw*p,bw*p,t*p];
}
function DWTest (a,b) {
  var n=2000, p=100/n, aw=0, bw=0, t=0, ar=0, br=0; 
   
  for(var i=0;i<n;i++){
    ar = CPXC.DW(); br=CPXC.DW(); 
    a.forEach(function(el){ ar+=el; })
    b.forEach(function(el){ ar-=el; })
    if(ar<7) {bw++;}
    else if(ar<10) { t++; }
    else { aw++; }
  }
  return JSON.stringify([[aw*p,bw*p,t*p],DWDTest(a,b)]);
}

function makeFight(){
  var F = CPX.challenge.buildFight({name:'Dwarf',rank:0,special:[],nappearing:'group'});
  CPX.vue.fight.open({foes:F,heroes:[CPXAU],neutrals:[]},{});  
}

