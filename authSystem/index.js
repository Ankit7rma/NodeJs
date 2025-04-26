const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()

const app = express()
const port = process.env.PORT || 3002 

app.listen(port,(req,res)=>{
    console.log(`Server is Running on port: ${port}`)
})