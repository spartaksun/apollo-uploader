"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUploadBuckets;
(function (FileUploadBuckets) {
    FileUploadBuckets["VIDEO"] = "video";
    FileUploadBuckets["IMAGE"] = "image";
})(FileUploadBuckets = exports.FileUploadBuckets || (exports.FileUploadBuckets = {}));
var FileUploadStatuses;
(function (FileUploadStatuses) {
    FileUploadStatuses["UPLOAD_PENDING"] = "UPLOAD_PENDING";
    FileUploadStatuses["UPLOAD_IN_PROGRESS"] = "UPLOAD_IN_PROGRESS";
    FileUploadStatuses["UPLOAD_DONE"] = "UPLOAD_DONE";
    FileUploadStatuses["UPLOAD_ERROR"] = "UPLOAD_ERROR";
    FileUploadStatuses["UPLOAD_ABORTED_BY_CLIENT"] = "UPLOAD_ABORTED_BY_CLIENT";
    FileUploadStatuses["UPLOAD_PENDING_TO_ABORT"] = "UPLOAD_PENDING_TO_ABORT";
    FileUploadStatuses["VIDEO_CREATION_ERROR"] = "VIDEO_CREATION_ERROR";
    FileUploadStatuses["VIDEO_CREATION_DONE"] = "VIDEO_CREATION_DONE";
})(FileUploadStatuses = exports.FileUploadStatuses || (exports.FileUploadStatuses = {}));
