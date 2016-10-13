"use strict";
if (process.argv.length < 3) {
    console.log('Please specify the URL that you want to crawl.\nUsage: node crawler.js http://site.orz');
    return;
}

const THREADS   =   5;

var _site       =   require('./Utilities/ArgParser.js').parse(process.argv),
    _io         =   require('./Utilities/FileIO.js'),
    _queue      =   require('./Utilities/Queue.js');

_io.initialise(_site.hostname);
_queue.push(_site.url).process(THREADS);
