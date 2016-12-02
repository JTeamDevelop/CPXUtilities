/* Version 0.1
  Added to dev 
*/

CPX.CPI = {}
CPX.CPI.template = {
  _id:'',
  seed:[],
  name:'',
  notes:'',
  zones:[{name:'',notes:'',explored:0,secured:false}]
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpi-zone', { 
  props: ['Z','i'],
  template: '\
  <div class="box center bottom-pad pwd-area" v-bind:class="{ secured: Z.secured }">\
    <h4 class="header">\
      {{Z.name}}<span v-if="Z.name.length==0">Zone {{i+1}}</span>\
      <button v-on:click="remove" type="button" class="close">\
        <span aria-hidden="true">&times;</span>\
      </button>\
    </h4>\
    <input class="form-control input-lg center" type="text" v-model="Z.name" placeholder="NAME">\
    <div class="input-group">\
      <span class="input-group-addon" id="pwd-addon-i">Notes</span>\
      <textarea class="form-control" type="textarea" v-model="A.notes" placeholder="INFO"></textarea>\
    </div>\
    <div class="center">\
      <button v-on:click="explore" type="button" class="btn btn-info">Explore ({{Z.explored}})</button>\
      <input type="checkbox" v-model="A.explored" > Explored\
    </div>\
  </div>\
  ',
  methods:{
    remove: function(){
      HUB.$emit('CPI-remove',this.i)
    },
    explore: function() {
      this.Z.explored++;
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpi', { 
  template: '<div>'+
  '<h2 class="center">CPX Incursion Builder</h2>'+
  '<c-menubar id="CPI" v-bind:show="showmenu"></c-menubar>'+
  '<c-loadselect id="CPI" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>'+
  '<div class="content">'+
    '<input class="form-control input-lg center" type="text" v-model="area.name" placeholder="NAME">'+
    '<textarea class="form-control" type="textarea" v-model="area.notes" placeholder="ADD NOTES"></textarea>'+
  '</div>'+
  '<button v-on:click="add" type="button" class="btn btn-info">Add Zone Map</button>'+
  '<h4 class="center bar-bottom">Zones '+
    '<button v-on:click="add" type="button" class="btn btn-sm">'+
      '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'+
    '</button>'+
  '</h4>'+
  '<c-cpi-zone v-for="zone in content.zones" v-bind:Z="zone" v-bind:i="$index"></c-cpi-zone></div>',
  data: function () {
    return {
      vid: 'CPI',
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {load:false},
      content: {},
      allgens: {}
    }
  },
  //called when created
  created: function () {
    CPX.vue.page.onCreated(this);
  },
  beforeDestroy: function () {
    CPX.vue.page.onBeforeDestroy(this);
  },
  methods: {
    remove: function(i){
      this.content.zones.splice(i,1);
    },
    add: function () {
      this.content.zones.unshift({name:'',notes:'',explored:0,secured:false});
    },
    save: function () {
      CPXSAVE.setItem(this.content._id,this.content).then(function(){});
      if(!objExists(this.allgens[this.content._id])){
        Vue.set(this.allgens, this.content._id, this.content.name);
      }
    },
    load: function (I) {
      this.content = I;
    },
    new : function () { 
      this.content = objCopy(CPX.CPI.template);
      this.generate();
    },
    generate: function () {
      this.content.seed = ['CPI','-',CPXC.string({length: 27, pool: base62})];
      this.content._id = this.content.seed.join('')
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.content = {};
      this.allgens = {};
    }
  }
})