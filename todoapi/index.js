const express = require('express')
const app = express()

const port = 3003;

app.use(express.json())

let tasks = []
let nextId = 1


app.get("/",(req,res)=>{
     res.send("Welcome to todolist exampole ")
})

app.get("/tasks",(req,res)=>{
    res.json(tasks)
})
app.post("/tasks",(req,res)=>{
    const {title} = req.body;
    if(!title || title.trim()===""){
        res.status(400).json({error:" Title is Required"})
    }
    const newTask = {
        id:nextId++,
        title:title.trim(),
        completed:false
    }

    tasks.push(newTask)
    res.status(201).json(newTask)

})


app.put("/tasks/:id",(req,res)=>{
    const id = parseInt(req.params.id)
    const {title,completed} = req.body
    const task = tasks.find((t) =>t.id=== id)
    if(!task){
        return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined && title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
    }
    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = completed;

    res.json(task);


})

app.delete('/tasks/:id',(req,res)=>{
    const id  = parseInt(req.params.id)
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    } 
    tasks.splice(taskIndex , 1)
    res.status(204).send();
})





app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`)
})