// restfulExpressServer.js
// nicolas roldos
//

'use strict'
const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const filepath = path.join(__dirname, 'pets.json')

const app = express()
const port = process.env.PORT || 8000

app.disable('x-powered-by')
app.use(morgan('short'))
app.use(bodyParser.json())


app.get('/pets', function(req, res) {

  // if the request is GET and includes '/pets' URL endpoint
  //  read 'pets.json' and send back raw 'json' object in 'res' response
  fs.readFile(filepath, 'utf8', function(err, petJson) {
    // catch any errors in reading the 'pets.json' file
    if (err) {  return res.sendStatus(500) }

    // set the 'res' response body
    // send the raw 'petJson' data
    res.set('Content-Type', 'application/json')
    res.send(petJson)
  })
})


app.get('/pets/:id', function(req, res) {

  fs.readFile(filepath, 'utf8', function(err, petJson) {
    // catch any errors in reading the 'pets.json' file
    if (err) { return res.sendStatus(500) }

    // use the 'req' request body 'parameters to get the ':id' from GET request
    //  after '...pets/'
    // then parse the 'petsJSON' into a JSON object that can be manipulated
    let id = Number.parseInt(req.params.id)
    let pets = JSON.parse(petJson)

    // check if 'id' is valid: within array-range & a 'Number' type
    //  if 'invalid' send 'res' response code: 404
    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404)
    }

    // set the 'res' response body
    // 'stringify' 'pets' at index set by 'id' for requested 'pet'
    let pet = JSON.stringify(pets[id])
    res.set('Content-Type', 'application/json')
    res.send(pet)
  })
})


app.post('/pets', function(req, res) {

  // check if all parts of 'req' request are sent to build a new pet object
  //  if 'incomplete' send 'res' response code: 404
  if (!req.body.name || !req.body.age || !req.body.kind) {
    res.sendStatus(400)

  } else {
    // else proceed to reading and writing a 'new' 'pet' object
    // read the 'pets.json' file and add the new 'pet' object to the array of objects
    fs.readFile(filepath, 'utf8', function(err, petJson) {
      // catch any errors in reading the 'pets.json' file
      if (err) { return res.sendStatus(500) }

      // parse file so it is a valid 'json' object that can be manipulated
      let pets = JSON.parse(petJson)

      // new 'pet' is in the 'req.body', set variable 'pet' to value
      let pet = req.body
      pets.push(pet)

      // 'stringify' updated 'pets' object so it can be sent in 'res' response
      pets = JSON.stringify(pets)

      // write the updated 'pets' object to the 'pets.json' file & send 'res'
      fs.writeFile(filepath, pets, function(err) {
        // handle any errors in writing changes to file 'pets.json'
        if (err) { throw error }
        // send 'res' response if no 'error'
        res.send(pet)
      })
    })
  }
})


app.patch('/pets/:id', function(req, res) {

  // set 'name' 'age' & 'kind' for pet object 'to-be-modified' in patch
  let name = req.body.name
  let age = req.body.age
  let kind = req.body.kind

  // check if attributes of 'to-be-modified' object are 'complete' & correct type
  if (!name && (!age || typeof age !== 'number') && !kind) {
    res.sendStatus(400)

  } else {
    // read 'pets.json' to retrive json object & update it
    fs.readFile(filepath, 'utf8', function(err, petJson) {
      // handle any errors in reading 'pets.json'
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      // parse object so it can be manipulated
      let pets = JSON.parse(petJson)

      // use 'req' request 'params' to update appropriate attributes of object
      // for 'name' param update 'name' attribute
      if (name) {
        pets[req.params.id].name = name
      }
      // for 'number' param update 'number' attribute
      if (age && typeof age === 'number') {
        pets[req.params.id].age = age
      }
      // for 'kind' param update 'kind' attribute
      if (kind) {
        pets[req.params.id].kind = kind
      }
      // 'stringify' updated array-of-objects before sending updated pet object...
      // ...in 'res' response & writing changes to 'pets.json' file
      petJson = JSON.stringify(pets)

      fs.writeFile(filepath, petJson, function(err) {
        // handle any errors in writing changes to file 'pets.json'
        if (err) { throw error }
        // send 'res' response if no 'error'
        res.send(pets[req.params.id])
      })
    })
  }
})


app.delete('/pets/:id', function(req, res) {
  fs.readFile(filepath, 'utf8', function(err, petJson) {
    // handle any errors in reading 'pets.json'
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    // parse object so it can be manipulated
    let pets = JSON.parse(petJson)

    // splice array of 'pet' objects at 'index' ':id' from 'req' request 'params'
    let outgoing = pets.splice(req.params.id, 1)

    // 'stringify' updated array-of-objects 'pets'
    // ...so it can be 'written' with update (deleted object) & ...
    // ...'deleted-object' can be sent in 'res' response
    pets = JSON.stringify(pets)

    fs.writeFile(filepath, pets, function(err) {
      // handle any errors in writing changes to file 'pets.json'
      if (err) { throw error }
      // send 'res' response of 'deleted-object' if no 'error'
      res.send(outgoing[0])
    })
  })
})

app.use(function(req, res) {
  res.sendStatus(404)
})


app.listen(port, function() {
  console.log('listening on port', port)
})


module.exports = app;
