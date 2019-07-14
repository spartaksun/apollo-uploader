import {FileUploadStatuses, HashMap} from '../../types';

export const abortUploadFileLocal = (_: any, args: HashMap<any>, context: any): any => {
    const { id } = args;
    context.cache.writeData({
        id: `UploadProcess:${id}`,
        data: {
            status: FileUploadStatuses.UPLOAD_PENDING_TO_ABORT,
        },
    });

    return id;
};
