///////////////////////////////////////////////////////////////////////////////////////////////////////////
//partial for the deleteAll - provides the Yes and Cancel buttons
Vue.component('c-deleteall', {
  template: '<div class="center content"><button v-on:click="deleteAll" type="button" class="pad-y btn btn-danger">Yes</button>' +
'<button v-on:click="close" type="button" class="pad-y btn btn-success">Cancel</button></div>',
  methods: {
    close: function (){
      CPX.vue.notify.close();
    },
    deleteAll: function (){
      CPXSAVE.clear();
      CPX.vue.notify.close();
    }
  } 
}); 
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//defines notify popup - call with open and provide header, content, and whether to show the close button
CPX.vue.notify = new Vue({
  el: '#mainNotify',
  data: {
    show: false,
    showclose: false,
    header: '',
    content: '',
    deleteall: 'false',
    currentView: ''
  },
  methods: {
    open: function(header,content,close,buttons){
      if(buttons != null){ this.currentView = buttons; }
      this.header = header;
      this.content = content;
      this.showclose = close;
      this.show = true;
    },
    close: function(event) {
      this.header = '';
      this.content = '';
      this.deleteall = false;
      this.show = false;
    }
  }
})
