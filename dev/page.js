/*
V 1.3
Move bars to page js
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-map-footer', { 
  props:['mapd','map'],
  template: '\
  <div class="box strong slim">\
    <div class="center">\
      <div class="btn-group" role="group" aria-label="...">\
        <button v-on:click="frontback" type="button" class="btn">{{mapd.front | capitalize}}</button>\
        <button v-on:click="zoom(-1)" type="button" class="btn">Z <span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>\
        <button v-on:click="zoom(1)" type="button" class="btn">Z <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>\
        <button v-on:click="mapd.minimal=!mapd.minimal" type="button" class="btn">\
          <span class="glyphicon" v-bind:class="isMinimal" aria-hidden="true"></span>Menu\
        </button>\
      </div>\
    </div>\
  <div>\
  ',
  methods: {
    frontback:function(){
      if(this.mapd.front=='front'){this.mapd.front='back';}
      else {this.mapd.front='front';}
    },
    zoom: function(n){
      if(this.map._hexradius==5 && n==-1){return;}
      if(n==1){this.map._hexradius+=5;}
      else {this.map._hexradius-=5};
      //identify bounds for display
      CPX.hexMap.bounds(this.map);
      //update after vue/canvas has been updated
      Vue.nextTick(this.display); 
    },
    display: function () {
      //send the vue to the display function
      CPX.display.hexMap(this.map);
    },
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//main menu bar
Vue.component('c-menubar', {
  props: ['id','show'],
  template:'<div class="btn-group btn-group-justified top-header" role="group">'+
  '<div class="btn-group" role="group" v-if="show.new"><button @click="new" type="button" class="btn btn-info">New</button></div>'+
  '<div class="btn-group" role="group" v-if="show.load"><button @click="load" type="button" class="btn btn-info">Load</button></div>'+
  '<div class="btn-group" role="group" v-if="show.save"><button @click="save" type="button" class="btn btn-info">Save</button></div>' +
  '<div class="btn-group" role="group" v-if="show.close"><button @click="close" type="button" class="btn btn-info">Close</button></div></div>',
  methods: {
    new: function (){ HUB.$emit(this.id+'-new',''); },
    close: function (){ HUB.$emit(this.id+'-close',''); },
    save: function (){ HUB.$emit(this.id+'-save',''); },
    load: function (){ HUB.$emit(this.id+'-showload',''); }
  }
})
//Load select tool for loading data
Vue.component('c-loadselect', { 
  props:['id','list','show'],
  template: '\
  <div class="center content" v-show="show"><select v-model="loadID">\
  <option class="center" v-for="(key,val) in list" v-bind:value="key">{{val}}</option> </select>\
  <button v-on:click="load" type="button" class="btn btn-info">Load</button></div>\
  ',
  data: function () {
    return {
      loadID: ''
    }
  },
  methods: {
    load: function () {
      var VU = this;
      CPXSAVE.getItem(this.loadID).then(function(obj) {
        HUB.$emit(VU.id+'-loadObj',obj);
      });
    }
  }
})


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
      this.allgens = {};
      vMainMenu.open();
    }
  }
})
