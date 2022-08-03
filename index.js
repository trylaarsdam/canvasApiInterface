const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const auth = require("./internal/auth")
const cors = require("cors")

var coursesRoute = require('./routes/courses');
var internalRoute = require("./routes/internal");
var announcementsRoute = require("./routes/announcements");
var assignmentsRoute = require("./routes/assignments");
var peopleRoute = require("./routes/people");
var pollsRoute = require("./routes/polls");
var pagesRoute = require("./routes/pages");
var discussionsRoute = require("./routes/discussions");
 
app.use(cors())
app.use(auth);

app.use("/api/courses", coursesRoute);
app.use("/api/announcements", announcementsRoute)
app.use("/api/assignments", assignmentsRoute)
app.use("/api/people", peopleRoute)
app.use("/api/polls", pollsRoute)
app.use("/api/pages", pagesRoute)
app.use("/api/discussions", discussionsRoute)
app.use("/internal", internalRoute);

app.get("/", (req, res) => {
  res.redirect("https://canvas.toddr.org")
})

app.get("/docs", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/8120773/Uzs2ZSCY")
})

app.listen(7001, () => {
  console.log("AC API listening on port 7001");
});