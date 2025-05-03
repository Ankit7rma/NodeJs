Let’s build a simple REST API for a to-do list application using Express.js, step by step. This guide is beginner-friendly, explaining each part clearly. We’ll store tasks in memory (an array) for simplicity and include basic input validation. At the end, I’ll suggest how to move to a database like SQLite or MongoDB.

---

### Prerequisites
1. **Node.js installed**: Download and install Node.js from [nodejs.org](https://nodejs.org) if you haven’t already.
2. **Basic JavaScript knowledge**: Familiarity with variables, arrays, and functions.
3. **Text editor**: Use VS Code or any editor you prefer.
4. **Terminal**: Basic comfort with running commands.

---

### Step 1: Set Up the Project
1. **Create a project folder**:
   - Open your terminal and create a folder called `todo-api`:
     ```bash
     mkdir todo-api
     cd todo-api
     ```

2. **Initialize a Node.js project**:
   - Run this command to create a `package.json` file:
     ```bash
     npm init -y
     ```

3. **Install Express.js**:
   - Install Express, a lightweight web framework for Node.js:
     ```bash
     npm install express
     ```

4. **Create the main file**:
   - Create a file named `index.js` in the `todo-api` folder:
     ```bash
     touch index.js
     ```

---

### Step 2: Set Up the Express Server
Let’s create a basic Express server to handle HTTP requests.

1. **Open `index.js`** and add the following code:
   ```javascript
   const express = require('express');
   const app = express();
   const port = 3000;

   // Middleware to parse JSON bodies
   app.use(express.json());

   // Sample route to test the server
   app.get('/', (req, res) => {
       res.send('Welcome to the To-Do List API!');
   });

   // Start the server
   app.listen(port, () => {
       console.log(`Server running at http://localhost:${port}`);
   });
   ```

2. **Explanation**:
   - `require('express')`: Imports the Express module.
   - `express()`: Creates an Express application.
   - `app.use(express.json())`: Middleware to parse incoming JSON requests.
   - `app.get('/')`: Defines a route that responds to GET requests at the root URL (`/`).
   - `app.listen(port)`: Starts the server on port 3000.

3. **Run the server**:
   - In the terminal, run:
     ```bash
     node index.js
     ```
   - Open your browser or a tool like [Postman](https://www.postman.com/) and visit `http://localhost:3000`. You should see: `Welcome to the To-Do List API!`.

4. **Stop the server**:
   - Press `Ctrl + C` in the terminal to stop the server.

---

### Step 3: Create the In-Memory Task Storage
We’ll store tasks in an array to simulate a database. Each task will have an `id`, `title`, and `completed` status.

1. **Add the tasks array** to `index.js` (before the routes):
   ```javascript
   // In-memory storage for tasks
   let tasks = [];
   let nextId = 1; // To generate unique IDs
   ```

2. **Explanation**:
   - `tasks`: An array to store task objects like `{ id: 1, title: "Buy groceries", completed: false }`.
   - `nextId`: Tracks the next available ID for new tasks.

---

### Step 4: Implement CRUD Endpoints
We’ll create endpoints for **Create**, **Read**, **Update**, and **Delete** operations.

#### 1. **GET /tasks** (Read all tasks)
This endpoint returns the list of all tasks.

Add this code below the `app.get('/')` route:
```javascript
// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});
```

**Explanation**:
- `app.get('/tasks')`: Handles GET requests to `/tasks`.
- `res.json(tasks)`: Sends the `tasks` array as a JSON response.

#### 2. **POST /tasks** (Create a new task)
This endpoint creates a new task with a title and validates that the title is not empty.

Add this code:
```javascript
// Create a new task
app.post('/tasks', (req, res) => {
    const { title } = req.body;

    // Validation: Check if title is provided and not empty
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
        id: nextId++,
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});
```

**Explanation**:
- `req.body`: Contains the JSON data sent in the request (e.g., `{ "title": "Buy groceries" }`).
- Validation: Checks if `title` exists and isn’t empty. If invalid, returns a 400 (Bad Request) error.
- `newTask`: Creates a task object with a unique `id`, the provided `title`, and `completed: false`.
- `tasks.push(newTask)`: Adds the task to the array.
- `res.status(201)`: Returns a 201 (Created) status with the new task.

#### 3. **PUT /tasks/:id** (Update a task)
This endpoint updates the title or completed status of a task by its ID.

Add this code:
```javascript
// Update a task
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    // Find the task
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Validation: Check if title is provided and not empty (if provided)
    if (title !== undefined && title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
    }

    // Update fields if provided
    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = completed;

    res.json(task);
});
```

**Explanation**:
- `req.params.id`: Gets the task ID from the URL (e.g., `/tasks/1`).
- `parseInt`: Converts the ID to a number.
- Finds the task by ID. If not found, returns a 404 (Not Found) error.
- Validates the title if provided. Updates `title` and/or `completed` if sent in the request.
- Returns the updated task.

#### 4. **DELETE /tasks/:id** (Delete a task)
This endpoint deletes a task by its ID.

Add this code:
```javascript
// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});
```

**Explanation**:
- Finds the task’s index in the array. If not found, returns a 404 error.
- `tasks.splice`: Removes the task from the array.
- `res.status(204).send()`: Returns a 204 (No Content) status to indicate successful deletion.

---

### Step 5: Complete `index.js` Code
Here’s the full `index.js` code for reference:

```javascript
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for tasks
let tasks = [];
let nextId = 1;

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the To-Do List API!');
});

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const { title } = req.body;

    // Validation: Check if title is provided and not empty
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
        id: nextId++,
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const id = parse.parseInt(req.params.id);
    const { title, completed } = req.body;

    // Find the task
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Validation: Check if title is provided and not empty (if provided)
    if (title !== undefined && title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
    }

    // Update fields if provided
    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = completed;

    res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

---

### Step 6: Test the API
1. **Start the server**:
   ```bash
   node index.js
   ```

2. **Use Postman or curl to test**:
   - **GET /tasks**:
     ```bash
     curl http://localhost:3000/tasks
     ```
     Expected: `[]` (empty array initially).

   - **POST /tasks** (create a task):
     ```bash
     curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy groceries"}'
     ```
     Expected: `{ "id": 1, "title": "Buy groceries", "completed": false }`.

   - **GET /tasks** (list tasks):
     ```bash
     curl http://localhost:3000/tasks
     ```
     Expected: `[{ "id": 1, "title": "Buy groceries", "completed": false }]`.

   - **PUT /tasks/1** (update task):
     ```bash
     curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title":"Buy groceries and milk","completed":true}'
     ```
     Expected: `{ "id": 1, "title": "Buy groceries and milk", "completed": true }`.

   - **DELETE /tasks/1** (delete task):
     ```bash
     curl -X DELETE http://localhost:3000/tasks/1
     ```
     Expected: No content (204 status).

   - **Test validation** (empty title):
     ```bash
     curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":""}'
     ```
     Expected: `{ "error": "Title is required" }`.

3. **Using Postman**:
   - Download Postman and create requests for GET, POST, PUT, and DELETE with the URLs above.
   - Set the `Content-Type` header to `application/json` for POST and PUT requests.

---

### Step 7: Learning Outcomes
You’ve built a REST API with:
- **Routing**: Defined endpoints like `/tasks` and `/tasks/:id`.
- **Middleware**: Used `express.json()` to parse JSON.
- **HTTP Methods**: Implemented GET, POST, PUT, DELETE.
- **JSON Handling**: Sent and received JSON data.
- **Error Responses**: Returned 400, 404, and 204 statuses for errors and success.
- **Validation**: Ensured the title isn’t empty.

---

### Step 8: Persisting Data (Next Step)
The current API stores tasks in memory, so data is lost when the server restarts. To persist data, use a database like **SQLite** (lightweight, file-based) or **MongoDB** (NoSQL, document-based).

#### Option 1: SQLite
1. **Install SQLite**:
   ```bash
   npm install sqlite3
   ```

2. **Modify the code**:
   - Replace the `tasks` array with SQLite queries.
   - Use the `sqlite3` module to create a database file (e.g., `tasks.db`).
   - Example table: `CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT, completed BOOLEAN)`.

3. **Update CRUD operations**:
   - GET: `SELECT * FROM tasks`
   - POST: `INSERT INTO tasks (title, completed) VALUES (?, ?)`
   - PUT: `UPDATE tasks SET title = ?, completed = ? WHERE id = ?`
   - DELETE: `DELETE FROM tasks WHERE id = ?`

4. **Resources**:
   - SQLite Node.js tutorial: [bezkoder.com/node-js-sqlite](https://www.bezkoder.com/node-js-sqlite/)

#### Option 2: MongoDB
1. **Install MongoDB**:
   - Install MongoDB locally or use a cloud service like MongoDB Atlas.
   - Install the MongoDB driver:
     ```bash
     npm install mongodb
     ```

2. **Modify the code**:
   - Connect to MongoDB and use a `tasks` collection.
   - Store tasks as documents (e.g., `{ title: "Buy groceries", completed: false }`).

3. **Update CRUD operations**:
   - GET: `db.tasks.find()`
   - POST: `db.tasks.insertOne()`
   - PUT: `db.tasks.updateOne()`
   - DELETE: `db.tasks.deleteOne()`

4. **Resources**:
   - MongoDB with Node.js: [mongodb.com/docs/drivers/node](https://www.mongodb.com/docs/drivers/node/current/)

#### Alternative: JSON File
If a database feels complex, use the `fs` module to store tasks in a JSON file:
1. Install `fs` (built-in, no installation needed).
2. Read/write tasks to `tasks.json`.
3. Example:
   ```javascript
   const fs = require('fs');
   const tasksFile = './tasks.json';

   // Load tasks
   let tasks = fs.existsSync(tasksFile) ? JSON.parse(fs.readFileSync(tasksFile)) : [];

   // Save tasks
   function saveTasks() {
       fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
   }

   // Update POST, PUT, DELETE to call saveTasks() after modifying tasks
   ```

---

### Step 9: Run and Experiment
1. Save `index.js` and run:
   ```bash
   node index.js
   ```
2. Test all endpoints using Postman or curl.
3. Try adding more features:
   - Filter tasks by `completed` status (e.g., `GET /tasks?completed=true`).
   - Add a `dueDate` field to tasks.
   - Improve validation (e.g., max title length).

---

### Troubleshooting
- **Error: Cannot find module 'express'**:
  - Run `npm install express`.
- **Port 3000 in use**:
  - Change the `port` variable to 3001 or stop the other process.
- **Invalid JSON**:
  - Ensure POST/PUT requests have valid JSON and `Content-Type: application/json`.
- **Server not responding**:
  - Check if `node index.js` is running and the URL is correct (`http://localhost:3000`).

---

### Next Steps
- **Learn more Express**: Explore middleware, error handling, and authentication.
- **Add a database**: Try SQLite or MongoDB as described.
- **Deploy the API**: Host it on platforms like Heroku, Render, or Vercel.
- **Build a frontend**: Create a simple web app using React or vanilla JavaScript to interact with the API.

If you have questions or want to add a specific feature (e.g., database integration, filtering tasks), let me know, and I’ll guide you further!