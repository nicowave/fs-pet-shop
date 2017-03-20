// expressServer.js
// nicolas roldos
//
'use strict'
const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const express = require('express')
const filepath = path.join(__dirname, 'pets.json')
const app = express()
const port = process.env.PORT || 8000


app.use(function(req, res, next) {
  // urlPath variable retireves 'pathname' value from Url parsed object
  let urlPath = req.url
  let urlArray = urlPath.split('/')
  let method = req.method
  let encoding = 'utf-8'

  // call 'readWriteServer()' function to handle different requests
  readWriteServer(req, res, filepath, encoding, urlArray)
})


// function handles different HTTP requests and responses
function readWriteServer(req, res, filepath, encoding, urlArray) {
    // set the petIndex to what is present in the urlArray at position '2'
    let petIndex = urlArray[2]

    // read the file from the 'HTTP' 'GET' request
    fs.readFile(filepath, encoding, function(err, json) {
      let parsedJSON = JSON.parse(json)
      // handle internal server error here
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      // switch on the length of the urlArray that has been split based on '/'
      switch (urlArray.length) {
        // if the urlArray is only 2 pieces 'long'
        case 2:
          return res.send(parsedJSON)
        // if urlArray has 3 parts (3 items long) use 'petIndex' to handle different
        //  request
        case 3:
          if (petIndex >= 0 && petIndex <= parsedJSON.length -1) {
            // no need to 'stringify()' the 'parsedJSON'
            // define 'pet' at index 'petIndex' in 'parsedJSON' object
            let pet = parsedJSON[petIndex]
            // send pet in 'res' response & return
            return res.send(pet)

          } else if (petIndex < 0 || petIndex > parsedJSON.length -1) {
            // if 'petIndex' is out of range for json data then
            // return a 'response' 'Not found' and 'statusCode' 404
            res.sendStatus(404)
          }
        }
    })
}

// listen on port '8000' as defined above in 'port' constant
app.listen(port, function() {
  console.log('listening on port:', port);
})

// export the 'server' function
module.exports = app
