import {UploaderInstance} from './Uploader';
import {uploadFileLocal} from './graphql/mutations';
import {FetchResult} from "apollo-link";
import {Observable, Observer} from 'zen-observable-ts';
import {FileUploadProcess, FileUploadStatuses} from "./types";

export interface ParamsInterface {
    crop?: {
        offsetX: number,
        offsetY: number,
        width: number,
        height: number,
    },
    bucket?: string
}

export default (file: File, params?: ParamsInterface): Observable<any> => {
    let id: string = null;

    const client = UploaderInstance.getClient();
    const unsubscribe = () => {
        if (id) {
            UploaderInstance.unsubscribe(id);
            id = null
        }
    };

    if (client) {
        return new Observable((observer: Observer<any>) => {
            UploaderInstance.getClient().mutate({
                mutation: uploadFileLocal,
                variables: {
                    file,
                    params: params ? params : {}
                }
            }).then(({data: {uploadFileLocal}}: FetchResult<{ uploadFileLocal: FileUploadProcess }>) => {
                id = uploadFileLocal.id;
                UploaderInstance.subscribe(
                    id,
                    (process: FileUploadProcess) => {
                        switch (process.status) {
                            case FileUploadStatuses.UPLOAD_DONE:
                                observer.next(process);
                                observer.complete();
                                unsubscribe();
                                break;
                            case FileUploadStatuses.UPLOAD_ERROR:
                                observer.next(process);
                                observer.error(process.error);
                                unsubscribe();
                                break;
                            case FileUploadStatuses.UPLOAD_ABORTED_BY_CLIENT:
                                observer.next(process);
                                observer.complete();
                                unsubscribe();
                                break;
                            case FileUploadStatuses.POST_UPLOAD_PROCESS_DONE:
                                break;
                            default:
                                observer.next(process);
                        }
                    },
                    () => {
                        observer.complete();
                        unsubscribe()
                    }
                )
            }).catch((e: any) => {
                observer.error(e);
                unsubscribe();
            });
        });
    }

    throw Error('Client not initialized')
};

