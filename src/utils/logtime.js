// Time for debugging purposes
const startTime = new Date().getTime() / 1000.0;
var nowTime = startTime / 1000.0;

//debugging
function logTime(msg) {
  nowTime = new Date().getTime() / 1000.0;
  console.log(msg + ' in ' + String(nowTime - startTime).substring(0, 5) + 's.');
}
