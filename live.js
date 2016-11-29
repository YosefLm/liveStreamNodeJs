'user strict'
// TODO : massive cleanup
var readdir = require('./readdir')
var myEnd = require('./myEnd')
var Events = require('events')
var fs = require('fs') // create my own require
var start = 14
var timeoutSeconds = 10
// var mainEvent = events
class LiveStream // extends (require(`stream`)).Stream.Duplex
{
  // TODO : createNormalStream, need to start only in mp3 frame
  constructor (options) {
    options = options || {}
    // options.fromFolder ? 'true' : false
    this.__Live__ = options.Live ? options.Live : Object.create({ started: true, ended: false })
    this.filePathStream = options.filePathStream = options.filePathStream || ['./temp.mp3.temp.mp3', './']
    this.toPipeCount = options.num || -1 // for zero = -1
    this.event = (function () { // TOASK: maybe extend class events?
      var event = new Events(); event.on('log', function () { console.log('main') })
      // options.__Live__._interval ? options.__Live__._interval : 9999
      event.interval = function () {
        if (event._interval) {
          event._interval.close()
        }
        event._interval = setInterval(function () { event.emit('proc'); console.log('proc') }, 6000)
      }
      event.interval()
      return event
    })()
    this.emit = this.event.emit
    this.on = this.event.on // TODO: Events
    this.once = this.event.once
    this.pipe = function (writeableStream) {
      console.log(this)
      writeableStream.oldend = writeableStream.end // sorry pipe
      writeableStream.end = function () { writeableStream.emit('myfinish'); console.log('thinking ?is ending') }
      writeableStream.on('oldend', function () { console.log('oldend'); writeableStream.oldend() })
      console.log('piping?')
      // TODO:  check if Stream exist and writeable
      console.log('piping!')
      var thats = this // stupids binding errors
      nextfunc(writeableStream, thats)
    }
  }
}

function nextfunc (writeableStream, thats) { // NOTE: makesure to bind, read why below
  return next.bind(thats)(writeableStream, thats)
}

function next (writeableStream, thats) {
  // TODO || NOTE: not working inside the class, need to re-read docs maybe. ? using this.next = function : next() inside the class, for the time use next.bind(this)
  console.log('next...?')
  if (thats.__Live__.started && !thats.__Live__.ended) {
    if (thats.outParser && !thats.filePathStream[thats.toPipeCount + 1]) {
      var tempString = thats.filePathStream[thats.filePathStream.length - 1].split('out')[1].split('.mp3')[0]
      var PipeCount = Number(tempString)
      var endString = PipeCount.toFixed()
      while (endString.length !== tempString.length) { endString = '0' + endString }
      thats.filePathStream[thats.filePathStream.length] = thats.filePathStream[thats.filePathStream.length - 1].split('out')[0] + endString + '.mp3'
    }
    if (thats.filePathStream[++thats.toPipeCount]) {
      nextFuncs.neReadFile(thats.filePathStream[thats.toPipeCount], writeableStream, thats)
    } else {
      process.nextTick(function () { nextfunc(writeableStream, thats) })
    }
  } else {
    if (!thats.__Live__.started) {
      nextfunc.neReadFile(thats.startFiles[0], writeableStream, thats)
    } else {
      nextfunc.neReadFile(thats.endFiles[0], writeableStream, thats)
    }
    // writeableStream.toEnd = true // TODO-ASK: callback?
    return false
  }
}

var nextFuncs = {
  neReadFile: function (file, writeableStream, thats) {
    if (file) {
      var fsStream = fs.createReadStream(file, {
        start: 0 // (start)
      })
      thats.event.interval()
      console.log('next!' + file)
      fsStream.on('error', function (err) { console.oldlog(err) }) // log errors, ignore them.
      myEnd.close(function () {
        fsStream.emit('_hy_old')
        console.log('next?')
        if (writeableStream.toEnd) {
          writeableStream.emit('oldend')
        }
        thats.event.once('proc', function () { nextfunc(writeableStream, thats) })
      }, fsStream)
      fsStream.pipe(writeableStream)
    }
  }
}

class Live {
  constructor (options) {
    options = options || {}
    this.fakelive = options.fakelive || false
    // this.events = [ function () { var event = new Events(); event.on('log', console.log('main')); return event } ]
    this.now = options.now || -1
    this.timeoutSeconds = options.timeoutSeconds = options.timeoutSeconds || timeoutSeconds
    this.getLiveStream = function (options) {
      // TODO : create new LiveStream
      options = options || {toPipeCount: this.now, num: this.now}
      options.num = options.toPipeCount || this.now
      options.__Live__ = Object.create(this)
      return new LiveStream(options)
    }
    this.interval = function (seconds) {
      if (this._interval) this._interval.close()
      this._interval = setInterval(function () { console.log(this.now++) }.bind(this), seconds * 1000)
    }
    this.askInterval = function () {
      if (!this._interval) this.interval(9.9999)
    }
    this.started = false
    this.startIn = function (seconds) {
      if (this._interval) this._interval.close()
      this._startTimeOut = setTimeout(function () { this.started = true }.bind(this), seconds * 1000)
    }
  }
}
module.exports = function (options) {
  return new Live(options)
}
module.exports.LiveStream = function (options) {
  return new LiveStream(options)
}

// utilty
module.exports.setHeaders = function (response) {
  // response.setHeader('Transfer-Encoding', 'chunked')
  response.setHeader('Cache-Control', 'no-cache; no-store; must-revalidate')
  response.setHeader('Pragma', 'no-cache')
  response.setHeader('Expires', '-1')
  response.setHeader('Last-Modified', (new Date()).toUTCString())
  response.setHeader('Content-Disposition', 'inline; filename="hylive"; name="live";')
  response.setHeader('mime', 'audio/mpeg')
}
var mainLive = module.exports.mainLive = new Live({})

// doTheThing  - for tests mainly, or just default. created for http response mainly.
module.exports.doTheThing = function (response, dir) {
  mainLive.askInterval()
  var live = module.exports
  live.setHeaders(response)
  response.writeHead(200)
  // response.write(`ID3`) http://jonhall.info/how_to/create_id3_tags_using_ffmpeg
  // ffmpeg -y -i "test.mkv" -c copy -map_metadata -1 -metadata title="My Title" -metadata creation_time=2016-09-20T21:30:00 -map_chapters -1 "test.mkv"
  // console.log(256000 * live.now)
  mainLive.started = true
  var arr = readdir(dir)
  var tempLive = {}
  if (arr[0].includes('out')) {
    //
    tempLive = mainLive.getLiveStream({ filePathStream: arr.map(function (val) { return dir + '/' + val }), fromFolder: true, outParser: true })
  } // [`c:/` + process.env.HOMEPATH + `file.mp3`, `c:/` + process.env.HOMEPATH + `file.mp3`]
  tempLive = mainLive.getLiveStream({ filePathStream: arr.map(function (val) { return dir + '/' + val }), fromFolder: true })
  console.log(tempLive)
  tempLive.pipe(response)
}
