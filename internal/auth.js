module.exports = auth;
const config = require("../auth.config.json")
const db = require("./database")

async function auth(req, res, next) {
  // make authenticate path public'
  // console.log(req.path)

  let status = (await db.getDoc("System", "status"))

  if(config["unsecured-endpoints"].includes(req.path)) {
    if(status.adminOnly != true) {
      return next();
    }
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

      if(req.user.banned) {
        return res.status(401).json({ message: 'User Account Banned', status: "error" });
      }

      if(status.adminOnly == true) {
        if(req.user.role == "Administrator") {
          return next();
        } else {
          return res.status(401).send({
            status: "error",
            message: "system in admin only mode"
          })
        }
      } else {
        return next();
      }
    }
    else {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
  }
  return res.status(401).json({ message: 'Invalid Authentication Credentials' });
}