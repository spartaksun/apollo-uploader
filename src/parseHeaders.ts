const parseHeaders = (rawHeaders: any) => {
    const headers = new Headers();
    const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');

    preProcessedHeaders.split(/\r?\n/).forEach((line: string) => {
        const parts = line.split(':');
        const key = parts.shift().trim();
        if (key) {
            const value = parts.join(':').trim();
            headers.append(key, value);
        }
    });

    return headers;
};

export default parseHeaders;
