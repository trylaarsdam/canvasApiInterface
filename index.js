const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.listen(7001, () => {
  console.log("listening on port 7001");
});