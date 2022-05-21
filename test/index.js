
/* IMPORT */

import {describe} from 'fava';
import Worker from '../dist/node.js';

/* MAIN */

describe ( 'WebWorker Shim', it => {

  it ( 'works', async t => {

    return new Promise ( resolve => {

      const backend = `data:text/javascript;charset=utf-8,${encodeURIComponent (`
        addEventListener ( 'message', event => {
          if ( event.data === 'ping' ) {
            postMessage ( 'pong' );
          }
        });
      `)}`;

      const frontend = new Worker ( backend );

      frontend.addEventListener ( 'message', event => {

        t.is ( event.data, 'pong' );

        resolve ();

        frontend.terminate ();

      });

      frontend.postMessage ( 'ping' );

    });

  });

});
