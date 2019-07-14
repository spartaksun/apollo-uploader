import { AbortObserverInterface } from './types';

class AbortObserver implements AbortObserverInterface {
    subscriber: XMLHttpRequest|null = null;

    subscribe = (xhr: XMLHttpRequest) => {
        this.subscriber = xhr;
    };

    abort = () => {
        if (this.subscriber !== null) {
            this.subscriber.abort();
        }
    };
}

export default AbortObserver;
