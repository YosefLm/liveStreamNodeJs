var fs = require('fs')
module.exports = function (path) {
  path = path || './miscFiles/radio/1'
  // console.log(fs.readdirSync(path))
  return fs.readdirSync(path)
}
