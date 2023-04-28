
// JavaScript code for calculating and displaying total time and completion time
function validateForm() {
    // Get the form elements
    var washDuration = parseInt(document.getElementsByName("washDuration")[0].value);
    console.log(washDuration);
    var dryDuration = parseInt(document.getElementsByName("dryDuration")[0].value);
    console.log(dryDuration);
    var numWashers = parseInt(document.getElementsByName("numWashers")[0].value);
    console.log(numWashers);
    var numDryers = parseInt(document.getElementsByName("numDryers")[0].value);
    console.log(numDryers);
    var numLoads = parseInt(document.getElementsByName("numLoads")[0].value);
    console.log(numLoads);
    var startTime = document.getElementsByName("startTime")[0].value;
    console.log(startTime);

    // Check if all fields have been filled
    if (isNaN(washDuration) || isNaN(dryDuration) || isNaN(numWashers) || isNaN(numDryers) || isNaN(numLoads) || startTime === "") {
        alert("Please fill in all fields.");
        return false;
    }

    // Check if all values are positive integers
    if (washDuration <= 0 || dryDuration <= 0 || numWashers <= 0 || numDryers <= 0 || numLoads <= 0) {
        alert("All values must be positive integers.");
        return false;
    }

    return true;
}



function calculateTotalTime() {
    // Get values from form input
    var washDuration = parseInt(document.getElementById("washDuration").value);
    console.log(washDuration);
    var dryDuration = parseInt(document.getElementById("dryDuration").value);
    console.log(dryDuration);
    var numWashers = parseInt(document.getElementById("numWashers").value);
    console.log(numWashers);
    var numDryers = parseInt(document.getElementById("numDryers").value);
    console.log(numDryers);
    var numLoads = parseInt(document.getElementById("numLoads").value);
    console.log(numLoads);
    var startTime = document.getElementById("startTime").value;
    console.log(startTime);

    // Calculate the total duration in minutes
    var totalDuration = (washDuration + dryDuration) * numLoads;
    console.log(totalDuration);
    var totalMachines = Math.min(numWashers, numDryers);
    console.log(totalMachines);
    var numCycles = Math.ceil(numLoads / totalMachines);
    console.log(numCycles);
    totalDuration *= numCycles;

    // Calculate the end time
    var endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + totalDuration);
    console.log(endTime);

    return {
        totalDuration: totalDuration,
        endTime: endTime
    };
}



function displayTotalTime() {
    // calulate total time here
    var totalTime = calculateTotalTime();
    //format total time here using the formatTimespan function
    var totalTimeFormatted = formatTimespan(totalTime);

    document.getElementById('totalTime').innerHTML = totalTimeFormatted;
}


function startTimer(duration) {
    var timer = duration * 60, minutes, seconds;
    var intervalID = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("countdownTimer").innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalID);
            playAudioAlert();
        }
    }, 1000);
}


function calculateCompletionTime(totalTime, startTime) {
    // Convert start time to Date object
    var startDate = new Date();
    var timeArr = startTime.split(":");
    startDate.setHours(parseInt(timeArr[0]));
    startDate.setMinutes(parseInt(timeArr[1]));

    // Calculate completion time
    var completionTime = new Date(startDate.getTime() + totalTime * 60000);

    return completionTime;
}




function playAudioAlert() {
    var audio = document.getElementById("audio");
    audio.play();
  }
  

// add event listener to form submit button
document.querySelector('#submitBtn').addEventListener('click', function (event) {
    event.preventDefault(); // prevent page refresh on form submission
    if (validateForm()) {
        var totalTime = calculateTotalTime();
        displayTotalTime(totalTime);
        var completionTime = calculateCompletionTime(totalTime);
        completionTime(completionTime);
        startTimer(totalTime);
    }
});

