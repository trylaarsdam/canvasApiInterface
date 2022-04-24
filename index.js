const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const auth = require("./internal/auth")

var coursesRoute = require('./routes/courses');
var internalRoute = require("./routes/internal")

app.use(auth);

app.use("/api/courses", coursesRoute);
app.use("/internal", internalRoute);

app.get("/", (req, res) => {
  res.send("Assignment Canvas v2 API");
})

app.listen(7001, () => {
  console.log("AC API listening on port 7001");
});