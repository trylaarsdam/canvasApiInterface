module.exports = auth;
const config = require("../auth.config.json")
const db = require("./database")

async function auth(req, res, next) {
  // make authenticate path public
  if(config["unsecured-endpoints"].includes(req.path)) {
    return next();
  }

  // check for basic auth header
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.status(401).json({ message: 'Missing Authorization Header' });
  }

  // verify auth credentials
  const base64Credentials =  req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const users = await db.query("User", "email", "==", username);
  if(users.length === 1) {
    if(users[0].password === password) {
      req.user = users[0];
      return next();
    }
    else {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
  }
  return res.status(401).json({ message: 'Invalid Authentication Credentials' });
}