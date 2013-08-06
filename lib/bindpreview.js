
/**
 * @param {SimpleSwipes} ss
 **/
module.exports = function (ss) {
    var d = window.document;
    var el = d.querySelector(".key");

    ["left", "right", "up", "down"].forEach(function(event) {
        ss.on(event, function() {
            el.classList.add("animate");
            el.classList.add("icon-arrow-" + event);

            el.addEventListener("webkitAnimationEnd", function endListener() {
                el.classList.remove("animate");
                el.classList.remove("icon-arrow-" + event);
                el.removeEventListener("webkitAnimationEnd", endListener, false);
            }, false);

        });
    });
};

