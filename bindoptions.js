
/**
 * @param {SimpleSwipes} ss
 **/
module.exports = function(ss) {
    var d = window.document;
    var store = window.localStorage;
    var xEl = d.querySelector(".swapx");
    var yEl = d.querySelector(".swapy");
    var activeEl = d.querySelector(".active");

    if (typeof store.active === "undefined") {
        store.active = "1";
    }

    xEl.checked = !!store.swapx;
    yEl.checked = !!store.swapy;
    activeEl.checked = !!store.active;

    ss.swapX(!!xEl.checked);
    ss.swapY(!!yEl.checked);
    ss.active = !!activeEl.checked;

    xEl.addEventListener("change", function(e) {
        ss.swapX(xEl.checked);
        store.swapx = xEl.checked ? "1" : "";
    }, false);

    yEl.addEventListener("change", function(e) {
        ss.swapY(yEl.checked);
        store.swapy = yEl.checked ? "1" : "";
    }, false);

    activeEl.addEventListener("change", function(e) {
        ss.active = store.active = activeEl.checked ? "1" : "";
    }, false);

};
