var TROUBLE = [
/*  categories: ["disorder","uprising","poverty","education","despair","corruption"],
  "disorder": ["raiders","wildlife","monsters","thugs","gangs","lurkingoutsiders","cult"],
  "uprising": ["darkwizard","outsiders","exiledlord","murderousheirs","thugs","monsters"],
  "poverty": ["barren","contaminated","extremepoverty","harshconditions","inaccessible","hunger","damaged","undeveloped"],
  "education" : ["hazardousresource","sickness","toxicprocess","wastedproduction"],
  "despair": ["classhatred","crushedspirits","demagogue","disunity"],
  "corruption": ["corruptleaders","mob","secretsociety","cult"],
*/
  //disorder
  {id:"raiders",cat:"disorder",text:"Raiders routinely harrass the populace."},
  {id:"monsters",cat:"disorder",text:"Monsters lurk in the wilds."},
  {id:"wildlife",cat:"disorder",text:"The beasts of the regions have no fear."},
  {id:"gangs",cat:"disorder",text:"Gang violence can't be stopped, and innocents are being hurt."},
  {id:"thugs",cat:"disorder",text:"Gangs of thugs are making it hard to do honest beisness."},
  {id:"lurkingoutsiders",cat:"disorder",text:"Something is lurking in the town, and the people are restless."},
  {id:"cult",cat:"disorder",text:"A cult has risen in power.  Their god and their worship is unsetteling the people, but they're afraid to act."},
  //uprising
  {id:"darkwizard",cat:"uprising",text:"A wizard in the area is practicing dark arts and plaguing the people."},
  {id:"exiledlord",cat:"uprising",text:"A warlord and his force are approaching. If they don't surrender, the warlord will burn the town to the ground."},
  {id:"outsiders",cat:"uprising",text:"Beings from beyond are lurking in the wilds and preying upon the people."},
  //poverty
  {id:"barren",cat:"poverty",text:"Times are hard, and the land is not yeilding what it used to."},
  {id:"contaminated",cat:"poverty",text:"The land has been tainted by strange power."},
  {id:"extremepoverty",cat:"poverty",text:"Continued hardships have reduced the people to poverty. THere's nothing here help them recover."},
  {id:"inaccessible",cat:"poverty",text:"The town is simply hard to reach - you're amazed you found it.  They need help taiming the wilds and developing roads."},
  {id:"hunger",cat:"poverty",text:"Droughts have make food scarce and the people are hungry."},
  {id:"damaged",cat:"poverty",text:"Recent storms have left numerous houses and buildings in ruins."},
  {id:"undeveloped",cat:"poverty",text:"The area has potential, but it needs a lot of work, and the locals need your help."},
  //education
  {id:"hazardousresource",cat:"education",text:"The resources that the people depend upon are actually hazardous, and the locals are suffering."},
  {id:"sickness",cat:"education",text:"A plague has settled on the town. People only stay well for a short time before falling ill again."},
  {id:"toxicprocess",cat:"education",text:"Some livelihood of the people is actually posioning them."},
  {id:"wastedproduction",cat:"education",text:"They are spending a lot of effort to make very little - there's got to be a better way."},
  //despair
  {id:"classhatred",cat:"despair",text:"Two factions are bitter enemies, and the constant conflicts are tearing the town apart."},
  {id:"crushedspirits",cat:"despair",text:"The people have suffered hardship for too long. They lack the will to carry on."},
  {id:"demagogue",cat:"despair",text:"Someone has snared the majority of the people with sweet words and false promises."},
  {id:"disunity",cat:"despair",text:"Everyone is holding a grudge, no one can agree on anything. And anyone who visists doesn't stay long."},
  //corruption
  {id:"corruptleaders",cat:"corruption",text:"Corruption is rempant amongst the elite. The people need your help exposing and removing them from power."},
  {id:"mob",cat:"corruption",text:"Mobs rule the town and the people can't do buisness without answering to them."},
  {id:"secretsociety",cat:"corruption",text:"There is a power behind the throne and they don't want to let go of the reigns."}
];
var TROUBLESKILLS = {
  "disorder":[["Fight","Shoot"],["Investigate","Athletics","Physique","Provoke"],["Resources","Stealth","Will"]],
  "uprising":[["Fight","Shoot","Athletics","Physique"],["Will","Provoke","Investigate","Stealth"],["Resources"]],
  "poverty":[["Resources","Contacts"],["Rapport","Crafts"],["Physique"]],
  "education":[["Rapport","Contacts"],["Crafts","Lore","Resources"],["Empathy","Investigate"]],
  "despair":[["Rapport","Empathy"],["Contacts","Will"],["Resources"]],
  "corruption":[["Investigate","Notice","Contacts"],["Burglary","Deceive","Provoke","Resources","Stealth"],["Fight","Physique","Shoot","Will"]],
}

CPX.quest = function (map) {
  var type = CPXC.pickone(["defeat","find","save"]);
  //goto, defeat/find, obj

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('site-trouble', CPX.option({text:"Help",on:"troubleHelp",classes:["troubleHelp","btn-info","btn-lg","btn-block"]}));
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('trouble-view', '<div><h3 class="header center">{{header}}</h3></div>' +
    '<div class="content center font-lg">{{{content}}}'+
    '<div v-show="time>0">(It will take ~{{time}} days)'+
    '<div>Requires {{scale+1}} successes. ({{pass}} currently)</div></div></div>'+
    '<div class="center strong font-lg" v-show="time>0">Overcome using...</div><div class="content">'+
    '<button class="btn btn-info btn-block" v-for="o in overcomes" v-on:click="test(o.skill)">{{o.skill}} ({{o.val}})</button>'+
    '<partial name="notify-close"></div>');
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.vue.help = new Vue({
  el: '#helpPop',
  data: {
    id: "",
    show: false,
    showClose: true,
    trouble: {},
    scale : 0,
    pass : 0,
    fail : 0,
    time:0,
    header:'',
    content:'',
    overcomes: [],
    closeText:''
  },
  // define methods under the `methods` object
  methods: {
    failTest: function () {
      this.fail++;
      //reduce HP for the effort, but add xp
      CPX.unit.change(CPXAU,{"XP":0.5,"HP":-1});  
      //announce
      var n = noty({layout:'center',type:'error',timeout: 1000,text: 'Failure!'});
      //redo the skill list;
      this.skillList();
    },
    passTest: function (R) {
      this.pass++;
      if(R > 9) { this.pass+=0.5; }
      if(R > 10) { this.pass+=0.5; }
      //announce
      var n = noty({layout:'center',type:'success',timeout: 1000,text: 'Success!'});
      //Award XP
      CPX.unit.change(CPXAU,{"XP":0.5});
      //check if more successes are needed
      if(this.pass>=this.scale+1){ 
        //full success - push mod
        CPX.mod.add(CPXDB[this.id],["help","inc",Math.pow(10,2+this.scale-CPXDB[this.id].scale)]);
        this.close(); 
      }
      //redo the skill list
      else { this.skillList(); }
    },
    test: function (test) {
      var slist = TROUBLESKILLS[this.trouble.cat], bonus=0, sval=CPX.unit.skillVal(CPXAU,test);
      slist.forEach(function(el,idx){
        if(el.includes(test)) { bonus = 1-idx; }
      })

      //Account for time - it is an average considering number of successes and 25% failure
      CPX.unit.change(CPXAU,{"AP":(-this.time/(this.scale+1)/1.25)});
      var TR = CPXC.rpg('2d6', {sum: true})+bonus+sval;
      //DungeonWorld roll, if better than difficulty
      if(TR >= 7) { this.passTest(TR); }
      else { this.failTest(); }
    },
    skillList: function() {
      var skills = TROUBLESKILLS[this.trouble.cat], s="", list=[];
      for(var i=0;i<3;i++){
        s = CPXC.pickone(skills[i]);
        list.push({
          skill:s,
          val:CPX.unit.skillVal(CPXAU,s)
        });
      }
      this.overcomes = CPXC.shuffle(list);
    },
    noHelp : function () { this.content= 'The locals appreciate your offer, but things are currently peaceful.'; },
    needHelp : function (idx) {
      var map = CPXDB[this.id], realm = CPXDB[map.seed[0]];
      var t = {
        RNG : new Chance(map.seed.concat(["t",idx,realm.time]).join(""))
      } 
      this.trouble = objCopy(t.RNG.pickone(TROUBLE));
      //time it takes to solve the trouble
      //TODO: include unit scale
      var time = 1, scale =0, maxscale=map.scale-1;
      if(maxscale<0) {maxscale = 0};
      scale = t.RNG.natural({min:0,max:maxscale});

      if(scale==0){ time = CPXC.d4()+1; }
      else if(scale==1){ time = CPXC.normal({mean: 10, dev: 2}); }
      else if(scale==2){ time = CPXC.normal({mean: 30, dev: 5}); }
      else if(scale==3){ time = CPXC.normal({mean: 60, dev: 5}); }
      this.time=Math.round(time);
      this.scale=scale;

      t.RNG = null;
      delete t.RNG;
      this.content= this.trouble.text;
      this.skillList();
    },
    open: function(map) {
      this.id=map._id;
      this.header = 'Help '+map.name;
      this.closeText = 'Leave '+map.name;
      this.scale = 0; this.time = 0;

      var VU = this;
      //pull the mods to see if they need help 
      CPX.mod.find(map).then(function(mods){
        //if there are no mods - they need help
        if(mods!=null){
          //if there are mods - and help is one, they've been helped in the past
          if(objExists(mods.help)){
            //if help is above 5-7%, no help is needed
            if(mods.help >= CPXC.integer({min:5,max:7})) { VU.noHelp(); }
            //else they need help
            else { VU.needHelp(mods.help); }
          }
        }
        //no mods = help needed
        else { VU.needHelp(0); }

        VU.show=true;
      })
    },
    close: function() {
      this.pass = 0;
      this.fail = 0;
      this.overcomes = [];
      this.trouble={};
      this.show = false;
    }
  } 
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
