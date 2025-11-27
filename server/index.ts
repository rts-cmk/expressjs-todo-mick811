import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

app.get("/", (req, res) => {
  res.json({
    message: "welcome to the todos api",
  })
});

app.get("/todos", (_, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "failed to read todos" });

    // Parse the JSON string into a JavaScript object
    const fileData = JSON.parse(data);
    res.json(fileData.todos);
  });
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "failed to read todos" });

    const fileData = JSON.parse(data);
    const todo = fileData.todos.find((t: Todo) => t.id.toString() === id);

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
      todos: Todo[];
    };

    // increment the last id to generate a unique id
    const newId = fileData.lastId + 1;

    const newTodo: Todo = {
      id: newId,
      title,
      completed: completed,
    };

    fileData.todos.push(newTodo);
    fileData.lastId = newId;

    // save with 2-space indentation for readability
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
      todos: Todo[];
    };

    const todoIndex = fileData.todos.findIndex((t: Todo) => t.id.toString() === id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: "todo not found" });
    }

    const oldTodo = fileData.todos[todoIndex]!; 

    // merge existing todo with updates
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
      todos: Todo[];
    };

    // findIndex returns the array position (0, 1, 2...) where the object with matching id is located
    // note: this is different from the object's 'id' property (5, 6, 7...)
    const todoIndex = fileData.todos.findIndex((t: Todo) => t.id.toString() === id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: "todo not found" });
    }

    // splice(todoIndex, 1) removes 1 array element starting at todoIndex
    // the '1' means "remove 1 element" in this case, the entire object at todoIndex
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
