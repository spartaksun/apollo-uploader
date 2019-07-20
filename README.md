## Multiple file uploader based on Apollo Cache

See example <a href="https://github.com/spartaksun/apollo-uploader-example-app">React application</a>  (Typescript).

#### Install
```code
npm i apollo-uploader apollo-client apollo-cache-inmemory
```
#### Initialize

```code
import { createUploadLink, Uploader } from "apollo-uploader";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

const apolloClient =  new ApolloClient({
    link: createUploadLink('http://localhost'), // concat with your other links (i.e. http, error etc.)
    cache: new InMemoryCache({})
});
Uploader.init(apolloClient);
```
#### Basic usage
```code 
import * as React from 'react';
import { upload } from 'apollo-uploader';

class UploadExample extends React.Component {
    handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        upload(e.target.files[0], {})
            .subscribe((value: any) => console.log(value));
        
    };

    render() {
        return (
            <div>
                <input type="file" onChange={this.handleFileChange}/>
            </div>
        );
    }
}

```
#### Advanced usage (Typescript)
```code 
import * as React from 'react';
import { upload } from 'apollo-uploader';
import {FileUploadProcess, FileUploadStatuses} from "apollo-uploader/lib/types";


class UploadExample extends React.Component {
    handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        upload(e.target.files[0], {
                    crop: {
                        offsetX: 25,
                        offsetY: 37,
                        width: 600,
                        height: 600,
                    },
                    bucket: 'image'
                }).subscribe((uploadProcess: FileUploadProcess) => {
                      switch (uploadProcess.status) {
                          case FileUploadStatuses.UPLOAD_IN_PROGRESS:
                              console.log(`Upload in progress. Uploaded: ${uploadProcess.loaded} from ${uploadProcess.total}`);
                              break;
                          case FileUploadStatuses.UPLOAD_ERROR:
                              console.log(`Upload error: ${uploadProcess.error}`);
                              break;
                          case FileUploadStatuses.UPLOAD_DONE:
                              console.log(`File successfully loaded!`);
                              break;
          
                      }
                });
    };

    render() {
        return (
            <div>
                <input type="file" onChange={this.handleFileChange}/>
            </div>
        );
    }
}

```

#### Uploading statuses

```code 
enum FileUploadStatuses {
    UPLOAD_PENDING = 'UPLOAD_PENDING',
    UPLOAD_IN_PROGRESS = 'UPLOAD_IN_PROGRESS',
    UPLOAD_DONE = 'UPLOAD_DONE',
    UPLOAD_ERROR = 'UPLOAD_ERROR',
    UPLOAD_ABORTED_BY_CLIENT = 'UPLOAD_ABORTED_BY_CLIENT',
    UPLOAD_PENDING_TO_ABORT = 'UPLOAD_PENDING_TO_ABORT',
    POST_UPLOAD_PROCESS_ERROR = 'POST_UPLOAD_PROCESS_ERROR',
    POST_UPLOAD_PROCESS_DONE = 'POST_UPLOAD_PROCESS_DONE',
}
```



