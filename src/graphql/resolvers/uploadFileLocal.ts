import uuid = require('uuid/v4');
import {FileUploadStatuses, FileUploadBuckets, HashMap} from '../../types';
import { uploadingVideoFile as queryUploadVideoFile } from '../queries';

export const uploadFileLocal = (_: any, { file }: HashMap<any>, { cache }: any): any => {
    const previous = cache.readQuery({ query: queryUploadVideoFile }) as any;
    const newProcess = {
        __typename: 'UploadProcess',
        file,
        bucket: FileUploadBuckets.IMAGE,
        id: uuid(),
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
        query: queryUploadVideoFile,
        data,
    });

    return newProcess;
};
