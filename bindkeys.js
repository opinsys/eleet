var exec = require("child_process").exec;

/**
 *
 * Bind SimpleSwipes events to keyboard strokes
 * @param {SimpleSwipes} ss
 *
 **/
module.exports = function(ss) {
    ss.on("left", function() {
        console.log("left");
        exec("xdotool key Left");
    }).on("right", function() {
        console.log("right");
        exec("xdotool key Right");
    }).on("up", function() {
        console.log("up");
        exec("xdotool key Up");
    }).on("down", function() {
        console.log("up");
        exec("xdotool key Up");
    }).on("point", function() {
        console.log("point");
        exec("xdotool key KP_Enter");

    });

};
