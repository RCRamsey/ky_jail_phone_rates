
// // hour + minutes + seconds passed
// var timerVar= setInterval(countTimer, 1000);
// var totalSeconds = 0;
// function countTimer(){
//     ++totalSeconds;
//     var hour = Math.floor(totalSeconds / 3600); //count hour
//     var minute = Math.floor((totalSeconds- hour * 3600 ) / 60); // count minute, subtract hours seconds from total seconds
//     var seconds = totalSeconds - (hour *3 600 + minute * 60); //count seconds, subtract hours and minutes seconds from total seconds
//     document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;// put result in div element called
// }

// minutes + seconds passed
var timerVar = setInterval(countTimer, 1000);
var totalSeconds = 0;

function countTimer() {
    ++totalSeconds;
    var minute = Math.floor((totalSeconds) / 60); // count minute
    var seconds = totalSeconds - (minute * 60); //count seconds, subtract minutes seconds from total seconds
    document.getElementById("timer").innerHTML = minute + ":" + seconds; // put result in div element called
}