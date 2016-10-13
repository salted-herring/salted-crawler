"use strict";
const HISTORY = 'pages.txt';
var fs      =   require('fs'),
    base    =   '';
exports.initialise = function(hostname) {
    base = hostname;
    if (fs.existsSync(hostname)) {
        rmDir(hostname);
    }
    fs.mkdir(hostname);
    this.append('', HISTORY);
};

exports.append = function(link, filename) {
    filename = base + '/' + filename;
    fs.appendFile(filename, (link.trim().length > 0 ? link + "\n" : ''), 'utf8', function(err) {
        if(err) {
            return console.log(err);
        }
    });
};

function rmDir(path) {
    if(fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
