const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()

const app = express()
const port = process.env.PORT || 3002 
const JWT_SECRET =  process.env.JWT_SECRET 

app.use(express.json())

const users = []
const tokenExpiredUsers = []

const findUserByMail =(email)=> users.filter((user)=> user.email === email)

const authMiddelware = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    if(!authHeader){
        return res.status(401).json({message:'Authorization header missing'})
    }
    const token  = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
      }
    
    if (tokenExpiredUsers.includes(token)) {
        return res.status(401).json({ message: 'Token has been invalidated' });
    }
    try {
         const decoded = jwt.verify(token,JWT_SECRET)
         req.user = decoded
         next()
    } catch (error) {
        return res.status(401).json({message: `Invalid or Expired Token , Error is : ${error.message}` })
    }

}




app.listen(port,(req,res)=>{
    console.log(`Server is Running on port: ${port}`)
}) 