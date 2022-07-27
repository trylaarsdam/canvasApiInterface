const db = require("./database")

async function logError(id, userID, error) {
  let errorLog = {
    id: id,
    userID: userID,
    error: error.toString(),
    timestamp: Date()
  }

  await db.setDoc("Errors", id, errorLog)
}

module.exports = {
  logError
}