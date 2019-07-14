"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_link_1 = require("apollo-link");
var apollo_link_http_common_1 = require("apollo-link-http-common");
var fetch_1 = tslib_1.__importDefault(require("./fetch"));
var AbortObserver_1 = tslib_1.__importDefault(require("./AbortObserver"));
var createUploadLink = function (uri) {
    return new apollo_link_1.ApolloLink(function (operation, forward) {
        if (operation.operationName !== 'uploadFile') {
            return forward(operation);
        }
        var file = operation.variables.file;
        if (!file) {
            throw Error('Upload operation must contain a file');
        }
        var context = operation.getContext();
        var contextConfig = {
            http: context.http,
            options: context.fetchOptions,
            credentials: context.credentials,
            headers: context.headers,
        };
        var _a = apollo_link_http_common_1.selectHttpOptionsAndBody(operation, apollo_link_http_common_1.fallbackHttpConfig, {}, contextConfig), options = _a.options, body = _a.body;
        delete options.headers['content-type'];
        options.body = new FormData();
        options.body.append('operations', apollo_link_http_common_1.serializeFetchParameter(body, 'Payload'));
        options.body.append('map', JSON.stringify({ 0: ['variables.file'] }));
        options.body.append(0, file, file.name);
        return new apollo_link_1.Observable(function (observer) {
            var xhr = new XMLHttpRequest();
            if (context.abortObserver instanceof AbortObserver_1.default) {
                context.abortObserver.subscribe(xhr);
            }
            if (xhr.upload && context.onProgress) {
                xhr.upload.onprogress = context.onProgress;
            }
            fetch_1.default(xhr, apollo_link_http_common_1.selectURI(operation, uri), options)
                .then(function (response) {
                operation.setContext({ response: response });
                return response;
            })
                .then(apollo_link_http_common_1.parseAndCheckHttpResponse(operation))
                .then(function (result) {
                observer.next(result);
                observer.complete();
            })
                .catch(function (error) {
                if (error.name === 'AbortError') {
                    return;
                }
                if (error.result && error.result.errors && error.result.data) {
                    observer.next(error.result);
                }
                observer.error(error);
            });
        });
    });
};
exports.default = createUploadLink;
