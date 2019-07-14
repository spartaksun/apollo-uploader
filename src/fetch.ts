import { Error } from 'tslint/lib/error';

import parseHeaders from './parseHeaders';
import {HashMap} from "./types";

const fetch = (xhr: XMLHttpRequest, url: string, options: HashMap<string> = {}): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
        xhr.onload = () => {
            const opts = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
            } as any;

            opts.url = 'responseURL' in xhr ? xhr.responseURL : opts.headers.get('X-Request-URL');
            resolve(new Response(xhr.response, opts));
        };

        xhr.onabort = () => {
            reject(new Error('Upload aborted'));
        };
        xhr.onerror = () => {
            reject(new TypeError('Upload failed'));
        };
        xhr.ontimeout = () => {
            reject(new TypeError('Upload failed (timeout)'));
        };
        xhr.open(options.method, url, true);

        Object.keys(options.headers).forEach((key: any) => {
            xhr.setRequestHeader(key, options.headers[key]);
        });

        xhr.send(options.body);
    });
};

export default fetch;
