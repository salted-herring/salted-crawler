"use strict";

this.writeFunc = null;
this.pending = [];
this.processed = [];
this.search = { keywords: null, domains: null, ignores: null};
this.activeCralwers = 0;
this.maxThreads = 5;
var self = this;

var Crawler = require('../Classes/Crawler.js');

exports.initialise = function(writeFunc, site) {
    this.writeFunc = writeFunc;
    this.search.keywords = site.keywords;
    this.search.domains = site.search_domains;
    this.search.ignores = site.ignores;
}

exports.push = function(item) {
    this.pending.push(item);
    return this;
};

exports.next = function() {
    self.process();
}

exports.process = function() {
    let self = this;
    let threads = this.maxThreads;
    threads = threads <= this.pending.length ? threads : this.pending.length;
    threads = threads - this.activeCralwers;
    // console.log('you say you have: ' + threads + ', while current active is: ' + this.activeCralwers);
    if (threads > 0 && this.pending.length > 0) {
        for (let i = 0; i < threads; i++) {
            var url = self.pending.pop();
            if (url) {
                if (self.processed[url] === undefined && self.activeCralwers < self.maxThreads) {
                    self.processed[url] = 1;
                    var crawler = new Crawler(url, self.pending, self.search, self.writeFunc);
                    self.activeCralwers++;
                } else {
                    self.processed[url]++;
                    //console.log(url + ' has been processed before.');
                    self.process();
                }
            }
        }
    } else {
        //console.log('no available slot');
    }
};
