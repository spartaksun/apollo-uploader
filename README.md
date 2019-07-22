See [example application.](https://github.com/spartaksun/apollo-uploader-example-app)

## Table of contents:
* [Install](#install)
* [Initialize](#initialize)
* [Basic usage](#basic-usage)
* [Advanced usage](#advanced-usage)
* [List of upload processes](#list-of-upload-processes)
* [Upload callback](#upload-callback)
* [Customize upload mutation](#customize-upload-mutation)
* [FileUploadProcess](#fileuploadprocess)
* [FileUploadStatuses](#fileuploadstatuses)


## Install
```
npm i apollo-uploader
```
## Initialize

```typescript jsx
import { createUploadLink, Uploader } from 'apollo-uploader';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const uploadLink = createUploadLink('http://site.com/grqphql')
const apolloClient =  new ApolloClient({
    link: uploadLink,
    cache: new InMemoryCache({})
});
Uploader.init({apolloClient});


```
## Initial configuration
| Property |      Type      |  Description |  Default |
|----------|:-------------:|:------|:------|
| apolloClient |  ApolloClient | ApolloClient instance  | no |
| onSuccess |  () => Promise | Callback called when upload is success | yes (stub) | 
| mutation |  DocumentNode | Mutation which uploader sends to server | mutation uploadFile($file: Upload!) {uploadFile(file: $file)} | 

**Note:** 
* Assumes that you already have installed `apollo-client` and some of Apollo cache implementation like `apollo-cache-inmemory`.
* Instead of direct passing `uploadLink` to `link` property at ApolloClient config, you should concat it with other links in your app, i.e http link. For example you can use `from()` from 'apollo-link':
```typescript jsx
...
import { from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';

const uri = 'http://site.com/grqphql';
const httpLink = new HttpLink({uri});
const apolloClient =  new ApolloClient({
    ...
    link: from([httpLink, uploadLink])
});
```

## Basic usage
```jsx harmony
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
## Advanced usage
```typescript jsx
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
## List of upload processes
You can get all changes of upload processes just by using Apollo Query component and `uploading` query:

```typescript jsx
import * as React from 'react';
import {Queries} from 'apollo-uploader';
import {Query} from "react-apollo";
import {FileUploadProcess} from "apollo-uploader/lib/types";

class UploadList extends React.Component {

    render(): React.ReactElement | string {
        return (
            <div>
                <h2>Upload processes</h2>
                <table>
                    <tbody>
                    <tr>
                        <th>id</th>
                        <th>fileName</th>
                        <th>status</th>
                        <th>fileSize</th>
                        <th>loaded</th>
                        <th>total</th>
                        <th>result</th>
                        <th>error</th>
                    </tr>

                    <Query query={Queries.uploading}>
                        {({data}: { data: { uploading: FileUploadProcess[] } }) =>
                            data.uploading.map((process: FileUploadProcess) => {
                                const result = JSON.parse(process.result);

                                return (
                                    <tr key={process.id}>
                                        <td> {process.id} </td>
                                        <td> {process.fileName} </td>
                                        <td> {process.status} </td>
                                        <td> {process.loaded} </td>
                                        <td> {process.fileSize} </td>
                                        <td> {process.total} </td>
                                        <td> {result.id} </td>
                                        <td> {process.error} </td>
                                    </tr>
                                )
                            })
                        }
                    </Query>
                    </tbody>
                </table>
            </div>
        );
    }
}
```
**Note:** Do not forget to wrap a root component with an ApolloProvider.

## Upload callback
You can pass a second argument as a callback function when initializing Uploader.
```typescript jsx
...

const onSuccess = (result: {id: string}): Promise<any> => {
     return new Promise((resolve: (result: any) => void, reject: () => void) => {
         // do some stuff here
         if(/* success */) {
             resolve(result);
         } else {
             reject();
         }
         // or call reject on error
         
     });
 };

Uploader.init({
    apolloClient, 
    onSuccess
});
```

## Customize upload mutation
Apollo-uploader sends a mutation with attached file. You need to implement resolver on your server for `uploadFile` mutation.
You can customize upload mutation by passing it in Uploader.init(). You `MUST NOT` change mutation name and parameter `file`.

```typescript jsx
...
import gql from "graphql-tag";

Uploader.init({
    ...
    mutation: gql`
      mutation uploadFile($file: Upload!, $customParam: String!) {
          uploadFile(file: $file, customParam: $customParam)
      }`
});
```
And then pass customParam to `upload()`:
````typescript jsx
import { upload } from 'apollo-uploader';

upload(file, {
            customParam: 'custom param value'
        })
````

## FileUploadProcess

| Property |      Type      |  Description |
|----------|:-------------:|:------|
| id       |  string | Internal ID (autogenerated).  |
| fileName |  string | Local file name.   |   
| fileSize | number  | File size in bytes.   |   
| status   | FileUploadStatuses |Status of uploading. |    
| loaded   | number | Number of bytes uploaded to server. |    
| total    | number | File size in bytes. You should use this value with `loaded` to get loading progress. |    
| result   | string | `uploadFile` property in server response. Use `JSON.parse()` to access is as an object.    | 

## FileUploadStatuses

| Status |     Description |
|----------|:------|
| UPLOAD_PENDING       |  File is waiting to be sent to the server. |
| UPLOAD_IN_PROGRESS       |  Upload in progress. |
| UPLOAD_DONE       |  Upload successfully finished. |
| UPLOAD_ERROR       |  Error happened during upload. |
| UPLOAD_ABORTED_BY_CLIENT       |  Process aborted by sending abort mutation or calling `abort()` method.   |
| POST_UPLOAD_PROCESS_ERROR      |  Called `reject()` in `upload callback`. |
| POST_UPLOAD_PROCESS_DONE       |  Called `resolve()` in `upload callback`. |


[![License](https://poser.pugx.org/thecodingmachine/graphqlite/license)](https://packagist.org/packages/thecodingmachine/graphqlite)



