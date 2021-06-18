
// minutes + seconds passed
var timerVar = setInterval(countTimer, 1000);
var totalSeconds = 0;

function countTimer() {
    ++totalSeconds;
    //math.floor function returns largest integer less than or equal to given number
    //in this instance example if totalSeconds = 100/60 number returned will be 1
    var minute = Math.floor((totalSeconds) / 60); // count minute
    var seconds = totalSeconds - (minute * 60); //count seconds, subtract minutes seconds from total seconds
    document.getElementById("timer").innerHTML = minute + ":" + seconds; // put result in div element called timer

    //cost of call
    var callCost = 3.32 //start call cost at first minute fee 3.32 for Henderson County

    if (minute > 1){ //at roll over to second minute
        callCost = (3.32 + (minute * 0.57)); //each additional minute costs 0.57
    } else {
        callCost = 3.32 //if less than 1 cost only 3.32
    }

    var callCostRnd = callCost.toFixed(2);

    document.getElementById("cost").innerHTML = "$"+callCostRnd; //put result in div element called cost
}

