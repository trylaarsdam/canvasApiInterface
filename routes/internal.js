const express = require('express');
const axios = require('axios')
var router = express.Router();
const {v4: uuidv4} = require('uuid');
const dev = require("../dev.json")
const log = require("../internal/logging")
const db = require("../internal/database")
const crypto = require("crypto")
const emailCredentials = require("../email.json")
const nodemailer = require("nodemailer")

router.get("/users/test", async (req, res) => {
  const canvasURL = req.query.canvasURL
  const canvasKey = req.query.canvasKey
  // console.log(canvasURL)
  try {
    const canvasResults = await axios.get(`${canvasURL}/api/v1/courses`, {
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

router.get("/login", async (req, res) => {
  const email = req.query.email
  const password = req.query.password

  let user = await db.query("User", "email", "==", email)
  if(user.length === 1) {
    if(user[0].password === crypto.createHash("sha256").update(password).digest("hex")) {
      res.send({
        status: "success",
        user: user[0]
      })
    }
    else {
      res.send({
        status: "error",
        message: "invalid password"
      })
    }
  }
  else {
    res.send({
      status: "error",
      message: "invalid email"
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
        role: "User",
        apiKey: uuidv4()
      })
      
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "todd@toddr.org", 
          pass: emailCredentials.password, 
        },
      });

      let info = await transporter.sendMail({
        from: 'admin@toddr.org', // sender address
        to: email, // list of receivers
        subject: "Welcome to Assignment Canvas", // Subject line
        html: `Your account has been successfully created. If you need any help with the service,
          please contact <a href="mailto:support@toddr.org">support@toddr.org</a>.</p><br/><br/>
          <hr />
          <p>This email was sent from a system generated email address. Please do not reply to this email.<br/>
          You received this email because you signed up for an account at canvas.toddr.org. If you did not sign up for
          an account, please contact support.
          </p>
          `, // html body
      });

      res.send({
        message: "user created",
        status: "success",
        user: {
          id: userID,
          name: name,
          email: email,
          canvasKey: canvasKey,
          role: "User",
          canvasURL: canvasURL,
          password: password
        }
      })
    }
  }
})

router.post("/users/unban/:id", async (req, res) => {
  if(req.user.role == "Administrator") {
    const userID = req.query.id
    const user = await db.getDoc("User", userID)

    if(user) {
      await db.mergeDoc("User", userID, { banned: false })
      res.send({
        status: "success"
      })
    } else {
      res.send({
        message: "user not found",
        status: "error"
      })
    }
  } else {
    req.status(401).send({
      message: "requires administrator privilages",
      status: "error"
    })
  }
})

router.post("/users/ban/:id", async (req, res) => {
  if(req.user.role == "Administrator") {
    const userID = req.query.id
    const user = await db.getDoc("User", userID)

    if(user) {
      await db.mergeDoc("User", userID, { banned: true })
      res.send({
        status: "success"
      })
    } else {
      res.send({
        message: "user not found",
        status: "error"
      })
    }
  } else {
    req.status(401).send({
      message: "requires administrator privilages",
      status: "error"
    })
  }
})

router.get("/users/get", async (req, res) => {
  if(req.user.id == req.query.id || req.user.role == "Administrator") {
    const userID = req.query.id
    const user = await db.getDoc("User", userID)

    if(user) {
      res.send({
        user: user,
        status: "success"
      })
    } else {
      res.send({
        message: "user not found",
        status: "error"
      })
    }
  } else {
    req.status(401).send({
      message: "requires administrator privilages",
      status: "error"
    })
  }
})

router.get("/users", async (req, res) => {
  if(req.user.role == "Administrator") {
    const users = await db.getCollection("User")
    if(users) {
      res.send({
        users: users,
        status: "success"
      })
    } else {
      res.send({
        message: "error fetching users",
        status: "error"
      })
    }
  } else {
    req.status(401).send({
      message: "requires administrator privilages",
      status: "error"
    })
  }
})

router.get("/errors", async (req, res) => {
  if(req.user.role) {
    const users = await db.getCollection("Errors")

    if(users) {
      res.send({
        errors: users,
        status: "success"
      })
    } else {
      res.send({
        message: "error fetching users",
        status: "error"
      })
    }
  } else {
    req.status(401).send({
      message: "requires administrator privilages",
      status: "error"
    })
  }
})

router.post("/system", async (req, res) => {
  if(req.user.role == "Administrator") {
    let currentStatus = (await db.getDoc("System", "status"))

    if(currentStatus.adminOnly == true) {
      await db.mergeDoc("System", "status", { adminOnly: false })
      res.send({
        status: "success",
        adminOnly: false
      })
    }
    else {
      await db.mergeDoc("System", "status", { adminOnly: true })
      res.send({
        status: "success",
        adminOnly: true
      })
    }
  } else {
    res.status(401).send({
      status: "error",
      message: "requires administrator privilages"
    })
  }
})

module.exports = router;
