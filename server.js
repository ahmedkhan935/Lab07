const express = require("express");
const app = express();

app.use(express.json());

let users = [];

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password, tasks: [] });
    res.send({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.send({ message: "Login successful" });
    } else {
        res.send({ message: "Invalid username or password" });
    }
});

app.post("/:username/task", (req, res) => {
    const { username } = req.params;
    const { title, description, dueDate, category, priority } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
        user.tasks.push({ title, description, dueDate, category, status: "incomplete", priority });
        res.send({ message: "Task created successfully" });
    } else {
        res.send({ message: "User not found" });
    }
});

app.put("/:username/task/:title", (req, res) => {
    const { username, title } = req.params;
    const { status,priority } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
        const task = user.tasks.find(t => t.title === title);
        if (task && status) {
            task.status = status;
            res.send({ message: "Task status updated successfully" });
        } else {
            res.send({ message: "Task not found" });
        }
        if(priority && task)
        {
            task.priority=priority
            res.send({ message: "Task priority updated successfully" });
        } else {
            res.send({ message: "Task not found" });
        }   

        
    } else {
        res.send({ message: "User not found" });
    }
});

app.get("/:username/tasks", (req, res) => {
    const { username } = req.params;
    const { sort } = req.query;
    const user = users.find(u => u.username === username);
    if (user) {
        let tasks = [...user.tasks];
        if (sort === "dueDate") {
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sort === "category") {
            tasks.sort((a, b) => a.category.localeCompare(b.category));
        } else if (sort === "status") {
            tasks.sort((a, b) => a.status.localeCompare(b.status));
        }
        res.send(tasks);
    } else {
        res.send({ message: "User not found" });
    }
});



app.listen(3001, () => console.log("Server is running on port 3000"));