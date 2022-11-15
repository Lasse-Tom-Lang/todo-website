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
      include: {
        todolists: {
          include: {
            todos: true
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