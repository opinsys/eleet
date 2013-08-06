
module.exports = function(win, gui, exit) {
    var tray = new gui.Tray({
        icon: "assets/icon.png",
        tooltip: "Eleet"
    });

    var pause = false;

    var menu = new gui.Menu();
    menu.append(new gui.MenuItem({
        type: 'checkbox',
        label: 'Sulje',
        click: exit
    }));

    tray.menu = menu;

    function minimize() {
        if (pause) return;
        win.hide();
        tray.once('click', function() {
            win.show();
            win.restore();
            pause = true;
            setTimeout(function() {
                pause = false;
            }, 500);
        });
    }

    win.on("minimize", minimize);
    win.on("close", minimize);

};
