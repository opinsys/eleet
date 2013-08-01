var util = require("util");
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

function isSmall(i) {
    return Math.abs(i) < 10;
}

/**
 * Adapt swipe events from Leap.Controller instance to really simple
 * `left`, `right`, `up`, `down`, `point` events
 *
 * @class Simpleswipes
 * @param {Leap.Controller} controller
 * @return {SimpleSwipes} EventEmitter emiting simple move events
 * @see https://npmjs.org/package/leapjs
 *
 **/
function SimpleSwipes(controller) {
    EventEmitter.call(this);
    this.controller = controller;

    this.emit = _.throttle(this.emit, 500);

    this.start = null;
    this.lastUpdate = null;
    this.stopWaiter = null;
    this.controller.on("frame", function(frame) {
        if (!frame.data.gestures) return;
        if (frame.data.gestures.length === 0) return;

        var gesture = frame.data.gestures[0];

        if (gesture.type === "screenTap") {
            this.emit("point");
            this.end();
            return;
        }

        if (gesture.type === "swipe") {
            this.handleSwipe(gesture);
            return;
        }

    }.bind(this));
}

util.inherits(SimpleSwipes, EventEmitter);

SimpleSwipes.prototype.handleSwipe = function(gesture) {

    if (gesture.state === "update") {
        this.lastUpdate = gesture;
    }

    if (gesture.state === "start" && !this.start) {
        this.start = gesture;
        this.stopWaiter = setTimeout(function() {
            console.warn("ending with update");
            this.handleSwipeStop(this.lastUpdate);

        }.bind(this), 1000);

        return;
    }

    if (!this.start) return;

    if (gesture.state === "stop" && this.start.id === gesture.id) {
        this.handleSwipeStop(gesture);
    }

};

SimpleSwipes.prototype.handleSwipeStop = function(gesture) {

    var xdiff = this.start.position[0] - gesture.position[0];
    var ydiff = this.start.position[1] - gesture.position[1];

    if (isSmall(xdiff) && isSmall(ydiff)) {
        console.warn("too small movement");
        return this.end();
    }

    if (Math.abs(xdiff) > Math.abs(ydiff)) {
        if (xdiff < 0) this.emit("left");
        else this.emit("right");
    }
    else {
        if (ydiff > 0) this.emit("up");
        else this.emit("down");
    }

    this.end();
};

SimpleSwipes.prototype.end = function() {
    this.start = null;
    this.lastUpdate = null;
    clearTimeout(this.stopWaiter);
};

module.exports = SimpleSwipes;

