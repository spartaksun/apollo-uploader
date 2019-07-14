"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v4");
var types_1 = require("../../types");
var queries_1 = require("../queries");
exports.uploadFileLocal = function (_, _a, _b) {
    var file = _a.file;
    var cache = _b.cache;
    var previous = cache.readQuery({ query: queries_1.uploadingVideoFile });
    var newProcess = {
        __typename: 'UploadProcess',
        file: file,
        bucket: types_1.FileUploadBuckets.IMAGE,
        id: uuid(),
        fileSize: file.size,
        fileName: file.name,
        status: types_1.FileUploadStatuses.UPLOAD_PENDING,
        loaded: 0,
        total: 0,
        error: '',
        video: '',
    };
    var data = {
        uploading: previous.uploading.concat([newProcess]),
    };
    cache.writeQuery({
        query: queries_1.uploadingVideoFile,
        data: data,
    });
    return newProcess;
};
