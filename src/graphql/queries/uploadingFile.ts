import gql from "graphql-tag";

export const uploadingFile = gql`
    query uploadinFile {
        uploading @client {
            id
            file
            fileSize
            fileName
            status
            loaded
            total
            error
            params
        }
    }
`;
