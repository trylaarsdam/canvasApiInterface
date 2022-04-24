const express = require("express");
const app = express();
const bodyParser = require("body-parser");

var coursesRoute = require('./routes/courses');

app.use("/api/courses", coursesRoute);

app.get("/", (req, res) => {
  res.send("Assignment Canvas v2 API");
})

app.listen(7001, () => {
  console.log("AC API listening on port 7001");
});