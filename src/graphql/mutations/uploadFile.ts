import gql from "graphql-tag";

export const uploadFile = gql`
    mutation uploadFile($file: Upload!, $bucket: String, $crop: CropInput ) {
        uploadFile(file: $file, bucket: $bucket, crop: $crop) {
            id
        }
    }
`;
