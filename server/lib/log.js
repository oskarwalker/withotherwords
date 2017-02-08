const winston = require('winston')

class Logger {
  error (logMessage, socket, message) {
    this.internalLog(winston, winston.error, logMessage, socket, message)
  }

  warn (logMessage, socket, message) {
    this.internalLog(winston, winston.warn, logMessage, socket, message)
  }

  info (logMessage, socket, message) {
    this.internalLog(winston, winston.info, logMessage, socket, message)
  }

  verbose (logMessage, socket, message) {
    this.internalLog(winston, winston.verbose, logMessage, socket, message)
  }

  debug (logMessage, socket, message) {
    this.internalLog(winston, winston.debug, logMessage, socket, message)
  }

  silly (logMessage, socket, message) {
    this.internalLog(winston, winston.silly, logMessage, socket, message)
  }

  internaLog (method, methodThis, logMessage, socket = null, message = 'Something went wrong.') {
    method.call(methodThis, logMessage)
    if (socket) {
      socket.emit(message)
    }
  }
}

module.exports = new Logger()
