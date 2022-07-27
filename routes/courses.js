const express = require('express');
const axios = require('axios')
var router = express.Router();
const {v4: uuidv4} = require('uuid');
const dev = require("../dev.json")
const log = require("../internal/logging")

router.get("/", async (req, res) => {
  try {
    const canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/courses`, {
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
    console.log(error.response)
      if(error.response) {
      if(error.response.status === 401) {
        let errorID = uuidv4()
        await log.logError(errorID, req.user.id, error)
        res.send({
          message: "api key unauthorized",
          errorID: errorID,
          status: "error"
        })
      }
    }
    else {
      let errorID = uuidv4()
      await log.logError(errorID, req.user.id, error)

      res.send({
        message: `canvas api returned code ${error.response}`,
        errorID: errorID,
        status: "error"
      })
    }
  }   
})

router.get("/:id", async (req, res) => {
  try {
    const canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.id}`, {
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
        status: "error"
      })
    }
  }   
})

router.get("/:courseID/assignments", async (req, res) => {
  try {
    const canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.courseID}`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })

    try {
      const assignmentResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.courseID}/assignments`, {
        headers: {
          'Authorization': `Bearer ${req.user.canvasKey}`
        }
      })
      var results = []
      for (var assignment of assignmentResults.data) {
        assignment.course = canvasResults.data
        results.push(assignment)
      }
      if(assignmentResults.status === 200) {
        res.send({
          data: results,
          status: "success"
        })
      } else {
        res.send({
          message: assignmentResults.status,
          status: "error"
        })
      }
    } catch (error) {
      console.log(error)
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
  } catch (error) {
    console.log(error.response)
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

router.get("/:courseID/announcements", async (req, res) => {
  try {
    const courseResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.courseID}`, {
      headers: {
        'Authorization': `Bearer ${req.user.canvasKey}`
      }
    })
    try {
      const canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/announcements?context_codes[]=course_${req.params.courseID}&start_date=2018-01-01&end_date=2027-01-01`, {
        headers: {
          Authorization: `Bearer ${req.user.canvasKey}`
        }
      })
      var results = []
      for (var result of canvasResults.data) {
        result.course = courseResults.data
        results.push(result)
      }
      if(canvasResults.status === 200) {
        res.send({
          data: results,
          status: "success"
        })
      } else {
        res.send({
          error: "unknown"
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

router.get("/:courseID/users", async (req, res) => {
  try {
    const canvasResults = await axios.get(`${req.user.canvasURL}/api/v1/courses/${req.params.courseID}/users`, {
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
        status: "error"
      })
    }
  }
})

module.exports = router;
