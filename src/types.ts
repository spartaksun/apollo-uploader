export type UploadSuccessResolver = (result: any) => Promise<any>;

export interface AbortObserverInterface {
    subscribe: (xhr: XMLHttpRequest) => void;
    abort: () => void;
}
export interface HashMap<T> {
    [key: string]: T | any;
}
export interface FileUploadProcess {
    id: string;
    params?: string;
    file: FileType;
    fileSize: number;
    fileName: string;
    status: FileUploadStatuses;
    loaded: number;
    total: number;
    error: string | null;
    abort: boolean | null;
    result: string | any
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

export interface FileParams {
    crop?: CropInput
    bucket?: FileUploadBuckets;
}

export interface CropInput {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
}
export enum FileUploadStatuses {
    UPLOAD_PENDING = 'UPLOAD_PENDING',
    UPLOAD_IN_PROGRESS = 'UPLOAD_IN_PROGRESS',
    UPLOAD_DONE = 'UPLOAD_DONE',
    UPLOAD_ERROR = 'UPLOAD_ERROR',
    UPLOAD_ABORTED_BY_CLIENT = 'UPLOAD_ABORTED_BY_CLIENT',
    UPLOAD_PENDING_TO_ABORT = 'UPLOAD_PENDING_TO_ABORT',
    POST_UPLOAD_PROCESS_ERROR = 'POST_UPLOAD_PROCESS_ERROR',
    POST_UPLOAD_PROCESS_DONE = 'POST_UPLOAD_PROCESS_DONE',
}
