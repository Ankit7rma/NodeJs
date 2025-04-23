const express = require('express')
const app = express()

const port = 3003;

app.use(express.json())
app.get("/",(req,res)=>{
     res.send("Welcome to todolist exampole ")
})


app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`)
})