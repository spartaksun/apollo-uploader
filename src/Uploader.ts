import ApolloClient from 'apollo-client/ApolloClient';
import {FetchResult} from 'apollo-link';
import {defaultDataIdFromObject, NormalizedCacheObject} from 'apollo-cache-inmemory';
import {ApolloError} from 'apollo-client';

import {FileUploadStatuses, FileUploadProcess, HashMap} from './types';
import {uploadingFile} from './graphql/queries';
import {uploadFile} from './graphql/mutations';
import AbortObserver from './AbortObserver';
import {UploadSuccessResolver} from './types';
import {abortUploadFileLocal, uploadFileLocal, resetAllUploadsLocal} from './graphql/resolvers';

class Uploader {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    uploading: HashMap<FileUploadProcess> = {};
    abort: HashMap<AbortObserver> = {};
    onSuccess: (id: string, fileName: string) => Promise<any> = null;
    subscribers: HashMap<{
        callback: (process: FileUploadProcess) => void,
        finish: () => void
    }> = {};

    subscribe = (
        id: string,
        callback: (process: FileUploadProcess) => void,
        finish: () => void
    ): void => {
        this.subscribers[id] = {
            callback,
            finish
        };
    };

    unsubscribe = (id: string): void => {
        delete this.subscribers[id];
    };

    init = (apolloClient: ApolloClient<NormalizedCacheObject>, onSuccess?: UploadSuccessResolver) => {

        this.onSuccess = onSuccess;
        this.apolloClient = apolloClient;

        apolloClient.addResolvers({
            Mutation: {
                abortUploadFileLocal,
                uploadFileLocal,
                resetAllUploadsLocal
            },
        });
        apolloClient.writeData({data: {uploading: []}});
        apolloClient
            .watchQuery({
                query: uploadingFile,
            })
            .forEach(({data: {uploading}}: { data: { uploading: Array<FileUploadProcess> } }) => {
                this.refreshUploadingList(uploading);
                this.processAll(uploading);
            })
            .catch(() => new Error('Watching query error'));
    };

    getClient = (): ApolloClient<any> => {
        return this.apolloClient
    };

    refreshUploadingList = (uploading: FileUploadProcess[]) => {
        this.uploading = {};
        uploading.forEach((process: FileUploadProcess) => (this.uploading[process.id] = process));
    };

    getProcessById = (id: string) => {
        return this.uploading[id];
    };

    processAll = (uploading: FileUploadProcess[]) => {
        if (uploading.length) {
            uploading.forEach((process: FileUploadProcess) => {
                if (this.subscribers[process.id]) {
                    this.subscribers[process.id].callback(process);
                }
            });

            const inProgress = uploading.filter(
                (process: FileUploadProcess) => process.status === FileUploadStatuses.UPLOAD_IN_PROGRESS
            );
            const pendingUpload = uploading.filter(
                (process: FileUploadProcess) => process.status === FileUploadStatuses.UPLOAD_PENDING
            );

            uploading
                .filter((process: FileUploadProcess) => process.status === FileUploadStatuses.UPLOAD_PENDING_TO_ABORT)
                .forEach((process: FileUploadProcess) => this.abortProcess(process));

            if (pendingUpload.length && !inProgress.length) {
                this.startUpload(pendingUpload[0]);
            }
        } else {
            for (const k in this.abort) {
                if (this.abort.hasOwnProperty(k)) {
                    this.abort[k].abort();
                }
            }
            this.abort = {};
        }
    };

    pick = (obj: HashMap<any>, fields: string[]) =>
        fields.reduce(
            (acc: HashMap<any>, f: string) =>
                f in obj
                    ? {
                        ...acc,
                        [f]: obj[f],
                    }
                    : acc,
            {}
        );

    extractProcessFields = (process: FileUploadProcess) => {
        return this.pick(process, ['status', 'fileName', 'fileSize', 'error', 'loaded', 'total']);
    };

    updateProcess = (process: FileUploadProcess, params: any) => {
        const cached = this.getProcessById(process.id);
        const id = defaultDataIdFromObject(cached);
        this.apolloClient.writeData({
            id,
            data: {
                ...this.extractProcessFields(cached),
                ...params,
            },
        });
    };

    deleteAbortObserver = (process: FileUploadProcess) => {
        delete this.abort[process.id];
    };

    abortProcess = (process: FileUploadProcess) => {
        if (this.abort[process.id]) {
            this.abort[process.id].abort();
            this.deleteAbortObserver(process);
        }

        this.updateProcess(process, {status: FileUploadStatuses.UPLOAD_ABORTED_BY_CLIENT});
    };

    initAbortObserver = (process: FileUploadProcess) => {
        this.abort[process.id] = new AbortObserver();

        return this.abort[process.id];
    };

    handleProgress = (process: FileUploadProcess) => (e: ProgressEvent) => {
        const {loaded, total} = e;
        this.updateProcess(process, {loaded, total});
    };

    startUpload = (process: FileUploadProcess) => {
        this.updateProcess(process, {status: FileUploadStatuses.UPLOAD_IN_PROGRESS});
        let variables = {
            file: process.file,
        } as any;

        if (process.params) {
            const params = JSON.parse(process.params);
            if (params.crop) {
                variables.crop = params.crop
            }
            if (params.bucket) {
                variables.bucket = params.bucket
            }
        }

        this.apolloClient
            .mutate({
                mutation: uploadFile,
                variables,
                context: {
                    onProgress: this.handleProgress(process),
                    abortObserver: this.initAbortObserver(process),
                },
            })
            .then(({data: {uploadFile: {id, filename}}}: FetchResult<any>) => {
                this.deleteAbortObserver(process);
                this.updateProcess(process, {status: FileUploadStatuses.UPLOAD_DONE});

                if (this.onSuccess) {
                    this.onSuccess(id, filename)
                        .then(() => {
                            this.updateProcess(process, {
                                status: FileUploadStatuses.POST_UPLOAD_PROCESS_DONE,
                            });
                        })
                        .catch((error: Error) => {
                            this.updateProcess(process, {
                                status: FileUploadStatuses.POST_UPLOAD_PROCESS_ERROR,
                                error: error.message,
                            });
                        });
                } else {
                    this.updateProcess(process, {
                        status: FileUploadStatuses.POST_UPLOAD_PROCESS_DONE,
                    });
                }
            })
            .catch((error: ApolloError) => {
                this.deleteAbortObserver(process);

                this.updateProcess(process, {
                    status: FileUploadStatuses.UPLOAD_ERROR,
                    error: error.message,
                });
            });
    };
}

export const UploaderInstance = new Uploader();
