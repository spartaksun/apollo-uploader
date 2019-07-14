export type UploadSuccessResolver = (id: string, fileName: string) => Promise<any>;

export interface AbortObserverInterface {
    subscribe: (xhr: XMLHttpRequest) => void;
    abort: () => void;
}
export interface HashMap<T> {
    [key: string]: T | any;
}
export interface FileUploadProcess {
    id: string;
    bucket?: FileUploadBuckets;
    file: FileType;
    fileSize: number;
    fileName: string;
    status: FileUploadStatuses;
    loaded: number;
    total: number;
    error: string | null;
    video: string | null;
    abort: boolean | null;
}
export enum FileUploadBuckets {
    VIDEO = 'video',
    IMAGE = 'image',
}
export interface FileType {
    name: string;
    size: number;
    mimeType: string;
}
export enum FileUploadStatuses {
    UPLOAD_PENDING = 'UPLOAD_PENDING',
    UPLOAD_IN_PROGRESS = 'UPLOAD_IN_PROGRESS',
    UPLOAD_DONE = 'UPLOAD_DONE',
    UPLOAD_ERROR = 'UPLOAD_ERROR',
    UPLOAD_ABORTED_BY_CLIENT = 'UPLOAD_ABORTED_BY_CLIENT',
    UPLOAD_PENDING_TO_ABORT = 'UPLOAD_PENDING_TO_ABORT',
    VIDEO_CREATION_ERROR = 'VIDEO_CREATION_ERROR',
    VIDEO_CREATION_DONE = 'VIDEO_CREATION_DONE',
}
