
'use strict';
// External dependencies
const express = require('express');
const app = express();

// Enternal dependencies
const config = require('./config');
const startWorkerThreads = require('./service/workerCommunication.js');


// Function print all error logs on console
const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

// Function handle server error
const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

// Function to handle all sever errors
const errorHandler = (err, req, res, next) => {
  res.status(500)
  res.render('error', { error: err })
}

// All Error handler middleware 
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

// Start express server 
app.listen(config.port, () => {
  console.log("Analytical server started on port:", config.port)
  startWorkerThreads();
})