SPECTRAL = ['OBFKKMMMM','AFGKMMMMM','FGGKMMMMM','GGGKMMMMM','KKKKMMMMM','KMMMMMMMM','MMMMMMMMC','MMMMMMMST','MMMMMMCLY'];
HABSTARS= [['A','F','G','H'],[1,4,7,1]];
NSTARS = [1,1,1,1,2,2,2,2,3];
STARPROB = {
  cluster: [0.081,0.350],
  inner: [0.0013,0.197],
  basic: [0.0051,0.195],
  voids: [0,0.189],
}
STARS = {
  Habitable: "AFFFFGGGGGGGH", 
  Major:"AFFGGGGHHHHHHHHHJJJJJ", 
  Minor:"MMMMMMMMML",
  //Supertorrid,Torrid,Temperate,Frigid+
  O:{nP:-6},
  B:{nP:-4},
  A:[[1.5,3.7,9,36],"White",259.3,"white"],
  F:[[0.6,1.5,3.8,16],"Yellow White",310,"white"],
  G:[[0.35,0.8,2.5,10],"Yellow",386.5,"yellow"],
  H:[[0.1,0.25,0.65,4],"Orange",438.3,"orange"],
  J:[[0,0,0.01,0.05],"White Dwarf",374,"white"],
  L:[[0,0,0.01,0.05],"Brown Dwarf",1550,"brown"],
  M:[[0,0,0.01,0.05],"Red Dwarf",820,"red"],
  S:{nP:-4}
}; 
JOVIAN = {
  //Supertorrid,Torrid,Temperate,Frigid+
  Supertorrid: [[27,46,49,52,61,62,92],["SP","TP","HP","VP","AB","SJ","JJ","TJ"]],
  Torrid: [[27,46,49,50,59,62,92],["SP","TP","HP","VP","AB","SJ","JJ","TJ"]],
  Temperate: [[27,32,46,49,52,53,62,92],["SP","TP","NP","HP","AP","VP","AB","JJ","TJ"]],
  Frigid: [[32,41,59,92],["GP","AB","SJ","JJ","TJ"]]
}
NONJOVIAN = {
  //Supertorrid - Temperate Zone, Frigid+
  Temperate: ["SP","SP","SP","TP","TP","HP","VP","VP","AB","AB"],
  Frigid: ["GP","GP","GP","GP","GP","AB","AB","SJ","SJ","SJ"]
}
PLANETS = {
  SP:{name:"Selenian",mass:[0.01,0.03,0.1],d:[[2800,4400,6400],["1d4","1d6","1d8"],400]},
  TP:{name:"Terran",mass:[0.3,1],d:[[9600,12000],["1d6","1d8"],400]},
  HP:{name:"Hadean",mass:[3],d:[[15200],["1d20"],400]},
  VP:{name:"Vestan",mass:[10],d:[[23200],["1d6"],400]},
  NP:{name:"Nerean",mass:[0.3,1,1],d:[[9600,12000],["1d6","1d8"],400]},
  AP:{name:"Aquarian",mass:[3],d:[[18400],["1d12"],800]},
  GP:{name:"Glacian",mass:[0.01,0.01,0.01,0.03,0.03,0.1,0.1,0.3],d:[[2800,5200,6800,10400],["1d6","1d4","1d10","1d8"],400]},
  AB:{name:"Asteroid Belt",mass:[0.01,0.01,0.01,0.03,0.03,0.1]},
  SJ:{name:"Subjovian",mass:[[0.03,0.1],[1,1]],d:[[27500,78000],["1d20","1d20"],2250]},
  JJ:{name:"Jovian",mass:[[0.3,1,3],[3,3,2]],d:[[120000,138000],["2d6-2","1d1"],2000]},
  TJ:{name:"Transjovian",mass:[[10],[1]],d:[[140000],["1d1"],0]},
}

/*
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function sectorObject(guid,sid,n) {
  var sO={}, seed = guid+sid+n, cRNG = new RNG(seed),
    cell = Galaxies[guid].cells[sid],
    pR = galaxySectorLocation(guid,sid),
    basis = EXPLORE.random(cRNG), colors=[],
    discovery="", unique="", type="system", tags=[], options=[];

  if(basis.includes("I")){
    var I=["UF","NF","NF","NF","EV","EV","CR","CR","ST","ST","ST","ST"];
    discovery = I.random(cRNG);
    options.push(discovery);
    if(discovery=="EV" || discovery == "CR"){
      if(cRNG.TrueFalse()) { type = "space"; }
      if(discovery == "CR") { options.push("encounter"); }
    }
  }
  if(basis.includes("Q")){
    //giant, habitable, phenomenon, object
    var Q=["H","H","H","H","H","H","H","O","O","O","O","O","G","P"];
    unique = Q.random(cRNG);
    if(unique == "P"){ type = "phenomenon"; }
    else if(unique == "O"){ type = "object"; }
    else {
      options.push(unique);
    }
  }

  if(type=="system"){
    sO=system(seed,options);
  }
  else if(type=="object"){
    sO=system(seed,options);
  }
  else if(type=="phenomenon"){
    sO=system(seed,options);
  }
  else if(type=="space"){

  }

  sO.type=type;
  sO.tags=tags;

  if(basis.includes("T")){
    sO.CP = cosmicPower(seed);
    if(type=="encounter"){ sO.CP.regen = false; }
    if(type=="system"){ sO.CP.planet = cRNG.rndInt(1,sO.nP); }
    tags.push("CPX");
  }

  console.log(sO);
  return sO;
}
*/