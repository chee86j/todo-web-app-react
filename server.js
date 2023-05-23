const { conn, seedData, Todo, Category } = require("./db");
const express = require("express");
const app = express();
const path = require("path");
const ws = require("ws");
app.use(express.json());
app.use("/dist", express.static("dist"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/api/todos", async (req, res, next) => {
  try {
    const todos = await Todo.findAll();
    res.send(todos);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/todos/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    await todo.destroy();
    res.sendStatus(204);
    sockets.forEach((socket) => {
      socket.send(JSON.stringify({ type: "TODO_DESTROY", payload: todo }));
    }
    );
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/categories/:id", async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    await category.destroy();
    res.sendStatus(204);
    sockets.forEach((socket) => { // this is to notify all connected clients when a category is deleted
      socket.send(
        JSON.stringify({ type: "CATEGORY_DESTROY", payload: category })
      );
    });
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/todos", async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);
    res.send(todo);

    sockets.forEach((socket) => {
      socket.send(JSON.stringify({ type: "TODO_CREATE", payload: todo }));
    }
    );
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/categories", async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.send(category);

    sockets.forEach((socket) => {
      socket.send(
        JSON.stringify({ type: "CATEGORY_CREATE", payload: category }) 
      );
    });
  } catch (ex) {
    next(ex);
  }
});

app.put("/api/todos/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    await todo.update(req.body);

    sockets.forEach((socket) => { 
      socket.send(JSON.stringify({ type: "TODO_UPDATE", payload: todo }));
    }
    );
    res.send(todo);

  } catch (ex) {
    next(ex);
  }
});

app.get("/api/categories", async (req, res, next) => {
  try {
    res.send(await Category.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
});

// Step 5 - Edit Category - to notify all connected clients when a category is updated
app.put("/api/categories/:id", async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId); // to find the category by id

    if (!category) {
      res.status(404).send("Category not found"); // error handling if category is not found
      return;
    }

    await category.update(req.body); // update the category if found passing in request body

    // notify all connected clients about connected category update
    // a payload obj is created with category info wrapped in a type of CATEGORY_UPDATE
    const payload = { type: "CATEGORY_UPDATE", payload: category };
    sockets.forEach((socket) => socket.send(JSON.stringify(payload)));
    // to be sent to all connected clients as a JSON string with a res.send of the updated category to client
    res.send(category);
  } catch (ex) {
    next(ex);
  }
});

const port = process.env.PORT || 3000;

const server = app.listen(port, async () => {
  try {
    console.log(`listening on port ${port}`);
    await conn.sync({ force: true });
    console.log("connected");
    await seedData();
    console.log("seeded");
  } catch (ex) {
    console.log(ex);
  }
});

// Prof's code below for Socket Server functionality below
let sockets = [];

const socketServer = new ws.WebSocketServer({ server });

socketServer.on("connection", (socket) => {
  socket.send(JSON.stringify({ message: "hello world" }));
  sockets.push(socket);
  console.log(sockets.length);

  socket.on("close", () => {
    sockets = sockets.filter((s) => s !== socket);
  });
});
