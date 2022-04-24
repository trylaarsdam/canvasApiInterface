const express = require('express');
const axios = require('axios')
var router = express.Router();
const {v4: uuidv4} = require('uuid');
const dev = require("../dev.json")
axios.defaults.headers.common = {'Authorization': `Bearer ${dev.token}`}

router.get("/", async (req, res) => {
  try {
    const canvasResults = await axios.get(`http://${dev.ip}/api/v1/courses`)

    if(canvasResults.status === 200) {
      res.send({
        data: canvasResults.data,
        status: "success"
      })
    }
  } catch (error) {
    console.log(error.response.status)
    if(error.response.status === 401) {
      let errorID = uuidv4()
      res.send({
        message: "api key unauthorized",
        errorID: errorID,
        status: "error"
      })
    }
    else {
      let errorID = uuidv4()

      res.send({
        message: `canvas api returned code ${error.response.status}`,
        errorID: errorID,
        status: "error"
      })
    }
  }   
})

module.exports = router;
