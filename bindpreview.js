

/**
 * @param {SimpleSwipes} ss
 **/
module.exports = function (ss) {
    var d = window.document;

    ["left", "right", "up", "down"].forEach(function(event) {
        var el = d.querySelector("." + event);

        el.addEventListener("webkitAnimationEnd", function() {
            el.classList.remove("animate");
        }, false);

        ss.on(event, function() {
            el.classList.add("animate");
        });

    });

};

