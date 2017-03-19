// command line tool for extracting 'pet' names from 'pets.json'

'use strict'
const fs = require('fs')
const path = require('path')

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1])
const petsJson = path.join(__dirname, 'pets.json')

let command = process.argv[2]
let index = Number(process.argv[3])


if (command === 'read') {
  // if command is 'read' use 'fs' module method readFile to read 'pets.json' file
    fs.readFile(petsJson, 'utf-8', function(err, data) {

      let parsedJSON = JSON.parse(data)

       // handle the 'err' from callback if there is an error reading the file
      if (err) {
        throw err
        console.error(`Usage: ${node} ${file} ${command} INDEX`)
       }
      if (index <= parsedJSON.length - 1 && index > -1) {
        console.log(parsedJSON[index])

      } else if (index < 0 || index > parsedJSON.length -1) {
        console.error(`Usage: ${node} ${file} ${command} INDEX`)
        process.exit(1)
      } else {
        console.log(parsedJSON)
       }
   })
// if the command in prompt is 'create' execute the following code to
// 'readFile' and 'writeFile'
} else if (command === 'create') {
    fs.readFile(petsJson, 'utf-8', function(err, data) {

      // parsedJSON returns an 'array' of JSON objects of pets
      let parsedJSON = JSON.parse(data)
      // console.log(parsedJSON)
      // create an empty object to add new pet's key-value pairs
      let newObject = {}
      var age = Number(process.argv[3])
      var kind = String(process.argv[4])
      var name = String(process.argv[5])
      // console.log(age, kind, name)

      if (process.argv.length < 6) {
        console.error('Usage: node pets.js create AGE KIND NAME')
        process.exit(1)
      }
      // create the new object's key-value 'pairs' based on values retrieved from command line prompt
      newObject['age'] = age
      newObject['kind'] = kind
      newObject['name'] = name

      console.log(newObject)

      // push it!
      parsedJSON.push(newObject)

      // 'stringify' the array
      var updatedJSON = JSON.stringify(parsedJSON)
      fs.writeFile(petsJson, updatedJSON, function(err) {
        if (err) { throw err }
    })
  })
} else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`)
    process.exit(1)
}
