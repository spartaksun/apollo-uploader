"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbortObserver = (function () {
    function AbortObserver() {
        var _this = this;
        this.subscriber = null;
        this.subscribe = function (xhr) {
            _this.subscriber = xhr;
        };
        this.abort = function () {
            if (_this.subscriber !== null) {
                _this.subscriber.abort();
            }
        };
    }
    return AbortObserver;
}());
exports.default = AbortObserver;
