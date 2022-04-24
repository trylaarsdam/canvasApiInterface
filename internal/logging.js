function logError(id, userID, error) {
  let errorLog = {
    id: id,
    userID: userID,
    error: error
  }

  // TODO - add error to database
}

module.exports = {
  logError
}