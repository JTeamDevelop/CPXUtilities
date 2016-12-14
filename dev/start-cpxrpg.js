//function callback
function initialize() {
  CPX.vue.page.open('c-cpxrpg','wide'); 
}
//global start function call - launch!
//global start function - given a callback once finished.  
function start(f) {
  refreshRNG(f);
}
start(initialize);
