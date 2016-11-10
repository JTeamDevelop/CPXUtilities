///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-ogl', { 
  template: "#OGL",
  methods: {
    close: function() { CPX.vue.page.close(); },
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-txt', { 
  template: "#about",
  methods: {
    close: function() { CPX.vue.page.close(); },
    showOGL: function() { 
      CPX.vue.page.show=false;
      CPX.vue.page.open('c-ogl','wide'); 
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Setup for the page vue - call open and provide the header and content 
CPX.vue.page = new Vue({
  el: '#cpxpage',
  data: {
    show: false,
    width: '',
    currentView: '',
  },
  methods: {
    onCreated: function (VU) {
      //calls the loadall function to pull saved data
      var load = VU.vid;
      //if there is an array pass it to load multiple types
      if(objExists(VU.loadids)) { load = VU.loadids; }
      this.loadall(load).then(function(list){
        VU.allgens = list;
      })
      //make new 
      VU.new();
      //set up event listeners
      HUB.$on(VU.vid+'-new', VU.new);
      HUB.$on(VU.vid+'-close', VU.close);
      HUB.$on(VU.vid+'-save', VU.save);
      HUB.$on(VU.vid+'-loadObj', VU.load);
      HUB.$on(VU.vid+'-remove', VU.remove);
      HUB.$on(VU.vid+'-add', VU.add);
      HUB.$on(VU.vid+'-mod', VU.mod);
      HUB.$on(VU.vid+'-showload', function(){
        VU.showlist.load = !VU.showlist.load;
      });
    },
    // It's good to clean up event listeners before
    // a component is destroyed.
    onBeforeDestroy: function (VU) {
      HUB.$off(VU.vid+'-new', VU.new);
      HUB.$off(VU.vid+'-close', VU.close);
      HUB.$off(VU.vid+'-save', VU.save);
      HUB.$off(VU.vid+'-loadObj', VU.load);
      HUB.$off(VU.vid+'-remove', VU.remove);
      HUB.$off(VU.vid+'-add', VU.add);
      HUB.$off(VU.vid+'-mod', VU.mod);
      HUB.$off(VU.vid+'-showload', function(){
                VU.showlist.load = !VU.showlist.load;
              });
    },
    //pull all the data from the IndexedDB - using localforage
    loadall: function (vid){
      return new Promise(function(resolve,reject){
        var list = {};
        CPXSAVE.iterate(function(value, key, idx){
          //check if an arrai of ids is provided
          if(Array.isArray(vid)){
            //if it is an array loop through ids
            vid.forEach(function(el) {
              //check the key
              if(key.includes(el+'-')){
                list[key] = value.name;  
              }  
            });
          }
          //otherwise use the id provided
          else{
            if(key.includes(vid+'-')){
              list[key] = value.name;  
            }
          }
        }).then(function() {
          resolve(list);
        });
      });  
    },
    newGen : function (VU) { 
      //randomly creates the seed for generating content
      VU.seed = [VU.vid,'-',CPXC.string({length: 21, pool: base62})];
      //calls generate
      VU.generate();
    },
    open: function(view,width){
      this.show = true;
      this.currentView = view;
      this.width = width;
    },
    //close opens mainmenu
    close: function() {
      this.show = false;
      this.currentView = '';
      this.genobject = {};
      this.allgens = [];
      vMainMenu.open();
    }
  }
})
