

var Transform = require("stream").Transform ;
var util = require("util");


function RegExpEvent(options) {
    if (!(this instanceof RegExpEvent))
            return new RegExpEvent(options);

    this.bufferSize = (options && options.bufferSize) || 1024 * 1024;

    Transform.call(this, options);
    this.matchers = [];
}

util.inherits(RegExpEvent, Transform);

RegExpEvent.prototype.onRegExp = function(regexp, fn) {
    this.matchers.push({
        regexp: regexp,
        fn: fn,
        buffer: ""
    });

    return this;
};

RegExpEvent.prototype._transform = function(chunk, encoding, done) {
    this.push(chunk);
    done();

    this.matchers.forEach(function(matcher) {
        matcher.buffer += chunk.toString();
        // console.log("match on " + matcher.buffer + "END");

        var match = null;
        while (match = matcher.regexp.exec(matcher.buffer)) {
            matcher.fn(match);
            if (!matcher.regexp.global) break;
        }

        if (match) matcher.buffer = "";

        if (matcher.buffer.length > this.bufferSize) {
            matcher.buffer = matcher.buffer.slice(
                matcher.buffer.length - this.bufferSize
            );
        }
    });

};

module.exports = RegExpEvent;


if (require.main === module) {
    var fs = require("fs");
    // fs.createReadStream("/etc/hosts")
    // .pipe(new RegExpEvent().onRegExp(/ip6(.+$)/gm, function(match) {
    //     console.log("got", match[1]);
    // })).pipe(process.stdout);


    var PassThrough = require('stream').PassThrough;
    var cmb = new PassThrough();

    fs.createReadStream("/etc/hosts").pipe(cmb);
    fs.createReadStream("/etc/hdparm.conf").pipe(cmb);
    cmb.pipe(process.stdout);



}



