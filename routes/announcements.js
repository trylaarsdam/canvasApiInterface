const express = require('express');
const axios = require('axios')
var router = express.Router();
const {v4: uuidv4} = require('uuid');
const dev = require("../dev.json")
const log = require("../internal/logging")
axios.defaults.headers.common = {'Authorization': `Bearer ${dev.token}`}

router.get("/", async (req, res) => {
  var courseString = "?"
  let courses = []
  //Get courses
  try {

    const courseResults = await axios.get(`http://${dev.ip}/api/v1/courses`)

    if(courseResults.status === 200) {
      courses = courseResults.data

      for(var course in courses) {
        courseString += `context_codes[]=course_${courses[course].id}&`
      }
    }

    // console.log(courses)
  } catch (error) {
    console.log(error.response.status)
    if(error.response.status === 401) {
      let errorID = uuidv4()
      await log.logError(errorID, req.user.id, error)
      res.send({
        message: "api key unauthorized",
        errorID: errorID,
        status: "error"
      })
    }
    else {
      let errorID = uuidv4()
      await log.logError(errorID, req.user.id, error)

      res.send({
        message: `canvas api returned code ${error.response.status}`,
        errorID: errorID,
        status: "error"
      })
    }
    return
  }

  try {
    var canvasResults = await axios.get(`http://${dev.ip}/api/v1/announcements${courseString}start_date=2018-01-01&end_date=2027-01-01`)

    if(canvasResults.status === 200) {
      for(var announcement in canvasResults.data) {
        canvasResults.data[announcement].course = courses[canvasResults.data[announcement].context_code.split("_")[1]]
      }

      res.send({
        data: canvasResults.data,
        status: "success"
      })
    }
  } catch (error) {
    console.log(error.response.status)
    if(error.response.status === 401) {
      let errorID = uuidv4()
      await log.logError(errorID, req.user.id, error)
      res.send({
        message: "api key unauthorized",
        errorID: errorID,
        status: "error"
      })
    }
    else {
      let errorID = uuidv4()
      await log.logError(errorID, req.user.id, error)

      res.send({
        message: `canvas api returned code ${error.response.status}`,
        errorID: errorID,
        status: "error"
      })
    }
  }   
})

module.exports = router;
