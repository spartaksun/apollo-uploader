import gql from "graphql-tag";

export const uploadFileLocal = gql`
    mutation uploadFileLocal($file: Upload!, $params: FileParams) {
        uploadFileLocal(file: $file, params: $params) @client
    }
`;
