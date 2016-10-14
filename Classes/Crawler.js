"use strict";
class Crawler {
    constructor(url, queue, search, writeFunc) {
        this.queue = queue;
        this.writeFunc = writeFunc;
        this.search = search;
        this.proceed = require('../Utilities/Queue.js').next;
        this.baseURL = require('../main.js').baseURL;
        this.processed = require('../Utilities/Queue.js').processed;
        console.log('about to crawl url: ' + url);
        var request = require('request'),
            cheerio = require('cheerio'),
            self    = this;
        request(url, function(error, response, body) {
            require('../Utilities/Queue.js').activeCralwers--;
            writeFunc(url);
            // console.log(response.statusCode);
            if(response.statusCode === 200) {
                var $ = cheerio.load(body);
                self.searchKeywords($, url);
                self.fetchLinks($);
            }
            self.proceed();
        });
    }

    searchKeywords($, url) {
        let search = this.search;
        let self = this;
        search.domains.forEach(function(domain) {
            if ($(domain).length > 0) {
                var bodyText = $(domain).html().toLowerCase();
                search.keywords.forEach(function(keyword) {
                    if (bodyText.indexOf(keyword.toLowerCase()) !== -1) {
                        self.writeFunc(url, 'Keyword - ' + keyword + ' - found in ' + domain + '.txt');
                    }
                });
            }
        });
    }

    fetchLinks($) {
        let self = this;
        var relativeLinks = $("a[href^='/']");
        console.log("Found " + relativeLinks.length + " relative links on page");
        relativeLinks.each(function() {
            var uri = $(this).attr('href');
            self.search.ignores.forEach(function(ignore) {
                if (uri && uri.indexOf(ignore) < 0 && self.queue.indexOf(uri) < 0) {
                    self.queue.push(self.baseURL + uri);
                }
            });
        });
    }
}

module.exports = Crawler;
