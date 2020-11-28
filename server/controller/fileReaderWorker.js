'use strict';
// External dependencies
const { MessageChannel, parentPort } = require('worker_threads');
const readline = require('readline');
const fs = require('fs');
const { port1: socketWorkerPort, port2: fileRederPort } = new MessageChannel();
let fsmWorker;

/**
 * Pass the fileRederPort to main thread to establish the message channel between fsmWorker thread
 */
parentPort.postMessage({
    port: fileRederPort
}, [fileRederPort]);

/**
 * Listener function to listen the 'message' event from web socket worker thread to accept 
 * and pass the port to fsmWorker thread to establish the communication channel.
 */
parentPort.on('message', value => {
    if (value.port) {
        fsmWorker = value.port;
    }
})


 /**
  * Function that reads the Trades data from JSON file and send that packets to  FSM (Finite-State-Machine) worker thread
  * @param {Object} subscription 
  */
const readDataFromJSONFile = (subscription) => {
    return new Promise((resolve) => {
        const stream = fs.createReadStream('./assets/trades.json');
        const readInterface = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        })
        stream.once('error', _ => resolve(null));
        readInterface.on('line', line => {
            setTimeout(() => {
                processTradeByLine(subscription, JSON.parse(line))
            }, 200);
        });
        readInterface.on('close', () => console.log('close'));
    });
}

/**
 * Function that receive data from readDataFromJSONFile, filter for symbol and pass the data for processing
 * @param {object} subscription - subscription data
 * @param {object} data - trades packet data
 */
const processTradeByLine = (subscription, data) => {
    if (subscription.symbol == data.sym) {
        let messageData = {
            subscription: subscription,
            data: data
        }
        fsmWorker.postMessage(messageData);
    }
}

/**
 * Event listenr function to receive subcription data from web scoket worker thread and pass for reading trades data from file
 */

socketWorkerPort.on('message', subscription => {
    readDataFromJSONFile(subscription);
})