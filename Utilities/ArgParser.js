"use strict";
exports.parse = function(args) {
    var URL = require('url-parse'),
        structure = {
            url                 :   args[2],
            baseUrl             :   '',
            protocol            :   'http:',
            hostname            :   '',
            keywords            :   [],
            search_domains      :   ['body'],
            ignores             :   []
        },
        url_object = new URL(structure.url);

    structure.protocol = url_object.protocol;
    structure.hostname = url_object.hostname;
    structure.baseUrl = structure.protocol + '//' + structure.hostname;

    if (args[3] && args[3].trim().length > 0) {
        let keywords = args[3].trim();
        keywords = keywords.split(',');
        keywords.forEach(function(keyword){
            structure.keywords.push(keyword.trim().replace(/\+/gi, ' '));
        });
    }

    if (args[4] && args[4].trim().length > 0) {
        let domains = args[4].trim();
        structure.search_domains = [];
        domains = domains.split(',');
        domains.forEach(function(domains){
            structure.search_domains.push(domains.trim());
        });
    }

    if (args[5] && args[5].trim().length > 0) {
        let ignores = args[5].trim();
        ignores = ignores.split(',');
        ignores.forEach(function(ignore){
            structure.ignores.push(ignore.trim());
        });
    }

    return structure;
};
