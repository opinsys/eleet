
var bindKeys = require("./bindkeys");
var bindPreview = require("./bindpreview");
var bindOptions = require("./bindoptions");
var Leap = require("leapjs");
var SimpleSwipes = require("./simpleswipes");
var spawn = require("child_process").spawn;
var gui = require("nw.gui");

var controller = new Leap.Controller({ enableGestures: true });
var ss = new SimpleSwipes(controller);
var d = window.document;
var connectMsg = d.querySelector(".connecting");

bindKeys(ss);
bindPreview(ss);
bindOptions(ss);


[].forEach.call(d.querySelectorAll(".open-external"), function(el) {
    el.addEventListener("click", function(e) {
        e.preventDefault();
        gui.Shell.openExternal(e.target.href);
    }, false);
});

[].forEach.call(d.querySelectorAll(".open-exec"), function(el) {
    el.addEventListener("click", function(e) {
        e.preventDefault();
        spawn(e.target.dataset["exec"]);
    }, false);
});


spawn("leapd", [], {
    stdio: "pipe",
    detached: false // leapd should die when leapkeys dies
});

// Give some time for lead to start
setTimeout(function() {
    controller.on('connect', function() {
        console.log("A Leap device has been connected.");
        connectMsg.innerText = "Yhdistetty!";
    });

    controller.connect();
    connectMsg.innerText = "Yhdistetään...";
    console.log("\nWaiting for device to connect...");
}, 1000);

