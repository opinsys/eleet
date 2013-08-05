
var bindKeys = require("./bindkeys");
var bindPreview = require("./bindpreview");
var bindOptions = require("./bindoptions");
var spawn = require("./pipespawn");
var Leap = require("leapjs");
var SimpleSwipes = require("./simpleswipes");
var gui = require("nw.gui");
var regexpevent = require("./regexpevent");

var controller = new Leap.Controller({ enableGestures: true });
var ss = new SimpleSwipes(controller);
var d = window.document;
var connectMsg = d.querySelector(".connecting");

bindKeys(ss);
bindPreview(ss);
bindOptions(ss);

gui.Window.get().showDevTools();


[].forEach.call(d.querySelectorAll(".external"), function(el) {
    el.addEventListener("click", function(e) {
        e.preventDefault();
        var item = e.target.dataset.value.split(":");
        switch (item[0]) {
            case "spawn":
                spawn(item[1]);
                break;
            case "item":
                gui.Shell.openItem(item[1]);
                break;
            default:
                gui.Shell.openExternal(e.target.dataset.value);
        }

    }, false);
});


var leapd = spawn("leapd");

leapd.stream.pipe(regexpevent()
    // deviceConnected event is broken...
    .onRegExp(/Leap Motion Controller detected: +(.+)$/mg, function(match) {
        connectMsg.innerText = "Laite " + match[1] + " löydetty!";
        controller.removeAllListeners("connect");
   }).onRegExp(/WebSocket exception: bind: Address already in use/, function() {
        connectMsg.innerText = "Virhe: leapd on jo päällä";
   })
).pipe(process.stdout);

controller.on("connect", function() {
    console.log("Connected to leapd websocker server");
    connectMsg.innerText = "Palvelin löydetty! Etsitään laitetta...";
});

// Give some time for leapd to start
setTimeout(function() {
    controller.connect();
    connectMsg.innerText = "Yhdistetään...";
    console.log("\nWaiting for device to connect...");
}, 1000);

