"use strict";
if (process.argv.length < 3) {
    console.log('Please specify the URL that you want to crawl.\nUsage: node main.js URL key+words+1,keyword+2 div.classname,tagname /url-contain-this-will-be-ignored/,and-this-too\ne.g. node main.js http://www.heritagehotels.co.nz/ Heritage+Boutique+Collection head,article.node,div[role="main"] /comments/,/calendar/,@');
    return;
}

var _site       =   require('./Utilities/ArgParser.js').parse(process.argv),
    _io         =   require('./Utilities/FileIO.js'),
    _queue      =   require('./Utilities/Queue.js');

this.baseURL = _site.baseUrl;

_io.initialise(_site.hostname);
_queue.initialise(_io.append, _site);
_queue.push(_site.url).process();
