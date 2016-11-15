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
var vMainMenu = new Vue({
  el: '#mainmenu',
  data: {
    show: false,
  },
  methods: {
    open: function(){
      this.show = true;
    },
    About: function(){
      this.show = false;
      CPX.vue.page.open('c-txt','wide');
    },
    hexArea: function(){
      this.show = false;
      CPX.vue.page.open('c-cha','');
    },
    cityGen: function(){
      this.show = false;
      CPX.vue.page.open('c-cfp','slim');
    },
    areaBuilder: function(){
      this.show = false;
      CPX.vue.page.open('c-cab','slim');
    },
    CephGen: function(event) {
      this.show = false;
      CPX.vue.page.open('c-chs','slim');
    },
    PWDGen: function(){
      this.show = false;
      CPX.vue.page.open('c-pwd','slim');
    },
    PandCGen: function(){
      this.show = false;
      CPX.vue.page.open('c-pnc','slim');
    },
    fpGen: function(event) {
      this.show = false;
      CPX.vue.page.open('c-fpg','slim');
    },
    clearAllData: function(){
      var header = 'Clear All Saved Data';
      var content = '<div class="center">This will clear all saved data (heroes, generated content, etc.) - everything. </br>Are you sure?</div>';
      
      CPX.vue.notify.open(header,content,false,'c-deleteall');
      CPX.vue.notify.deleteall = true;
    },
    close: function(event) {
      this.show = false;
    }
  }
})
