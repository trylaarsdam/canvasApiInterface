const express = require('express');
const axios = require('axios')
var router = express.Router();
const {v4: uuidv4} = require('uuid');
const dev = require("../dev.json")
const log = require("../internal/logging")
const db = require("../internal/database")
const crypto = require("crypto")

router.get("/users/test", async (req, res) => {
  const canvasURL = req.query.canvasURL
  const canvasKey = req.query.canvasKey
  
  try {
    const canvasResults = await axios.get(`https://${canvasURL}/api/v1/courses`, {
      headers: {
        'Authorization': `Bearer ${canvasKey}`
      }
    })

    if(canvasResults.status === 200) {
      res.send({
        status: "success"
      })
    }
  } catch (error) {
    res.send({
      status: "error"
    })
  }
})

router.get("/users/check", async (req, res) => {
  const email = req.query.email

  let results = await db.query("User", "email", "==", email)

  if (results.length == 0) {
    res.send({
      status: "unique"
    })
  }
  else {
    res.send({
      status: "taken"
    })
  }
})

router.post("/users/new", async (req, res) => {
  const name = req.query.name
  const email = req.query.email
  const canvasKey = req.query.canvasKey
  const password = req.query.password
  const canvasURL = req.query.canvasURL

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
        canvasURL: canvasURL,
        password: password,
        apiKey: uuidv4()
      })
  
      res.send({
        message: "user created",
        status: "success",
        user: {
          id: userID,
          name: name,
          email: email,
          canvasKey: canvasKey,
          canvasURL: canvasURL,
          password: password
        }
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
