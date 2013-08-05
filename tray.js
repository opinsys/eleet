
// Load library
var gui = require('nw.gui');

// Reference to window and tray
var win = gui.Window.get();
var tray = new gui.Tray({ icon: 'icon.png' });

var pause = false;

tray.on('click', function() {
    console.log("tray click");
    window.document.body.innerHTML = "sdaf";
    win.show();
    win.restore();
    pause = true;
    setTimeout(function() {
        pause = false;
    }, 500);
});


win.on('minimize', function() {
    if (pause) return;
    console.log("hiding");
    win.hide();
});
