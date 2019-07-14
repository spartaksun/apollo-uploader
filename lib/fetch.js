"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var error_1 = require("tslint/lib/error");
var parseHeaders_1 = tslib_1.__importDefault(require("./parseHeaders"));
var fetch = function (xhr, url, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        xhr.onload = function () {
            var opts = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders_1.default(xhr.getAllResponseHeaders() || ''),
            };
            opts.url = 'responseURL' in xhr ? xhr.responseURL : opts.headers.get('X-Request-URL');
            resolve(new Response(xhr.response, opts));
        };
        xhr.onabort = function () {
            reject(new error_1.Error('Upload aborted'));
        };
        xhr.onerror = function () {
            reject(new TypeError('Upload failed'));
        };
        xhr.ontimeout = function () {
            reject(new TypeError('Upload failed (timeout)'));
        };
        xhr.open(options.method, url, true);
        Object.keys(options.headers).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key]);
        });
        xhr.send(options.body);
    });
};
exports.default = fetch;
