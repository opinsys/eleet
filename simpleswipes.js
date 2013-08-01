var util = require("util");
var EventEmitter = require("events").EventEmitter;

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

    var origEmit = this.emit;
    var pause = false;
    this.emit = function() {
        if (pause) {
            console.log("ignoring", arguments);
            return;
        }
        origEmit.apply(this, arguments);
        pause = true;
        setTimeout(function() {
            pause = false;
        }, 1000);
    };

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

    var event = {
        x: this.start.position[0] - gesture.position[0],
        y: this.start.position[1] - gesture.position[1]
    };

    if (isSmall(event.x) && isSmall(event.y)) {
        console.warn("too small movement", event);
        return this.end();
    }

    if (Math.abs(event.x) > Math.abs(event.y)) {
        if (event.x < 0) this.emit("left", event);
        else this.emit("right", event);
    }
    else {
        if (event.y > 0) this.emit("up", event);
        else this.emit("down", event);
    }

    this.end();
};

SimpleSwipes.prototype.end = function() {
    this.start = null;
    this.lastUpdate = null;
    clearTimeout(this.stopWaiter);
};

module.exports = SimpleSwipes;

