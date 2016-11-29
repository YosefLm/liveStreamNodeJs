# liveStreamNodeJs
A little playing with nodejs and piping multiple files.
Get directory and stream it.
# using
var live = require('./live.js'); 
live.doTheThing(writeAbleStream, pathToDirectory)
# using ffmpeg to create the files from existing mp3 file:
ffmpeg -i <mp3_file_location> -f segment -segment_time 10 -map_metadata -1 -c copy -map 0:a -codec:a libmp3lame -q:a 4 -map_metadata -1 -metadata title="live" out%%03d.mp3 -y

