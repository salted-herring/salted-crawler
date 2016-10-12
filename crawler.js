if (process.argv.length < 3) {
    console.log('Please specify the URL that you want to crawl.\nUsage: node crawler.js http://site.orz');
    return;
}

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
const HISTORY = 'visited-pages.txt';
var START_URL = "";
const SEARCH_WORD = "Heritage Boutique Collection";
const MAX_PAGES_TO_VISIT = 10000000;
var SEARCH_DOMAINS = ['head', 'body'];

process.argv.forEach(function (val, index) {
    if (index == 2) {
        START_URL = val;
    }
});
var pagesVisited = [];
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;
pagesToVisit.push(START_URL);

function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last  = 0;
    while (index > -1) {
      var line = remaining.substring(last, index);
      last = index + 1;
      func(line);
      index = remaining.indexOf('\n', last);
    }

    remaining = remaining.substring(last);
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
    crawl();
  });
}

function func(data) {
    if (!pagesVisited[data]) {
        pagesVisited[data] = true;
    } else {
        console.log('duplicate');
    }
}

fs.stat(HISTORY, function(err, stat) {
    if(err == null) {
        var input = fs.createReadStream(HISTORY);
        readLines(input, func);
    } else if(err.code == 'ENOENT') {
        // file does not exist
        fs.writeFile(HISTORY, '');
        crawl();
    } else {
        console.log('Some other error: ', err.code);
    }
});


function yell(link, filename) {
    filename = filename ? filename : 'links';
    fs.appendFile(filename + ".txt", link + "\n", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("appended");
    });
}

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  if (pagesToVisit.length == 0) {
      console.log('Completed');
      return;
  }
  var nextPage = pagesToVisit.pop();
  visitPage(nextPage, crawl);
}

function visitPage(url, callback) {

  if (!url) {
      console.log('no url');
      yell('NOT WORKING', 'broken-link');
      callback();
      return;
  }

  if (!pagesVisited[url]) {
      // Add page to our set
      pagesVisited[url] = true;
      numPagesVisited++;
      // Make the request
      console.log("Visiting page " + url);
      request(url, function(error, response, body) {
         // Check status code (200 is HTTP OK)
         console.log("Status code: " + response.statusCode);
         if(response.statusCode !== 200) {
           callback();
           return;
         }

         yell(url, 'visited-pages');
         // Parse the document body
         var $ = cheerio.load(body);
         searchForWord($, SEARCH_WORD, url);

         collectInternalLinks($);
         // In this short program, our callback is just calling crawl()
         callback();
      });
  } else {
      callback();
  }
}

function searchForWord($, word, url) {
  SEARCH_DOMAINS.forEach(function(domain) {
      if ($(domain).length > 0) {
          var bodyText = $(domain).html().toLowerCase();
          if (bodyText.indexOf(word.toLowerCase()) !== -1) {
              yell(url, 'found-in-' + domain);
          }
      }
  });
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        var uri = $(this).attr('href');
        if (uri && uri.indexOf('/comments/') < 0 && uri.indexOf('/calendar/') < 0) {
            pagesToVisit.push(baseUrl + uri);
        }
    });
}
