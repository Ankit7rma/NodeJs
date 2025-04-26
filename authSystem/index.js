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

const findUserByEmail = (email) => users.find((user) => user.email === email);

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

app.post("/signup",async(req,res)=>{
    try {
        const {username,email,password} = req.body
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
          }
        if (findUserByEmail(email)) {
            return res.status(400).json({ message: 'Email already registered' });
          }
        const hashedPassword = await bcrypt.hash(password,10)
        users.push({username,email,password:hashedPassword})
        console.log(users)
        return res.status(201).json({message:"User Registered Successfully "})
    } catch (error) {
        return res.status(500).json({message:'Server Error',error: error.message})
    }
})

app.post("/signin", async(req,res)=>{
 try {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({message:"Email and password are required"})
    }
    const user = findUserByEmail(email)
    if(!user){
        return res.status(401).json({message:"Invalid email or password"})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
   const token = jwt.sign(
    { email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
);

    return res.status(200).json({message:"Login Successful ", token})

 } catch (error) {
    return res.status(500).json({message:"Server Error",error:error.message})
 }
})

app.post('/logout', authMiddelware, (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
   
    tokenExpiredUsers.push(token);
  
    res.json({ message: 'Logout successful' });
  });
  
 
  app.get('/profile', authMiddelware, (req, res) => {
    res.json({
      message: 'Profile accessed successfully',
      user: { email: req.user.email, username: req.user.username }
    });
  });

app.listen(port,(req,res)=>{
    console.log(`Server is Running on port: ${port}`)
}) 