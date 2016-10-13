"use strict";

this.pending = [];
this.processed = [];

var Crawler = require('../Classes/Crawler.js');

exports.push = function(item) {
    this.pending.push(item);
    return this;
};
exports.process = function(threads) {

    threads = threads ? threads : 1;
    threads = threads <= this.pending.length ? threads : this.pending.length;
    for (let i = 0; i < threads; i++) {
        var url = this.pending.pop();
        if (this.processed[url] === undefined) {
            this.processed[url] = 1;
            var crawler = new Crawler(url);
        } else {
            this.processed[url]++;
        }
    }
};
