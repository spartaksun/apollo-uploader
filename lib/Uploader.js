"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
var types_1 = require("./types");
var queries_1 = require("./graphql/queries");
var mutations_1 = require("./graphql/mutations");
var AbortObserver_1 = tslib_1.__importDefault(require("./AbortObserver"));
var Uploader = (function () {
    function Uploader() {
        var _this = this;
        this.uploading = {};
        this.abort = {};
        this.onSuccess = null;
        this.subscribe = function (apolloClient, onSuccess) {
            _this.onSuccess = onSuccess;
            _this.apolloClient = apolloClient;
            _this.apolloClient
                .watchQuery({
                query: queries_1.uploadingVideoFile,
            })
                .forEach(function (_a) {
                var uploading = _a.data.uploading;
                _this.refreshUploadingList(uploading);
                _this.processAll(uploading);
            })
                .catch(function (e) { return console.log('Error when watchQuery:', e); });
        };
        this.refreshUploadingList = function (uploading) {
            _this.uploading = {};
            uploading.forEach(function (process) { return (_this.uploading[process.id] = process); });
        };
        this.getProcessById = function (id) {
            return _this.uploading[id];
        };
        this.processAll = function (uploading) {
            if (uploading.length) {
                var inProgress = uploading.filter(function (process) { return process.status === types_1.FileUploadStatuses.UPLOAD_IN_PROGRESS; });
                var pendingUpload = uploading.filter(function (process) { return process.status === types_1.FileUploadStatuses.UPLOAD_PENDING; });
                uploading
                    .filter(function (process) { return process.status === types_1.FileUploadStatuses.UPLOAD_PENDING_TO_ABORT; })
                    .forEach(function (process) { return _this.abortProcess(process); });
                if (pendingUpload.length && !inProgress.length) {
                    _this.startUpload(pendingUpload[0]);
                }
            }
            else {
                for (var k in _this.abort) {
                    if (_this.abort.hasOwnProperty(k)) {
                        _this.abort[k].abort();
                    }
                }
                _this.abort = {};
            }
        };
        this.pick = function (obj, fields) {
            return fields.reduce(function (acc, f) {
                var _a;
                return f in obj
                    ? tslib_1.__assign({}, acc, (_a = {}, _a[f] = obj[f], _a)) : acc;
            }, {});
        };
        this.extractProcessFields = function (process) {
            return _this.pick(process, ['status', 'fileName', 'fileSize', 'error', 'loaded', 'total', 'video']);
        };
        this.updateProcess = function (process, params) {
            var cached = _this.getProcessById(process.id);
            var id = apollo_cache_inmemory_1.defaultDataIdFromObject(cached);
            _this.apolloClient.writeData({
                id: id,
                data: tslib_1.__assign({}, _this.extractProcessFields(cached), params),
            });
        };
        this.deleteAbortObserver = function (process) {
            delete _this.abort[process.id];
        };
        this.abortProcess = function (process) {
            if (_this.abort[process.id]) {
                _this.abort[process.id].abort();
                _this.deleteAbortObserver(process);
            }
            _this.updateProcess(process, { status: types_1.FileUploadStatuses.UPLOAD_ABORTED_BY_CLIENT });
        };
        this.initAbortObserver = function (process) {
            _this.abort[process.id] = new AbortObserver_1.default();
            return _this.abort[process.id];
        };
        this.handleProgress = function (process) { return function (e) {
            var loaded = e.loaded, total = e.total;
            _this.updateProcess(process, { loaded: loaded, total: total });
        }; };
        this.startUpload = function (process) {
            _this.updateProcess(process, { status: types_1.FileUploadStatuses.UPLOAD_IN_PROGRESS });
            _this.apolloClient
                .mutate({
                mutation: mutations_1.uploadFile,
                variables: {
                    file: process.file,
                    bucket: process.bucket,
                },
                context: {
                    onProgress: _this.handleProgress(process),
                    abortObserver: _this.initAbortObserver(process),
                },
            })
                .then(function (_a) {
                var _b = _a.data.uploadFile, id = _b.id, filename = _b.filename;
                _this.deleteAbortObserver(process);
                _this.updateProcess(process, { status: types_1.FileUploadStatuses.UPLOAD_DONE });
                if (_this.onSuccess) {
                    _this.onSuccess(id, filename)
                        .then(function (id) {
                        _this.updateProcess(process, {
                            status: types_1.FileUploadStatuses.VIDEO_CREATION_DONE,
                            video: id,
                        });
                    })
                        .catch(function (error) {
                        _this.updateProcess(process, {
                            status: types_1.FileUploadStatuses.VIDEO_CREATION_ERROR,
                            error: error.message,
                        });
                    });
                }
                else {
                    _this.updateProcess(process, {
                        status: types_1.FileUploadStatuses.VIDEO_CREATION_DONE,
                        video: id,
                    });
                }
            })
                .catch(function (error) {
                _this.deleteAbortObserver(process);
                _this.updateProcess(process, {
                    status: types_1.FileUploadStatuses.UPLOAD_ERROR,
                    error: error.message,
                });
            });
        };
    }
    return Uploader;
}());
exports.default = new Uploader();
