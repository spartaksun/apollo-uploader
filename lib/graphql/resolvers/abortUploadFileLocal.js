"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../../types");
exports.abortUploadFileLocal = function (_, args, context) {
    var id = args.id;
    context.cache.writeData({
        id: "UploadProcess:" + id,
        data: {
            status: types_1.FileUploadStatuses.UPLOAD_PENDING_TO_ABORT,
        },
    });
    return id;
};
