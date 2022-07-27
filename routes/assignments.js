const express = require('express');
const axios = require('axios')
var router = express.Router();
const dev = require("../dev.json")
const db = require('../internal/database')

module.exports = router;

router.get("/", async (req, res) => {
  try {
    const coursesResult = await axios.get(`${req.user.canvasURL}/api/v1/courses`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })
    allAssignments = []
    for(var course of coursesResult.data) {
      try {
        const courseAssignments = await axios.get(`${req.user.canvasURL}/api/v1/courses/${parseInt(course.id)}/assignments`, {
          headers: {
            'Authorization': `Bearer ${req.user.canvasKey}`
          }
        })
        for(var assignment of courseAssignments.data) {
          assignment.course = course
          allAssignments.push(assignment)
        }
      } catch(error) {
        // console.log(error)
        res.status(502).send({
          status: "error",
          error: "error fetching assignments"
        })
      }
    }
    res.send({
      status: "success",
      data: allAssignments
    })
  } catch (error) {
    console.log(error.response.status)
    if(error.response.status === 401) {
      let errorID = uuidv4()
      await log.logError(errorID, req.user.id, error)
      res.send({
        message: "api key unauthorized",
        errorID: errorID,
        status: "error",
        timestamp: Date()
      })
    }
    else {
      let errorID = uuidv4()
      await log.logError(errorID, req.user.id, error)

      res.send({
        message: `canvas api returned code ${error.response.status}`,
        errorID: errorID,
        status: "error",
        timestamp: Date()
      })
    }

  }
})

router.get("/:courseID", async (req, res) => {
  try {
    const canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.courseID}/assignments`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })

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
        status: "error",
        timestamp: Date()
      })
    }
  }
})

router.get("/:courseID/:assignmentID", async (req, res) => {
  try {
    const canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.courseID}/assignments/${req.params.assignmentID}`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })

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
        status: "error",
        timestamp: Date()
      })
    }
  }
})
