import gql from "graphql-tag";

export const uploadFile = gql`
    mutation uploadFile($file: Upload!, $bucket: String!) {
        uploadFile(file: $file, bucket: $bucket) {
            id
        }
    }
`;
