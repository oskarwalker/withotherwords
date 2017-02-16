const crypto = require('crypto')

module.exports = function (req, res, next) {
  const sessionId = req.cookies['__sessid']
  const randomSessionId = () => crypto.randomBytes(8).toString('hex').slice(0, 16)

  if (!sessionId) {
    res.cookie('__sessid', randomSessionId(), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true
    })
  }

  req.sessionId = sessionId

  next()
}
