"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseHeaders = function (rawHeaders) {
    var headers = new Headers();
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
            var value = parts.join(':').trim();
            headers.append(key, value);
        }
    });
    return headers;
};
exports.default = parseHeaders;
