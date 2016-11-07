CPX.AB = {}
CPX.AB.template = {
  _id:'',
  seed:[],
  name:'',
  notes:'',
  areas:[{name:'',notes:'',explored:false}]
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cab-area', { 
  props: ['A','i'],
  template: '\
  <div class="box center bottom-pad pwd-area" v-bind:class="{ explored: A.explored }">\
  <h4 class="header">{{A.name}}<span v-if="A.name.length==0">Area {{i+1}}</span>\
  <button v-on:click="remove" type="button" class="close"><span aria-hidden="true">&times;</span></button>\
  </h4>\
  <input class="form-control input-lg center" type="text" v-model="A.name" placeholder="NAME">\
  <div class="input-group">\
  <span class="input-group-addon" id="pwd-addon-i">Notes</span>\
  <textarea class="form-control" type="textarea" v-model="A.notes" placeholder="INFO"></textarea>\
  </div>\
  <div class="center"><input type="checkbox" v-model="A.explored" > Explored</div>\
  ',
  methods:{
    remove: function(){
      HUB.$emit('CAB-remove',this.i)
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cab', { 
  template: '<div>'+
  '<h2 class="center">CPX Area Builder</h2>'+
  '<c-menubar id="CAB" v-bind:show="showmenu"></c-menubar>'+
  '<c-loadselect id="CAB" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>'+
  '<div class="content"><input class="form-control input-lg center" type="text" v-model="area.name" placeholder="NAME">'+
  '<textarea class="form-control" type="textarea" v-model="area.notes" placeholder="ADD NOTES"></textarea></div>'+
  '<h4 class="center bar-bottom">Areas '+
  '<button v-on:click="addArea" type="button" class="btn btn-sm"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>'+
  '</h4>'+
  '<c-cab-area v-for="area in area.areas" v-bind:A="area" v-bind:i="$index"></c-cab-area></div>',
  data: function () {
    return {
      vid: 'CAB',
      showmenu:{
        new:true,
        load:true,
        save:true,
        close:true
      },
      showlist: {load:false},
      area: objCopy(CPX.AB.template),
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
      this.area.areas.splice(i,1);
    },
    addArea: function () {
      this.area.areas.unshift({name:'',notes:'',explored:false});
    },
    save: function () {
      CPXSAVE.setItem(this.area._id,this.area).then(function(){});
      if(!objExists(this.allgens[this.area._id])){
        Vue.set(this.allgens, this.area._id, this.area.name);
      }
    },
    load: function (A) {
      this.area = A;
    },
    new : function () { 
      this.area = objCopy(CPX.AB.template);
      this.generate();
    },
    generate: function () {
      this.area.seed = ['CAB','-',CPXC.string({length: 21, pool: base62})];
      this.area._id = this.area.seed.join('')
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.area = {};
      this.allgens = [];
    }
  }
})