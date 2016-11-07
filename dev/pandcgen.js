///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc-result', { 
  props: ['object','allgens','idx'],
  template: '\
  <div class="box margin-full">\
  <h4 class="header center">{{object.class[0] | capitalize}} ({{object.rank | capitalize}})\
  <button v-on:click="remove" type="button" class="close"><span aria-hidden="true">&times;</span></button>\
  </h4>\
  <div class="bar-bottom pad-bottom content">\
  <input class="form-control input-lg center" type="text" v-model="object.name" placeholder="NAME">\
  <textarea class="form-control" type="textarea" v-model="object.notes" placeholder="ADD NOTES"></textarea>\
  </div>\
  <div class="content">\
  <div v-if="object.class.length>1"><strong>Nature: </strong>{{nature | capitalize}}</div>\
  <div v-if="object.special.length>0"><strong>Tags:</strong> {{object.special.unique().join(", ") | capitalize}}</div>\
  <button v-on:click="save" type="button" class="btn btn-info btn-block">Save</button>\
  </div></div>\
  ',
  computed: {
    nature: function(){
      return this.object.class.slice(1).unique().join(", ");
    }
  },
  methods:{
    save: function(){
      CPXSAVE.setItem(this.object._id,this.object).then(function(){});
      if(!objExists(this.allgens[this.object.id])){
        Vue.set(this.allgens, this.object._id, this.object.name);
      }
    },
    remove: function(){
      HUB.$emit('CPC-remove',this.idx);
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-pnc', { 
  template: '\
  <div>\
  <h2 class="center">People & Creature Generator</h2>\
  <c-menubar id="CPC" v-bind:show="showmenu"></c-menubar>\
  <c-loadselect id="CPC" v-bind:list="allgens" v-bind:show="showlist.load"></c-loadselect>\
  <c-pnc-result v-for="being in current" v-bind:idx="$index" v-bind:object="being" v-bind:allgens="allgens"></c-pnc-result>\
  </div>\
  ',
  data: function () {
    return {
      vid: 'CPC',
      showmenu:{
        new:true,
        load:true,
        save:false,
        close:true
      },
      showlist: {load:false},
      current: [],
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
    load: function (E) {
      var push = [E].concat(this.current);
      this.current = push;
    },
    new : function () { 
      this.current=[];
      this.generate();
    },
    generate: function () {
      var RNG ={}, id='', rank=["common", "uncommon", "rare", "legendary"];
      for(var i=0;i<3;i++){
        id = 'CPC-'+CPXC.string({length: 27, pool: base62});
        RNG = new Chance(id);
        this.current.push(CPX.creature(RNG,{rank:CPXC.pickone(rank)}));
        this.current[this.current.length-1]._id=id;
      }
      for(var i=0;i<3;i++){
        id = 'CPC-'+CPXC.string({length: 27, pool: base62});
        RNG = new Chance(id);
        this.current.push(CPX.people(RNG,{rank:CPXC.pickone(rank)}));
        this.current[this.current.length-1]._id=id;
      }
      this.current = CPXC.shuffle(this.current);
    },
    remove: function(idx){
      this.current.splice(idx,1);
    },
    //close opens mainmenu
    close: function() {
      CPX.vue.page.close();
      this.current=[];
      this.saveID = '';
      this.allgens = [];
    }
  }
})