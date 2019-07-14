import {Observer} from 'zen-observable-ts';
import {Operation, ApolloLink, Observable, NextLink} from 'apollo-link';
import {
    selectURI,
    selectHttpOptionsAndBody,
    fallbackHttpConfig,
    serializeFetchParameter,
    parseAndCheckHttpResponse,
} from 'apollo-link-http-common';

import linkFetch from './fetch';
import AbortObserver from './AbortObserver';

const createUploadLink = (uri: string) => {
    return new ApolloLink(
        (operation: Operation, forward: NextLink): any => {
            if (operation.operationName !== 'uploadFile') {
                return forward(operation);
            }

            const {
                variables: {file},
            } = operation;
            if (!file) {
                throw Error('Upload operation must contain a file');
            }

            const context = operation.getContext();
            const contextConfig = {
                http: context.http,
                options: context.fetchOptions,
                credentials: context.credentials,
                headers: context.headers,
            };
            const {options, body} = selectHttpOptionsAndBody(operation, fallbackHttpConfig, {}, contextConfig);

            delete options.headers['content-type'];

            options.body = new FormData();
            options.body.append('operations', serializeFetchParameter(body, 'Payload'));
            options.body.append('map', JSON.stringify({0: ['variables.file']}));
            options.body.append(0, file, file.name);

            return new Observable((observer: Observer<any>) => {
                const xhr = new XMLHttpRequest();
                if (context.abortObserver instanceof AbortObserver) {
                    context.abortObserver.subscribe(xhr);
                }

                if (xhr.upload && context.onProgress) {
                    xhr.upload.onprogress = context.onProgress;
                }

                linkFetch(xhr, selectURI(operation, uri), options)
                    .then((response: any) => {
                        // Forward the response on the context.
                        operation.setContext({response});
                        return response;
                    })
                    .then(parseAndCheckHttpResponse(operation))
                    .then((result: any) => {
                        observer.next(result);
                        observer.complete();
                    })
                    .catch((error: any) => {
                        if (error.name === 'AbortError') {
                            // Fetch was aborted.
                            return;
                        }

                        if (error.result && error.result.errors && error.result.data) {
                            // There is a GraphQL result to forward.
                            observer.next(error.result);
                        }

                        observer.error(error);
                    });
            });
        }
    );
};

export default createUploadLink;
