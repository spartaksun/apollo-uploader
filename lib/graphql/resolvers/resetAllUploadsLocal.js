"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAllUploadsLocal = function (_, __, context) {
    context.cache.writeData({
        data: {
            uploading: [],
        },
    });
    return true;
};
