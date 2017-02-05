module.exports = (promise) => promise
  .then(result => {error: null, result})
  .catch(error => {error, result: null})