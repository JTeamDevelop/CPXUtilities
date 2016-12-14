///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpxrpg-chg', { 
  template: "#challenge",
  methods: {
    close:function(){
      CPX.vue.page.show=false;
      CPX.vue.page.open('c-cpxrpg','wide'); 
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpxrpg-inc', { 
  template: "#incursion",
  methods: {
    close:function(){
      CPX.vue.page.show=false;
      CPX.vue.page.open('c-cpxrpg','wide'); 
    }
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
Vue.component('c-cpxrpg', { 
  template: "#cpxrpg",
  methods: {
    incursion: function() {  
      CPX.vue.page.show=false;
      CPX.vue.page.open('c-cpxrpg-inc','wide'); 
    },
    challenge: function() {  
      CPX.vue.page.show=false;
      CPX.vue.page.open('c-cpxrpg-chg','wide'); 
    },
    investigation: function() { 
      CPX.vue.page.show=false;
      CPX.vue.page.open('c-ogl','wide'); 
    }
  }
})