import Uploader from "./Uploader";
import createUploadLink from './createUploadLink';

import {
    uploadFileLocal as uploadFileLocalResolver,
    resetAllUploadsLocal as resetAllUploadsLocalResolver,
    abortUploadFileLocal as abortUploadFileLocalResolver
} from './graphql/resolvers'

import {uploadingVideoFile} from './graphql/queries'

export default {
    Uploader,
    createUploadLink,
    uploadFileLocalResolver,
    resetAllUploadsLocalResolver,
    abortUploadFileLocalResolver,
    uploadingVideoFile
};
