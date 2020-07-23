exports.directoriesBack = (total) => {
  var dir = "./"
  var num = 0;
  while(total > num){
    dir += "../";
    num++;
  }
  return dir;
}
