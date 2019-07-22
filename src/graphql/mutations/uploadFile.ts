import gql from "graphql-tag";

export const uploadFile = gql`
    mutation uploadFile($file: Upload!) {
        uploadFile(file: $file)
    }
`;
