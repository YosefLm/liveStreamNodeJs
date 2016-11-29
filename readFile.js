var fs = require('fs')
var path = require('path')
var basicPath = './miscFiles/'
module.exports = function (file) {
  try {
    if (fs.existsSync(path.resolve(basicPath + file))) {
      try {
        return fs.readFileSync(path.resolve(basicPath + file))
      } catch (e) {
        console.log('error = ' + e); return null
      }
    }
    if (fs.existsSync(path.resolve('../../' + basicPath + file))) {
      try {
        return fs.readFileSync(path.resolve('../../' + basicPath + file))
      } catch (e) {
        console.oldlog('error = ' + e); return null
      }
    }
  } catch (e) {
    console.oldlog('error = ' + e); return null
  }
}
module.exports.getStream = function (file) { try { return fs.createReadStream(path.resolve(basicPath + file)) } catch (e) { console.log('error = ' + e); return null } }
module.exports.path = basicPath
module.exports.reslove = function (file, os) { return path.resolve(basicPath + file) }
console.oldlog(module)
