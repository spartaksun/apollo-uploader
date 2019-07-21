import {UploaderInstance as Uploader} from "./Uploader";
import {createUploadLink} from './createUploadLink';
import upload from './upload';

import {uploadFileLocal, uploadFile } from './graphql/mutations';
import {uploadingFile} from './graphql/queries';


const Queries = {
    uploading: uploadingFile
};

const Mutations = {
    uploadFileLocal,
    uploadFile
};

export {
    Uploader,
    createUploadLink,
    upload,
    Queries,
    Mutations
};




