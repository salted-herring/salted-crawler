"use strict";
class Crawler {
    constructor(url) {
        var request = require('request'),
            cheerio = require('cheerio');
        //console.log(url);
        request(url, function(error, response, body) {
            console.log(response.statusCode);
        //    // Check status code (200 is HTTP OK)
        //    console.log("Status code: " + response.statusCode);
        //    if(response.statusCode !== 200) {
        //      callback();
        //      return;
        //    }
        //    // Parse the document body
        //    var $ = cheerio.load(body);
        //    searchForWord($, SEARCH_WORD, url);
           //
        //    collectInternalLinks($);
        //    // In this short program, our callback is just calling crawl()
        //    callback();
        });
    }

    searchForWord($, word, url) {
      SEARCH_DOMAINS.forEach(function(domain) {
          if ($(domain).length > 0) {
              var bodyText = $(domain).html().toLowerCase();
              if (bodyText.indexOf(word.toLowerCase()) !== -1) {
                  yell(url, 'found-in-' + domain);
              }
          }
      });
    }

    collectInternalLinks($) {
        var relativeLinks = $("a[href^='/']");
        console.log("Found " + relativeLinks.length + " relative links on page");
        relativeLinks.each(function() {
            var uri = $(this).attr('href');
            if (uri && uri.indexOf('/comments/') < 0 && uri.indexOf('/calendar/') < 0 && uri.indexOf('@') < 0) {
                pagesToVisit.push(baseUrl + uri);
            }
        });
    }
}

module.exports = Crawler;
