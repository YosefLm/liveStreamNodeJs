var BasicM3U = {
  start: `#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:1`,
  middle: ['@NAME \n',
     '@PATH\n'],
  end: `#EXT-X-ENDLIST`
}
module.exports = function (name, basicPath, extension, count) {
  var str = BasicM3U.start
  for (var i = 0; i < count; i++) {
    for (var j = 0; j < BasicM3U.middle.length; j++) {
      str += BasicM3U.middle[j].replace(/@NAME/, name + i + extension).replace(/@PATH/, (basicPath + i + extension))
    }
  }
  str += BasicM3U.end
  return str
}
