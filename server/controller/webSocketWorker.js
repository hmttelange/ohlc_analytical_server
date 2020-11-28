'use strict';
const config = require('../config');
const socketio = require('socket.io')(config.socketPort);
const { MessageChannel, parentPort } = require('worker_threads');
const { port1: fsmPort, port2: socketWorkerPort } = new MessageChannel();

/**
 * Variable yo h olds all the user subscriptions to serve request
 */
let userSubscriptions = [];
let fileReader;

/**
 * Pass the socketWorkerPort to main thread to establish the message channel between fsm_worker thread
 */
parentPort.postMessage({
    port: socketWorkerPort
}, [socketWorkerPort])

/**
 * listen to 'message' event from parent port with the port details of fileReader thread 
 * to send the subsription data for further processing
 */
parentPort.on('message', value => {    
    if(value.port) {
        fileReader = value.port;
    }
})

/**
 * Function that persist the subscription data and pass the same to fileReader thread via postMessage
 * @param {object} subscription - user subscription data from client
 */

const handleUserSubscriptions = (subscription) => {
    subscription['userFound'] = false;
    if(subscription.eventData.event.toLowerCase() == "subscribe") {                
        for(let userSubscription of userSubscriptions) {                    
            if(userSubscription.userData.userId == subscription.userData.userId && userSubscription.eventData.symbol == subscription.eventData.symbol) {
                subscription['userFound'] = true;
                break;
            }
        }
        if(!subscription['userFound']){
            userSubscriptions.push(subscription)
        }
        fileReader.postMessage(subscription.eventData);
    }
}

/**
 * Function finds out the subscription available in userSubscriptions array or not
 * @param {object} subscriptionObject
 * 
 */
const emitResponseData = (subscriptionObject) => {
    let flagUserFound = false;
    let foundUserDetails;
    
    for(let user of userSubscriptions) {
        const symbol = subscriptionObject.symbol || subscriptionObject.sym || subscriptionObject.key;
        if(user.eventData.symbol == symbol) {
            flagUserFound = true
            foundUserDetails = user.userData
            break;
        }
    }
    return {flagUserFound, foundUserDetails};
}

/**
 * Function to listen varion socket events and emit the response data 
 * received from fsm_thread to respective client
 */

const startSocketServer = () => {    
    socketio.on('connection', (socket) => {        
        console.log('Client conneded to server');
        socket.emit('connected', 'Client connection established');
    
        socket.on('disconnect', () => console.log('Client Disconnected'));
    
        /**
         * Listen the userSubscription event from client.
         */
        socket.on('userSubscription', (subscription) => handleUserSubscriptions(subscription));

        /**
         * listener to receive message from fsm with computed OHLC result and emit the same to client
         */
        fsmPort.on('message', inputData => {            
            const { flagUserFound, foundUserDetails } = emitResponseData(inputData);
            if(flagUserFound) {
                socket.emit(foundUserDetails.userId, inputData);
            }
        });
    })
}

startSocketServer();