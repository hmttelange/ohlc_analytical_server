'use strict';
const { Worker: CreateWorkerThread } = require('worker_threads');
const fileReaderWorkerThread = new CreateWorkerThread('./controller/fileReaderWorker.js');
const fsmWorkerThread = new CreateWorkerThread('./controller/fsmWorker.js');
const webSockeWorkerThread = new CreateWorkerThread('./controller/webSocketWorker.js');


/**
 * Function to create worker threads to handle task
 */
const startWorkerThreads = () => {

    /**
     * Listener function that listen the message event from fileRead worker thread and pass port to  
     * webSockeWorkerThread worker to establish the communication channel
     */
    fileReaderWorkerThread.on('message', data => {
        webSockeWorkerThread.postMessage({
            port: data.port
        }, [data.port])
    })

   
     /**
      * Listener function that listen message event from FSC worker thread and pass the port to fileReaderWorkerThread
      * worker to to establish the communication channel.
      */
    fsmWorkerThread.on('message', data => {
        fileReaderWorkerThread.postMessage({
            port: data.port
        }, [data.port])
    })

      /**
      * Listener function that listen message event from web socket worker thread and pass the port to fileReaderWorkerThread
      * worker to to establish the communication channel.
      */
    webSockeWorkerThread.on('message', data => {
        fsmWorkerThread.postMessage({
            port: data.port
        }, [data.port])
    })
}

module.exports = startWorkerThreads;