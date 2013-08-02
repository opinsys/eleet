
/**
 * @param {SimpleSwipes} ss
 **/
module.exports = function(ss) {
    var d = window.document;

    d.querySelector(".swapx").addEventListener("change", function(e) {
        ss.swapX(e.target.checked);
    }, false);

    d.querySelector(".swapy").addEventListener("change", function(e) {
        ss.swapY(e.target.checked);
    }, false);

};
