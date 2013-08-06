
/**
 * @param {SimpleSwipes} ss
 **/
module.exports = function(ss) {
    var d = window.document;
    var store = window.localStorage;
    var xEl = d.querySelector(".swapx");
    var yEl = d.querySelector(".swapy");

    xEl.checked = !!store.swapx;
    yEl.checked = !!store.swapy;
    ss.swapX(!!xEl.checked);
    ss.swapY(!!yEl.checked);

    xEl.addEventListener("change", function(e) {
        ss.swapX(xEl.checked);
        store.swapx = xEl.checked ? "1" : "";
    }, false);

    yEl.addEventListener("change", function(e) {
        ss.swapY(yEl.checked);
        store.swapy = yEl.checked ? "1" : "";
    }, false);

};
