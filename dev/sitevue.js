///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('site-store', CPX.option({text:"Resupply",classes:["siteAction","btn-info","btn-lg","btn-block"],data:[["actid","store"]]}) +
'<div class=siteStore><div class="btn-group btn-group-justified" role="group">' +
'<div class="btn-group" role="group">'+CPX.option({text:"Gear",classes:["btn-store-recruit"],data:[["id","gear"],["type","store"]]})+'</div>' +
'<div class="btn-group" role="group">'+CPX.option({text:"Weapons",classes:["btn-store-recruit"],data:[["id","weapon"],["type","store"]]})+'</div>' +
'<div class="btn-group" role="group">'+CPX.option({text:"Armor",classes:["btn-store-recruit"],data:[["id","armor"],["type","store"]]})+'</div>' +
'<div class="btn-group" role="group">'+CPX.option({text:"Special",classes:["btn-store"],data:[["id","special"],["type","store"]]})+'</div>' + 
'</div><div class=storeData>{{{storeData}}}</div><div class="center" v-if="storeCost > 0">Cost: {{storeCost}} coin'+
CPX.option({text:"Buy",classes:["siteBuy","btn-info","btn-lg"],data:[["type","store"]]})+'</div></div>');
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('site-recruit', CPX.option({text:"Recruit",classes:["siteAction","btn-info","btn-lg","btn-block"],data:[["actid","recruit"]]}) +
'<div class=siteRecruit><div class="btn-group btn-group-justified" role="group">' +
'<div class="btn-group" role="group">'+CPX.option({text:"General",classes:["btn-store-recruit"],data:[["id","general"],["type","recruit"]]})+'</div>' +
'<div class="btn-group" role="group">'+CPX.option({text:"Specialized",classes:["btn-store-recruit"],data:[["id","special"],["type","recruit"]]})+'</div>' +
'</div><div class=recruitData>{{{recruitData}}}</div><div class="center" v-if="recruitCost > 0">Cost: {{recruitCost}} coin'+
CPX.option({text:"Buy",classes:["siteBuy","btn-info","btn-lg"],data:[["type","recruit"]]})+'</div></div>');
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.partial('site-view', '<div><h3 class="header center">{{header}}</h3></div>' +
    '<div class="content"><div class="center">{{people}}</div><div v-if="options.length>0">'+
    '<h3 class="center">Actions</h3><div class=actions>'+
    '<button class="btn btn-info btn-block btn-lg" v-for="o in options" v-on:click="option(o.id)">{{o.text}}</button>'+
    '<div v-if="subsites.length>0"><h4 class="strong center font-lg">Explore Sub-sites</h4>'+
    '<button class="btn btn-info btn-block btn-lg" v-for="s in subsites" v-on:click="subEnter($index)">{{s.name}} ({{scaletext[s.scale-2]}})</button></div>' +
    '<div class="top-pad" v-show="showResupply"><partial name="site-store"></partial></div>'+
    '<div class="top-pad" v-show="showRecruit"><partial name="site-recruit"></partial></div>'+
    '</div></div>'+
    '<div class="top-pad"><partial name="notify-close"></div></div>');
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.vue.site = new Vue({
  el: '#siteView',
  data: {
    id: "",
    show: false,
    showResupply: false,
    showRecruit: false,
    showClose: true,
    closeText:'Exit',
    content:'',
    options:[],
    subsites:[],
    scaletext:['Huge','Gigantic','Colossal'],
    storeData: "",
    recruitData: "",
    storeCost:0,
    recruitCost:0
  },
  computed: {
    // a computed getter
    site : function () { return CPXDB[this.id]; },
    people : function () {
      var maxsize = Math.round(Math.pow(10,this.site.scale)*this.site.size);
      if(this.site.class.includes("city") || this.site.class.includes("order")) {
        return 'People: '+this.site.people.people.join(", ")+' (pop: '+maxsize+')'; 
      }
    },
    header : function () {
      var scaletitle = ["Settlement","Hamlet","Village","Town","City","Large City"];
      if(this.site.class.includes("city")){
        return this.site.name+' ('+scaletitle[this.site.scale-1]+')';
      }
      else {
        return this.site.name;
      }
    }
  },
  // define methods under the `methods` object
  methods: {
    subEnter: function (idx){
      var sub=this.site.subsites[idx], seed = this.site.seed.concat(["b",idx]),
      sid = seed.join('');
      
      if(!objExists(CPXDB[sid])) {
        var options = objCopy(sub);
        options.class = CPXDB[this.id].class.concat([]);
        options.seed = seed; 
        options.parent = [CPXDB[this.id]];
  
        CPX.hexMap(options);
        CPXDB[sid].class = this.site.class.concat([]);  
      }

      CPX.unit.move(CPXAU,CPXDB[sid].seed.concat([CPXDB[sid]._zoneEnter]));
      
      this.close();
      CPX.display({map:CPXDB[sid]});
      footer.showExit = true;
      footer.exitMap = seed.slice(0,3).join("");
    },
    close: function (){
      this.show = false;
      this.showResupply = false;
      this.showRecruit = false;
      this.options = [];
      this.id = "";
    },
    option: function (hid) {
      if(hid == "help"){
        if(CPXAU.AP<1) {
          var n = noty({layout:'center',type:'error',timeout: 1000,text: "You don't have the AP."});  
        }
        else {
          CPX.vue.help.open(CPXDB[this.id]);
          this.close();
        }
      }
      if(hid == "rest"){
        CPX.unit.change(CPXAU,{"AP":-1});
        CPX.unit.fullHP(CPXAU);
      }
    },
    open : function (site) {
      var VU=this;
      this.id = site._id;
    
      var actname= {
        help: "Help", rest: "Rest & Recover", store: "Resupply", recruit: "Recruit", explore: "Explore"
      }
      
      this.site.actions.forEach(function (S) {
        VU.options.push({id:S,text:actname[S]});
      });
      if(objExists(this.site.store)){ this.showResupply = true; }
      if(objExists(this.site.recruit)){ this.showRecruit = true; }

      this.subsites = this.site.subsites;

      this.show = true;
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on('click',"button.siteAction",function(e) {
  var actid = $(this).attr("data-actid");
  if(actid == "store"){ CPX.vue.site.storeData = ''; }   
  if(actid == "recruit"){ CPX.vue.site.recruitData = ''; }  
});