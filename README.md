# "OHLC" Analytical Server
# Analytical server "OHLC" time series based on the 'Trades' input dataset

# System details
It has two parts
1. Server Application - Analytical Server to read trades json and generates time series OHLC packets
2. Client Application - Fires subscription event and prints response in console/terminal

# Server Application details

Server application contains of following components:

1. Main file (app.js)
    - Contains logic to start the express server.
    - Requires 'workerCommunication' service module which spawns the worker threads and establish the communication channel between them.


There are 3 threads in the server application
# fileReaderWorker 
In this thread we read file line by line and pass that data to FSM worker thread

# fsmWorker: (Finite-State-Machine) computes OHLC packets based on time interval subscribed by client.
In this worker thread we generate OHLC packets based on the user subscription and interval subscribed
    
# webSocketWorker: Client subscriptions come here. Maintains user subscription, and publishes the BAR OHLC data as computed in real time

2. Client Application

socket.io-client library is used to establish the connection Analytical server and print the OHLC data on client console

## Getting Started

Following are the details on running application LINUX environment. 

### Environment Details - Needs following environment to be setup on machine to run the system

Note : You can skip these steps if you already have Node and npm installed on your system.
 
1) Install node and Git:

* [NodeJs](https://nodejs.org/en/) - How to install node?

2) Install git

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) - How to install Git?

 
### Installing/ Running locally

1) Create and enter into a folder where you want to clone the source code.

2) Fetch the source code from my github repo

```
>git clone https://github.com/hmttelange/ohlc_analytical_server.git
```

```
>git pull origin master
```

4) Install all the modules required to run the given application with following command(do the following step in client and server folder separately)

```
>npm install
```

5) Run the Server application by using following command(should be in server folder)

```
>npm start
```

5) Run the client application by using following command(should be client folder)

```
>node client.js
```

## Used npm packages

* [NPM](https://www.npmjs.com/) - Most of the modules are used
* [Node](https://nodejs.org) - NodeJS
* [express](http://expressjs.com/) -  NodeJS Web framework
* [SocketIO](https://socket.io) - Library for Socket communication
* [worker_threads] - Library for create workers threads in NodeJS
