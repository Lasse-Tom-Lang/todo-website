const express = require("express")
const app = express()
const fs = require("fs")

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
  res.write(fs.readFileSync("./public/index.html"));
  res.end();
})

app.get("/icons/add.png", (req, res) => {
  res.sendFile(__dirname + "/public/icons/add.png")
})