// restfulExpressServer.js
// nicolas roldos
//
'use strict'
const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const filepath = path.join(__dirname, 'pets.json')

const app = express()
const port = process.env.PORT || 8000

app.disable('x-powered-by');
app.use(morgan('short'))
app.use(bodyParser.json())


app.get('/pets', function(req, res, next) {
   fs.readFile(filepath, 'utf8', function (err, data){
      if (err) throw err;
      res.send(JSON.parse(data))
   })
})

app.get('/pets/1', function(req, res, next) {
   fs.readFile(filepath, 'utf8', function (err, data){
      if (err) throw err;
      res.send(JSON.parse(data)[1])
   })
})

app.get('/pets/:index', function(req, res) {

     fs.readFile(filepath, 'utf8', function (err, data){
       var index = Number.parseInt(req.params.index);
       if (Number.isNaN(index) || index < 0 || index > data.length - 1 || index === undefined || index === '') {
         return res.sendStatus(404);
       }
       res.send(data[index]);
     })
})

app.post('/pets', function(req, res, next){
   var pet = req.body
   if (!pet || pet.name === ''){
      return res.sendStatus(400)
   } else {
      fs.readFile(filepath, 'utf8', function (err, data){
         if (err) throw err;
         let pets = JSON.parse(data)
         pets.push(pet)
         fs.writeFile(filepath, JSON.stringify(pets), function(err){
            if (err) throw err;
         })
      })
      res.send(pet)
   }
})

app.patch('/pets/1', function(req, res, next){
   let pet = req.body
   if (!pet || pet.name === ''){
      return res.sendStatus(400)
   }
   else if (pet.kind === undefined) {
      fs.readFile(filepath, 'utf8', function (err, data){
         if (err) throw err;
         let pets = JSON.parse(data)
         let newPet = pets[1]
         newPet.age = pet.age
         pet = pets[1]
         res.send(pet)
          fs.writeFile(filepath, JSON.stringify(pets), function(err){
            if (err) throw err;
         })
      })
   }
   else {
      fs.readFile(filepath, 'utf8', function (err, data){
         if (err) throw err;
         let pets = JSON.parse(data)
         pets.splice(1, 0, pet)
         fs.writeFile(pathArray, JSON.stringify(pets), function(err){
            if (err) throw err;
         })
      })
   res.send(pet)
   }
})

app.delete('/pets/:index', function(req, res) {
  fs.readFile(filepath, 'utf8', function (err, data){
     if (err) throw err;
     var index = Number.parseInt(req.params.index);
     if (Number.isNaN(index) || index < 0 || index >= data.length) {
       return res.sendStatus(404);
     }
     var pet = JSON.parse(data)
     pet = pet.splice(index, 1);
    res.send(pet);
  })
})

app.listen(app.get('port'), function() {
  console.log('Listening on', app.get('port'));
})

module.exports = app
