'use strict';
const socketConn = require('socket.io-client');
const socketClient = socketConn.connect('http://localhost:8000');
let count = 0;
let userData = {
    "userName": "Hanmant Telange",
    "userId": "ABCS19091984"
}

let eventData = {
    "event": "subscribe",
    "symbol": "XXBTZUSD",
    "interval": 15,
    "userId": "ABCS19091984",
    "everyTrade": true
}

let userSubscription = {
    userData,
    eventData
}

const printCurrentTime = (message) => {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    console.log(message + datetime);
}

socketClient.on('connected', (message) => {
    console.log('Connection Establish with Server', message);
    socketClient.emit('userSubscription', userSubscription);
    printCurrentTime('Reauest Time ');
})

socketClient.on(userData.userId, data => {
    count++;
    if (count == 1) {
        printCurrentTime('Response received Time ');
    }
    console.log('OHLC Data: ', data);
})