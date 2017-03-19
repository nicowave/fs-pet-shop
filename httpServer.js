// httpServer.js
// nicolas roldos
//

'use strict'
const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const filepath = path.join(__dirname, 'pets.json')
const port = process.env.PORT || 8000


const server = http.createServer(function(req, res){
  // urlPath variable retireves 'pathname' value from Url parsed object
  let urlPath = req.url
  let urlArray = urlPath.split('/')
  let method = req.method
  let encoding = 'utf-8'
  // call readWriteServer() to handle different requests
  readWriteServer(req, res, filepath, encoding, urlArray)

})


server.listen(port, function(){
  console.log('listening on port', port)
})


function readWriteServer(req, res, filepath, encoding, urlArray) {
    // set the petIndex to what is present in the urlArray at position '2'
    let petIndex = urlArray[2]
    // read the file from the 'HTTP' 'GET' request
    fs.readFile(filepath, encoding, function(err, json){
      let parsedJSON = JSON.parse(json)
      console.log('length of json data:\n', parsedJSON.length);
      // handle internal server error here...
      if (err) {
        console.error(err.stack)
        res.statusCode = 500
        res.setHeader('Content-type', 'application/json')
        return res.end('Internal server error')
      }
      // switch on the length of the urlArray that has been split based on '/'
      switch (urlArray.length) {
        // if the urlArray is only 2 pieces 'long'
        case 2:
          res.statusCode = 200
          res.setHeader('Content-type', 'application/json')
          return res.end(json)
        // if urlArray has 3 parts (3 items long) use 'petIndex' to handle different
        //  request
        case 3:
          if (petIndex >= 0 && petIndex <= parsedJSON.length -1) {
            let pet = parsedJSON[petIndex]
            pet = JSON.stringify(pet)
            res.statusCode = 200
            res.setHeader('Content-type', 'application/json')
            return res.end(pet)

          } else if (petIndex < 0 || petIndex > parsedJSON.length -1) {
            // if 'petIndex' is out of range for json data then
            // return a 'response' 'Not found' and 'statusCode' 404
            res.statusCode = 404
            res.setHeader('Content-type', 'text/plain')
            return res.end('Not Found')
          }
        }
    })
}
// export the 'server' function
module.exports = server
