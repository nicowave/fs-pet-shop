// expressServer.js
// nicolas roldos
//
'use strict'
const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000






app.listen(port, function(){
  console.log('listening on port:\t', port);

})
