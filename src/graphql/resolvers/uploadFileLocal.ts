import uuid = require('uuid/v4');
import {FileUploadStatuses, FileUploadBuckets, HashMap} from '../../types';
import { uploadingFile } from '../queries';

export const uploadFileLocal = (_: any, { file, params }: HashMap<any>, { cache }: any): any => {
    const previous = cache.readQuery({ query: uploadingFile }) as any;
    const newProcess = {
        __typename: 'UploadProcess',
        file,
        id: uuid(),
        params: JSON.stringify(params),
        fileSize: file.size,
        fileName: file.name,
        status: FileUploadStatuses.UPLOAD_PENDING,
        loaded: 0,
        total: 0,
        error: '',
        video: '',
    };
    const data = {
        uploading: [...previous.uploading, newProcess],
    };

    cache.writeQuery({
        query: uploadingFile,
        data,
    });

    return newProcess;
};
