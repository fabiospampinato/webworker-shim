
/* IMPORT */

import {Worker} from 'node:worker_threads';

/* MAIN */

class WorkerShim extends EventTarget {

  /* VARIABLES */

  #worker: Worker;

  /* CONSTRUCTOR */

  constructor ( url: string, options?: WorkerOptions ) {

    super ();

    /* NORMALIZE */

    url = url.trim ();

    /* CREATE */

    const prefix = 'data:text/javascript;charset=utf-8,';

    if ( !url.startsWith ( prefix ) ) throw new Error ( `Only urls that start with "${prefix}" are supported` );

    const setup = encodeURIComponent ( 'import {parentPort} from "node:worker_threads";globalThis.self = globalThis;globalThis.addEventListener = parentPort.on.bind ( parentPort );globalThis.postMessage = parentPort.postMessage.bind ( parentPort );' );
    const module = url.slice ( prefix.length );
    const code = `${prefix}${setup}${module}`;

    this.#worker = new Worker ( new URL ( code ) );

    /* INIT */

    this.#worker.on ( 'message', data => {
      const event = new Event ( 'message' );
      event['data'] = data;
      this.dispatchEvent ( event );
    });

    this.#worker.on ( 'error', error => {
      const event = new Event ( 'error' );
      event['data'] = error;
      this.dispatchEvent ( event );
    });

    this.#worker.on ( 'exit', exitCode => {
      const event = new Event ( 'close' );
      event['data'] = Number ( exitCode ?? 0 );
      this.dispatchEvent ( event );
    });

  }

  /* API */

  postMessage ( message: any, transfer?: Transferable[] ): void {

    const event = new Event ( 'message' );

    event['data'] = message;

    this.#worker.postMessage ( event, transfer as any ); //FIXME: The types between Node.JS and the browser are actually different here :(

  }

  terminate (): void {

    this.#worker.terminate ();

  }

}

/* EXPORT */

export default globalThis.Worker || WorkerShim;
