
var gui = require("nw.gui");
var Window = gui.Window.get();
Window.showDevTools();
var Leap = require("leapjs");

var bindKeys = require("./lib/bindkeys");
var bindPreview = require("./lib/bindpreview");
var bindOptions = require("./lib/bindoptions");
var spawn = require("./lib/pipespawn");
var SimpleSwipes = require("./lib/simpleswipes");
var regexpevent = require("./lib/regexpevent");
var tray = require("./lib/tray");

var controller = new Leap.Controller({ enableGestures: true });
var ss = new SimpleSwipes(controller);
var d = window.document;
var connectMsg = d.querySelector(".connecting");


var leapd = spawn("leapd");

leapd.stream.pipe(regexpevent()
    // deviceConnected event is broken...
    .onRegExp(/Leap Motion Controller detected: +(.+)$/mg, function(match) {
        connectMsg.innerText = "Laite " + match[1] + " löydetty!";
        controller.removeAllListeners("connect");
        spawn("notify-send", ["Eleet", "Leap Motion yhdistetty"]);

   }).onRegExp(/WebSocket exception: bind: Address already in use/, function() {
        connectMsg.innerText = "Virhe: leapd on jo päällä";
   })
).pipe(process.stdout);

function exit() {
    console.log("Killing leapd and exiting....");
    leapd.process.kill("SIGKILL");
    gui.App.quit();
}

tray(Window, gui, exit);
bindKeys(ss);
bindPreview(ss);
bindOptions(ss);

Window.showDevTools();



[].forEach.call(d.querySelectorAll(".external"), function(el) {
    el.addEventListener("click", function(e) {
        e.preventDefault();
        var item = e.target.href.split(":");
        switch (item[0]) {
            case "spawn":
                spawn(item[1]);
                break;
            case "item":
                gui.Shell.openItem(item[1]);
                break;
            default:
                gui.Shell.openExternal(e.target.href);
        }

    }, false);
});






controller.on("connect", function() {
    console.log("Connected to leapd websocker server");
});

// Give some time for leapd to start
setTimeout(function() {
    console.log("Connecting...");
    controller.connect();
    console.log("\nWaiting for device to connect...");
}, 1000);

