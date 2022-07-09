const express = require('express');
const axios = require('axios')
var router = express.Router();
const {v4: uuidv4} = require('uuid');
const dev = require("../dev.json")
const log = require("../internal/logging")

router.get("/", async (req, res) => {
  var courseString = "?"
  let courses = {}
  //Get courses
  try {

    const courseResults = await axios.get(`${req.user.canvasURL}/api/v1/courses`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })

    if(courseResults.status === 200) {
      for(var course of courseResults.data) {
        courses[course.id] = course
      }

      for(var course in courses) {
        courseString += `context_codes[]=course_${courses[course].id}&`
      }
    }

    // console.log(courses)
  } catch (error) {
    console.log("courses")
    console.log(error.response)
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
    var canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/announcements${courseString}start_date=2018-01-01&end_date=2027-01-01`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })

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
    console.log("announcements")
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


router.get("/:courseID/:announcementID", async (req, res) => {
  let course = {}
  try {
    const canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.id}`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })

    if(canvasResults.status === 200) {
      course = canvasResults.data
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

  try {
    var canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.courseID}/discussion_topics/${req.params.announcementID}`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })

    if(canvasResults.status === 200) {
      canvasResults.data.course = course
      res.send({
        data: canvasResults.data,
        status: "success"
      })
    }
  } catch (error) {
    console.log("announcements")
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
