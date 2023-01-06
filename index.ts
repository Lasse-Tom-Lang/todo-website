import express, { Express } from 'express';
const app: Express = express()
const fs = require("fs")
import sessions from 'express-session';
const oneDay = 86400000

import { PrismaClient } from "@prisma/client";
const prisma: PrismaClient = new PrismaClient();

const crypto = require("crypto")

declare module 'express-session' {
  interface SessionData {
    userID: string
  }
}

app.use(sessions({
  secret: ".f2.97rrh34?r318b24!82rb",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));

app.listen(80, () => {
  console.log("Server started on port 80")
})

app.get("/script.js", (req, res) => {
  res.write(fs.readFileSync("./public/script.js"));
  res.end();
})

app.get("/style.css", (req, res) => {
  res.write(fs.readFileSync("./public/style.css"));
  res.end();
})

app.get("/", (req, res) => {
  if (req.session.userID) {
    res.write(fs.readFileSync("./public/index.html"));
    res.end();
  }
  else {
    res.write(fs.readFileSync("./public/login.html"));
    res.end();
  }
})

app.get("/icons/add.png", (req, res) => {
  res.sendFile(__dirname + "/public/icons/add.png")
})

app.get("/login", async (req, res) => {
  if (req.query.username && req.query.password) {
    let username = req.query.username as string
    let password = crypto.createHash('sha256').update(req.query.password).digest('base64') as string
    let user = await prisma.user.findFirst({
      where: {
        name: username,
        password: password
      }
    })
    if (user) {
      req.session.userID = user.id
      res.json({"status": 1})
      res.end()
    }
    else {
      res.json({"status": 0})
      res.end()
    }
  }
  else {
    res.json({"status": 0})
    res.end()
  }
})

app.get("/getUserData", async (req, res) => {
  if (req.session.userID) {
    let userData = await prisma.user.findFirst({
      where: {
        id: req.session.userID
      },
      select: {
        name: true,
        id: true,
        todolists: {
          select: {
            id: true,
            name: true,
            todos: {
              select: {
                id: true,
                name: true,
                done: true
              }
            }
          }
        }
      }
    })
    res.json(userData)
    res.end()
  }
  else {
    res.json({"status": 0})
    res.end()
  }
})

app.get("/addList", async (req, res) => {
  if (req.session.userID && req.query.listName) {
    let listName = req.query.listName as string
    let list = await prisma.toDoList.create({
      data: {
        name: listName,
        user: {
          connect: {
            id: req.session.userID
          }
        }
      },
      select: {
        id: true,
        name: true
      }
    })
    res.json(list)
    res.end()
  }
  else {
    res.json({"status": 0})
    res.end()
  }
})

app.get("/addToDo", async (req, res) => {
  if (req.session.userID && req.query.todo && req.query.todolist) {
    let todoName = req.query.todo as string
    let todolist = req.query.todolist as string
    let todo = await prisma.toDoItem.create({
      data: {
        name: todoName,
        done: false,
        todolist: {
          connect: {
            id: todolist
          }
        }
      },
      select: {
        id: true,
        name: true
      }
    })
    res.json(todo)
    res.end()
  }
  else {
    res.json({"status": 0})
    res.end()
  }
})

app.get("/updateToDo", async (req, res) => {
  if (req.query.todoID && req.query.todoDone != undefined) {
    let todoID = req.query.todoID as string
    let todoDone = req.query.todoDone as string
    let done = todoDone=="1"?true:false
    await prisma.toDoItem.update({
      where: {
        id: todoID
      },
      data: {
        done: done
      }
    })
    res.json({"status": 1})
    res.end()
  }
  else {
    res.json({"status": 0})
    res.end()
  }
})

app.get("/addUser", async (req, res) => {
  if (req.query.username && req.query.password) {
    let username = req.query.username as string
    let password = crypto.createHash('sha256').update(req.query.password).digest('base64') as string
    await prisma.user.create({
      data: {
        name: username,
        password: password
      }
    })
    res.json({"status": 1})
    res.end()
  }
  else {
    res.json({"status": 0})
    res.end()
  }
})

app.get("/canRegister", async (req, res) => {
  if (req.query.username) {
    let username = req.query.username as string
    let user = await prisma.user.findUnique({
      where: {
        name: username
      }
    })
    if (user) {
      res.json({"status": 0})
      res.end()
    }
    else {
      res.json({"status": 1})
      res.end()
    }
  }
  else {
    res.json({"status": 0})
    res.end()
  }
})