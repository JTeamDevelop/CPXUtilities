/*
 V 1.3
 Refactor to move bars to the pagejs
*/

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
    Sector: function(){
      this.show = false;
      CPX.vue.page.open('c-cps','');
    },
    HeroEd: function(){
      this.show = false;
      CPX.vue.page.open('c-che','slim');
    },
    IncursionGen: function(){
      this.show = false;
      CPX.vue.page.open('c-cpi','');
    },
    InvestigationGen: function(){
      this.show = false;
      CPX.vue.page.open('c-cpv','slim');
    },
    cityGen: function(){
      this.show = false;
      CPX.vue.page.open('c-cfp','slim');
    },
    areaBuilder: function(){
      this.show = false;
      CPX.vue.page.open('c-cab','slim');
    },
    SystemGen: function(event) {
      this.show = false;
      CPX.vue.page.open('c-cpy','slim');
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
