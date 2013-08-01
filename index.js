
var Leap = require("leapjs");
var controller = new Leap.Controller({enableGestures: true});

var SimpleSwipes = require("./simpleswipes");
var bindKeys = require("./bindkeys");

var ss = new SimpleSwipes(controller);

bindKeys(ss);

controller.on('connect', function() {
  console.log("A Leap device has been connected.");
});

controller.connect();

console.log("\nWaiting for device to connect...");
