CPX.data.cityExtras = ['school','barracks','fortified','market','militia','temple','guild','resource']

CPX.city = function (opts){
  var C = {
    seed: opts.seed,
    size: opts.size,
    class:['city'],
    name : typeof opts.name === "undefined" ? '' : opts.name,
    notes : typeof opts.notes === "undefined" ? '' : opts.notes,
    people : typeof opts.people === "undefined" ? [] : opts.people,
    terrain : typeof opts.terrain === "undefined" ? [] : opts.terrain,
  }
  C._id = C.seed.join('');
  C.RNG = new Chance(C._id);
  
  var aspect = C.RNG.weighted(['aspect','magic','element'],[2,1,1]);
  C.aspect = CPX.creature.special(C.RNG,aspect);
  
  //pick population if none given
  if(C.people.length==0){
    //number of people
    var np = C.RNG.weighted([1,2,3],[7,2.5,0.5]);
    for(var i=0;i<np;i++){
      C.people.push(CPX.people(C.RNG,{terrain:opts.terrain}));
    }
  }
  //pick extras
  //number of extras
  var ne = C.RNG.weighted([1,2,3],[7,2.5,0.5]);
  C.extras=[];
  for(var i=0;i<ne;i++){
    C.extras.push(C.RNG.pickone(CPX.data.cityExtras));
  }
  //trouble
  var tcat = C.RNG.pickone(CPX.data.troubleCategories);
  C.trouble = C.RNG.pickone(CPX.data['t'+tcat]).id;

  C.RNG = null;
  delete C.RNG;
  return C;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cfp-CPC', { 
props:['obj'],
template: ''+
  '<div class="content">'+
    '<input class="form-control input-lg center" type="text" v-model="obj.name" placeholder="NAME">'+
    '<textarea class="form-control" type="textarea" v-model="obj.notes" placeholder="ADD NOTES"></textarea>'+
    '<div class="content-minor box">'+
      '<div class="header strong center">Population</div>'+
      '<c-cfp-ppl v-for="ppl in obj.people" v-bind:P="ppl"></c-cfp-ppl>'+
    '</div>'+
    '<div class="input-group">'+
      '<span class="input-group-addon strong">Aspect</span>'+
      '<input class="form-control center" type="text" v-model="obj.aspect">'+
    '</div>'+
    '<div class="input-group" v-for="e in obj.extras">'+
      '<span class="input-group-addon strong">Extra</span>'+
      '<input class="form-control center" type="text" v-model="e">'+
    '</div>'+
    '<div class="input-group">'+
       '<span class="input-group-addon strong">Trouble</span>'+
       '<select class="form-control" v-model="obj.trouble">'+
         '<option  v-for="t in trouble" v-bind:value="t.id">{{t.id | capitalize}}</option>'+
       '</select>'+
    '</div>'+
    '<div class="center bottom-pad">{{tinfo(obj.trouble)}}</div>'+ 
    '</div>',
  computed: {
    trouble: function(){
      var t = [];
      CPX.data.troubleCategories.forEach(function(el) {
        t = t.concat(CPX.data['t'+el]);
      });
      return t;
    }
  },
  methods: {
    tinfo : function(tid){
      return this.trouble.find(function(el){
        return el.id == tid;
      }).text;
    }
  }
})

