import gql from "graphql-tag";

export const uploadingVideoFile = gql`
    query uploadingVideoFile {
        uploading @client {
            id
            file
            fileSize
            fileName
            status
            loaded
            total
            error
            video
            bucket
        }
    }
`;
