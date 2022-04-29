const express = require('express');
const axios = require('axios')
var router = express.Router();
const {v4: uuidv4} = require('uuid');
const dev = require("../dev.json")
const log = require("../internal/logging")
const db = require("../internal/database")
const crypto = require("crypto")

router.post("/users/new", async (req, res) => {
  const name = req.query.name
  const email = req.query.email
  const canvasKey = req.query.canvasKey
  const password = req.query.password
  const userID = uuidv4()

  if(!name || !email) {
    res.status(400).send({
      message: "missing required parameters",
      status: "error"
    })
  } else {
    if((await db.query("User", "email", "==", email)).length > 0) {
      res.status(418).send({
        message: "email already exists",
        status: "error"
      })
    } else {
      await db.setDoc("User", userID, {
        id: userID,
        name: name,
        email: email,
        canvasKey: canvasKey,
        password: crypto.createHash("sha256").update(password).digest("hex"),
        apiKey: uuidv4()
      })
  
      res.send({
        message: "user created",
        status: "success",
        userID: userID
      })
    }
  }
})

router.get("/users/get", async (req, res) => {
  const userID = req.query.id
  const user = await db.getDoc("User", userID)

  if(user) {
    
  } else {
    res.send({
      message: "user not found",
      status: "error"
    })
  }
  res.send("not implemented")
})

module.exports = router;
