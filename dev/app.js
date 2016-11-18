//Version 1.1
//core object for Cosmic Power utilities
const CPX = {
  display:{},
  gen:{},
  user:{},
  vue: {},
  realm:{},
  data:{}
};
//Save db for Indexed DB - localforage
const CPXSAVE = localforage.createInstance({ name: "CPXSave", storeName: "CPXsave" });
//local save for quick reference - used for maps
const CPXDB = {};
//Object declaration for the global Random NUmber generator - to be populated later
var CPXC;
//Provide data shortcut
DATA = CPX.data;
//Base character list for UID determination
const base62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//Named rarity ranks
const RANKS = ['common','uncommon','rare','legendary','epic'];
const DIERANKS = [['1d4'],['1d6'],['1d8'],['1d10'],['1d12'],
  ['1d6','1d8'],['1d8','1d8'],['1d8','1d10'],['1d10','1d10'],['1d6','1d8','1d8'],
  ['1d8','1d8','1d8'],['1d10','1d8','1d8'],['1d10','1d10','1d8'],['1d10','1d10','1d10']];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Decimal adjustment of a number. Taken from Mozilla.org
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
  };
  // Decimal floor
  Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
  };
  // Decimal ceil
  Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//COnvert Hex color to RGB - given alpha
function hexToRgbA(hex,alpha) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var string = "rgba("
  string+=parseInt(result[1], 16) +",";
  string+=parseInt(result[2], 16) +",";
  string+=parseInt(result[3], 16) +",";
  string+=alpha+")";
  return string;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Simple test to see if an object is defined = exists
objExists = function (obj) {
  if (typeof obj === "undefined") {
    return false;
  }
  else {
    return true;
  }
}
//Deep copy an object by stringify and parse - cannot be used on objects with functions
objCopy = function (obj){
  return JSON.parse(JSON.stringify(obj));
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Removes duplicates from array
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
/**
 * @description determine if an array contains one or more items from another array.
 * @param {array} haystack the array to search.
 * @param {array} arr the array providing items to check for in the haystack.
 * @return {boolean} true|false if haystack contains at least one item from arr.
 */
Array.prototype.findOne = function (haystack) {
    return this.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//generic object creator - takes options (object) and extras (object array)
// extras = {key,value}
CPX.obj = function (opts,extras) {
  //loads the basics that all objects will have
  var obj = {
    class : [],
    seed : typeof opts.seed === "undefined" ? [CPXC.string({length: 32, pool: base62})] : opts.seed,
    scale : typeof opts.scale === "undefined" ? 3 : opts.scale,
    parent : typeof opts.parent === "undefined" ? {} : opts.parent
  }
  //pulls id from seed
  obj._id = obj.seed.join("");

  //for every extra pulls that data to the object - each extra is key: value
  extras = typeof extras === "undefined" ? {} : extras;
  for(var x in extras){
    obj[x] = typeof opts[x] === "undefined" ? extras[x] : opts[x];
  }

  return obj;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Apply a template if one exists
CPX.obj.applyTemplate = function (obj,opts) {
  if(objExists(opts.template))  { 
    for (var x in opts.template){
      obj[x] = opts.template[x];
    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//random size of an object - centered around 2
CPX.size = function (RNG) {
  var s = RNG.weighted([1,2,3,4,5], [.1,.45,.34,.1,.01]);
  var n = RNG.normal({mean: 0, dev: 0.3});
  if(s==1) {
    s+= Math.abs(n);
  }
  else {
    s+=n;
  }
  return s;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Adds functionality to the Chance Random Number Generator
CPX.chanceMixin = function (){
  CPXC.mixin({
    //Fate dice roll
    'dF': function() {
      return CPXC.rpg('4d3',{sum:true})-8;
    },
    //Dungeon World Dice roll
    'DW': function() {
      return CPXC.rpg('2d6',{sum:true});
    },
    //Quick sum of rpg dice - instead of typing {sum:true} every time
    'diceSum' : function(dice) {
      return CPXC.rpg(dice,{sum:true});
    },
    //Wxploding dice - given an array of rpg dice
    'diceEx' : function(dice) {
      var t=0, r=0, max=0, n=dice.length;
      for(var i =0;i<n;i++){
        max = Number(dice[i][dice[i].length-1]);
        r = CPXC.diceSum(dice[i]);
        t+=r;
        if(r==max) { dice.push(dice[i]); n++; }
      }
      return t;
    }
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//sets an interval to refresh the CPXC Chance RNG every 10 minutes
setInterval(function(){
  refreshRNG();
}, 600000);
//RNG refresh function
function refreshRNG(callback){
  //set callback if undefined
  callback = typeof callback === "undefined" ? function () {} : callback;

  //on success use the returned random number
  function initAjaxSuccess(randNum) {
    var mySeed = randNum;
    // Instantiate Chance with this truly random number as the seed
    CPXC = new Chance(mySeed);
    CPX.chanceMixin();
  }
  //on failure use the local rng as a seed
  function initAjaxError() {
    var mySeed = Math.random();
    // Instantiate Chance with this truly random number as the seed
    CPXC = new Chance(mySeed);
    CPX.chanceMixin();
  }
  // ajax call to get a random number for use as global RNG
  $.ajax({
    url: "https://www.random.org/integers/",
    data: {num: "1", col: "1", min: "1", max: "1000000000", base: "10", format: "plain", rnd: "new"},
    success: initAjaxSuccess,
    error: initAjaxError,
    complete : callback,
    timeout: 3000
  });
}

//global start function - given a callback once finished.  
function start(f) {
  refreshRNG(f);
}

// This is the event hub we'll use in every
// component to communicate between them.
var HUB = new Vue();
