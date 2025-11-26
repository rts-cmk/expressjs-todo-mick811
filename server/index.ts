import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "welcome to the todos api",
  })
});

app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "failed to read todos" });

    const fileData = JSON.parse(data);
    res.json(fileData.todos);
  });
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "failed to read todos" });

    const fileData = JSON.parse(data);
    const todo = fileData.todos.find((t: any) => t.id.toString() === id);

    if (!todo) return res.status(404).json({ error: "todo not found" });

    res.json(todo);
  });
});

app.post("/todos", (req, res) => {
  const { title, completed } = req.body;

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "failed to read todos" });

    const fileData = JSON.parse(data) as {
      lastId: number;
      todos: Record<string, any>[];
    };

    const newId = fileData.lastId + 1;

    const newTodo = {
      id: newId,
      title,
      completed: completed ?? false,
    };

    fileData.todos.push(newTodo);
    fileData.lastId = newId;

    fs.writeFile("todos.json", JSON.stringify(fileData, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "failed to save todo" });

      res.status(201).json(newTodo);
    });
  });
});

app.put("/todos/:id", (req, res) => {
  const id = req.params.id;
  const { title, completed } = req.body;

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "failed to read todos" });

    const fileData = JSON.parse(data) as {
      lastId: number;
      todos: Record<string, any>[];
    };

    const todoIndex = fileData.todos.findIndex((t: any) => t.id.toString() === id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: "todo not found" });
    }

    const oldTodo = fileData.todos[todoIndex]!; 

    const updatedTodo = {
      ...oldTodo,
      title: title ?? oldTodo.title,
      completed: completed ?? oldTodo.completed,
    };

    fileData.todos[todoIndex] = updatedTodo;

    fs.writeFile("todos.json", JSON.stringify(fileData, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "failed to save todo" });

      res.json(updatedTodo);
    });
  });
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "failed to read todos" });

    const fileData = JSON.parse(data) as {
      lastId: number;
      todos: Record<string, any>[];
    };

    const todoIndex = fileData.todos.findIndex((t: any) => t.id.toString() === id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: "todo not found" });
    }

    fileData.todos.splice(todoIndex, 1);

    fs.writeFile("todos.json", JSON.stringify(fileData, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "failed to save todos" });

      res.status(204).send();
    });
  });
});

app.listen(port, (err) => {
  if (err) return console.error(err);
  console.log(`server is running at http://localhost:${port}`);
});

