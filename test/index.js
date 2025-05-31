
/* IMPORT */

import {describe} from 'fava';
import Worker from '../dist/node.js';

/* MAIN */

describe ( 'WebWorker Shim', it => {

  it ( 'support messaging with a worker', t => {

    return new Promise ( resolve => {

      const worker = new Worker (`
        data:text/javascript;charset=utf-8,${encodeURIComponent (`
          addEventListener ( 'message', event => {
            if ( event.data === 'ping' ) {
              postMessage ( 'pong' );
            }
          });
        `)}
      `);

      worker.addEventListener ( 'message', event => {

        worker.terminate ();

        t.is ( event.data, 'pong' );

        resolve ();

      });

      worker.postMessage ( 'ping' );

    });

  });

});
