module.exports = { end: function (funcEnd, thats) {
  console.log('ending?')
  return myEnd.bind(thats || this || {})(funcEnd, 'end', thats)
},
close: function (funcEnd, thats) {
  console.log('closings')
  return myClose.bind(thats || this || {})(funcEnd, 'close', thats)
}

}

var myEnd = function (funcEnd, type, thats) {  // TOASK: work with binding || paramter ; emit event?
    return funcToOldFunc(funcEnd, 'end', thats)  
}

var myClose = function (funcEnd, type, thats) {  // TOASK: work with binding || paramter ; emit event?
  return funcToOldFunc(funcEnd, 'close', thats)
}

var funcToOldFunc = function (funcEnd, type, thats) {  // TOASK: work with binding || paramter ; emit event?
  thats['_hy_old' + type] = thats[type]
  thats.on('_hy_old', function () { thats['_hy_old' + type]() } )
  var endfunc = function () { thats.emit('endfunc'); console.log('endfunc'); funcEnd() }
  thats[type] = endfunc
}

// export class a {}