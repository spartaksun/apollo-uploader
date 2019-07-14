import gql from "graphql-tag";

export const uploadFileLocal = gql`
    mutation uploadFileLocal($file: Upload!) {
        uploadFileLocal(file: $file) @client
    }
`;
