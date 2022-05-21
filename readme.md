# WebWorker Shim

A tiny shim for WebWorker (data URI only) that works in Node.

## Install

```sh
npm install --save webworker-shim
```

## Usage

Only WebWorkers encoded as a `data:text/javascript;charset=utf-8,*` string are supported.

```ts
import WebWorker from 'webworker-shim';

const worker = new Worker ( `data:text/javascript;charset=utf-8,${encodeURIComponent (`
  addEventListener ( 'message', event => {
    if ( event.data === 'ping' ) {
      postMessage ( 'pong' );
    }
  });
`)}`);

worker.addEventListener ( 'message', event => {
  console.log ( event.data ); // => 'pong'
});

worker.postMessage ( 'ping' );
```

## License

MIT © Fabio Spampinato
